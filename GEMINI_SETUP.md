# Gemini AI Entegrasyonu Kurulum Rehberi

Bu proje Google Gemini AI entegrasyonu kullanmaktadır. Kurulum için aşağıdaki adımları takip edin.

## Kurulum Adımları

### 1. API Key Alma

1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
2. Google hesabınızla giriş yapın
3. "Get API Key" butonuna tıklayın
4. API key'inizi kopyalayın

### 2. .env Dosyası Oluşturma

Proje kök dizininde (expo-deneme-project klasöründe) `.env` dosyası oluşturun:

```bash
# Terminalden oluşturmak için:
touch .env
```

Veya manuel olarak `.env` dosyası oluşturun ve içine şunu ekleyin:

```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_SYSTEM_PROMPT=Sen bir dayak simülasyon asistanısın. Kullanıcının fotoğrafına yapılan eyleme göre (tokat, tekme, yumruk, vb.) görsel değişiklikler uygula ve yüzde değerini azalt. Her eylem sonrası fotoğraftaki kişinin durumunu betimle.
```

**ÖNEMLİ:** `your_actual_api_key_here` yerine aldığınız gerçek API key'i yazın.

### 3. Uygulamayı Yeniden Başlatın

```bash
# Metro bundler'ı durdurun (Ctrl+C)
# Sonra yeniden başlatın:
npx expo start --clear
```

## Nasıl Çalışır?

1. **Fotoğraf Seçme:** Photo Gallery ekranından bir fotoğraf seçin veya yükleyin
2. **İşlem Uygulama:** Photo Detail ekranındaki kırmızı butonlardan birini (Tokat, Tekme, vb.) tıklayın
3. **AI İşleme:** Gemini AI fotoğrafı analiz eder ve durumu betimler
4. **Yüzde Azaltma:** Her işlemden sonra ilgili fotoğrafın dayanma yüzdesi %15 azalır
5. **%0 Kontrolü:** Yüzde %0'a ulaşınca işlem yapılamaz

## Özellikler

- ✅ Her fotoğraf %100 ile başlar
- ✅ Kırmızı butonlar (Tokat, Tekme, Tükür, Yumruk) Gemini AI kullanır
- ✅ Her işlem sonrası yüzde %15 azalır
- ✅ %0'a gelince uyarı gösterilir
- ✅ İşlem sırasında loading göstergesi
- ✅ Yüzde değeri AsyncStorage'da kalıcı olarak saklanır

## Sorun Giderme

### "Gemini API key tanımlanmamış" Hatası

- `.env` dosyasının proje kök dizininde olduğundan emin olun
- API key'in doğru yazıldığından emin olun
- Metro bundler'ı yeniden başlatın: `npx expo start --clear`

### API Çağrısı Başarısız Olursa

- İnternet bağlantınızı kontrol edin
- API key'inizin geçerli olduğundan emin olun
- Google AI Studio'da API key'inizi kontrol edin

## Güvenlik Notu

⚠️ **DİKKAT:** `.env` dosyası `.gitignore`'da olmalıdır (zaten eklenmiştir). API key'inizi asla Git'e commit etmeyin!

