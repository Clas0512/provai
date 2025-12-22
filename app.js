import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  AppRegistry,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Mesaj tipi tanımı
const createMessage = (text, sender = 'user') => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  text,
  sender, // 'user' veya 'assistant'
  timestamp: new Date(),
});

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [providerMenuVisible, setProviderMenuVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const flatListRef = useRef(null);

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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          {/* Mesaj Geçmişi */}
          <FlatList
            ref={flatListRef}
            data={messages}
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
          >
            <View style={styles.chatBoxContainer}>
              {/* AI Provider Seçici */}
              {selectedProvider ? (
                <TouchableOpacity
                  onPress={() => setProviderMenuVisible(true)}
                  style={styles.selectedProviderContainer}
                >
                  <Text style={styles.selectedProviderText}>{selectedProvider.name}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setProviderMenuVisible(true)}
                  style={styles.providerButton}
                >
                  <Text style={styles.providerButtonText}>AI Provider Seç</Text>
                </TouchableOpacity>
              )}
              
            <View style={styles.inputRow}>
              {/* "+" Butonu */}
              <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>

              {/* Text Input */}
              <TextInput
                placeholder="Mesaj yazın..."
                placeholderTextColor="#666666"
                value={message}
                onChangeText={setMessage}
                style={styles.textInput}
                multiline
              />

              {/* Submit Butonu */}
              <TouchableOpacity
                onPress={handleSend}
                disabled={!message.trim()}
                style={[
                  styles.sendButton,
                  !message.trim() && styles.sendButtonDisabled
                ]}
              >
                <Text style={[
                  styles.sendButtonText,
                  !message.trim() && styles.sendButtonTextDisabled
                ]}>
                  Gönder
                </Text>
              </TouchableOpacity>
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
              style={styles.modalOverlay}
              onPress={() => setProviderMenuVisible(false)}
            >
              <View style={styles.providerMenuContainer}>
                <Text style={styles.providerMenuTitle}>AI Provider Seç</Text>
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
              </View>
            </Pressable>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Koyu gri arka plan
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
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    borderTopLeftRadius: 48, // Üst sol köşe - daha yumuşak
    borderTopRightRadius: 48, // Üst sağ köşe - daha yumuşak
  },
  providerButton: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  providerButtonText: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.7,
  },
  selectedProviderContainer: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  selectedProviderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  providerMenuContainer: {
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    maxHeight: '50%',
  },
  providerMenuTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  sendButton: {
    minWidth: 60,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#666666',
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
});

export default App;

// Register the app with AppRegistry
// Expo expects 'main' as the component name when using app.js
AppRegistry.registerComponent('main', () => App);