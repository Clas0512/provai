import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

// .env dosyasından API key ve prompt'u al
// app.config.js üzerinden Constants.expoConfig.extra ile erişilir
const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;
const GEMINI_SYSTEM_PROMPT = Constants.expoConfig?.extra?.GEMINI_SYSTEM_PROMPT || "Sen bir dayak simülasyon asistanısın. Kullanıcının fotoğrafına yapılan eyleme göre (tokat, tekme, yumruk, vb.) görsel değişiklikler uygula ve yüzde değerini azalt. Her eylem sonrası fotoğraftaki kişinin durumunu betimle.";

// Gemini AI client'ı başlat
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Fotoğrafa eylem uygula ve yeni fotoğraf döndür
 * @param {string} photoUri - Fotoğrafın URI'si
 * @param {string} action - Yapılan eylem (tokat, tekme, vb.)
 * @returns {Promise<string>} - Yeni fotoğraf URI'si
 */
export const applyActionToPhoto = async (photoUri, action) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Fotoğrafı base64'e çevir
    const response = await fetch(photoUri);
    const blob = await response.blob();
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.readAsDataURL(blob);
    });

    // Prompt oluştur
    const prompt = `${GEMINI_SYSTEM_PROMPT}

Uygulanan eylem: ${action}

Bu eyleme göre fotoğraftaki kişinin durumunu betimle ve görsel değişiklikleri açıkla.`;

    // Gemini'ye gönder (text-only response)
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64,
        },
      },
      { text: prompt },
    ]);

    const textResponse = result.response.text();
    
    // Not: Gemini Vision API şu anda fotoğraf manipülasyonu yapmıyor,
    // sadece text response dönüyor. Gerçek implementasyonda
    // fotoğraf düzenleme API'si (OpenAI DALL-E, Midjourney vb.) gerekir.
    console.log('Gemini Response:', textResponse);

    // Şimdilik orijinal fotoğrafı döndür
    // Gerçek implementasyonda burası düzenlenmiş fotoğraf olacak
    return {
      success: true,
      newPhotoUri: photoUri, // Düzenlenmiş fotoğraf burada olacak
      description: textResponse,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API hatası: ${error.message}`);
  }
};

/**
 * API key'in geçerli olup olmadığını kontrol et
 * @returns {boolean}
 */
export const isGeminiConfigured = () => {
  return !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here';
};

