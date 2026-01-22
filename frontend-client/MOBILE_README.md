# Frezona.ma - Application Mobile

## 📱 Configuration Capacitor

Votre application React a été configurée avec Capacitor pour fonctionner sur Android et iOS.

## 🚀 Commandes disponibles

### Build et synchronisation
```bash
# Build de l'application web et synchronisation avec les plateformes mobiles
npm run build:mobile

# Synchronisation uniquement
npm run sync
```

### Android
```bash
# Ouvrir Android Studio
npm run android

# Lancer sur un appareil/émulateur Android
npm run run:android
```

### iOS
```bash
# Ouvrir Xcode
npm run ios

# Lancer sur un simulateur iOS
npm run run:ios
```

## 📋 Prérequis

### Pour Android
- [Android Studio](https://developer.android.com/studio)
- SDK Android configuré
- Un appareil Android ou émulateur

### Pour iOS (macOS uniquement)
- [Xcode](https://developer.apple.com/xcode/)
- CocoaPods installé
- Un appareil iOS ou simulateur

## 🔧 Configuration

### Fichiers importants
- `capacitor.config.ts` - Configuration principale
- `src/capacitor.ts` - Initialisation des plugins
- `android/` - Projet Android natif
- `ios/` - Projet iOS natif

### Plugins installés
- **SplashScreen** - Écran de démarrage
- **StatusBar** - Barre de statut
- **App** - Gestion de l'application
- **Haptics** - Vibrations tactiles
- **Keyboard** - Gestion du clavier

## 🎨 Personnalisation

### Couleurs de l'application
- Couleur principale : `#379c00` (vert Frezona.ma)
- Couleur de fond : `#ffffff` (blanc)
- Couleur d'accent : `#fff9eb` (jaune crème)

### Écran de démarrage
- Durée : 2 secondes
- Couleur de fond : Vert Frezona.ma
- Spinner blanc

## 📱 Fonctionnalités mobiles

### Vibrations tactiles
```javascript
import { hapticFeedback } from './capacitor';

// Vibration légère
await hapticFeedback(ImpactStyle.Light);

// Vibration moyenne
await hapticFeedback(ImpactStyle.Medium);

// Vibration forte
await hapticFeedback(ImpactStyle.Heavy);
```

### Détection de plateforme
```javascript
import { isMobile, getPlatform } from './capacitor';

if (isMobile()) {
  console.log('Application mobile détectée');
  console.log('Plateforme:', getPlatform()); // 'android' ou 'ios'
}
```

## 🚀 Déploiement

### Android
1. Build de l'application : `npm run build:mobile`
2. Ouvrir Android Studio : `npm run android`
3. Générer l'APK ou AAB dans Android Studio
4. Publier sur Google Play Store

### iOS
1. Build de l'application : `npm run build:mobile`
2. Ouvrir Xcode : `npm run ios`
3. Configurer les certificats de développement
4. Générer l'IPA dans Xcode
5. Publier sur App Store

## 🔄 Workflow de développement

1. **Développement web** : Modifiez votre code React normalement
2. **Test web** : `npm start` pour tester dans le navigateur
3. **Build mobile** : `npm run build:mobile` pour synchroniser
4. **Test mobile** : `npm run android` ou `npm run ios`
5. **Itération** : Répétez le processus

## 📝 Notes importantes

- L'application utilise 100% de votre code React existant
- Les plugins Capacitor sont automatiquement initialisés
- La barre de statut et l'écran de démarrage sont configurés
- Le bouton retour Android est géré automatiquement
- Les vibrations tactiles sont disponibles pour une meilleure UX

## 🆘 Support

Pour plus d'informations sur Capacitor :
- [Documentation officielle](https://capacitorjs.com/docs)
- [Guide de démarrage](https://capacitorjs.com/docs/getting-started)
- [Plugins disponibles](https://capacitorjs.com/docs/plugins)
