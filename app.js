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
  ScrollView,
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
  const [systemPromptVisible, setSystemPromptVisible] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('Sen yardımcı bir AI asistanısın.');
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

  const handleSystemPromptSave = () => {
    setSystemPromptVisible(false);
    console.log('System prompt kaydedildi:', systemPrompt);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          {/* Üst Butonlar */}
          <View style={styles.topButtonsContainer}>
            {/* Sol Üst - System Prompt Butonu */}
            <TouchableOpacity
              onPress={() => setSystemPromptVisible(true)}
              style={styles.topButton}
            >
              <Text style={styles.topButtonText}>⚙️</Text>
            </TouchableOpacity>

            {/* Sağ Üst - AI Provider Butonu */}
            <TouchableOpacity
              onPress={() => setProviderMenuVisible(true)}
              style={styles.topButton}
            >
              <Text style={styles.topButtonText}>
                {selectedProvider ? selectedProvider.name : 'AI Provider'}
              </Text>
            </TouchableOpacity>
          </View>

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
      </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Koyu gri arka plan
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
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
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    borderTopLeftRadius: 48, // Üst sol köşe - daha yumuşak
    borderTopRightRadius: 48, // Üst sağ köşe - daha yumuşak
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
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    overflow: 'hidden',
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