import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { applyActionToPhoto, isGeminiConfigured } from '../services/geminiService';

const { width, height } = Dimensions.get('window');

const PhotoDetailScreen = ({ photo, updatePhotoPercentage, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(photo?.percentage || 100);
  const [rights, setRights] = useState(3);
  const [actions, setActions] = useState([
    { id: '1', label: 'Tokat', color: '#ff6b6b', pressed: false },
    { id: '2', label: 'Tekme', color: '#ff6b6b', pressed: false },
    { id: '3', label: 'Tükür', color: '#ff6b6b', pressed: false },
    { id: '4', label: 'Yumruk', color: '#ff6b6b', pressed: false },
  ]);
  const [secondaryActions, setSecondaryActions] = useState([
    { id: '5', label: 'Kırbaç', color: '#ff6b6b', pressed: false },
    { id: '6', label: 'okşa', color: '#6bcf7f', pressed: false },
    { id: '7', label: 'Kulaklarını çek', color: '#ff6b6b', pressed: false },
  ]);
  const [bonusActions, setBonusActions] = useState([
    { id: '8', label: 'Dilini çek', color: '#e0e0e0', pressed: false },
    { id: '9', label: 'Özür', color: '#e0e0e0', pressed: false },
    { id: '10', label: 'Dirsek', color: '#e0e0e0', pressed: false },
    { id: '11', label: 'öpücük', color: '#e0e0e0', pressed: false },
  ]);
  const auroraAnim = useRef(new Animated.Value(0)).current;

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

  const handleActionPress = async (actionId, listType) => {
    // Gemini yapılandırma kontrolü
    if (!isGeminiConfigured()) {
      Alert.alert(
        'Yapılandırma Hatası',
        'Gemini API key tanımlanmamış. Lütfen .env dosyasını oluşturun ve GEMINI_API_KEY değerini ekleyin.'
      );
      return;
    }

    // Yüzde kontrolü - Sadece kırmızı butonlar için
    if (listType === 'main' && currentPercentage <= 0) {
      Alert.alert(
        'İşlem Yapılamaz',
        'Bu fotoğrafın dayanma yüzdesi %0\'a ulaşmış. Artık işlem yapılamaz.'
      );
      return;
    }

    const updateList = (list, setList) => {
      return list.map(action =>
        action.id === actionId
          ? { ...action, pressed: !action.pressed }
          : action
      );
    };

    if (listType === 'main') {
      setActions(updateList(actions, setActions));
      
      // Kırmızı butonlar için Gemini API çağrısı yap
      const action = actions.find(a => a.id === actionId);
      if (action && photo.uri) {
        setIsProcessing(true);
        try {
          // Gemini API'ye gönder
          const result = await applyActionToPhoto(photo.uri, action.label);
          
          if (result.success) {
            // Yüzdeyi %15 azalt
            const newPercentage = Math.max(0, currentPercentage - 15);
            setCurrentPercentage(newPercentage);
            await updatePhotoPercentage(photo.id, newPercentage);
            
            // Sonucu bildir
            Alert.alert(
              'İşlem Tamamlandı',
              `${action.label} uygulandı!\n\n${result.description}\n\nKalan dayanma: %${newPercentage}`,
              [{ text: 'Tamam' }]
            );
          }
        } catch (error) {
          Alert.alert('Hata', error.message);
        } finally {
          setIsProcessing(false);
        }
      }
    } else if (listType === 'secondary') {
      setSecondaryActions(updateList(secondaryActions, setSecondaryActions));
    } else if (listType === 'bonus') {
      setBonusActions(updateList(bonusActions, setBonusActions));
    }
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
        <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={isProcessing}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Dayakhane</Text>
          {isProcessing && (
            <ActivityIndicator size="small" color="#fff" style={styles.loadingIndicator} />
          )}
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Display */}
        <View style={styles.photoSection}>
          <View style={styles.photoFrame}>
            {photo?.uri ? (
              <Image
                source={{ uri: photo.uri }}
                style={styles.photo}
                contentFit="cover"
              />
            ) : (
              <View style={styles.emptyPhoto}>
                <Text style={styles.emptyPhotoText}>Fotoğraf Yok</Text>
              </View>
            )}
          </View>
        </View>

        {/* Rights Counter */}
        <View style={styles.rightsContainer}>
          <View style={styles.rightsBox}>
            <Text style={styles.rightsNumber}>{rights}</Text>
            <Text style={styles.rightsLabel}>hak/gün</Text>
          </View>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsRow}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionButton,
                { borderColor: action.color },
                action.pressed && { backgroundColor: `${action.color}30` },
                isProcessing && styles.actionButtonDisabled,
              ]}
              onPress={() => handleActionPress(action.id, 'main')}
              disabled={isProcessing}
            >
              <Text style={[
                styles.actionText,
                { color: action.color },
                isProcessing && styles.actionTextDisabled,
              ]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Secondary Actions */}
        <View style={styles.actionsRow}>
          <View style={styles.secondaryRightsBox}>
            <Text style={styles.secondaryRightsNumber}>1</Text>
            <Text style={styles.secondaryRightsLabel}>hak/gün</Text>
          </View>
          {secondaryActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionButton,
                { borderColor: action.color },
                action.pressed && { backgroundColor: `${action.color}30` },
              ]}
              onPress={() => handleActionPress(action.id, 'secondary')}
            >
              <Text style={[styles.actionText, { color: action.color }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bonus Actions */}
        <View style={styles.bonusSection}>
          <View style={styles.bonusHeader}>
            <View style={styles.bonusRightsBox}>
              <Text style={styles.bonusRightsNumber}>1</Text>
              <Text style={styles.bonusRightsLabel}>hak/gün</Text>
            </View>
            <View style={styles.bonusBadge}>
              <Text style={styles.bonusBadgeText}>300 TL/AY</Text>
            </View>
          </View>
          <View style={styles.actionsRow}>
            {bonusActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.bonusActionButton,
                  { borderColor: action.color },
                  action.pressed && { backgroundColor: `${action.color}30` },
                ]}
                onPress={() => handleActionPress(action.id, 'bonus')}
              >
                <Text style={[styles.bonusActionText, { color: action.color }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoFrame: {
    width: width * 0.6,
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  emptyPhoto: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPhotoText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 18,
  },
  rightsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rightsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  rightsNumber: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
  },
  rightsLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionTextDisabled: {
    opacity: 0.5,
  },
  secondaryRightsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  secondaryRightsNumber: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  secondaryRightsLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
  },
  bonusSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  bonusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bonusRightsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  bonusRightsNumber: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  bonusRightsLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
  },
  bonusBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  bonusBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  bonusActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  bonusActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PhotoDetailScreen;

