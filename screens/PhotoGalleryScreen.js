import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const PhotoGalleryScreen = ({ onPhotoSelect, onBack }) => {
  const defaultPhotos = [
    { id: '1', uri: null, name: 'adem', percentage: 30, color: '#ff6b6b' },
    { id: '2', uri: null, name: 'mustafa', percentage: 60, color: '#ffd93d' },
    { id: '3', uri: null, name: 'adem', percentage: 90, color: '#6bcf7f' },
    { id: '4', uri: null, name: 'adem', percentage: 30, color: '#ff6b6b' },
    { id: '5', uri: null, name: 'mustafa', percentage: 60, color: '#ffd93d' },
    { id: '6', uri: null, name: 'adem', percentage: 90, color: '#6bcf7f' },
    { id: '7', uri: null, name: 'adem', percentage: 30, color: '#ff6b6b' },
    { id: '8', uri: null, name: 'mustafa', percentage: 60, color: '#ffd93d' },
    { id: '9', uri: null, name: 'adem', percentage: 90, color: '#6bcf7f' },
  ];
  
  const [photos, setPhotos] = useState(defaultPhotos);
  const [remainingRights, setRemainingRights] = useState(10);
  const [totalLies, setTotalLies] = useState(57);
  const auroraAnim = useRef(new Animated.Value(0)).current;

  // AsyncStorage'dan fotoğrafları yükle
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const savedPhotos = await AsyncStorage.getItem('photoGallery');
      if (savedPhotos) {
        const parsedPhotos = JSON.parse(savedPhotos);
        // Kayıtlı fotoğrafları varsa kullan, yoksa default'ları kullan
        if (parsedPhotos && parsedPhotos.length > 0) {
          setPhotos(parsedPhotos);
        }
      } else {
        // İlk açılışta default fotoğrafları kaydet
        savePhotos(defaultPhotos);
      }
    } catch (error) {
      console.error('Fotoğraflar yüklenirken hata:', error);
    }
  };

  // Fotoğrafları AsyncStorage'a kaydet
  const savePhotos = async (updatedPhotos) => {
    try {
      await AsyncStorage.setItem('photoGallery', JSON.stringify(updatedPhotos));
    } catch (error) {
      console.error('Fotoğraflar kaydedilirken hata:', error);
    }
  };

  // Aurora animasyonu
  useEffect(() => {
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
  }, []);

  const pickImage = async (photoId) => {
    // İzin kontrolü
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişim izni gerekiyor.');
      return;
    }

    // Fotoğraf seçimi
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedPhotos = photos.map(photo =>
        photo.id === photoId
          ? { ...photo, uri: result.assets[0].uri }
          : photo
      );
      setPhotos(updatedPhotos);
      savePhotos(updatedPhotos);
    }
  };

  const handlePhotoPress = (photo) => {
    if (photo.uri) {
      onPhotoSelect(photo);
    } else {
      pickImage(photo.id);
    }
  };

  const renderPhotoItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.photoCard}
        onPress={() => handlePhotoPress(item)}
      >
        <View style={styles.photoContainer}>
          {item.uri ? (
            <Image
              source={{ uri: item.uri }}
              style={styles.photo}
              contentFit="cover"
            />
          ) : (
            <View style={styles.emptyPhoto}>
              <Text style={styles.emptyPhotoText}>+</Text>
            </View>
          )}
        </View>
        <View style={styles.photoInfo}>
          <Text style={styles.photoName}>{item.name}</Text>
          <Text style={[styles.photoPercentage, { color: item.color }]}>
            %{item.percentage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const auroraTranslateX = auroraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const auroraTranslateY = auroraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Arka Plan Base */}
      <View style={styles.backgroundBase} />
      
      {/* Aurora Gradient Efektleri */}
      <Animated.View
        style={[
          styles.auroraContainer,
          {
            transform: [
              { translateX: auroraTranslateX },
              { translateY: auroraTranslateY },
            ],
          },
        ]}
        pointerEvents="none"
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
      </Animated.View>
      
      {/* Blur Overlay */}
      <BlurView intensity={20} style={styles.blurOverlay} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menü</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Photo Grid */}
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={renderPhotoItem}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Şamar oğlanı ekle</Text>
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Kalan hak: {remainingRights}/10</Text>
        </View>
      </View>

      <View style={styles.bottomContainer2}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Yamulanları listele</Text>
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Yamulanlar: {totalLies}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    opacity: 0.5,
  },
  auroraGradient1: {
    position: 'absolute',
    top: '10%',
    left: '0%',
    width: width * 1.5,
    height: height * 1.5,
    opacity: 0.4,
    transform: [{ rotate: '100deg' }],
  },
  auroraGradient2: {
    position: 'absolute',
    top: '30%',
    right: '-20%',
    width: width * 1.3,
    height: height * 1.3,
    opacity: 0.3,
    transform: [{ rotate: '-80deg' }],
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 24,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  headerPlaceholder: {
    width: 40,
  },
  gridContent: {
    padding: 16,
    paddingBottom: 200,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  photoCard: {
    width: (width - 48) / 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  photoContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  emptyPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPhotoText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 48,
    fontWeight: '200',
  },
  photoInfo: {
    alignItems: 'center',
  },
  photoName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  photoPercentage: {
    fontSize: 14,
    fontWeight: '700',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  bottomContainer2: {
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PhotoGalleryScreen;

