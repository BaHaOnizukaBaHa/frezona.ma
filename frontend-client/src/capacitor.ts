import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard } from '@capacitor/keyboard';

// Initialiser les plugins Capacitor
export const initializeCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    // Configurer la barre de statut
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#379c00' });
    
    // Masquer l'écran de démarrage
    await SplashScreen.hide();
    
    // Configurer le clavier
    await Keyboard.setAccessoryBarVisible({ isVisible: false });
    
    // Gérer le bouton retour Android
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });
  }
};

// Fonction pour les vibrations tactiles
export const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Light) => {
  if (Capacitor.isNativePlatform()) {
    await Haptics.impact({ style });
  }
};

// Fonction pour vérifier si on est sur mobile
export const isMobile = () => Capacitor.isNativePlatform();

// Fonction pour obtenir la plateforme
export const getPlatform = () => Capacitor.getPlatform();
