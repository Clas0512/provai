import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Keyboard,
  Platform,
  FlatList,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { GlobalText } from '@/components/global-text';
import { GlobalTextInput } from '@/components/global-text-input';

// Mesaj tipi tanımı
const createMessage = (text: string, sender: 'user' | 'assistant' = 'user') => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  text,
  sender,
  timestamp: new Date(),
});

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [providerMenuVisible, setProviderMenuVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [systemPromptVisible, setSystemPromptVisible] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('Sen yardımcı bir AI asistanısın.');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  // Aurora animasyonu için
  const auroraAnim = useRef(new Animated.Value(0)).current;
  // Shine animasyonu için
  const shineAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    // Aurora animasyonunu başlat
    Animated.loop(
      Animated.sequence([
        Animated.timing(auroraAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
        Animated.timing(auroraAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shine animasyonunu başlat
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 14000,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Klavye dinleyicileri
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Klavye açıldığında mesaj listesini en alta kaydır
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
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
      setMessage('');
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleMenuSelect = (option: string) => {
    setSelectedOption(option);
    setMenuVisible(false);
  };

  const handleProviderSelect = (provider: any) => {
    setSelectedProvider(provider);
    setProviderMenuVisible(false);
  };

  const handleSystemPromptSave = () => {
    setSystemPromptVisible(false);
  };

  // Aurora transform animasyonu
  const auroraX = auroraAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-width * 0.15, width * 0.15, -width * 0.15],
    extrapolate: 'clamp',
  });
  
  const auroraY = auroraAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-height * 0.1, height * 0.1, -height * 0.1],
    extrapolate: 'clamp',
  });
  
  const auroraAfterX = auroraAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [width * 0.1, -width * 0.1, width * 0.1],
    extrapolate: 'clamp',
  });
  
  const auroraAfterY = auroraAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [height * 0.08, -height * 0.08, height * 0.08],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Aurora Arka Plan Efekti */}
      <View style={styles.auroraContainer} pointerEvents="none">
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
          <LinearGradient
            colors={[
              '#3b82f6', '#a5b4fc', '#93c5fd', '#ddd6fe', '#60a5fa',
              '#3b82f6', '#a5b4fc', '#93c5fd', '#ddd6fe', '#60a5fa',
              '#3b82f6', '#a5b4fc', '#93c5fd', '#ddd6fe', '#60a5fa',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.auroraGradient}
          />
        </Animated.View>
        
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
          <LinearGradient
            colors={[
              '#3b82f6', '#a5b4fc', '#93c5fd', '#ddd6fe', '#60a5fa',
              '#3b82f6', '#a5b4fc', '#93c5fd', '#ddd6fe', '#60a5fa',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.auroraGradient}
          />
        </Animated.View>
        
        <BlurView intensity={10} style={styles.auroraBlur} />
        
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.auroraDarkGradient}
        />
      </View>
      
      {/* Üst Butonlar */}
      <View style={[styles.topButtonsContainer, styles.contentLayer]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.topButton}
        >
          <GlobalText style={styles.topButtonText}>←</GlobalText>
        </TouchableOpacity>

        <View style={styles.topRightButtons}>
          <TouchableOpacity
            onPress={() => setSystemPromptVisible(true)}
            style={styles.topButton}
          >
            <GlobalText style={styles.topButtonText}>⚙️</GlobalText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setProviderMenuVisible(true)}
            style={styles.topButton}
          >
            <GlobalText style={styles.topButtonText}>
              {selectedProvider ? selectedProvider.name : 'AI Provider'}
            </GlobalText>
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
              <GlobalText
                style={[
                  styles.messageText,
                  item.sender === 'user' ? styles.userMessageText : styles.assistantMessageText,
                ]}
              >
                {item.text}
              </GlobalText>
            </View>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <GlobalText style={styles.emptyText}>Henüz mesaj yok. İlk mesajınızı yazın!</GlobalText>
          </View>
        }
      />

      {/* Chat Box */}
      <View style={[styles.chatBoxContainer, styles.contentLayer, { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 16 : 16 }]}>
          <View style={styles.inputWrapper}>
            <GlobalTextInput
              placeholder="Type your message..."
              placeholderTextColor="#666666"
              value={message}
              onChangeText={setMessage}
              style={styles.textInput}
              multiline
            />
            
            <View style={styles.inputButtonsContainer}>
              <View style={styles.selectAgentsButtonWrapper}>
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
                    <GlobalText style={styles.selectAgentsIcon}>🤖</GlobalText>
                    <GlobalText style={styles.selectAgentsText}>Select agents</GlobalText>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sendButtonWrapper}>
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
                    <GlobalText style={styles.sendButtonIcon}>↑</GlobalText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
      </View>

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
                onPress={() => handleMenuSelect(option.value)}
                style={styles.menuItem}
              >
                <GlobalText style={styles.menuItemText}>{option.label}</GlobalText>
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
              <GlobalText style={styles.providerMenuTitle}>AI Provider Seç</GlobalText>
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
                    <GlobalText style={styles.providerMenuItemText}>{provider.name}</GlobalText>
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
        <Pressable
          style={styles.systemPromptModalOverlay}
          onPress={() => setSystemPromptVisible(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.systemPromptContainer}>
              <GlobalText style={styles.systemPromptTitle}>System Prompt</GlobalText>
              <ScrollView 
                style={styles.systemPromptScrollView}
                contentContainerStyle={styles.systemPromptScrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <GlobalTextInput
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
                  <GlobalText style={styles.systemPromptButtonText}>İptal</GlobalText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSystemPromptSave}
                  style={[styles.systemPromptButton, styles.systemPromptButtonSave]}
                >
                  <GlobalText style={styles.systemPromptButtonText}>Kaydet</GlobalText>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    opacity: 0.5,
  },
  auroraGradient: {
    width: '100%',
    height: '100%',
  },
  auroraAfter: {
    position: 'absolute',
    opacity: 0.5,
  },
  auroraBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  auroraDarkGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
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
    paddingTop: 12,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: 672,
    alignSelf: 'center',
  },
  textInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(63, 63, 70, 0.8)',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 50,
    minHeight: 80,
    color: '#ffffff',
    fontSize: 14,
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
    padding: 2,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  sendButtonWrapper: {
    position: 'relative',
    borderRadius: 20,
    padding: 2,
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
    backgroundColor: '#a1a1aa',
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

