# State Yönetimi Karşılaştırması

## Hızlı Karşılaştırma

| Özellik | useState | Context API | Redux |
|---------|----------|------------|-------|
| **Kurulum** | ✅ Hazır (React ile gelir) | ✅ Hazır (React ile gelir) | ❌ Paket kurulumu gerekir |
| **Öğrenme Zorluğu** | ⭐ Çok Kolay | ⭐⭐ Kolay | ⭐⭐⭐⭐ Zor |
| **Kod Miktarı** | ⭐ Az | ⭐⭐ Orta | ⭐⭐⭐ Çok |
| **Performans** | ⭐⭐⭐ İyi | ⭐⭐ Orta | ⭐⭐⭐⭐ Çok İyi |
| **Küçük Projeler** | ✅✅✅ Mükemmel | ✅✅ İyi | ❌ Gereksiz |
| **Büyük Projeler** | ❌ Yetersiz | ✅✅ İyi | ✅✅✅ Mükemmel |
| **Prop Drilling** | ❌ Var | ✅ Yok | ✅ Yok |
| **Debugging** | ⭐⭐ Orta | ⭐⭐ Orta | ⭐⭐⭐⭐⭐ Mükemmel |

## Ne Zaman Hangisini Kullan?

### useState Kullan:
- ✅ Tek bileşende state
- ✅ 2-3 bileşen arasında state paylaşımı
- ✅ Basit projeler
- ✅ **Senin şu anki projen gibi** 🎯

### Context API Kullan:
- ✅ 5-10 bileşen arasında state paylaşımı
- ✅ Tema, dil, kullanıcı bilgisi gibi global state
- ✅ Orta büyüklükte projeler
- ✅ useState yetersiz kaldığında

### Redux Kullan:
- ✅ 20+ bileşen arasında karmaşık state
- ✅ Çok büyük ekip projeleri
- ✅ Undo/Redo gibi özellikler gerekiyorsa
- ✅ State'in zaman içindeki değişimini takip etmek gerekiyorsa

## Örnek Senaryolar

### Senaryo 1: Basit Form
```javascript
// useState YETERLİ ✅
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ...
};
```

### Senaryo 2: Tema Değiştirme
```javascript
// Context API İDEAL ✅
// Tema tüm uygulamada kullanılıyor
const ThemeContext = createContext();
// Her bileşen tema bilgisine erişebilir
```

### Senaryo 3: E-ticaret Sepeti
```javascript
// Redux İDEAL ✅
// Sepet bilgisi: ürünler, fiyat, indirimler, kargo...
// Çok karmaşık state mantığı
// Undo/Redo gerekebilir
```

## Senin Projen İçin Öneri

**Şu an: useState ✅** (Doğru seçim!)
- Sadece birkaç state var (messages, sidebarVisible)
- Bileşenler yakın (app.js içinde)
- Basit ve anlaşılır

**Gelecekte Context API'ye geç:**
- Eğer 10+ bileşen olursa
- State'i birçok yerde kullanman gerekiyorsa
- Mesaj geçmişi, kullanıcı profili gibi global state eklenirse

**Redux'a geçme:**
- Sadece çok büyük projelerde gerekli
- Senin projen için şimdilik gereksiz karmaşıklık


