import { LegalPageLayout, LegalSection } from '../../components/legal/LegalPageLayout';
import { BACKUP_PURGE_DAYS, GUEST_DATA_MONTHS_AFTER_EVENT } from '../../legal/retention';

const SECTIONS: LegalSection[] = [
  {
    id: 'veri-sorumlusu',
    title: 'Veri Sorumlusu',
    paragraphs: [
      'Bu Gizlilik Sözleşmesi ve Kişisel Verilerin Korunması Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuat uyarınca hazırlanmıştır.',
      'Kişisel verileriniz, veri sorumlusu sıfatıyla DavetKart ("Şirket") tarafından aşağıda açıklanan kapsamda işlenmektedir. KVKK kapsamındaki başvurularınızı İletişim sayfamız üzerinden veya kvkk@davetkart.com adresine iletebilirsiniz.'
    ]
  },
  {
    id: 'toplanan-veriler',
    title: 'Toplanan Kişisel Veriler',
    paragraphs: ['Platform\'u kullanımınız sırasında aşağıdaki veri kategorileri toplanabilir:'],
    bullets: [
      'Kimlik ve iletişim bilgileri: ad-soyad, e-posta adresi, telefon numarası (hesap oluşturma ve iletişim formları aracılığıyla),',
      'Davetiye içeriği: etkinlik sahibi isimleri, etkinlik tarihi ve konumu, yüklenen fotoğraflar ve davet metinleri,',
      'Davetli yanıtları: davetlilerin LCV formu üzerinden ilettiği isim, katılım durumu ve iletilen notlar,',
      'İşlem güvenliği verileri: IP adresi, tarayıcı ve cihaz bilgileri, oturum kayıtları,',
      'Ödeme bilgileri: ödeme tutarı ve işlem kaydı (kart bilgileri Şirket tarafından saklanmaz; lisanslı ödeme kuruluşları tarafından işlenir),',
      'Kullanım verileri: ziyaret edilen sayfalar, tıklama ve etkileşim istatistikleri (çerezler aracılığıyla).'
    ]
  },
  {
    id: 'isleme-amaclari',
    title: 'Kişisel Verilerin İşlenme Amaçları',
    bullets: [
      'Üyelik hesabınızın oluşturulması, kimlik doğrulaması ve hesap güvenliğinin sağlanması,',
      'Davetiye oluşturma, yayınlama ve davetli katılım takibi hizmetlerinin sunulması,',
      'Ödeme işlemlerinin gerçekleştirilmesi ve faturalandırma,',
      'Destek taleplerinizin yanıtlanması ve müşteri ilişkilerinin yürütülmesi,',
      'Açık rızanızın bulunması hâlinde kampanya ve bülten gönderimleri,',
      'Hizmet kalitesinin ölçülmesi, hataların giderilmesi ve platformun geliştirilmesi,',
      'Hukuki yükümlülüklerin yerine getirilmesi ve yetkili kurum taleplerinin karşılanması.'
    ]
  },
  {
    id: 'hukuki-sebepler',
    title: 'İşlemenin Hukuki Sebepleri',
    paragraphs: ['Kişisel verileriniz, KVKK\'nın 5. maddesinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenir:'],
    bullets: [
      'Sözleşmenin kurulması veya ifası için veri işlemenin gerekli olması (üyelik ve hizmet sunumu),',
      'Hukuki yükümlülüğün yerine getirilmesi (vergi ve e-ticaret mevzuatı, kayıt saklama),',
      'Meşru menfaat (hizmet güvenliği, dolandırıcılık önleme, ürün geliştirme),',
      'Açık rıza (pazarlama iletileri, zorunlu olmayan çerezler).'
    ]
  },
  {
    id: 'davetli-verileri',
    title: 'Davetli (Misafir) Verilerine İlişkin Özel Açıklama',
    paragraphs: [
      'Davetiyenize LCV formu üzerinden yanıt veren davetlilerin verileri, yalnızca ilgili davetiyenin sahibine sunulmak amacıyla işlenir. Davetiye sahibi, davetlilerinden topladığı veriler bakımından kendi çevresine karşı sorumlu davranmayı ve verileri yalnızca etkinlik organizasyonu amacıyla kullanmayı kabul eder.',
      'Davetliler, verilerinin silinmesini davetiye sahibinden veya doğrudan Şirket\'ten talep edebilir.'
    ]
  },
  {
    id: 'verilerin-aktarimi',
    title: 'Kişisel Verilerin Aktarılması',
    paragraphs: ['Kişisel verileriniz, yalnızca hizmetin sunulması için gerekli olduğu ölçüde ve KVKK\'nın 8. ve 9. maddelerine uygun olarak aşağıdaki alıcı gruplarına aktarılabilir:'],
    bullets: [
      'Barındırma (hosting) ve bulut altyapı sağlayıcıları,',
      'Lisanslı ödeme ve elektronik para kuruluşları,',
      'E-posta ve bildirim gönderim hizmeti sağlayıcıları,',
      'Talep hâlinde yetkili kamu kurum ve kuruluşları.'
    ],
    note: 'Kişisel verileriniz hiçbir koşulda üçüncü kişilere satılmaz veya pazarlama amacıyla kiralanmaz.'
  },
  // SEC-11 (19.18): adıyla veri işleyenler. Biri eklenir ya da çıkarsa verify-render listesi de değişir.
  {
    id: 'veri-isleyenler',
    title: 'Hizmet Aldığımız Veri İşleyenler',
    paragraphs: ['Hizmeti sunmak için aşağıdaki sağlayıcılardan hizmet alırız. Her satırda sağlayıcının adı, amacı, verinin işlendiği yer ve işlenen veri yer alır:'],
    bullets: [
      'Amazon Web Services (AWS: Amazon Lightsail ve Amazon S3): sunucu, veritabanı, dosya depolama ve yedekler · Almanya (Frankfurt) · hesap bilgileri, davetiye içeriği, davetli yanıtları, yüklenen fotoğraf ve videolar ile bunların yedekleri,',
      'Amazon CloudFront (AWS): fotoğraf ve videoların hızlı sunulması · dünya genelindeki önbellek sunucuları · davetiyede gösterilen fotoğraf ve videolar,',
      'Amazon Simple Email Service (Amazon SES): e-posta gönderimi (doğrulama, şifre sıfırlama, bildirimler) · Almanya (Frankfurt) · e-posta adresiniz ve gönderilen e-postanın içeriği,',
      'Shopier: ödemenin alınması · Türkiye · ad, soyad, e-posta adresi, kartla ödemede cep telefonunuz (yalnızca siparişte saklanır, hesap silinince silinir), sipariş tutarı ve hesabınızın kaç gündür açık olduğu. Kart bilgilerinizi doğrudan Shopier\'in sayfasına girersiniz; DavetKart bu bilgileri görmez ve saklamaz,',
      'Natro: alan adı (DNS) ve gelen e-posta kutuları · Türkiye · @davetkart.com adreslerine gönderdiğiniz e-postalar,',
      'Sentry (etkinleştirildiğinde): hata kaydı ve izleme · yurt dışı (hizmet hesabında seçilen veri bölgesi) · hata anındaki teknik bilgiler; IP adresi ve kişisel veriler varsayılan olarak gönderilmez,',
      'Google Gemini (davetiye asistanı etkinleştirildiğinde): asistanın yanıt üretmesi · yurt dışı (Google sunucuları) · yalnızca asistana yazdığınız mesaj.'
    ],
    note: 'Fontlar ve sayfa dosyaları DavetKart\'ın kendi sunucusundan yüklenir; sayfa açılırken üçüncü taraf bir yazı tipi ya da reklam hizmetine istek gönderilmez.'
  },
  // FE 10.22: süreler backend'in uyguladığı kurallarla aynı (K97 hesap silme, K98 + K257 saklama,
  // K231 yedekler). Biri değişirse öbürü de değişir: rehber/src/pages/legal/PrivacyPage.md
  {
    id: 'saklama-sureleri',
    title: 'Saklama Süreleri',
    bullets: [
      'Hesap verileri (ad-soyad, e-posta adresi, şifrenin özeti): üyelik süresince. Hesabınızı "Hesabım" sayfasından sildiğinizde hesabınız, davetiyeleriniz, davetli yanıtları ve yüklenen tüm fotoğraf ve videolar canlı sistemden derhal silinir; yedeklerdeki kopyaları aşağıdaki Yedekler maddesindeki süre içinde silinir,',
      'Davetiye içeriği (metinler, etkinlik bilgileri, sizin yüklediğiniz fotoğraflar): siz davetiyeyi veya hesabınızı silene kadar,',
      'Silinen davetiyeler: 30 gün boyunca geri alınabilir; bu sürenin sonunda fotoğrafları ve davetli yanıtlarıyla birlikte kalıcı olarak silinir,',
      `Davetli (misafir) verileri: LCV yanıtları (isim, katılım durumu, kişi sayısı, menü tercihi, mesaj) ile davetlilerin yüklediği fotoğraf ve videolar, etkinlik tarihinden ${GUEST_DATA_MONTHS_AFTER_EVENT} ay sonra silinir. Etkinlik tarihi girilmemiş davetiyelerde bu veriler davetiyenin yayınlandığı tarihten, hiç yayınlanmamışsa oluşturulduğu tarihten 12 ay sonra silinir,`,
      'İletişim formu mesajları: gönderildikleri tarihten itibaren 12 ay,',
      'İşlem ve fatura kayıtları: ilgili mevzuat gereği 10 yıl. Hesabınız silindiğinde bu kayıtların hesabınızla bağlantısı kaldırılır,',
      'Pazarlama izinleri: rızanın geri alınmasına kadar,',
      `Yedekler: yukarıdaki silmeler canlı sistemde hemen uygulanır. Veritabanının günlük yedekleri, sunucunun günlük disk görüntüleri ve silinen fotoğraf ile videoların önceki sürümleri yalnızca arıza veya veri kaybında geri yükleme için bir süre daha saklanır; silinen veriler yedeklerden de en geç ${BACKUP_PURGE_DAYS} gün içinde kendiliğinden silinir.`
    ]
  },
  {
    id: 'guvenlik-onlemleri',
    title: 'Veri Güvenliği Önlemleri',
    paragraphs: ['Kişisel verilerinizin güvenliği için alınan başlıca teknik ve idari tedbirler:'],
    bullets: [
      'Tüm veri iletiminde SSL/TLS şifrelemesi,',
      'Şifrelerin geri döndürülemez (hash) yöntemlerle saklanması,',
      'Rol bazlı erişim kontrolleri ve erişim kayıtlarının tutulması,',
      'Düzenli güvenlik testleri ve yedekleme prosedürleri,',
      'Personel gizlilik taahhütleri ve farkındalık eğitimleri.'
    ]
  },
  {
    id: 'kvkk-haklariniz',
    title: 'KVKK Kapsamındaki Haklarınız',
    paragraphs: ['KVKK\'nın 11. maddesi uyarınca veri sorumlusuna başvurarak şu haklarınızı kullanabilirsiniz:'],
    bullets: [
      'Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse buna ilişkin bilgi talep etme,',
      'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,',
      'Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme,',
      'Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme,',
      'KVKK\'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,',
      'Düzeltme ve silme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,',
      'Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun doğmasına itiraz etme,',
      'Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme.'
    ]
  },
  {
    id: 'basvuru-yontemi',
    title: 'Başvuru Yöntemi',
    paragraphs: [
      'Haklarınıza ilişkin taleplerinizi kvkk@davetkart.com adresine e-posta ile veya İletişim sayfamızdaki form üzerinden "KVKK Başvurusu" konusunu seçerek iletebilirsiniz.',
      'Başvurularınız, talebin niteliğine göre en geç 30 gün içinde ücretsiz olarak sonuçlandırılır. Talebinizin reddedilmesi veya yanıtın yetersiz bulunması hâlinde Kişisel Verileri Koruma Kurulu\'na şikâyette bulunma hakkınız saklıdır.'
    ]
  },
  {
    id: 'degisiklikler',
    title: 'Politika Değişiklikleri',
    paragraphs: [
      'Bu metin, mevzuat değişiklikleri veya hizmet kapsamındaki güncellemeler doğrultusunda revize edilebilir. Güncel sürüm her zaman bu sayfada yayınlanır; önemli değişiklikler kayıtlı kullanıcılara e-posta yoluyla bildirilir.'
    ]
  }
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      badge="Yasal"
      title="Gizlilik"
      accent="Sözleşmesi"
      intro="Kişisel verilerinizin güvenliği bizim için özel anlarınız kadar değerli. Bu metin, verilerinizi KVKK kapsamında hangi amaçlarla ve nasıl işlediğimizi şeffaf biçimde açıklar."
      lastUpdated="24 Kasım 2026"
      sections={SECTIONS}
      related={[
        {
          to: '/terms',
          label: 'Kullanım Şartları',
          description: 'Platform kullanımına ilişkin hak ve yükümlülükleriniz.'
        },
        {
          to: '/cookies',
          label: 'Çerez Politikası',
          description: 'Sitemizde kullanılan çerezler ve tercihlerinizi nasıl yöneteceğiniz.'
        },
        {
          to: '/contact',
          label: 'İletişim',
          description: 'KVKK başvurularınız ve sorularınız için bize ulaşın.'
        }
      ]}
    />
  );
}
