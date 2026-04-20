
import { Listing, SidebarListing, NewsItem, NavItem } from './types';
import { LIVE_MAIN_LISTINGS, LIVE_SIDEBAR_LISTINGS } from './data/liveListings.generated';

// STRICT CATEGORY LIST
export const CATEGORIES = [
  "SATILIK KONUT", "KİRALIK KONUT",
  "SATILIK ARSA", "KİRALIK ARSA",
  "SATILIK BİNA", "KİRALIK BİNA",
  "SATILIK PLAZA", "KİRALIK PLAZA",
  "SATILIK FABRİKA", "KİRALIK FABRİKA",
  "SATILIK DEPO-ANTREPO", "KİRALIK DEPO-ANTREPO",
  "SATILIK İŞ YERİ", "KİRALIK İŞ YERİ",
  "SATILIK OTEL", "KİRALIK OTEL",
  "SATILIK OFİS", "KİRALIK OFİS",
  "SATILIK MAĞAZA", "KİRALIK MAĞAZA",
  "SATILIK VİLLA", "KİRALIK VİLLA"
];

// Footer Navigation Items
export const NAV_ITEMS = [
  { label: 'ARSA', path: '/arsa' },
  { label: 'BİNA', path: '/bina' },
  { label: 'PLAZA', path: '/plaza' },
  { label: 'FABRİKA', path: '/fabrika' },
  { label: 'DEPO - ANTREPO', path: '/depo-antrepo', externalUrl: 'https://www.depoantrepo.com/' },
  { label: 'İŞ YERİ', path: '/is-yeri' },
  { label: 'LÜKS KONUT', path: '/luks-konut' }
];

// TOP MENU MAPPING (Desktop)
export const NAV_MENU: NavItem[] = [
  {
    label: "ARSA",
    slug: "arsa",
    subItems: [
      { label: "Satılık Arsa", link: "/kategori/arsa/satilik", categoryKey: "SATILIK ARSA" },
      { label: "Kiralık Arsa", link: "/kategori/arsa/kiralik", categoryKey: "KİRALIK ARSA" }
    ]
  },
  {
    label: "BİNA",
    slug: "bina",
    subItems: [
      { label: "Satılık Bina", link: "/kategori/bina/satilik", categoryKey: "SATILIK BİNA" },
      { label: "Kiralık Bina", link: "/kategori/bina/kiralik", categoryKey: "KİRALIK BİNA" }
    ]
  },
  {
    label: "PLAZA",
    slug: "plaza",
    subItems: [
      { label: "Satılık Plaza", link: "/kategori/plaza/satilik", categoryKey: "SATILIK PLAZA" },
      { label: "Kiralık Plaza", link: "/kategori/plaza/kiralik", categoryKey: "KİRALIK PLAZA" }
    ]
  },
  {
    label: "FABRİKA",
    slug: "fabrika",
    subItems: [
      { label: "Satılık Fabrika", link: "/kategori/fabrika/satilik", categoryKey: "SATILIK FABRİKA" },
      { label: "Kiralık Fabrika", link: "/kategori/fabrika/kiralik", categoryKey: "KİRALIK FABRİKA" }
    ]
  },
  {
    label: "DEPO - ANTREPO",
    slug: "depo-antrepo",
    externalUrl: "https://www.depoantrepo.com/",
    subItems: [
      { label: "Satılık Depo-Antrepo", link: "/kategori/depo-antrepo/satilik", categoryKey: "SATILIK DEPO-ANTREPO" },
      { label: "Kiralık Depo-Antrepo", link: "/kategori/depo-antrepo/kiralik", categoryKey: "KİRALIK DEPO-ANTREPO" }
    ]
  },
  {
    label: "İŞ YERİ",
    slug: "is-yeri",
    subItems: [
      { label: "Satılık İş Yeri", link: "/kategori/is-yeri/satilik", categoryKey: "SATILIK İŞ YERİ" },
      { label: "Kiralık İş Yeri", link: "/kategori/is-yeri/kiralik", categoryKey: "KİRALIK İŞ YERİ" },
      { label: "Satılık Ofis", link: "/kategori/ofis/satilik", categoryKey: "SATILIK OFİS" },
      { label: "Kiralık Ofis", link: "/kategori/ofis/kiralik", categoryKey: "KİRALIK OFİS" },
      { label: "Satılık Mağaza", link: "/kategori/magaza/satilik", categoryKey: "SATILIK MAĞAZA" },
      { label: "Kiralık Mağaza", link: "/kategori/magaza/kiralik", categoryKey: "KİRALIK MAĞAZA" },
      { label: "Satılık Otel", link: "/kategori/otel/satilik", categoryKey: "SATILIK OTEL" },
      { label: "Kiralık Otel", link: "/kategori/otel/kiralik", categoryKey: "KİRALIK OTEL" }
    ]
  },
  {
    label: "LÜKS KONUT",
    slug: "luks-konut",
    subItems: [
      { label: "Satılık Konut", link: "/kategori/konut/satilik", categoryKey: "SATILIK KONUT" },
      { label: "Kiralık Konut", link: "/kategori/konut/kiralik", categoryKey: "KİRALIK KONUT" },
      { label: "Satılık Villa", link: "/kategori/villa/satilik", categoryKey: "SATILIK VİLLA" },
      { label: "Kiralık Villa", link: "/kategori/villa/kiralik", categoryKey: "KİRALIK VİLLA" }
    ]
  }
];

// --- MOBILE SPECIFIC CONSTANTS ---

export const MOBILE_NAV_ITEMS = [
  { label: 'Ana Sayfa', path: '/', icon: 'home' },
  { label: 'Hakkımızda', path: '/hakkimizda', icon: 'about' },
  { label: 'Haberler', path: '/blog', icon: 'news' },
  { label: 'Referanslarımız', path: '/referanslar', icon: 'refs' },
  { label: 'İletişim', path: '/iletisim', icon: 'contact' },
];

export const MOBILE_CATEGORY_ITEMS = [
  { label: 'ARSA', path: '/arsa', iconKey: 'arsa' },
  { label: 'BİNA', path: '/bina', iconKey: 'bina' },
  { label: 'PLAZA', path: '/plaza', iconKey: 'plaza' },
  { label: 'FABRİKA', path: '/fabrika', iconKey: 'fabrika' },
  { label: 'DEPO - ANTREPO', path: '/depo-antrepo', iconKey: 'depo-antrepo', externalUrl: 'https://www.depoantrepo.com/' },
  { label: 'İŞ YERİ', path: '/is-yeri', iconKey: 'is-yeri' },
  { label: 'LÜKS KONUT', path: '/luks-konut', iconKey: 'luks-konut' },
];

// Helper to map broad slugs to actual DB categories for filtering
export const SLUG_TO_CATEGORIES: Record<string, string[]> = {
  'arsa': ['SATILIK ARSA', 'KİRALIK ARSA'],
  'bina': ['SATILIK BİNA', 'KİRALIK BİNA'],
  'plaza': ['SATILIK PLAZA', 'KİRALIK PLAZA'],
  'fabrika': ['SATILIK FABRİKA', 'KİRALIK FABRİKA'],
  'depo-antrepo': ['SATILIK DEPO-ANTREPO', 'KİRALIK DEPO-ANTREPO'],
  'is-yeri': ['SATILIK İŞ YERİ', 'KİRALIK İŞ YERİ', 'SATILIK OFİS', 'KİRALIK OFİS', 'SATILIK MAĞAZA', 'KİRALIK MAĞAZA', 'SATILIK OTEL', 'KİRALIK OTEL'],
  'luks-konut': ['SATILIK KONUT', 'KİRALIK KONUT', 'SATILIK VİLLA', 'KİRALIK VİLLA']
};

export const MAIN_LISTINGS: Listing[] = LIVE_MAIN_LISTINGS;

export const SIDEBAR_LISTINGS: SidebarListing[] = LIVE_SIDEBAR_LISTINGS;

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'blog-1',
    title: "İstanbul'da Ticari Arsa Alırken İmar Durumu Nasıl Okunur?",
    slug: 'istanbulda-ticari-arsa-alirken-imar-durumu-nasil-okunur',
    date: '25 Mart 2026',
    publishedDateIso: '2026-03-25',
    summary: 'Ticari arsa yatırımında emsal, yükseklik, lejant, yol cephesi ve tapu niteliği gibi başlıkları doğru okumak; fiyat kadar kritik bir karar unsurudur. Bu rehber, İstanbul odağında arsa seçerken dikkat edilmesi gereken temel noktaları sade bir dille açıklar.',
    content: `
      <p>İstanbul'da ticari arsa yatırımı yaparken yalnızca metrekare fiyatına bakmak çoğu zaman yeterli değildir. Bir arsanın gerçek değeri; üzerinde hangi yapılaşmanın mümkün olduğu, ulaşım akslarına nasıl bağlandığı, cephesinin ticari görünürlüğü ve tapu niteliğinin yatırım hedefinizle uyumu gibi başlıklarla birlikte değerlendirilmelidir.</p>
      <h2>1. İmar durumu neden ilk bakılması gereken belgedir?</h2>
      <p>İmar durumu, arsanın hangi amaçla kullanılabileceğini gösteren temel referanstır. Ticaret, konut, konut + ticaret veya özel kullanım kararları; yatırımın geri dönüş süresini doğrudan etkiler. Bu yüzden satış sürecinde sadece “imar var” denmesi yeterli kabul edilmemeli, ilgili belediye kayıtları ve güncel plan notları ayrıca incelenmelidir.</p>
      <h2>2. Emsal, yükseklik ve çekme mesafeleri birlikte okunmalıdır</h2>
      <p>Yatırımcıların en sık yaptığı hatalardan biri emsal değerini tek başına yorumlamaktır. Oysa emsal yüksek olsa bile yükseklik sınırı, ön-yan-arka çekme mesafeleri ve otopark zorunluluğu toplam kullanılabilir inşaat alanını ciddi şekilde etkileyebilir. Bu nedenle arsa değeri hesaplanırken brüt potansiyel değil, fiili proje üretme kapasitesi dikkate alınmalıdır.</p>
      <ul>
        <li><strong>Emsal:</strong> İnşa edilebilir toplam kapalı alanı etkiler.</li>
        <li><strong>Yükseklik:</strong> Kat sayısı ve proje tipi üzerinde belirleyicidir.</li>
        <li><strong>Çekme mesafeleri:</strong> Parselin kullanışlı taban oturumunu daraltabilir.</li>
        <li><strong>Yol cephesi:</strong> Ticari görünürlük ve erişim kalitesini artırır.</li>
      </ul>
      <h2>3. Tapu niteliği ve hisseli yapı ayrı kontrol edilmelidir</h2>
      <p>Ticari arsa arayışında tapunun niteliği, yatırımın güvenliği açısından fiyat kadar önem taşır. Arsa tapusu, hisseli yapı, ifraz durumu ve şerhler; devir kolaylığını ve krediye uygunluğu etkileyebilir. Özellikle hızlı hareket edilmek istenen işlemlerde bu başlıkların işlem öncesinde netleştirilmesi ciddi zaman kazandırır.</p>
      <h2>4. Lokasyon analizinde yalnızca merkezilik yeterli değildir</h2>
      <p>Bir arsanın değerlenme potansiyeli; ana arterlere yakınlık, lojistik erişim, çevredeki ticari yoğunluk, yaya trafiği ve bölgedeki yeni plan kararları ile birlikte analiz edilmelidir. İstanbul gibi çok katmanlı bir pazarda aynı ilçe içinde bile sokak bazında ciddi farklar oluşabilir.</p>
      <h2>5. Satın alma öncesi pratik kontrol listesi</h2>
      <ul>
        <li>İmar durumu ve plan notları güncel mi?</li>
        <li>Tapu üzerinde şerh, ipotek veya hisse sorunu var mı?</li>
        <li>Parselin cephesi ticari kullanım için yeterli mi?</li>
        <li>Bölgedeki benzer ticari arsa işlemleri hangi seviyede?</li>
        <li>Projeyi etkileyebilecek kamusal alan, yol veya dönüşüm kararı var mı?</li>
      </ul>
      <p>Sonuç olarak doğru ticari arsa yatırımı; fiyat, imar ve lokasyon verilerinin birlikte okunmasıyla yapılır. Özellikle İstanbul gibi dinamik bir pazarda, karar sürecini uzman desteğiyle yürütmek hem zaman hem de bütçe açısından daha güvenli bir çerçeve sunar.</p>
    `,
    imageUrl: 'https://www.adaemlak.com.tr/UserFiles/ProductFiles/big/pendik-kurtkoy-de-ticari-imarli-6-108-m2-satilik-arsa-3465520-585_4176-1.jpg',
    status: 'published',
    author: 'Ada Emlak Araştırma Masası',
    metaDescription: "İstanbul'da ticari arsa alırken imar durumu, emsal, yükseklik ve tapu niteliği nasıl yorumlanır? Yatırım öncesi temel rehber.",
    keywords: 'ticari arsa, istanbul arsa yatırımı, imar durumu, emsal hesaplama, satılık arsa, arsa yatırım rehberi'
  },
  {
    id: 'blog-2',
    title: 'Satılık Bina Yatırımında Kira Getirisi ve Geri Dönüş Süresi Nasıl Hesaplanır?',
    slug: 'satilik-bina-yatiriminda-kira-getirisi-ve-geri-donus-suresi-nasil-hesaplanir',
    date: '18 Mart 2026',
    publishedDateIso: '2026-03-18',
    summary: 'Satılık bina yatırımında doğru karar vermek için sadece alım fiyatına değil; kira potansiyeli, boş kalma riski, bakım gideri ve çıkış stratejisine birlikte bakmak gerekir. Bu yazı, ticari bina yatırımını daha rasyonel değerlendirmek isteyenler için pratik bir çerçeve sunar.',
    content: `
      <p>Satılık bina yatırımı, yüksek bütçeli kararlar arasında yer aldığı için sadece “iyi lokasyon” ifadesiyle değerlendirilmemelidir. Yatırımın mantıklı olup olmadığını görmek için kira getirisi, doluluk riski, bakım maliyeti ve olası çıkış senaryoları birlikte hesaplanmalıdır.</p>
      <h2>1. Brüt getiri oranı nedir?</h2>
      <p>En temel hesaplardan biri yıllık toplam kira gelirinin satış bedeline oranıdır. Bu hesap yatırımın ilk fotoğrafını verir; ancak tek başına yeterli değildir. Çünkü brüt getiri, vergi, bakım, yenileme, tahliye ve boş kalma süresi gibi maliyetleri içermez.</p>
      <h2>2. Net getiri hesabı neden daha anlamlıdır?</h2>
      <p>Gerçek yatırım kalitesi net gelir ile anlaşılır. Eğer binada mevcut kiracı varsa, kira kontratının süresi, artış mekanizması ve tahliye esnekliği ayrıca değerlendirilmelidir. Kiracılı binalarda kağıt üzerindeki kira ile piyasadaki rayiç kira arasında önemli farklar oluşabilir.</p>
      <ul>
        <li><strong>Brüt kira geliri:</strong> Yıllık toplam tahsilat</li>
        <li><strong>İşletme giderleri:</strong> Bakım, küçük onarım, yönetim ve boş kalma etkisi</li>
        <li><strong>Net gelir:</strong> Gerçek yatırım performansını gösteren temel veri</li>
      </ul>
      <h2>3. Geri dönüş süresi nasıl okunmalı?</h2>
      <p>Yatırımcılar çoğu zaman “kaç yılda kendini amorti eder?” sorusunu sorar. Bu sorunun yanıtı, sadece kira toplamına değil binanın teknik durumuna, bölgedeki dönüşüm potansiyeline ve alternatif kullanım senaryolarına göre değişir. Özellikle cadde üstü ticari binalarda kira getirisi kadar yeniden konumlandırma potansiyeli de önem taşır.</p>
      <h2>4. Konum kadar bina kalitesi de önemlidir</h2>
      <p>Satılık binanın yaşı, taşıyıcı sistemi, teknik altyapısı, kat planı ve cephe görünürlüğü; kiralanabilirlik üzerinde doğrudan etkilidir. İyi lokasyondaki zayıf planlı bir bina ile daha dengeli planlanmış bir bina arasında ciddi performans farkı oluşabilir.</p>
      <h2>5. Satın alma öncesi kontrol başlıkları</h2>
      <ul>
        <li>Mevcut kira seviyesi piyasa ile uyumlu mu?</li>
        <li>Binanın teknik yenileme ihtiyacı var mı?</li>
        <li>Kat mülkiyeti, tapu ve kullanım durumu net mi?</li>
        <li>Bulunduğu aksın yaya ve araç trafiği güçlü mü?</li>
        <li>Boşalma halinde yeniden kiralama süresi ne olabilir?</li>
      </ul>
      <p>Doğru satılık bina yatırımı; yalnızca bugünkü kira gelirine değil, yarınki kullanım esnekliğine de bakılarak yapılır. Bu nedenle finansal hesap ile saha gözlemini aynı masada buluşturmak gerekir.</p>
    `,
    imageUrl: 'https://www.adaemlak.com.tr/UserFiles/ProductFiles/big/levent-nisbetiye-caddesine-cepheli-mustakil-bina-8349855-814_6270-1.jpg',
    status: 'published',
    author: 'Ada Emlak Araştırma Masası',
    metaDescription: 'Satılık bina yatırımında brüt getiri, net kira ve geri dönüş süresi nasıl hesaplanır? Ticari bina alımı öncesi kritik kontrol rehberi.',
    keywords: 'satılık bina, bina yatırımı, kira getirisi hesaplama, ticari gayrimenkul, geri dönüş süresi, emlak yatırımı'
  },
  {
    id: 'blog-3',
    title: 'Gayrimenkul Yatırımında Lokasyon Analizi: Bakırköy, Beşiktaş ve Pendik Neden Ayrışıyor?',
    slug: 'gayrimenkul-yatiriminda-lokasyon-analizi-bakirkoy-besiktas-ve-pendik',
    date: '10 Mart 2026',
    publishedDateIso: '2026-03-10',
    summary: 'Lokasyon analizi, gayrimenkul yatırımında fiyatın önüne geçen temel değişkendir. Bakırköy, Beşiktaş ve Pendik örneği üzerinden merkezilik, kullanıcı profili, ulaşım ve ticari tempo gibi başlıkların yatırım kararını nasıl etkilediğini ele alıyoruz.',
    content: `
      <p>Gayrimenkulde doğru lokasyon seçimi, çoğu zaman doğru metrekare seçiminden daha belirleyicidir. Aynı bütçe ile farklı ilçelerde tamamen farklı risk ve fırsat profilleri oluşabilir. İstanbul gibi çok merkezli bir şehirde bölge analizi yaparken ulaşım, kullanıcı profili, ticari derinlik ve gelecek potansiyeli birlikte ele alınmalıdır.</p>
      <h2>1. Bakırköy: oturmuş doku ve erişim dengesi</h2>
      <p>Bakırköy, uzun yıllardır yerleşik ticari hayatı, ulaşım bağlantıları ve oturmuş müşteri profili ile öne çıkan bölgelerden biridir. Bu yapı, yatırımcıya ani sıçramadan çok daha öngörülebilir bir piyasa sunar. Özellikle merkezi akslara yakın noktalarda kullanıcı sirkülasyonu istikrarlı seyredebilir.</p>
      <h2>2. Beşiktaş: yüksek görünürlük ve premium talep</h2>
      <p>Beşiktaş tarafında özellikle ana arterler ve güçlü yaya akışı bulunan lokasyonlar, prestij ve görünürlük açısından farklılaşır. Bu tip bölgelerde giriş maliyeti daha yüksek olsa da marka değeri, kiralama kabiliyeti ve uzun vadeli talep seviyesi yatırım kararında etkili olabilir.</p>
      <h2>3. Pendik: gelişim aksları ve ölçek avantajı</h2>
      <p>Pendik ve çevresi; yeni ulaşım bağlantıları, geniş parsel seçenekleri ve gelişim alanları nedeniyle daha farklı bir yatırım dili üretir. Burada yatırımcı açısından ölçek, arsa niteliği ve gelecekteki proje üretme kapasitesi öne çıkar. Özellikle ticari imarlı arsalar ve karma kullanım potansiyeli olan alanlar yakından takip edilir.</p>
      <h2>4. Lokasyon analizinde hangi sorular sorulmalı?</h2>
      <ul>
        <li>Bölgedeki kullanıcı profili hangi gayrimenkul tipini destekliyor?</li>
        <li>Ulaşım bağlantıları bugünkü talebi mi, gelecekteki büyümeyi mi besliyor?</li>
        <li>Yaya görünürlüğü ve araç erişimi aynı anda güçlü mü?</li>
        <li>Bölgedeki arz seviyesi yükseliyor mu, sınırlı mı kalıyor?</li>
        <li>Portföy kısa vadeli nakit akışı mı, uzun vadeli değer artışı mı hedefliyor?</li>
      </ul>
      <h2>5. Sonuç: her yatırımın doğru lokasyonu farklıdır</h2>
      <p>Bakırköy, Beşiktaş ve Pendik aynı şehir içinde yer alsa da yatırım mantığı açısından birbirinden ayrışır. Bu nedenle lokasyon analizinde “en iyi bölge” aramak yerine, yatırım hedefiniz için “en uygun bölgeyi” bulmak daha sağlıklı sonuç verir. Satın alma kararından önce saha verisi, fiyat seviyesi ve kullanım senaryosunun birlikte okunması gerekir.</p>
    `,
    imageUrl: 'https://www.adaemlak.com.tr/UserFiles/ProductFiles/big/karakoy-persembe-pazarinda-caddede-2-katli-120-m2-bina-1064943-780_5922-1.jpg',
    status: 'published',
    author: 'Ada Emlak Araştırma Masası',
    metaDescription: 'Bakırköy, Beşiktaş ve Pendik lokasyonlarını gayrimenkul yatırımı açısından karşılaştırın. Bölgesel analizle daha doğru portföy kararı verin.',
    keywords: 'lokasyon analizi, bakırköy emlak, beşiktaş gayrimenkul, pendik yatırım, istanbul emlak yatırımı, ticari gayrimenkul'
  }
];
