// Context API Örneği
// Bu dosya state yönetimi için bir örnek - şu an kullanmıyorsun ama öğrenmek için

import React, { createContext, useContext, useState } from 'react';

// 1. Context oluştur
const ChatContext = createContext();

// 2. Provider bileşeni (state'i sağlayan)
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hey! I\'m Square.ai\n\nTell me everything you need',
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleSendMessage = (text) => {
    if (text.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: 'Hey! I\'m Square.ai\n\nTell me everything you need',
        isUser: false,
        timestamp: new Date().toISOString(),
      },
    ]);
    setSidebarVisible(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Context'te paylaşılacak değerler
  const value = {
    messages,
    sidebarVisible,
    handleSendMessage,
    handleNewChat,
    toggleSidebar,
    setSidebarVisible,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// 3. Custom hook (kullanımı kolaylaştırmak için)
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};


