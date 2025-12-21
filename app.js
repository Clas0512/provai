import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const [message, setMessage] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const menuOptions = [
    { label: 'Resim Ekle', value: 'image' },
    { label: 'Dosya Ekle', value: 'file' },
    { label: 'Konum Paylaş', value: 'location' },
    { label: 'Ses Kaydı', value: 'audio' },
  ];

  const handleSend = () => {
    if (message.trim()) {
      console.log('Mesaj gönderildi:', message);
      setMessage(''); // Input'u temizle
    }
  };

  const handleMenuSelect = (option) => {
    setSelectedOption(option);
    setMenuVisible(false);
    console.log('Seçilen seçenek:', option);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['bottom']}>
          {/* Ana içerik alanı */}
          <View style={styles.content}>
            {/* Buraya içerik ekleyebilirsiniz */}
          </View>

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
        </SafeAreaView>
      </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Koyu gri arka plan
  },
  content: {
    flex: 1,
    // Ana içerik buraya gelecek
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