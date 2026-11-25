import { useTranslation } from 'react-i18next';
import { LegalPageLayout, LegalSection } from '../../components/legal/LegalPageLayout';
import { RSVP_RECEIPT_KEY_PREFIX } from '../../services/rsvpReceipts';

const SECTIONS: LegalSection[] = [
  {
    id: 'cerez-nedir',
    title: 'Çerez Nedir?',
    paragraphs: [
      'Çerezler (cookies), bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler; oturumunuzun açık kalması, tercihlerinizin hatırlanması ve site deneyiminin iyileştirilmesi gibi amaçlarla yaygın olarak kullanılır.',
      'Bu politika, DavetKart platformunda kullanılan çerezleri ve benzeri yerel depolama teknolojilerini (localStorage, sessionStorage) kapsar.'
    ]
  },
  {
    id: 'kullanim-amaclari',
    title: 'Çerezleri Hangi Amaçlarla Kullanıyoruz?',
    bullets: [
      'Oturumunuzu güvenli biçimde açık tutmak ve kimlik doğrulamasını sürdürmek,',
      'Dil tercihi gibi ayarlarınızı sonraki ziyaretlerinizde hatırlamak,',
      'Üzerinde çalıştığınız davetiye taslağını cihazınızda geçici olarak saklayarak veri kaybını önlemek,',
      'Platform trafiğini ve kullanım istatistiklerini anonim olarak ölçümleyerek hizmeti geliştirmek,',
      'Güvenlik tehditlerini ve kötüye kullanımı tespit etmek.'
    ]
  },
  {
    id: 'zorunlu-cerezler',
    title: 'Kesinlikle Gerekli Çerezler',
    paragraphs: [
      'Platform\'un temel işlevleri için zorunlu olan bu çerezler devre dışı bırakılamaz; devre dışı bırakılmaları hâlinde giriş yapma ve davetiye oluşturma gibi temel özellikler çalışmaz.'
    ],
    bullets: [
      'Oturum kimliği ve kimlik doğrulama belirteci (JWT) — oturum süresince,',
      'Dil ve bölge tercihi — 12 ay,',
      'Davetiye taslağı yerel kaydı — taslak tamamlanana veya silinene kadar,'
    ]
  },
  {
    id: 'performans-cerezleri',
    title: 'Performans ve Analitik Çerezleri',
    paragraphs: [
      'Ziyaretçilerin Platform\'u nasıl kullandığını anlamamıza yardımcı olan bu çerezler; en çok görüntülenen şablonlar, sayfa yüklenme süreleri ve gezinme akışları gibi toplu ve anonim istatistikler üretir.',
      'Bu kategorideki çerezler yalnızca açık rızanıza dayanılarak kullanılır ve rızanızı dilediğiniz an geri çekebilirsiniz.'
    ]
  },
  {
    id: 'islevsel-cerezler',
    title: 'İşlevsel Çerezler',
    paragraphs: [
      'Deneyiminizi kişiselleştirmek için kullanılır: daha önce incelediğiniz şablon kategorisinin hatırlanması, arayüz tercihlerinizin saklanması gibi. Bu çerezler olmadan Platform çalışmaya devam eder; ancak bazı tercihlerinizin her ziyarette yeniden seçilmesi gerekebilir.'
    ]
  },
  {
    id: 'ucuncu-taraf',
    title: 'Üçüncü Taraf Çerezleri',
    paragraphs: [
      'Davetiyelerde yer alan harita görünümü, video oynatıcı gibi gömülü içerikler ile ödeme altyapısı sağlayıcıları kendi çerezlerini yerleştirebilir. Bu çerezler ilgili üçüncü tarafların politikalarına tabidir; kullanım koşulları için ilgili sağlayıcının gizlilik metnini incelemenizi öneririz.'
    ],
    note: 'DavetKart, üçüncü taraf reklam ağlarına ait izleme veya yeniden pazarlama (retargeting) çerezi kullanmaz.'
  },
  {
    id: 'cerez-yonetimi',
    title: 'Çerez Tercihlerinizi Nasıl Yönetirsiniz?',
    paragraphs: [
      'Tarayıcınızın ayarlarından çerezleri silebilir, engelleyebilir veya çerez yerleştirilmeden önce uyarı almayı seçebilirsiniz. Yaygın tarayıcılarda çerez yönetimi şu menüler altındadır:'
    ],
    bullets: [
      'Google Chrome: Ayarlar → Gizlilik ve güvenlik → Üçüncü taraf çerezleri,',
      'Safari: Tercihler → Gizlilik → Çerezleri ve web sitesi verilerini yönet,',
      'Mozilla Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler ve site verileri,',
      'Microsoft Edge: Ayarlar → Çerezler ve site izinleri.'
    ]
  },
  {
    id: 'saklama-suresi',
    title: 'Saklama Süreleri',
    paragraphs: [
      'Oturum çerezleri tarayıcınızı kapattığınızda silinir. Kalıcı çerezler, yukarıdaki bölümlerde belirtilen süreler boyunca veya siz silene kadar cihazınızda kalır. Yerel depolama kayıtları (davetiye taslağı vb.) siz silmedikçe cihazınızda saklanır ve sunucularımıza yalnızca yayınlama akışında iletilir.'
    ]
  },
  {
    id: 'iletisim-ve-guncelleme',
    title: 'Güncellemeler ve İletişim',
    paragraphs: [
      'Bu politika, kullanılan teknolojilerdeki değişikliklere bağlı olarak güncellenebilir; güncel sürüm her zaman bu sayfada yayınlanır.',
      'Çerez uygulamalarımızla ilgili sorularınız için İletişim sayfamızdan veya kvkk@davetkart.com adresinden bize ulaşabilirsiniz.'
    ]
  }
];

export default function CookiesPage() {
  const { t } = useTranslation();
  // B-H5: misafirin LCV düzenleme kodu da tarayıcıda kalıcı; adı koddaki anahtarla aynı.
  const sections = SECTIONS.map((section) =>
    section.id === 'zorunlu-cerezler'
      ? { ...section, bullets: [...(section.bullets ?? []), t('legal.cookies.rsvpReceipt', { prefix: RSVP_RECEIPT_KEY_PREFIX })] }
      : section
  );

  return (
    <LegalPageLayout
      badge="Yasal"
      title="Çerez"
      accent="Politikası"
      intro="Deneyiminizi iyileştirmek için sınırlı ve şeffaf biçimde çerez kullanıyoruz. Hangi çerezleri neden kullandığımızı ve tercihlerinizi nasıl yöneteceğinizi bu sayfada bulabilirsiniz."
      lastUpdated="1 Temmuz 2026"
      sections={sections}
      related={[
        {
          to: '/privacy',
          label: 'Gizlilik Sözleşmesi',
          description: 'Kişisel verilerinizi hangi amaçlarla ve nasıl işlediğimizi öğrenin.'
        },
        {
          to: '/terms',
          label: 'Kullanım Şartları',
          description: 'Platform kullanımına ilişkin hak ve yükümlülükleriniz.'
        },
        {
          to: '/contact',
          label: 'İletişim',
          description: 'Sorularınız için destek ekibimize ulaşın.'
        }
      ]}
    />
  );
}
