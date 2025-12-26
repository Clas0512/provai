import React, { useState } from 'react';
import { AppRegistry } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import PhotoGalleryScreen from './screens/PhotoGalleryScreen';
import PhotoDetailScreen from './screens/PhotoDetailScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'chat', 'photoGallery', 'photoDetail'
  const [currentChatId, setCurrentChatId] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [updatePhotoPercentage, setUpdatePhotoPercentage] = useState(null);

  const handleChatSelect = (chatId) => {
    setCurrentChatId(chatId);
    setCurrentScreen('chat');
  };

  const handleCreateChat = (chatId) => {
    setCurrentChatId(chatId);
    setCurrentScreen('chat');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setCurrentChatId(null);
    setSelectedPhoto(null);
  };

  const handleOpenPhotoGallery = () => {
    setCurrentScreen('photoGallery');
  };

  const handlePhotoSelect = (photo, updatePercentageFn) => {
    setSelectedPhoto(photo);
    setUpdatePhotoPercentage(() => updatePercentageFn);
    setCurrentScreen('photoDetail');
  };

  const handleBackToGallery = () => {
    setCurrentScreen('photoGallery');
    setSelectedPhoto(null);
  };

  return (
    <SafeAreaProvider>
      {currentScreen === 'home' ? (
        <HomeScreen
          onChatSelect={handleChatSelect}
          onCreateChat={handleCreateChat}
          onOpenPhotoGallery={handleOpenPhotoGallery}
        />
      ) : currentScreen === 'chat' ? (
        <ChatScreen
          chatId={currentChatId}
          onBack={handleBackToHome}
        />
      ) : currentScreen === 'photoGallery' ? (
        <PhotoGalleryScreen
          onPhotoSelect={handlePhotoSelect}
          onBack={handleBackToHome}
        />
      ) : currentScreen === 'photoDetail' ? (
        <PhotoDetailScreen
          photo={selectedPhoto}
          updatePhotoPercentage={updatePhotoPercentage}
          onBack={handleBackToGallery}
        />
      ) : null}
    </SafeAreaProvider>
  );
};

export default App;

// Register the app with AppRegistry
// Expo expects 'main' as the component name when using app.js
AppRegistry.registerComponent('main', () => App);