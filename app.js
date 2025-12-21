import React from 'react';
import {
  StyleSheet,
  View,
  AppRegistry,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';

// Koyu grimsi tema
const customTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#1a1a1a', // Koyu gri arka plan
  },
};

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={customTheme}>
        <SafeAreaView style={styles.container}>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Koyu gri arka plan
  },
});

export default App;

// Register the app with AppRegistry
// Expo expects 'main' as the component name when using app.js
AppRegistry.registerComponent('main', () => App);