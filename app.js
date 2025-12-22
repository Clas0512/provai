import React, { useState } from 'react';
import { AppRegistry } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' veya 'chat'
  const [currentChatId, setCurrentChatId] = useState(null);

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
  };

  return (
    <SafeAreaProvider>
      {currentScreen === 'home' ? (
        <HomeScreen
          onChatSelect={handleChatSelect}
          onCreateChat={handleCreateChat}
        />
      ) : (
        <ChatScreen
          chatId={currentChatId}
          onBack={handleBackToHome}
        />
      )}
    </SafeAreaProvider>
  );
};

export default App;

// Register the app with AppRegistry
// Expo expects 'main' as the component name when using app.js
AppRegistry.registerComponent('main', () => App);