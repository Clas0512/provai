require('dotenv').config();

module.exports = {
  expo: {
    name: "expo-deneme-project",
    slug: "expo-deneme-project",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "expodenemeproject",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ]
    ],
    experiments: {
      reactCompiler: true
    },
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      GEMINI_SYSTEM_PROMPT: process.env.GEMINI_SYSTEM_PROMPT || "Sen bir dayak simülasyon asistanısın. Kullanıcının fotoğrafına yapılan eyleme göre (tokat, tekme, yumruk, vb.) görsel değişiklikler uygula ve yüzde değerini azalt. Her eylem sonrası fotoğraftaki kişinin durumunu betimle."
    }
  }
};

