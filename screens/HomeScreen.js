import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ onChatSelect, onCreateChat, onOpenPhotoGallery }) => {
  const [newChatInput, setNewChatInput] = useState('');
  const [chats, setChats] = useState([
    { id: '1', title: 'Yeni Chat', lastMessage: 'Merhaba, nasılsın?', timestamp: new Date() },
    { id: '2', title: 'Proje Hakkında', lastMessage: 'React Native öğreniyorum', timestamp: new Date() },
    { id: '3', title: 'AI Asistan', lastMessage: 'Yardımcı olabilir miyim?', timestamp: new Date() },
  ]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const auroraAnim = useRef(new Animated.Value(0)).current;

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
      onCreateChat(newChat.id);
    }
  };

  const handleChatPress = (chatId) => {
    onChatSelect(chatId);
  };

  // Scroll animasyonu için
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  // Fade-out efekti için interpolate
  const opacity = scrollY.interpolate({
    inputRange: [0, 200, 400],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const renderChatItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item.id)}
      >
        <View style={styles.chatItemContent}>
          <Text style={styles.chatItemTitle}>{item.title}</Text>
          {item.lastMessage ? (
            <Text style={styles.chatItemMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  // Aurora transform animasyonu
  // Aurora animasyonu - ekran içinde sınırlı hareket
  const auroraTranslateX = auroraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.2, width * 0.2], // Ekran içinde sınırlı
  });

  const auroraTranslateY = auroraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.15, height * 0.15], // Ekran içinde sınırlı
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
      
      {/* Photo Gallery Button - Üst Sağda */}
      <TouchableOpacity
        style={styles.photoGalleryButton}
        onPress={onOpenPhotoGallery}
      >
        <Text style={styles.photoGalleryButtonText}>📷 Fotoğraflar</Text>
      </TouchableOpacity>
      
      {/* Üst Input Alanı - Ekranın Ortasında */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
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
            <Text style={[
              styles.createButtonText,
              !newChatInput.trim() && styles.createButtonTextDisabled
            ]}>
              Başlat
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Listesi - Ortadan Aşağıya */}
      <Animated.FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        style={styles.listContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View style={styles.listHeader} />}
      />

      {/* Fade-out Gradient - Alt Kısım */}
      <Animated.View style={[styles.fadeGradient, { opacity: opacity }]} pointerEvents="none">
        <View style={styles.gradient} />
      </Animated.View>
    </SafeAreaView>
  );
};

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
  photoGalleryButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  photoGalleryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -30 }], // Input yüksekliğinin yarısı kadar yukarı
    zIndex: 20,
    paddingHorizontal: 16,
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
  listContainer: {
    flex: 1,
    paddingTop: '55%', // Input alanının altından başlasın
    zIndex: 10,
  },
  listHeader: {
    height: 0,
  },
  listContent: {
    paddingHorizontal: 16,
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
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 15,
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    opacity: 0.8,
  },
});

export default HomeScreen;

