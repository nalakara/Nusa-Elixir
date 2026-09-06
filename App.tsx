
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import OfflineBanner from './components/OfflineBanner';
import MyRecipesScreen from './screens/MyRecipesScreen';
import { initDB } from './services/dbService';

export type Screen = 'home' | 'myRecipes';

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize IndexedDB when the app loads
    initDB();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header setCurrentScreen={setCurrentScreen} />
      {!isOnline && <OfflineBanner />}
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'myRecipes' && <MyRecipesScreen />}
      </main>
      <Footer />
    </div>
  );
};

export default App;