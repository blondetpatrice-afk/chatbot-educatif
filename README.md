# 🎓 Chatbot Éducatif avec Groq (100% GRATUIT)

## 🚀 Déploiement rapide sur Vercel (15 minutes)

### ✅ Prérequis
- [x] Compte Groq créé → https://console.groq.com
- [x] Clé API Groq obtenue (commence par `gsk_...`)
- [x] Compte GitHub (gratuit) → https://github.com
- [x] Compte Vercel (gratuit) → https://vercel.com

---

## 📋 ÉTAPE 1 : Préparer le code

### Option A : Via GitHub (RECOMMANDÉ)

1. **Créer un nouveau repository sur GitHub**
   - Allez sur https://github.com/new
   - Nom : `chatbot-educatif`
   - Public ou Private : au choix
   - Cliquez "Create repository"

2. **Uploader les fichiers**
   ```bash
   # Dans votre terminal
   cd chatbot-groq
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/chatbot-educatif.git
   git push -u origin main
   ```

### Option B : Upload direct sur Vercel
- Zippez le dossier `chatbot-groq`
- Uploadez directement dans Vercel (voir étape 2)

---

## 📋 ÉTAPE 2 : Déployer sur Vercel

1. **Connectez-vous à Vercel**
   - Allez sur https://vercel.com
   - Cliquez "Sign Up" (avec GitHub recommandé)

2. **Nouveau projet**
   - Cliquez "Add New Project"
   - Sélectionnez votre repository `chatbot-educatif`
   - Cliquez "Import"

3. **Configuration**
   - Framework Preset : **Other**
   - Root Directory : `./` (laisser par défaut)
   - Build Command : `npm run build` (ou laisser vide)
   - Output Directory : `public`

4. **⚠️ IMPORTANT : Ajouter votre clé API Groq**
   - Dans la section "Environment Variables"
   - Name : `GROQ_API_KEY`
   - Value : Collez votre clé Groq (ex: `gsk_...`)
   - Cliquez "Add"

5. **Deploy !**
   - Cliquez "Deploy"
   - ⏳ Attendez 2-3 minutes

6. **🎉 C'est en ligne !**
   - URL : `https://chatbot-educatif-xxxxx.vercel.app`
   - Copiez cette URL pour la partager à vos élèves

---

## 📋 ÉTAPE 3 : Configurer le chatbot

1. **Accédez à l'URL de votre site**
   - Vous êtes en mode "Professeur" par défaut

2. **Créez votre cours**
   - Titre du cours : "Histoire - 2nde Guerre Mondiale"
   - Ajoutez des sujets/chapitres
   - Pour chaque sujet :
     * Titre : "Chapitre 1 - Les origines"
     * Contenu : Collez votre cours complet

3. **Publiez**
   - Cliquez "Publier le chatbot"
   - ✅ C'est prêt pour vos élèves !

4. **Partagez l'URL**
   - Donnez l'URL à vos 150 élèves
   - Ils arrivent en mode "Élève"
   - Chacun peut poser 30 questions/jour

---

## 🔧 Configuration avancée (optionnel)

### Modifier la limite de questions/jour

Dans `src/CourseChatbot.jsx`, ligne 27 :
```javascript
const DAILY_LIMIT = 30; // Changez à 50, 100, etc.
```

### Utiliser un autre modèle Groq

Dans `api/chat.js`, ligne 30 :
```javascript
model: 'llama-3.1-70b-versatile', // Options :
// - 'llama-3.1-70b-versatile' (recommandé)
// - 'llama-3.1-8b-instant' (plus rapide)
// - 'mixtral-8x7b-32768' (bon aussi)
```

### Changer le domaine (optionnel)

1. Dans Vercel → Settings → Domains
2. Ajoutez votre domaine personnel (ex: `cours.monecole.fr`)
3. Suivez les instructions DNS

---

## 💰 Coûts

| Service | Prix |
|---------|------|
| Groq API | **0€** (14 400 requêtes/jour gratuites) |
| Vercel Hosting | **0€** (plan gratuit) |
| Domaine perso (optionnel) | ~10€/an |
| **TOTAL** | **0€ ou 10€/an** |

Pour 150 élèves × 30 questions/jour = 4500 questions/jour
→ Largement dans les limites gratuites de Groq ! ✅

---

## 📊 Monitoring

### Voir l'usage Groq
- https://console.groq.com/usage
- Nombre de requêtes utilisées
- Limite : 14 400/jour

### Logs Vercel
- https://vercel.com/dashboard
- Onglet "Logs"
- Voir les erreurs éventuelles

---

## 🔒 Sécurité

✅ **Votre clé API est sécurisée**
- Elle est dans les variables d'environnement Vercel
- Les élèves ne peuvent PAS la voir
- Seul votre backend l'utilise

✅ **Données privées**
- Les conversations ne sont PAS envoyées au professeur
- Chaque élève a son propre stockage local
- Groq ne garde pas les conversations

---

## ❓ Problèmes courants

### "Erreur API (401)"
→ Vérifiez que votre clé Groq est correcte dans Vercel
→ Vercel → Settings → Environment Variables

### "Erreur API (429)"
→ Limite de 14 400 requêtes/jour atteinte
→ Rare, mais attendez le lendemain ou contactez Groq

### Le site ne charge pas
→ Vérifiez les logs dans Vercel
→ Dashboard → Deployments → Logs

### Les questions ne marchent pas
→ Ouvrez la console du navigateur (F12)
→ Vérifiez les erreurs réseau

---

## 🆘 Support

**Groq :**
- Doc : https://console.groq.com/docs
- Support : support@groq.com

**Vercel :**
- Doc : https://vercel.com/docs
- Community : https://github.com/vercel/vercel/discussions

---

## 🎯 Checklist finale

- [ ] Compte Groq créé + clé API obtenue
- [ ] Code uploadé sur GitHub
- [ ] Projet déployé sur Vercel
- [ ] Variable GROQ_API_KEY configurée
- [ ] Site accessible via l'URL Vercel
- [ ] Mode professeur : cours configuré et publié
- [ ] Testé avec quelques questions
- [ ] URL partagée aux élèves

**🎉 Félicitations ! Votre chatbot éducatif GRATUIT est en ligne !**

---

## 📈 Évolution future

### Ajouter un système de backup (Groq → Claude)

Si Groq tombe ou atteint sa limite, basculer automatiquement sur Claude.

Modifier `api/chat.js` :
```javascript
// Essayer Groq d'abord
try {
  const groqResponse = await fetch(GROQ_URL, ...);
  // ...
} catch (error) {
  // Si échec, utiliser Claude en backup
  const claudeResponse = await fetch(CLAUDE_URL, ...);
  // ...
}
```

### Ajouter un tableau de bord professeur

- Nombre total de questions posées
- Questions par sujet
- Heures de pic d'utilisation
- (Sans voir le contenu des questions !)

---

## 📞 Contact

Créé pour l'éducation 🎓
100% gratuit • Open source • Respectueux de la vie privée

**Bon enseignement ! 🚀**
