import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import SeoHead from './SeoHead';

const LAST_UPDATED = '25.03.2026';

const ARTICLE_11_RIGHTS = [
  'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
  'İşlenmişse buna ilişkin bilgi talep etme',
  'İşleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme',
  'Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme',
  'Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme',
  'KVKK m.7 kapsamındaki şartlar oluşmuşsa verilerin silinmesini veya yok edilmesini isteme',
  'Düzeltme, silme veya yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme',
  'İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi sebebiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
  'Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme',
];

type LegalLayoutProps = {
  title: string;
  summary: string;
  keywords?: string;
  children: React.ReactNode;
};

type LegalSectionProps = {
  title: string;
  children: React.ReactNode;
};

type InfoCardProps = {
  label: string;
  value: React.ReactNode;
};

type FormFieldProps = {
  label: string;
  hint?: string;
};

const getSiteHost = (baseUrl: string) => baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, summary, keywords, children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <SeoHead title={title} description={summary} keywords={keywords} />
      <div className="container mx-auto max-w-[1100px] px-4 py-8">
      <div className="mb-6 flex items-center text-xs font-sans uppercase tracking-wider text-gray-500">
        <Link to="/" className="transition-colors hover:text-gold-500">
          Ana Sayfa
        </Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="font-bold text-gold-500">{title}</span>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#ece8dd] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        <div className="border-b border-[#f0ece2] bg-[linear-gradient(135deg,#fffdfa_0%,#f7f1e5_100%)] px-6 py-8 md:px-10">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-600">Yasal Metin</div>
          <h1 className="mt-3 text-3xl font-serif font-bold leading-tight text-[#2c2c2c] md:text-[38px]">{title}</h1>
          <p className="mt-4 max-w-[760px] text-[15px] leading-relaxed text-[#667085]">{summary}</p>
          <div className="mt-5 inline-flex rounded-full border border-[#ead7a6] bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7b2f]">
            Son Güncelleme: {LAST_UPDATED}
          </div>
        </div>

        <div className="legal-content space-y-8 px-6 py-8 text-[15px] leading-7 text-[#4b5563] md:px-10 md:py-10">
          {children}
        </div>
      </div>
      </div>
    </>
  );
};

const LegalSection: React.FC<LegalSectionProps> = ({ title, children }) => (
  <section className="space-y-4 rounded-[24px] border border-[#eef1f4] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-6 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
    <h2 className="text-[20px] font-semibold tracking-tight text-[#27303f]">{title}</h2>
    <div className="space-y-4 text-[15px] leading-7 text-[#5d6677]">{children}</div>
  </section>
);

const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => (
  <div className="rounded-[18px] border border-[#eceef2] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a18d65]">{label}</div>
    <div className="mt-2 whitespace-pre-line text-[15px] font-medium leading-6 text-[#2d3746]">{value}</div>
  </div>
);

const FormField: React.FC<FormFieldProps> = ({ label, hint }) => (
  <div className="rounded-[18px] border border-[#e8edf2] bg-white p-4">
    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b95a7]">{label}</div>
    <div className="mt-3 min-h-[44px] rounded-[12px] border border-dashed border-[#d8dee8] bg-[#fafbfd] px-3 py-3 text-[13px] text-[#98a2b3]">
      {hint || 'Bu alanı doldurunuz'}
    </div>
  </div>
);

const DataControllerSummary: React.FC<{
  companyName: string;
  address: string;
  email: string;
  phone: string;
  siteUrl: string;
}> = ({ companyName, address, email, phone, siteUrl }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <InfoCard label="Veri Sorumlusu" value={companyName} />
    <InfoCard label="Web Sitesi" value={siteUrl} />
    <InfoCard label="Adres" value={address} />
    <InfoCard label="İletişim" value={`${phone}\n${email}`} />
  </div>
);

export const Kvkk: React.FC = () => {
  const { generalSettings, seoSettings } = useData();
  const siteHost = getSiteHost(seoSettings.baseUrl || 'https://www.adaemlak.com.tr');

  return (
    <LegalLayout
      title="KVKK Aydınlatma Metni"
      summary={`${siteHost} internet sitesini ziyaret edenler, iletişim formunu dolduranlar ve gayrimenkul portföyleri hakkında bilgi talep eden kişiler için 6698 sayılı Kanun'un 10. maddesi kapsamında hazırlanmış bilgilendirme metnidir.`}
      keywords="kvkk aydınlatma metni, kişisel verilerin korunması, ada emlak kvkk"
    >
      <DataControllerSummary
        companyName={generalSettings.companyName}
        address={generalSettings.contactAddress}
        email={generalSettings.contactEmail}
        phone={generalSettings.contactPhone}
        siteUrl={seoSettings.baseUrl}
      />

      <LegalSection title="1. Kapsam ve Veri Sorumlusunun Kimliği">
        <p>
          Bu metin, <strong>{generalSettings.companyName}</strong> tarafından veri sorumlusu sıfatıyla; internet sitesi ziyaretleri,
          iletişim formu kullanımı, telefon ve e-posta ile iletilen bilgi talepleri, randevu oluşturma süreçleri ve portföyler hakkında
          yapılan görüşmeler kapsamında işlenen kişisel verilere ilişkin olarak hazırlanmıştır.
        </p>
        <p>
          KVKK kapsamında aydınlatma yükümlülüğü; veri sorumlusunun kimliği, verilerin hangi amaçla işleneceği, kimlere ve hangi amaçla
          aktarılabileceği, toplanma yöntemi ve hukuki sebebi ile ilgili kişinin hakları konularında açık bilgi verilmesini gerektirir.
        </p>
      </LegalSection>

      <LegalSection title="2. İşlenen Kişisel Veri Kategorileri">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            label="Kimlik ve İletişim Bilgileri"
            value="Ad-soyad, telefon numarası, e-posta adresi, tarafınızca paylaşılması halinde adres bilgisi"
          />
          <InfoCard
            label="Talep ve Müşteri İşlem Bilgileri"
            value="İlgilendiğiniz ilan, konu başlığı, mesaj içeriği, randevu veya geri dönüş talebiniz, iletişim geçmişi"
          />
          <InfoCard
            label="Portföy ve Tercih Bilgileri"
            value="Satılık veya kiralık tercihiniz, lokasyon, bütçe, gayrimenkul tipi, yatırım amacınız gibi tarafınızca paylaşılan tercihler"
          />
          <InfoCard
            label="Özel Durum"
            value="İletişim formu veya mesaj içeriğinde gerekli olmadıkça özel nitelikli kişisel veri paylaşmamanızı öneririz."
          />
        </div>
      </LegalSection>

      <LegalSection title="3. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebepleri">
        <p>
          Kişisel verileriniz; internet sitemizde yer alan iletişim formu, telefon görüşmeleri, e-posta iletişimleri, ofis görüşmeleri ve
          sizin tarafınızdan doğrudan yapılan bilgi paylaşımları aracılığıyla toplanır.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            label="KVKK m.5/2-c"
            value="Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması sebebiyle gerekli olan veri işleme faaliyetleri"
          />
          <InfoCard
            label="KVKK m.5/2-f"
            value="Temel hak ve özgürlüklerinize zarar vermemek kaydıyla, şirketimizin meşru menfaatleri için veri işlenmesinin zorunlu olması"
          />
          <InfoCard
            label="KVKK m.5/2-c ve m.5/2-f Uygulaması"
            value="İlan hakkında bilgi vermek, görüşme sürecini yönetmek, talebinize geri dönmek ve iletişim kayıtlarını tutmak"
          />
          <InfoCard
            label="KVKK m.5/1"
            value="Pazarlama, tanıtım veya ticari elektronik ileti gibi açık rıza gerektiren faaliyetlerde yalnızca ayrı olarak verdiğiniz açık rıza kapsamında işleme yapılır"
          />
        </div>
      </LegalSection>

      <LegalSection title="4. İşleme Amaçları">
        <ul className="list-disc space-y-2 pl-5">
          <li>Talep ettiğiniz gayrimenkuller ve portföyler hakkında bilgi vermek</li>
          <li>İletişim taleplerinizi almak, değerlendirmek ve size geri dönüş sağlamak</li>
          <li>Randevu, teklif ve görüşme süreçlerini planlamak ve takip etmek</li>
          <li>Müşteri ilişkileri yönetimi ile talep ve şikayet süreçlerini yürütmek</li>
          <li>Olası uyuşmazlıklarda ispat, denetim ve hukuki yükümlülüklerin yerine getirilmesini sağlamak</li>
          <li>Ayrı açık rıza vermeniz halinde yeni portföyler, yatırım fırsatları veya tanıtım iletileri göndermek</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Kişisel Verilerin Aktarılabileceği Taraflar">
        <p>
          Kişisel verileriniz; yukarıdaki amaçlarla sınırlı olmak üzere, yetkili şirket personeli, bilgi teknolojileri ve barındırma
          hizmet sağlayıcıları, kurumsal e-posta altyapısı hizmet sağlayıcıları ile kanunen yetkili kamu kurum ve kuruluşlarına aktarılabilir.
        </p>
        <p>
          Gayrimenkul işleminin fiilen yürütülmesi gereken durumlarda, ilgili sürecin gerektirmesi halinde noterlikler, tapu müdürlükleri,
          belediyeler, meslek danışmanları veya hukuken yetkili resmi makamlarla veri paylaşımı söz konusu olabilir.
        </p>
      </LegalSection>

      <LegalSection title="6. Saklama Süreleri ve Veri Güvenliği">
        <p>
          Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuatta zorunlu kılınan saklama süreleri kadar muhafaza
          edilir. Amaç ortadan kalktığında veya yasal saklama süresi sona erdiğinde, KVKK m.7 ve ilgili ikincil düzenlemelere uygun olarak
          silinir, yok edilir veya anonim hale getirilir.
        </p>
        <p>
          Şirketimiz; yetkisiz erişimin önlenmesi, verilerin muhafazası ve bütünlüğünün korunması amacıyla makul teknik ve idari tedbirleri
          almaya gayret eder. Bununla birlikte, internet üzerinden iletilen veriler için mutlak güvenlik garantisi verilemez.
        </p>
      </LegalSection>

      <LegalSection title="7. İlgili Kişi Olarak Haklarınız">
        <p>KVKK m.11 kapsamında aşağıdaki haklara sahipsiniz:</p>
        <ul className="list-disc space-y-2 pl-5">
          {ARTICLE_11_RIGHTS.map((right) => (
            <li key={right}>{right}</li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="8. Başvuru Usulü">
        <p>
          Haklarınıza ilişkin başvurularınızı, <Link to="/veri-sahibi-basvuru-formu" className="font-semibold text-gold-600 hover:underline">Veri Sahibi Başvuru Formu</Link>{' '}
          üzerinden veya 6698 sayılı Kanun'un 13. maddesine uygun diğer yöntemlerle şirketimize iletebilirsiniz.
        </p>
        <p>
          Başvurularınız, talebin niteliğine göre en kısa sürede ve en geç 30 gün içinde ücretsiz olarak sonuçlandırılır. İşlemin ayrıca
          bir maliyet gerektirmesi halinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarife üzerinden ücret talep edilebilir.
        </p>
      </LegalSection>
    </LegalLayout>
  );
};

export const PrivacyPolicy: React.FC = () => {
  const { generalSettings, seoSettings, googleSettings } = useData();
  const siteHost = getSiteHost(seoSettings.baseUrl || 'https://www.adaemlak.com.tr');

  return (
    <LegalLayout
      title="Gizlilik Politikası"
      summary={`${siteHost} üzerinden bizimle paylaştığınız bilgilerin hangi çerçevede korunduğunu, kimlerin erişebildiğini ve internet sitesinin gizlilik yaklaşımını açıklar.`}
      keywords="gizlilik politikası, ada emlak gizlilik, kişisel veri güvenliği"
    >
      <LegalSection title="1. Politikanın Kapsamı">
        <p>
          Bu politika; internet sitesi ziyaretleriniz, iletişim formu kullanımı, e-posta ve telefon yoluyla ilettiğiniz bilgiler ile
          gayrimenkul taleplerinize ilişkin olarak bize aktardığınız veriler için uygulanır.
        </p>
        <p>
          Site üzerinden kullanıcı hesabı oluşturma, online ödeme alma veya doğrudan tapu işlemi yürütme gibi bir yapı bulunmadığından,
          burada açıklanan gizlilik taahhütleri esas olarak iletişim ve portföy bilgilendirme süreçlerine ilişkindir.
        </p>
      </LegalSection>

      <LegalSection title="2. Hangi Bilgileri Topluyoruz">
        <ul className="list-disc space-y-2 pl-5">
          <li>İletişim formunda girdiğiniz ad-soyad, telefon, e-posta, konu ve mesaj bilgileri</li>
          <li>Telefon veya e-posta görüşmelerinde bizimle paylaştığınız ilan, lokasyon ve bütçe tercihleri</li>
          <li>Tarafınızca iletilen ek açıklamalar, randevu talebi ve geri dönüş tercihleri</li>
          <li>İletişimin yönetilebilmesi için gerekli tarih ve kayıt bilgileri</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Bilgilerin Kullanımı">
        <ul className="list-disc space-y-2 pl-5">
          <li>Taleplerinizi almak ve size geri dönmek</li>
          <li>Uygun portföyler, ilanlar veya görüşme planları hakkında bilgi sunmak</li>
          <li>Müşteri ilişkileri yönetimi, hizmet kalitesi ve operasyonel takip sağlamak</li>
          <li>Hukuki yükümlülükleri yerine getirmek ve uyuşmazlık hallerinde ispat yükümlülüğünü karşılamak</li>
        </ul>
        <p>
          İletişim formu üzerinden gönderdiğiniz bilgiler, bu uygulamanın yönetim panelinde yetkili personel tarafından görüntülenmek ve
          talebinize geri dönülebilmek amacıyla işlenir.
        </p>
      </LegalSection>

      <LegalSection title="4. Bilgilerin Paylaşımı">
        <p>
          Kişisel verileriniz, kanuni zorunluluk bulunmadıkça ve hukuki dayanak olmaksızın gelişigüzel şekilde üçüncü kişilerle
          paylaşılmaz. Ancak hizmetin yerine getirilmesi ve sistemin işletilmesi için barındırma, kurumsal e-posta, bilgi teknolojileri
          desteği gibi sınırlı hizmet sağlayıcılarından yararlanılabilir.
        </p>
        <p>
          Resmi makamların hukuka uygun talebi, yargısal süreçler veya zorunlu mevzuat hallerinde bilgi paylaşımı yapılabilir.
        </p>
      </LegalSection>

      <LegalSection title="5. Güvenlik Yaklaşımı">
        <p>
          Yetkisiz erişimi önlemek, verilerin kazara kaybını azaltmak ve iletişim kayıtlarını korumak amacıyla makul teknik ve idari
          tedbirler uygulanır. Bununla birlikte, internet altyapısı doğası gereği hiçbir elektronik aktarım yöntemi yüzde yüz güvenli
          kabul edilemez.
        </p>
      </LegalSection>

      <LegalSection title="6. Üçüncü Taraf İçerikler ve Bağlantılar">
        <p>
          Sitede üçüncü taraf web sitelerine yönlendiren bağlantılar, harita içeriği veya telefon/e-posta linkleri bulunabilir. Bu
          bağlantılar aracılığıyla ayrıldığınız sayfalardaki veri işleme faaliyetlerinden ilgili üçüncü taraf sorumludur.
        </p>
        <p>
          İletişim sayfasında yer alan harita bileşeni Google altyapısı üzerinden sunulur. Bu nedenle ilgili sayfa açıldığında, Google'ın
          kendi gizlilik ve çerez kuralları da devreye girebilir.
        </p>
      </LegalSection>

      <LegalSection title="7. Analitik ve Ölçümleme Durumu">
        <p>
          Mevcut uygulama yapısında Google Analytics kimliği yalnızca yönetim panelinden tanımlanması halinde çalışır. Şu andaki yazılım
          konfigürasyonunda <strong>{googleSettings.analyticsId ? 'Google Analytics entegrasyonu aktiftir.' : 'Google Analytics entegrasyonu aktif değildir.'}</strong>
        </p>
        <p>
          İleride analitik veya reklam amaçlı yeni araçlar devreye alınacak olursa, buna ilişkin yasal metinler ve çerez tercih mekanizması
          ayrıca güncellenmelidir.
        </p>
      </LegalSection>

      <LegalSection title="8. Haklarınız ve İletişim">
        <p>
          KVKK kapsamındaki talepleriniz için <Link to="/kvkk" className="font-semibold text-gold-600 hover:underline">KVKK Aydınlatma Metni</Link> ve{' '}
          <Link to="/veri-sahibi-basvuru-formu" className="font-semibold text-gold-600 hover:underline">Veri Sahibi Başvuru Formu</Link> sayfalarımızı
          kullanabilirsiniz.
        </p>
        <DataControllerSummary
          companyName={generalSettings.companyName}
          address={generalSettings.contactAddress}
          email={generalSettings.contactEmail}
          phone={generalSettings.contactPhone}
          siteUrl={seoSettings.baseUrl}
        />
      </LegalSection>
    </LegalLayout>
  );
};

export const CookiePolicy: React.FC = () => {
  const { generalSettings, seoSettings, googleSettings } = useData();
  const siteHost = getSiteHost(seoSettings.baseUrl || 'https://www.adaemlak.com.tr');

  return (
    <LegalLayout
      title="Çerez Politikası"
      summary={`${siteHost} üzerinde kullanılan çerezler ve çerez benzeri teknolojiler hakkında şeffaf bilgi vermek amacıyla hazırlanmıştır. Bu metin, sitenin mevcut yazılım konfigürasyonuna göre düzenlenmiştir.`}
      keywords="çerez politikası, cookie policy, ada emlak çerezler"
    >
      <LegalSection title="1. Çerez Nedir">
        <p>
          Çerezler, bir internet sitesini ziyaret ettiğinizde tarayıcınıza veya cihazınıza kaydedilebilen küçük veri dosyalarıdır. Benzer
          şekilde local storage gibi tarayıcı depolama araçları da belirli tercihlerin veya oturum bilgilerinin saklanması için
          kullanılabilir.
        </p>
      </LegalSection>

      <LegalSection title="2. Bu Sitede Kullanılan Teknolojiler">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            label="Kamuya Açık Bölüm"
            value="Mevcut uygulama kodunda kamuya açık sayfalarda zorunlu olmayan analitik veya reklam çerezleri varsayılan olarak etkinleştirilmemiştir."
          />
          <InfoCard
            label="Admin Paneli"
            value="Admin giriş durumunu aynı tarayıcıda sürdürmek için local storage üzerinde oturum anahtarı tutulur. Bu veri çerez değildir; ancak çerez benzeri tarayıcı depolama teknolojisi olarak burada açıklanmaktadır."
          />
          <InfoCard
            label="Harita Gömme İçeriği"
            value="İletişim sayfasındaki Google tabanlı harita bileşeni, ilgili sayfa yüklendiğinde üçüncü taraf çerez veya benzeri teknoloji kullanabilir."
          />
          <InfoCard
            label="Analitik Araçlar"
            value={googleSettings.analyticsId ? 'Yönetim panelinde tanımlı olduğu için Google Analytics entegrasyonu çalışmaya hazırdır veya etkinleştirilmiştir.' : 'Yönetim panelinde aktif bir Google Analytics kimliği bulunmadığından uygulama katmanında Google Analytics çerezleri çalıştırılmamaktadır.'}
          />
        </div>
      </LegalSection>

      <LegalSection title="3. Kullanım Amaçları">
        <ul className="list-disc space-y-2 pl-5">
          <li>Sayfaların teknik olarak çalışmasını sağlamak</li>
          <li>Admin panelinde oturum sürekliliğini korumak</li>
          <li>İletişim sayfasında ofis konumunu harita üzerinde gösterebilmek</li>
          <li>Etkinleştirilmesi halinde, site trafiğini ölçmek ve performansı analiz etmek</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Çerez Yönetimi ve Tercihler">
        <p>
          Tarayıcı ayarlarınız üzerinden çerezleri silebilir, engelleyebilir veya belirli alan adları için ayrı yönetebilirsiniz. Ancak
          zorunlu teknik mekanizmaların devre dışı bırakılması, sayfaların beklenen şekilde çalışmamasına yol açabilecektir.
        </p>
        <p>
          Üçüncü taraf harita veya benzeri gömülü içeriklerin davranışı, ilgili sağlayıcının kendi çerez ve gizlilik politikalarına tabidir.
        </p>
      </LegalSection>

      <LegalSection title="5. İleride Yapılabilecek Değişiklikler">
        <p>
          Siteye yeni analitik, reklam, yeniden hedefleme veya davranışsal ölçümleme araçları eklenirse; kullanılan çerez türleri, saklama
          süreleri ve hukuki dayanaklar bu sayfada güncellenecek, gerekli hallerde ayrı bir tercih veya açık rıza mekanizması sunulacaktır.
        </p>
      </LegalSection>

      <LegalSection title="6. İletişim">
        <DataControllerSummary
          companyName={generalSettings.companyName}
          address={generalSettings.contactAddress}
          email={generalSettings.contactEmail}
          phone={generalSettings.contactPhone}
          siteUrl={seoSettings.baseUrl}
        />
      </LegalSection>
    </LegalLayout>
  );
};

export const ExplicitConsent: React.FC = () => {
  const { generalSettings, seoSettings } = useData();

  return (
    <LegalLayout
      title="Açık Rıza Metni"
      summary="Bu metin, KVKK kapsamında açık rıza gerektiren veri işleme faaliyetleri için hazırlanmıştır. Aydınlatma metninden ayrı düzenlenmiş olup, yalnızca rıza verilmesi gereken durumlarda kullanılmalıdır."
      keywords="açık rıza metni, ticari elektronik ileti izni, ada emlak onay metni"
    >
      <LegalSection title="1. Açık Rızanın Kapsamı">
        <p>
          Açık rıza; belirli bir konuya ilişkin, bilgilendirmeye dayanan ve özgür iradeyle açıklanan rıza anlamına gelir. Bu nedenle bu
          metin, temel hizmetin sunulması için zorunlu olmayan ve ayrı onay gerektiren faaliyetlerle sınırlıdır.
        </p>
        <p>
          Açık rıza vermemeniz; ilanlar hakkında bilgi alma, iletişim formunu kullanma veya şirketimizle görüşme imkanınızın ortadan
          kalkması sonucunu doğurmaz.
        </p>
      </LegalSection>

      <LegalSection title="2. Açık Rıza Gerektirebilecek Faaliyetler">
        <ul className="list-disc space-y-2 pl-5">
          <li>Telefon, SMS veya e-posta ile tanıtım, kampanya veya yeni portföy bildirimleri gönderilmesi</li>
          <li>İlgi alanlarınıza ve arama tercihlerinize göre size özel portföy eşleştirmesi yapılması</li>
          <li>Temel hizmetin sunulması için zorunlu olmayan pazarlama ve tanıtım faaliyetleri</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Açık Rıza Kapsamında İşlenebilecek Veri Kategorileri">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard label="İletişim Bilgileri" value="Ad-soyad, telefon numarası, e-posta adresi" />
          <InfoCard label="Tercih Bilgileri" value="İlgilendiğiniz lokasyonlar, gayrimenkul tipi, bütçe aralığı, yatırım veya kullanım amacı" />
          <InfoCard label="İletişim Kanalları" value="Telefon araması, SMS, e-posta ve tarafınızca tercih edilen diğer iletişim yöntemleri" />
          <InfoCard label="İşleme Sınırı" value="Yalnızca rıza metninde belirtilen amaç, kapsam ve süre ile sınırlı olarak" />
        </div>
      </LegalSection>

      <LegalSection title="4. Örnek Açık Rıza Beyanı">
        <div className="rounded-[20px] border border-[#ead7a6] bg-[linear-gradient(135deg,#fffdfa_0%,#f8f2e7_100%)] p-5 text-[#495264]">
          <p>
            <strong>{generalSettings.companyName}</strong> tarafından sunulan gayrimenkul danışmanlığı faaliyetleri kapsamında;
            tarafıma yeni portföyler, yatırım fırsatları ve tanıtım içeriklerinin telefon, SMS ve e-posta kanallarıyla iletilmesine;
            tarafımca paylaşılan tercih bilgilerinin bana uygun portföylerin eşleştirilmesi amacıyla işlenmesine açıkça rıza gösterdiğimi
            beyan ederim.
          </p>
        </div>
      </LegalSection>

      <LegalSection title="5. Geri Alma Hakkı">
        <p>
          Verdiğiniz açık rızayı dilediğiniz zaman geri alabilirsiniz. Geri alma beyanınız bize ulaştıktan sonra, açık rızaya dayanan veri
          işleme faaliyetleri ileriye dönük olarak durdurulur.
        </p>
        <p>
          Geri alma taleplerinizi <strong>{generalSettings.contactEmail}</strong> adresine iletebilir veya{' '}
          <Link to="/veri-sahibi-basvuru-formu" className="font-semibold text-gold-600 hover:underline">Veri Sahibi Başvuru Formu</Link> iletebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="6. Önemli Not">
        <p>
          Bu sayfanın yayınlanması tek başına açık rıza alınmış olduğu anlamına gelmez. Açık rıza, aydınlatma metninden ayrı olacak şekilde,
          ilgili kişi tarafından olumlu irade beyanını gösteren açık bir işlem ile alınmalıdır.
        </p>
        <DataControllerSummary
          companyName={generalSettings.companyName}
          address={generalSettings.contactAddress}
          email={generalSettings.contactEmail}
          phone={generalSettings.contactPhone}
          siteUrl={seoSettings.baseUrl}
        />
      </LegalSection>
    </LegalLayout>
  );
};

export const DataSubjectForm: React.FC = () => {
  const { generalSettings, seoSettings } = useData();

  return (
    <LegalLayout
      title="Veri Sahibi Başvuru Formu"
      summary="KVKK m.11 kapsamındaki haklarınız için kullanabileceğiniz başvuru çerçevesini, zorunlu bilgi alanlarını ve başvuru kanallarını açıklar. Formu yazılı veya elektronik başvurunuzda örnek olarak kullanabilirsiniz."
      keywords="veri sahibi başvuru formu, kvkk başvuru, kişisel veri talep formu"
    >
      <LegalSection title="1. Başvuru Öncesi Bilmeniz Gerekenler">
        <ul className="list-disc space-y-2 pl-5">
          <li>Başvuru, bizzat ilgili kişi tarafından veya usulüne uygun yetkilendirilmiş vekil aracılığıyla yapılmalıdır.</li>
          <li>Talebinizin sağlıklı değerlendirilebilmesi için kimlik ve iletişim bilgileriniz ile talep konusunu açık şekilde belirtmeniz gerekir.</li>
          <li>Başvurular, niteliğine göre en geç 30 gün içinde sonuçlandırılır.</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Başvuruda Bulunması Gereken Asgari Bilgiler">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Ad Soyad" />
          <FormField label="T.C. Kimlik No / Pasaport No" hint="Yabancılar için uyruğu ve pasaport veya kimlik numarası" />
          <FormField label="Tebligata Esas Adres" />
          <FormField label="Kayıtlı E-Posta / E-Posta / Telefon" />
          <FormField label="Şirket ile İlişkiniz" hint="Müşteri, potansiyel müşteri, ilan sahibi, ziyaretçi, vekil vb." />
          <FormField label="Başvuru Konusu" hint="Hangi hakkınızı kullanmak istediğinizi açık yazınız" />
        </div>
      </LegalSection>

      <LegalSection title="3. Talep Konuları">
        <div className="grid gap-3 md:grid-cols-2">
          {ARTICLE_11_RIGHTS.map((right) => (
            <div key={right} className="flex items-start gap-3 rounded-[16px] border border-[#e7ebf1] bg-white px-4 py-4">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 rounded-[6px] border border-[#cfd7e3] bg-[#fafbfd]"></span>
              <span className="text-[14px] leading-6 text-[#4f5868]">{right}</span>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="4. Talebinize İlişkin Açıklama ve Belgeler">
        <FormField
          label="Açıklama"
          hint="Hangi veri işleme faaliyetine ilişkin talepte bulunduğunuzu, mümkünse ilan numarası, tarih, kanal veya belge bilgisiyle birlikte yazınız."
        />
        <FormField
          label="Ek Belgeler"
          hint="Vekaletname, kimlik fotokopisi, tebligat belgeleri veya talebinizi destekleyen diğer dokümanlar"
        />
      </LegalSection>

      <LegalSection title="5. Başvuru Yöntemleri">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            label="Yazılı Başvuru"
            value={`${generalSettings.contactAddress}\nAdresine imzalı dilekçeyi bizzat teslim ederek, noter aracılığıyla veya iadeli taahhütlü posta ile gönderebilirsiniz.`}
          />
          <InfoCard
            label="Elektronik Başvuru"
            value={`Güvenli elektronik imza, mobil imza veya sistemlerimizde kayıtlı bulunan e-posta adresiniz üzerinden ${generalSettings.contactEmail} adresine başvuru iletebilirsiniz.`}
          />
        </div>
        <p>
          Elektronik başvurularda, konu satırında <strong>"KVKK Bilgi Talebi"</strong> ibaresinin kullanılması sürecin hızlı
          değerlendirilmesine yardımcı olur.
        </p>
      </LegalSection>

      <LegalSection title="6. Cevaplama Süreci">
        <p>
          Talebiniz kabul edilebilir bulunursa gereği yerine getirilir; reddedilmesi halinde ise gerekçeli cevap tarafınıza yazılı veya
          elektronik ortamda bildirilir. Başvurunun reddedilmesi, cevabın yetersiz bulunması veya süresinde cevap verilmemesi halinde
          Kanun'da öngörülen süreler içinde Kişisel Verileri Koruma Kurulu'na şikayet hakkınız saklıdır.
        </p>
      </LegalSection>

      <LegalSection title="7. Veri Sorumlusu Bilgileri">
        <DataControllerSummary
          companyName={generalSettings.companyName}
          address={generalSettings.contactAddress}
          email={generalSettings.contactEmail}
          phone={generalSettings.contactPhone}
          siteUrl={seoSettings.baseUrl}
        />
      </LegalSection>
    </LegalLayout>
  );
};

export const TermsOfUse: React.FC = () => {
  const { generalSettings, seoSettings } = useData();
  const siteHost = getSiteHost(seoSettings.baseUrl || 'https://www.adaemlak.com.tr');

  return (
    <LegalLayout
      title="Kullanım Koşulları"
      summary={`${siteHost} internet sitesini ziyaret ederek veya kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Bu koşullar, sitenin bilgilendirme amaçlı kullanımını ve içeriklerin hukuki çerçevesini belirler.`}
      keywords="kullanım koşulları, ada emlak kullanım şartları, site kullanım politikası"
    >
      <LegalSection title="1. Hizmetin Niteliği">
        <p>
          Bu internet sitesi, gayrimenkul portföylerinin tanıtımı, şirket tanıtım bilgileri, haberler, iletişim kanalları ve danışmanlık
          talebi oluşturma imkanları sunan bir bilgilendirme platformudur. Sitede yer alan bilgiler, aksi açıkça belirtilmedikçe bağlayıcı
          teklif niteliğinde değildir.
        </p>
      </LegalSection>

      <LegalSection title="2. İlan Bilgileri ve Fiyatlar">
        <p>
          İlanlarda yer alan fiyat, metrekaresi, lokasyon, imar durumu, portföy uygunluğu ve benzeri bilgiler; ilanın yayında olduğu andaki
          mevcut kayıtlara dayanır. Bu bilgiler zaman içinde değişebilir, portföy kapanabilir veya yetki durumu sona erebilir.
        </p>
        <p>
          Bu nedenle, nihai karar vermeden önce ilgili portföy için şirketimizle doğrudan iletişime geçmeniz ve güncel durum teyidi almanız
          gerekir.
        </p>
      </LegalSection>

      <LegalSection title="3. Kullanıcı Yükümlülükleri">
        <ul className="list-disc space-y-2 pl-5">
          <li>Siteyi hukuka, genel ahlaka ve dürüstlük kurallarına uygun şekilde kullanmak</li>
          <li>Yanıltıcı bilgi iletmemek ve üçüncü kişilerin haklarını ihlal edecek içerik göndermemek</li>
          <li>Site altyapısına zarar verecek otomasyon, yük bindirme, veri çekme veya müdahale girişimlerinde bulunmamak</li>
          <li>İletişim bilgilerini izinsiz şekilde toplu veri çekme, kopyalama veya ticari amaçla kullanmamak</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Fikri Mülkiyet Hakları">
        <p>
          Site tasarımı, logo, marka unsurları, metinler, görseller, ilan sunumları ve diğer tüm içerikler ilgili mevzuat kapsamında korunur.
          Şirketimizin yazılı izni olmadan kopyalanamaz, çoğaltılamaz, yeniden yayınlanamaz veya ticari amaçla kullanılamaz.
        </p>
      </LegalSection>

      <LegalSection title="5. Üçüncü Taraf Bağlantılar ve Gömmeler">
        <p>
          Sitede yer alan üçüncü taraf bağlantılar, telefon arama linkleri, harita gömülü içerikleri veya dış sitelere yönlendirmeler sadece
          kolaylık sağlama amacıyla sunulabilir. Bu bağlantıların içeriğinden, güvenliğinden ve veri işleme uygulamalarından ilgili üçüncü
          taraf sorumludur.
        </p>
      </LegalSection>

      <LegalSection title="6. Sorumluluğun Sınırı">
        <p>
          Şirketimiz, sitedeki içeriklerin makul ölçüde güncel ve doğru tutulması için çaba gösterir. Bununla birlikte; internet bağlantısı,
          tarayıcı uyumsuzluğu, üçüncü taraf servis kesintileri, geçici teknik arızalar veya güncelleme gecikmeleri nedeniyle oluşabilecek
          kesinti ve hatalar için mutlak süreklilik taahhüdü verilmez.
        </p>
      </LegalSection>

      <LegalSection title="7. Gizlilik ve Kişisel Veriler">
        <p>
          Site kullanımı sırasında paylaştığınız kişisel veriler için <Link to="/kvkk" className="font-semibold text-gold-600 hover:underline">KVKK Aydınlatma Metni</Link>,{' '}
          <Link to="/gizlilik-politikasi" className="font-semibold text-gold-600 hover:underline">Gizlilik Politikası</Link> ve{' '}
          <Link to="/cerez-politikasi" className="font-semibold text-gold-600 hover:underline">Çerez Politikası</Link> birlikte uygulanır.
        </p>
      </LegalSection>

      <LegalSection title="8. Uygulanacak Hukuk ve Yetki">
        <p>
          Bu kullanım koşulları Türk hukuku kapsamında yorumlanır. Uyuşmazlık halinde, uygulanabilir mevzuatın emredici hükümleri saklı kalmak
          üzere, Bakırköy Mahkemeleri ve İcra Daireleri yetkilidir.
        </p>
      </LegalSection>

      <LegalSection title="9. İletişim">
        <DataControllerSummary
          companyName={generalSettings.companyName}
          address={generalSettings.contactAddress}
          email={generalSettings.contactEmail}
          phone={generalSettings.contactPhone}
          siteUrl={seoSettings.baseUrl}
        />
      </LegalSection>
    </LegalLayout>
  );
};
