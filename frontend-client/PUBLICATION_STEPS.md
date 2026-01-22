# 🚀 Étapes de Publication - Frezona.ma

## 📱 Google Play Store (Android)

### 1. Préparation
```bash
# Build de l'application
npm run build:release

# Ouvrir Android Studio
npm run android:release
```

### 2. Dans Android Studio
1. **Générer la clé de signature**
   - Build → Generate Signed Bundle/APK
   - Créer une nouvelle clé (garder le fichier .jks en sécurité)

2. **Générer l'AAB (Android App Bundle)**
   - Choisir "Android App Bundle"
   - Sélectionner la clé de signature
   - Build → Build Bundle(s) / APK(s) → Build Bundle(s)

3. **Localiser le fichier AAB**
   - `android/app/build/outputs/bundle/release/app-release.aab`

### 3. Google Play Console
1. **Créer un compte développeur** ($25)
2. **Créer une nouvelle application**
3. **Remplir les informations** :
   - Nom : Frezona.ma
   - Description : Application e-commerce pour produits bio
   - Catégorie : Shopping
   - Contenu : Tous publics

4. **Uploader l'AAB**
5. **Ajouter les screenshots** (minimum 2)
6. **Configurer les prix** (gratuit)
7. **Soumettre pour révision**

---

## 🍎 App Store (iOS)

### 1. Préparation
```bash
# Build de l'application
npm run build:release

# Ouvrir Xcode
npm run ios:release
```

### 2. Dans Xcode
1. **Configurer les certificats**
   - Apple Developer Account requis ($99/an)
   - Télécharger les certificats de distribution

2. **Configurer l'App ID**
   - Bundle Identifier : com.frezona.app
   - Capabilities : Push Notifications, In-App Purchase

3. **Générer l'IPA**
   - Product → Archive
   - Distribute App → App Store Connect
   - Upload

### 3. App Store Connect
1. **Créer une nouvelle app**
2. **Remplir les informations** :
   - Nom : Frezona.ma
   - Description : Application e-commerce pour produits bio
   - Catégorie : Shopping
   - Mots-clés : bio, fermier, légumes, maroc

3. **Ajouter les assets** :
   - Icône 1024x1024px
   - Screenshots (iPhone 6.7", 6.5")
   - App Preview (optionnel)

4. **Soumettre pour révision**

---

## 📋 Checklist de Publication

### ✅ Assets requis
- [ ] Icône 512x512px (Android)
- [ ] Icône 1024x1024px (iOS)
- [ ] Screenshots (minimum 2 par plateforme)
- [ ] Description de l'app
- [ ] Mots-clés
- [ ] Politique de confidentialité

### ✅ Configuration technique
- [ ] Bundle ID configuré
- [ ] Permissions définies
- [ ] Version 1.0.0
- [ ] Build de production
- [ ] Tests sur appareils réels

### ✅ Contenu légal
- [ ] Politique de confidentialité
- [ ] Conditions d'utilisation
- [ ] Conformité RGPD
- [ ] Informations de contact

### ✅ Marketing
- [ ] Description attractive
- [ ] Mots-clés optimisés
- [ ] Screenshots représentatifs
- [ ] App Preview (optionnel)

---

## 💰 Coûts

### Google Play Store
- **Inscription** : $25 (une fois)
- **Commission** : 15% sur les ventes
- **Renouvellement** : Gratuit

### App Store
- **Inscription** : $99/an
- **Commission** : 15% sur les ventes
- **Renouvellement** : $99/an

---

## ⏱️ Délais

### Google Play Store
- **Première soumission** : 1-3 jours
- **Mises à jour** : Quelques heures
- **Rejet** : Correction et resoumission

### App Store
- **Première soumission** : 1-7 jours
- **Mises à jour** : 1-3 jours
- **Rejet** : Correction et resoumission

---

## 🔧 Commandes utiles

```bash
# Build de production
npm run build:release

# Ouvrir Android Studio
npm run android:release

# Ouvrir Xcode
npm run ios:release

# Synchroniser les changements
npm run sync

# Tester sur appareil
npm run run:android
npm run run:ios
```

---

## 📞 Support

### En cas de problème
1. **Vérifier les logs** dans Android Studio/Xcode
2. **Tester sur appareil réel**
3. **Vérifier les permissions**
4. **Consulter la documentation Capacitor**

### Ressources utiles
- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer](https://developer.apple.com)

---

## 🎯 Prochaines étapes

1. **Créer les assets** (icônes, screenshots)
2. **Tester l'application** sur appareils réels
3. **Créer les comptes développeur**
4. **Générer les builds de production**
5. **Soumettre aux stores**
6. **Attendre l'approbation**
7. **Lancer la promotion**

Bonne chance pour la publication ! 🚀
