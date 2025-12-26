import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { GlobalText } from '@/components/global-text';
import { GlobalTextInput } from '@/components/global-text-input';

const { width, height } = Dimensions.get('window');

export default function ChatListScreen() {
  const [newChatInput, setNewChatInput] = useState('');
  const [chats, setChats] = useState([
    { id: '1', title: 'Yeni Chat', lastMessage: 'Merhaba, nasılsın?', timestamp: new Date() },
    { id: '2', title: 'Proje Hakkında', lastMessage: 'React Native öğreniyorum', timestamp: new Date() },
    { id: '3', title: 'AI Asistan', lastMessage: 'Yardımcı olabilir miyim?', timestamp: new Date() },
  ]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const auroraAnim = useRef(new Animated.Value(0)).current;
  const { user, logout } = useAuth();

  // Aurora animasyonu
  useEffect(() => {
    const animateAurora = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(auroraAnim, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
          Animated.timing(auroraAnim, {
            toValue: 0,
            duration: 20000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    animateAurora();
  }, []);

  // Klavye dinleyicileri
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
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

  const handleCreateChat = () => {
    if (newChatInput.trim()) {
      const newChat = {
        id: Date.now().toString(),
        title: newChatInput.trim(),
        lastMessage: '',
        timestamp: new Date(),
      };
      setChats([newChat, ...chats]);
      setNewChatInput('');
      // Chat sayfasına yönlendir
      router.push(`/chat/${newChat.id}`);
    }
  };

  const handleChatPress = (chatId: string) => {
    // Chat sayfasına yönlendir
    router.push(`/chat/${chatId}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: logout },
      ]
    );
  };

  // Scroll animasyonu için
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const renderChatItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item.id)}
      >
        <View style={styles.chatItemContent}>
          <GlobalText style={styles.chatItemTitle}>{item.title}</GlobalText>
          {item.lastMessage ? (
            <GlobalText style={styles.chatItemMessage} numberOfLines={1}>
              {item.lastMessage}
            </GlobalText>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  // Aurora transform animasyonu
  const auroraTranslateX = auroraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.2, width * 0.2],
  });

  const auroraTranslateY = auroraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.15, height * 0.15],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Arka Plan Base */}
      <View style={styles.backgroundBase} />
      
      {/* Aurora Gradient Efektleri */}
      <View style={styles.auroraContainer} pointerEvents="none">
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transform: [
              { translateX: auroraTranslateX },
              { translateY: auroraTranslateY },
            ],
          }}
        >
          <LinearGradient
            colors={['#3b82f6', '#a5b4fc', '#93c5fd', '#ddd6fe', '#60a5fa', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            style={styles.auroraGradient1}
          />
          <LinearGradient
            colors={['#60a5fa', '#3b82f6', '#a5b4fc', '#93c5fd', '#ddd6fe', '#60a5fa']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            style={styles.auroraGradient2}
          />
          <LinearGradient
            colors={['#93c5fd', '#ddd6fe', '#60a5fa', '#3b82f6', '#a5b4fc', '#93c5fd']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            style={styles.auroraGradient3}
          />
        </Animated.View>
      </View>
      
      {/* Blur Overlay */}
      <BlurView intensity={20} style={styles.blurOverlay} />

      {/* Üst Header - Kullanıcı bilgisi ve çıkış */}
      <View style={styles.header}>
        <GlobalText style={styles.headerText}>Merhaba, {user?.name || user?.email}</GlobalText>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <GlobalText style={styles.logoutText}>Çıkış</GlobalText>
        </TouchableOpacity>
      </View>

      {/* Chat Listesi */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        style={styles.listContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Alanı - Sayfanın Altında */}
      <View style={[styles.inputContainer, { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 16 : 16 }]}>
        <View style={styles.inputWrapper}>
          <GlobalTextInput
            style={styles.chatInput}
            placeholder="Yeni chat başlat..."
            placeholderTextColor="#666666"
            value={newChatInput}
            onChangeText={setNewChatInput}
            onSubmitEditing={handleCreateChat}
          />
          <TouchableOpacity
            onPress={handleCreateChat}
            disabled={!newChatInput.trim()}
            style={[
              styles.createButton,
              !newChatInput.trim() && styles.createButtonDisabled
            ]}
          >
            <GlobalText style={[
              styles.createButtonText,
              !newChatInput.trim() && styles.createButtonTextDisabled
            ]}>
              Başlat
            </GlobalText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  backgroundBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  auroraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    overflow: 'hidden',
  },
  auroraGradient1: {
    position: 'absolute',
    top: '10%',
    left: '0%',
    width: width * 1.2,
    height: height * 1.2,
    opacity: 0.4,
    transform: [{ rotate: '100deg' }],
  },
  auroraGradient2: {
    position: 'absolute',
    top: '30%',
    right: '0%',
    width: width * 1.1,
    height: height * 1.1,
    opacity: 0.3,
    transform: [{ rotate: '-80deg' }],
  },
  auroraGradient3: {
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    width: width * 1.0,
    height: height * 1.0,
    opacity: 0.35,
    transform: [{ rotate: '45deg' }],
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    zIndex: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    zIndex: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  chatItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  chatItemContent: {
    flex: 1,
  },
  chatItemTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  chatItemMessage: {
    color: '#999999',
    fontSize: 14,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    zIndex: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  createButtonDisabled: {
    opacity: 0.5,
    borderColor: '#666666',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonTextDisabled: {
    color: '#666666',
  },
});

