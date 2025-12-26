import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';

// Mesaj tipi tanımı
const createMessage = (text, sender = 'user') => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  text,
  sender, // 'user' veya 'assistant'
  timestamp: new Date(),
});

const ChatScreen = ({ chatId, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [providerMenuVisible, setProviderMenuVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [systemPromptVisible, setSystemPromptVisible] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('Sen yardımcı bir AI asistanısın.');
  const flatListRef = useRef(null);
  
  // Aurora animasyonu için
  const auroraAnim = useRef(new Animated.Value(0)).current;
  // Shine animasyonu için
  const shineAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    // Aurora animasyonunu başlat - CSS'teki @keyframes aurora gibi
    // CSS: @keyframes aurora { 0%{background-position:50%,50%} to{background-position:350%,350%} }
    // CSS: animation: aurora 20s ease-in-out infinite
    // Döngüyü düzgün yapmak için 0 -> 1 -> 0 şeklinde (başlangıç ve bitiş aynı)
    Animated.loop(
      Animated.sequence([
        Animated.timing(auroraAnim, {
          toValue: 1,
          duration: 20000, // 20s
          useNativeDriver: true,
        }),
        Animated.timing(auroraAnim, {
          toValue: 0,
          duration: 0, // Anında başa dön (CSS infinite gibi)
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shine animasyonunu başlat - CSS'teki @keyframes shine gibi
    // CSS: @keyframes shine{0%{background-position:0 0}50%{background-position:100% 100%}to{background-position:0 0}}
    // CSS: animation:shine var(--duration)infinite linear --duration: 14s
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 14000, // 14s
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 0, // Anında başa dön
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const menuOptions = [
    { label: 'Resim Ekle', value: 'image' },
    { label: 'Dosya Ekle', value: 'file' },
    { label: 'Konum Paylaş', value: 'location' },
    { label: 'Ses Kaydı', value: 'audio' },
  ];

  const aiProviders = [
    { id: '1', name: 'OpenAI GPT-4' },
    { id: '2', name: 'Claude 3' },
    { id: '3', name: 'Gemini Pro' },
    { id: '4', name: 'Llama 2' },
  ];

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = createMessage(message.trim(), 'user');
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(''); // Input'u temizle
      
      // Yeni mesaj gönderildiğinde en alta scroll yap
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // Mesajlar değiştiğinde otomatik scroll
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleMenuSelect = (option) => {
    setSelectedOption(option);
    setMenuVisible(false);
    console.log('Seçilen seçenek:', option);
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setProviderMenuVisible(false);
    console.log('Seçilen provider:', provider);
  };

  const handleSystemPromptSave = () => {
    setSystemPromptVisible(false);
    console.log('System prompt kaydedildi:', systemPrompt);
  };

  // Aurora gradient pozisyonları için interpolasyon - CSS'teki gibi
  // Ekran içinde kalması için gradient boyutları ve hareket alanı sınırlandırılmalı
  // Gradient boyutu: width * 1.3, height * 1.2 (ekran boyutuna yakın)
  // Hareket: ±%10 (ekran içinde kalacak şekilde)
  const auroraX = auroraAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      -width * 0.15, // Başlangıç: sola hareket
      width * 0.15,  // Orta: sağa hareket
      -width * 0.15, // Bitiş: başlangıca dön
    ],
    extrapolate: 'clamp',
  });
  
  const auroraY = auroraAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      -height * 0.1, // Başlangıç: yukarı hareket
      height * 0.1,  // Orta: aşağı hareket
      -height * 0.1, // Bitiş: başlangıca dön
    ],
    extrapolate: 'clamp',
  });
  
  // After pseudo-element için - farklı bir hareket paterni (ters yönde)
  const auroraAfterX = auroraAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      width * 0.1,  // Başlangıç: sağda
      -width * 0.1, // Orta: solda (ters yönde)
      width * 0.1,  // Bitiş: başlangıca dön
    ],
    extrapolate: 'clamp',
  });
  
  const auroraAfterY = auroraAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      height * 0.08, // Başlangıç: aşağıda
      -height * 0.08, // Orta: yukarıda (ters yönde)
      height * 0.08, // Bitiş: başlangıca dön
    ],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Aurora Arka Plan Efekti - HTML'deki gibi */}
      <View style={styles.auroraContainer} pointerEvents="none">
        {/* Ana Aurora Gradient - repeating-linear-gradient efekti */}
        {/* Ekran içinde kalması için boyutlar küçültüldü */}
        <Animated.View
          style={[
            styles.auroraBackground,
            {
              width: width * 1.3,
              height: height * 1.2,
              left: -width * 0.15,
              top: -height * 0.1,
              transform: [
                { translateX: auroraX },
                { translateY: auroraY },
              ],
            },
          ]}
        >
          {/* CSS: repeating-linear-gradient(100deg, #3b82f6 10%, #a5b4fc 15%, #93c5fd 20%, #ddd6fe 25%, #60a5fa 30%) */}
          {/* Repeating gradient için renkleri tekrarlıyoruz */}
          <LinearGradient
            colors={[
              '#3b82f6', // 10%
              '#a5b4fc', // 15%
              '#93c5fd', // 20%
              '#ddd6fe', // 25%
              '#60a5fa', // 30%
              '#3b82f6', // tekrar başla
              '#a5b4fc',
              '#93c5fd',
              '#ddd6fe',
              '#60a5fa',
              '#3b82f6', // tekrar
              '#a5b4fc',
              '#93c5fd',
              '#ddd6fe',
              '#60a5fa',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.auroraGradient}
          />
        </Animated.View>
        
        {/* İkinci katman - after pseudo-element efekti */}
        {/* Ekran içinde kalması için boyutlar küçültüldü */}
        <Animated.View
          style={[
            styles.auroraAfter,
            {
              width: width * 1.2,
              height: height * 1.1,
              left: -width * 0.1,
              top: -height * 0.05,
              transform: [
                { translateX: auroraAfterX },
                { translateY: auroraAfterY },
              ],
            },
          ]}
        >
          {/* After pseudo-element için aynı gradient */}
          <LinearGradient
            colors={[
              '#3b82f6', // 10%
              '#a5b4fc', // 15%
              '#93c5fd', // 20%
              '#ddd6fe', // 25%
              '#60a5fa', // 30%
              '#3b82f6', // tekrar
              '#a5b4fc',
              '#93c5fd',
              '#ddd6fe',
              '#60a5fa',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.auroraGradient}
          />
        </Animated.View>
        
        {/* Blur efekti */}
        <BlurView intensity={10} style={styles.auroraBlur} />
        
        {/* Dark gradient overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.auroraDarkGradient}
        />
        
        {/* Mask efekti - radial gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.auroraMask}
        />
      </View>
      
      {/* Üst Butonlar */}
      <View style={[styles.topButtonsContainer, styles.contentLayer]}>
        {/* Sol Üst - Geri Dön Butonu */}
        <TouchableOpacity
          onPress={onBack}
          style={styles.topButton}
        >
          <Text style={styles.topButtonText}>←</Text>
        </TouchableOpacity>

        {/* Sağ Üst - AI Provider Butonu */}
        <View style={styles.topRightButtons}>
          <TouchableOpacity
            onPress={() => setSystemPromptVisible(true)}
            style={styles.topButton}
          >
            <Text style={styles.topButtonText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setProviderMenuVisible(true)}
            style={styles.topButton}
          >
            <Text style={styles.topButtonText}>
              {selectedProvider ? selectedProvider.name : 'AI Provider'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mesaj Geçmişi */}
      <FlatList
        ref={flatListRef}
        data={messages}
        style={styles.contentLayer}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === 'user' ? styles.userMessageText : styles.assistantMessageText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz mesaj yok. İlk mesajınızı yazın!</Text>
          </View>
        }
      />

      {/* Chat Box - Alt kısımda sabit */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.contentLayer}
      >
        <View style={styles.chatBoxContainer}>
          <View style={styles.inputWrapper}>
            {/* Text Input */}
            <TextInput
              placeholder="Type your message..."
              placeholderTextColor="#666666"
              value={message}
              onChangeText={setMessage}
              style={styles.textInput}
              multiline
            />
            
            {/* Alt Butonlar - Input içinde */}
            <View style={styles.inputButtonsContainer}>
              {/* Select Agents Butonu (eski "+" butonu) */}
              <View style={styles.selectAgentsButtonWrapper}>
                {/* Shine animasyon efekti - Border gibi */}
                <Animated.View
                  style={[
                    styles.selectAgentsShineContainer,
                    {
                      transform: [
                        {
                          translateX: shineAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [-200, 100, -200],
                          }),
                        },
                        {
                          translateY: shineAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [-200, 100, -200],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[
                      'transparent',
                      'transparent',
                      'rgba(160, 124, 254, 1)',
                      'rgba(254, 143, 181, 1)',
                      'rgba(255, 190, 123, 1)',
                      'transparent',
                      'transparent',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.selectAgentsShineGradient}
                  />
                </Animated.View>
                
                <View style={styles.selectAgentsButtonContainer}>
                  <TouchableOpacity
                    onPress={() => setMenuVisible(true)}
                    style={styles.selectAgentsButton}
                  >
                    <Text style={styles.selectAgentsIcon}>🤖</Text>
                    <Text style={styles.selectAgentsText}>Select agents</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Gönder Butonu */}
              <View style={styles.sendButtonWrapper}>
                {/* Shine animasyon efekti - Border gibi */}
                <Animated.View
                  style={[
                    styles.sendButtonShineContainer,
                    {
                      transform: [
                        {
                          translateX: shineAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [-200, 100, -200],
                          }),
                        },
                        {
                          translateY: shineAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [-200, 100, -200],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[
                      'transparent',
                      'transparent',
                      'rgba(160, 124, 254, 1)',
                      'rgba(254, 143, 181, 1)',
                      'rgba(255, 190, 123, 1)',
                      'transparent',
                      'transparent',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sendButtonShineGradient}
                  />
                </Animated.View>
                
                <View style={styles.sendButtonContainer}>
                  <TouchableOpacity
                    onPress={handleSend}
                    disabled={!message.trim()}
                    style={[
                      styles.sendButton,
                      !message.trim() && styles.sendButtonDisabled
                    ]}
                  >
                    <Text style={styles.sendButtonIcon}>↑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {menuOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => handleMenuSelect(option)}
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* AI Provider Modal */}
      <Modal
        visible={providerMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProviderMenuVisible(false)}
      >
        <Pressable
          style={styles.systemPromptModalOverlay}
          onPress={() => setProviderMenuVisible(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.providerMenuContainer}>
              <Text style={styles.providerMenuTitle}>AI Provider Seç</Text>
              <ScrollView 
                style={styles.providerMenuScrollView}
                contentContainerStyle={styles.providerMenuScrollContent}
              >
                {aiProviders.map((provider) => (
                  <Pressable
                    key={provider.id}
                    onPress={() => handleProviderSelect(provider)}
                    style={[
                      styles.providerMenuItem,
                      selectedProvider?.id === provider.id && styles.providerMenuItemSelected
                    ]}
                  >
                    <Text style={styles.providerMenuItemText}>{provider.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* System Prompt Modal */}
      <Modal
        visible={systemPromptVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSystemPromptVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.systemPromptModalOverlay}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <Pressable
            style={styles.systemPromptModalOverlay}
            onPress={() => setSystemPromptVisible(false)}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.systemPromptContainer}>
                <Text style={styles.systemPromptTitle}>System Prompt</Text>
                <ScrollView 
                  style={styles.systemPromptScrollView}
                  contentContainerStyle={styles.systemPromptScrollContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <TextInput
                    style={styles.systemPromptInput}
                    value={systemPrompt}
                    onChangeText={setSystemPrompt}
                    multiline
                    placeholder="System prompt'unuzu buraya yazın..."
                    placeholderTextColor="#666666"
                  />
                </ScrollView>
                <View style={styles.systemPromptButtons}>
                  <TouchableOpacity
                    onPress={() => setSystemPromptVisible(false)}
                    style={[styles.systemPromptButton, styles.systemPromptButtonCancel]}
                  >
                    <Text style={styles.systemPromptButtonText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSystemPromptSave}
                    style={[styles.systemPromptButton, styles.systemPromptButtonSave]}
                  >
                    <Text style={styles.systemPromptButtonText}>Kaydet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Siyah arka plan
    position: 'relative',
    overflow: 'hidden',
  },
  auroraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  auroraBackground: {
    position: 'absolute',
    opacity: 0.5, // CSS: opacity-50
    // Transform ile merkeze hizalama yapılıyor
  },
  auroraGradient: {
    width: '100%',
    height: '100%',
  },
  auroraAfter: {
    position: 'absolute',
    opacity: 0.5, // CSS: opacity-50
    // Transform ile merkeze hizalama yapılıyor
  },
  auroraBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // HTML: blur-[10px]
  },
  auroraDarkGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5, // HTML: dark:opacity-50
  },
  auroraMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // HTML: mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)
  },
  contentLayer: {
    zIndex: 1,
    position: 'relative',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  topRightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  topButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  topButtonText: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.7,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#2a2a2a',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#3a3a3a',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'System', // San Francisco on iOS
      android: 'Roboto',
      default: 'System',
    }),
  },
  userMessageText: {
    color: '#ffffff',
  },
  assistantMessageText: {
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
  chatBoxContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: 672, // max-w-2xl (~672px)
    alignSelf: 'center',
  },
  textInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Daha koyu transparan arka plan
    borderRadius: 16, // rounded-xl
    borderWidth: 1,
    borderColor: 'rgba(63, 63, 70, 0.8)', // dark:border-zinc-800
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 50, // Alt butonlar için alan
    minHeight: 80,
    color: '#ffffff', // dark:text-white
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'System', // San Francisco on iOS
      android: 'Roboto',
      default: 'System',
    }),
    textAlignVertical: 'top',
  },
  inputButtonsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 12,
  },
  selectAgentsButtonWrapper: {
    position: 'relative',
    borderRadius: 9999,
    padding: 2, // border-width: 2px - CSS'teki padding: var(--border-width)
    overflow: 'hidden',
  },
  selectAgentsShineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  selectAgentsShineGradient: {
    width: 400,
    height: 400,
  },
  selectAgentsButtonContainer: {
    position: 'relative',
    zIndex: 1,
    borderRadius: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Gradient'i kapatmak için
  },
  selectAgentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  selectAgentsIcon: {
    fontSize: 16,
  },
  selectAgentsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '300', // font-light
    letterSpacing: 0.5, // tracking-wide
    fontFamily: Platform.select({
      ios: 'System', // San Francisco on iOS
      android: 'Roboto',
      default: 'System',
    }),
  },
  sendButtonWrapper: {
    position: 'relative',
    borderRadius: 20, // rounded-full (circular)
    padding: 2, // border-width: 2px
    overflow: 'hidden',
  },
  sendButtonShineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  sendButtonShineGradient: {
    width: 300,
    height: 300,
  },
  sendButtonContainer: {
    position: 'relative',
    zIndex: 1,
    borderRadius: 20,
    backgroundColor: '#a1a1aa', // Gradient'i kapatmak için
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  menuItemText: {
    color: '#ffffff',
    fontSize: 16,
  },
  providerMenuContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    maxHeight: '85%',
    width: '90%',
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  providerMenuScrollView: {
    maxHeight: 300,
  },
  providerMenuScrollContent: {
    flexGrow: 1,
  },
  providerMenuTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  providerMenuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  providerMenuItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  providerMenuItemText: {
    color: '#ffffff',
    fontSize: 16,
  },
  systemPromptContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    maxHeight: '85%',
    width: '90%',
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  systemPromptScrollView: {
    maxHeight: 300,
    marginBottom: 16,
  },
  systemPromptScrollContent: {
    flexGrow: 1,
  },
  systemPromptTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  systemPromptInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  systemPromptButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    marginBottom: 0,
    gap: 12,
    flexWrap: 'wrap',
  },
  systemPromptButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
    flex: 1,
    maxWidth: '48%',
  },
  systemPromptButtonCancel: {
    backgroundColor: '#3a3a3a',
  },
  systemPromptButtonSave: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  systemPromptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  systemPromptModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;

