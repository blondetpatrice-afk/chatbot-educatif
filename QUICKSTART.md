# 🚀 DÉMARRAGE RAPIDE (5 minutes)

## ✅ Vous avez déjà votre clé API Groq

### Option 1 : Déploiement direct sur Vercel (RECOMMANDÉ)

1. **Préparez le dossier**
   ```bash
   cd chatbot-groq
   ```

2. **Installez Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Déployez !**
   ```bash
   vercel
   ```
   
   - Login avec votre compte (GitHub recommandé)
   - Suivez les questions :
     * Set up and deploy? → YES
     * Which scope? → Votre compte
     * Link to existing project? → NO
     * Project name? → chatbot-educatif (ou autre)
     * Directory? → ./ (laisser par défaut)
   
4. **Ajoutez votre clé Groq**
   ```bash
   vercel env add GROQ_API_KEY
   ```
   - Collez votre clé (ex: gsk_...)
   - Environment: Production, Preview, Development (cochez tout)

5. **Redéployez**
   ```bash
   vercel --prod
   ```

6. **✅ TERMINÉ !**
   - Votre URL : affichée dans le terminal
   - Exemple : `https://chatbot-educatif-xxxxx.vercel.app`

---

### Option 2 : Via l'interface Vercel (encore plus simple)

1. **Zippez le dossier `chatbot-groq`**

2. **Allez sur** https://vercel.com/new

3. **Drag & drop** votre fichier .zip

4. **Configurez** :
   - Cliquez "Deploy"
   - Attendez 2 minutes
   
5. **Ajoutez la clé API** :
   - Allez dans Settings → Environment Variables
   - Name: `GROQ_API_KEY`
   - Value: votre clé Groq
   - Save

6. **Redéployez** :
   - Onglet "Deployments"
   - Cliquez "..." → "Redeploy"

7. **✅ TERMINÉ !**

---

## 🎓 Utilisation

### Mode Professeur
1. Allez sur votre URL
2. Vous êtes en mode professeur
3. Créez votre cours + sujets
4. Publiez

### Mode Élève
1. Partagez l'URL à vos élèves
2. Ils choisissent un sujet
3. Ils posent des questions (30/jour max)

---

## 🆘 Problème ?

**Le site ne charge pas ?**
→ Vérifiez les logs : https://vercel.com/dashboard

**Les questions ne fonctionnent pas ?**
→ Vérifiez que GROQ_API_KEY est bien configurée

**Limite atteinte ?**
→ Normal si > 14 400 questions/jour. Attendez demain.

---

## 📞 Besoin d'aide ?

Consultez le README.md complet pour plus de détails !
