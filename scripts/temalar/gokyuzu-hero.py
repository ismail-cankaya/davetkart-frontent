#!/usr/bin/env python3
"""
DavetKart — "Gokyuzu Ruyasi" temasi hero arkaplan videosu ureteci.

Cikti: hero.mp4 (H.264, sessiz, faststart) + hero-poster.jpg

DONGU GARANTISI
---------------
Butun hareket, DOSENEBILIR (tileable) gurultu alanlarinin yatay/dikey
kaydirilmasiyla saglanir. Kaydirma hizi, N kare sonunda tam sayida dosemenin
gecmesi olacak sekilde secilir -> 0. kare ile N. kare piksel piksel aynidir.
Parlaklik nefesi ise sin(k * 2*pi*i/N) biciminde, k TAM SAYI -> o da tam doner.

Calistirma:
    python3 scripts/temalar/gokyuzu-hero.py
"""

import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates

# ---------------------------------------------------------------------------
# Ayarlar
# ---------------------------------------------------------------------------
# 4:5 guvenli bolge — merkez %60 her oranda gorunur.
# Iki boyut da CIFT olmak zorunda: H.264/yuv420p renk kanallarini yarim
# cozunurlukte tasir, tek sayi bolunemez ve encoder hata verir.
W, H = 896, 1120
FPS, DUR = 24, 10
N = FPS * DUR             # 240 kare

# Gurultu, tam cozunurlukte degil kucuk izgarada uretilip buyutulur.
# Sebep: hem ~20x hizli, hem de bicubic buyutme bedava yumusaklik verir.
NW, NH = 180, 225

OUT_DIR = Path(__file__).resolve().parents[2] / "src/components/templates/dugun/DugunGokyuzu/assets"
RAW = Path("/tmp/gokyuzu_lossless.mkv")

SEED = 20260730


def hexc(h: str) -> np.ndarray:
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float64) / 255.0


# Palet — pastel gokyuzu. Referansta zemin cok acik, metin koyu yaziliyor.
SKY_TOP = hexc("#7ba9d2")     # zenit, doygun mavi
SKY_MID = hexc("#b6d5e9")     # orta kusak
SKY_LOW = hexc("#ecf1f2")     # ufka yakin, neredeyse beyaz
SKY_WARM = hexc("#f7e8dc")    # en alt seride cok hafif sicaklik
CLOUD_LIT = hexc("#ffffff")   # bulutun isik alan yuzu
CLOUD_SHADE = hexc("#b9cadd")  # bulutun golge yuzu
SUN_WARM = hexc("#fff3dd")    # gunes halesi


# ---------------------------------------------------------------------------
# Dosenebilir gurultu
# ---------------------------------------------------------------------------
def tileable_value_noise(rng: np.random.Generator, res: int, w: int, h: int) -> np.ndarray:
    """
    res x res kontrol noktasindan uretilmis, kenarlari dikissiz oturan
    (w x h) deger gurultusu.

    Doseneblirlik nasil saglaniyor: kontrol noktasi izgarasi np.roll ile
    sarmalanir, yani sag kenarin komsusu sol kenardir. Boylece alan yatayda
    ve dikeyde kendini tekrar eder.
    """
    grid = rng.random((res, res))

    # Her pikselin hangi hucreye dustugu ve hucre icindeki konumu
    gx = np.linspace(0.0, res, w, endpoint=False)
    gy = np.linspace(0.0, res, h, endpoint=False)
    x0 = np.floor(gx).astype(int) % res
    y0 = np.floor(gy).astype(int) % res
    x1 = (x0 + 1) % res
    y1 = (y0 + 1) % res
    fx = (gx - np.floor(gx))[None, :]
    fy = (gy - np.floor(gy))[:, None]

    # Smootherstep (6t^5-15t^4+10t^3): ikinci turevi de surekli, bu yuzden
    # buyutulunce izgara cizgileri gorunmez. Lineer harmanlama kullansaydik
    # bulutlarda kare desen belirirdi.
    sx = fx * fx * fx * (fx * (fx * 6 - 15) + 10)
    sy = fy * fy * fy * (fy * (fy * 6 - 15) + 10)

    n00 = grid[np.ix_(y0, x0)]
    n10 = grid[np.ix_(y0, x1)]
    n01 = grid[np.ix_(y1, x0)]
    n11 = grid[np.ix_(y1, x1)]

    top = n00 + (n10 - n00) * sx
    bot = n01 + (n11 - n01) * sx
    return top + (bot - top) * sy


def tileable_fbm(rng: np.random.Generator, base_res: int, octaves: int,
                 w: int, h: int, gain: float = 0.5) -> np.ndarray:
    """
    fBm = birden fazla gurultu katmaninin ust uste toplanmasi. Her katman iki
    kat sik, yari genlikte. Sonuc: dogadaki gibi hem kaba hem ince ayrintili
    doku. Tek katman gurultu "lekeli", fBm "bulutsu" gorunur.
    """
    total = np.zeros((h, w), dtype=np.float64)
    amplitude = 1.0
    norm = 0.0
    res = base_res

    for _ in range(octaves):
        total += amplitude * tileable_value_noise(rng, res, w, h)
        norm += amplitude
        amplitude *= gain
        res *= 2

    return total / norm


def roll_x(field: np.ndarray, tiles: int, i: int) -> np.ndarray:
    """
    Alani yatayda kaydirir. N kare sonunda tam `tiles` dose gecmis olur.
    Alan dosenebilir oldugu icin np.roll ile sarmak dikis birakmaz.
    """
    shift = int(round(field.shape[1] * tiles * i / N)) % field.shape[1]
    return np.roll(field, shift, axis=1)


def smoothstep(edge0: float, edge1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def normalize(field: np.ndarray) -> np.ndarray:
    """
    fBm katmanlari toplanip bolununce dagilim ortalamaya buzusur (merkezi
    limit teoremi): degerler 0..1 yerine ~0.35..0.65 arasinda sikisir.
    Esiklemeden once tam araliga geri yaymazsak hicbir bulut olusmaz —
    ilk denemede tam bu hata yapildi.
    """
    lo, hi = field.min(), field.max()
    return (field - lo) / (hi - lo)


def domain_warp(field: np.ndarray, wx: np.ndarray, wy: np.ndarray,
                strength: float) -> np.ndarray:
    """
    Alani KENDI gurultusuyle buker: her pikseli, baska bir gurultu alaninin
    soyledigi kadar kaydirip oradan orneklem alir.

    Neden sart: duz fBm'i esiklemek "amip" siluetleri uretir — ilk denemede
    tam bu oldu. Bukme, o yuvarlak lekeleri kivrimli, tirtikli, girdapli
    hale getirir; bulut gozle bakildiginda dogal gorunur.

    mode='grid-wrap' orneklemeyi sarmalar, yani dosenebilirlik korunur —
    dongu garantisi bozulmaz.
    """
    h, w = field.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
    coords = np.array([yy + wy * strength, xx + wx * strength])
    return map_coordinates(field, coords, order=1, mode="grid-wrap")


# ---------------------------------------------------------------------------
# Sabit katmanlar (bir kez hesaplanir)
# ---------------------------------------------------------------------------
rng = np.random.default_rng(SEED)

_y = np.linspace(0.0, 1.0, NH)[:, None]
_x = np.linspace(0.0, 1.0, NW)[None, :]

# Dikey gok degradesi: zenit -> orta kusak -> ufuk. Sicak seride sadece en
# altta, cok dar bir bantta devreye girer; erken baslarsa zemin camurlasir.
_t_up = smoothstep(0.0, 0.62, _y)
_t_low = smoothstep(0.58, 1.0, _y)
_t_warm = smoothstep(0.86, 1.0, _y)
SKY = (SKY_TOP[None, None, :] * (1 - _t_up)[..., None]
       + SKY_MID[None, None, :] * _t_up[..., None])
SKY = SKY * (1 - _t_low)[..., None] + SKY_LOW[None, None, :] * _t_low[..., None]
SKY = SKY * (1 - _t_warm * 0.55)[..., None] + SKY_WARM[None, None, :] * (_t_warm * 0.55)[..., None]

# Gunes sizmasi — sag ust koseden GENIS ve zayif yayilim. Onceki denemede
# dar gaussian kullanildi ve ortaya "spot isigi" diski cikti; bulut tulu
# ustune binince de mavi halka olustu. Genis + zayif = fark edilmeyen sicaklik.
_sun = np.exp(-(((_x - 0.80) ** 2) / 0.34 + ((_y - 0.06) ** 2) / 0.16))
SKY = SKY + SUN_WARM[None, None, :] * (_sun * 0.22)[..., None]

# Bukme (warp) alanlari: -1..1 arasi, kaydirma miktarini soyler
_WX = normalize(tileable_fbm(rng, 3, 3, NW, NH)) * 2.0 - 1.0
_WY = normalize(tileable_fbm(rng, 3, 3, NW, NH)) * 2.0 - 1.0

# Bulut katmanlari — fBm uret, tam araliga yay, sonra bukup tekrar yay.
# Bukme sonrasi ikinci normalize sart: map_coordinates aralik daraltabilir.
CLOUD_FAR = normalize(domain_warp(normalize(tileable_fbm(rng, 3, 6, NW, NH)), _WX, _WY, 14.0))
CLOUD_MID = normalize(domain_warp(normalize(tileable_fbm(rng, 2, 6, NW, NH)), _WX, _WY, 22.0))
CLOUD_NEAR = normalize(domain_warp(normalize(tileable_fbm(rng, 5, 4, NW, NH)), _WY, _WX, 10.0))
RAY_FIELD = normalize(tileable_fbm(rng, 2, 2, NW, NH))    # isik huzmesi maskesi

# Ufka dogru bulut yogunlugu artar, zenit acik kalir. Bu bir OPAKLIK
# carpanidir; gurultunun kendisiyle carpilmaz, sadece maskeyi soldurur.
BAND = smoothstep(0.10, 0.62, _y) * (1.0 - 0.35 * smoothstep(0.88, 1.0, _y))


def cloud_mask(field: np.ndarray, threshold: float, softness: float) -> np.ndarray:
    """Gurultuyu bulut ortusune cevirir: esigin altini sifirlar, ustunu yumusatir."""
    return smoothstep(threshold, threshold + softness, field) * BAND


# ---------------------------------------------------------------------------
# Kare uretimi
# ---------------------------------------------------------------------------
def render_frame(i: int) -> np.ndarray:
    p = 2.0 * np.pi * i / N

    # Parallax: uzak katman yavas, yakin katman hizli. Hepsi TAM SAYI dose.
    far = roll_x(CLOUD_FAR, 1, i)
    mid = roll_x(CLOUD_MID, 2, i)
    near = roll_x(CLOUD_NEAR, 3, i)
    ray = roll_x(RAY_FIELD, 1, i)

    img = SKY.copy()

    # 1) Uzak tul (cirrus) — cok genis gecis, neredeyse buharsi
    m_far = cloud_mask(far, 0.34, 0.52) * 0.34
    img = img * (1 - m_far[..., None]) + CLOUD_LIT[None, None, :] * m_far[..., None]

    # 2) Ana kumulus. Kenar sertligi ilk denemede en buyuk sorundu; cozum
    #    genis smoothstep araligi (0.42 -> 0.88) yani ~yarim birim yumusama.
    #    Hacim, TEK maskeden dogar: yogunlugu birkac piksel yukaridan
    #    orneklersek isigin ustten geldigi hissi olusur, alt kenar golgede kalir.
    alpha = cloud_mask(mid, 0.42, 0.46)
    lit = smoothstep(0.52, 0.94, np.roll(mid, -5, axis=0))
    body = (CLOUD_SHADE[None, None, :] * (1 - lit)[..., None]
            + CLOUD_LIT[None, None, :] * lit[..., None])
    img = img * (1 - alpha[..., None]) + body * alpha[..., None]

    # 3) On plan ince doku — kenarlara kirikllik katar, tek basina gorunmez
    m_near = cloud_mask(near, 0.52, 0.38) * 0.18
    img = img * (1 - m_near[..., None]) + CLOUD_LIT[None, None, :] * m_near[..., None]

    # 4) Isik huzmesi — gunesten (sag ust) sol asagi yayilan yumusak kama
    beam = np.exp(-((_x - 0.78 + (_y - 0.13) * 0.55) ** 2) / 0.050)
    beam = beam * smoothstep(0.05, 0.85, _y) * (0.40 + 0.60 * ray)
    img = img + SUN_WARM[None, None, :] * (beam * 0.13)[..., None]

    # 5) Parlaklik nefesi — k=1 tam sayi harmonik, dongu bozulmaz
    img = img * (1.0 + 0.022 * np.sin(p))

    # 6) Kose koyulastirma (vignette) — bakisi merkeze, yani metne toplar
    r = np.sqrt((_x - 0.5) ** 2 + ((_y - 0.45) * 0.8) ** 2)
    img = img * (1.0 - 0.16 * smoothstep(0.35, 0.80, r))[..., None]

    return np.clip(img, 0.0, 1.0)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Kayipsiz ara dosya: sikistirma artefaktlari uzerine ikinci kez
    # sikistirma yapmamak icin. Tek asamada mp4 uretsek kalite dusuk kalirdi.
    proc = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error",
         "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
         "-i", "-", "-c:v", "ffv1", str(RAW)],
        stdin=subprocess.PIPE,
    )
    assert proc.stdin is not None

    poster: np.ndarray | None = None

    for i in range(N):
        small = render_frame(i)
        frame = Image.fromarray((small * 255).astype(np.uint8), "RGB")
        frame = frame.resize((W, H), Image.BICUBIC)

        if i == 0:
            poster = np.asarray(frame)

        proc.stdin.write(frame.tobytes())

        if i % 24 == 0:
            print(f"  kare {i}/{N}", flush=True)

    proc.stdin.close()
    if proc.wait() != 0:
        sys.exit("ffvi ara dosya uretilemedi")

    assert poster is not None
    Image.fromarray(poster).save(OUT_DIR / "hero-poster.jpg", quality=75, optimize=True)

    # -an           : ses kanali yok (hicbir zaman calinmayacak, ~80 KB tasarruf)
    # -crf 27       : yumusak dogal goruntude fark edilmeyen sikistirma
    # -profile main : eski cihazlarda da donanim decode
    # -pix_fmt yuv420p : evrensel uyumluluk (yuv444 Safari'de calmaz)
    # +faststart    : moov atomu basa alinir -> video tamami inmeden oynar
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(RAW),
         "-an", "-c:v", "libx264", "-preset", "veryslow", "-crf", "27",
         "-profile:v", "main", "-level", "4.0", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", str(OUT_DIR / "hero.mp4")],
        check=True,
    )

    mp4 = OUT_DIR / "hero.mp4"
    jpg = OUT_DIR / "hero-poster.jpg"
    print(f"\nhero.mp4        {mp4.stat().st_size / 1024:8.1f} KB")
    print(f"hero-poster.jpg {jpg.stat().st_size / 1024:8.1f} KB")


if __name__ == "__main__":
    main()
