# 📤 Comment uploader sur GitHub (méthode simple)

## Option 1 : Interface Web GitHub (SANS git en ligne de commande)

### Étape 1 : Créer le repository
1. Allez sur https://github.com/new
2. Repository name: `chatbot-educatif`
3. Description: `Chatbot éducatif propulsé par Groq`
4. Public ou Private: **Private** recommandé (pour protéger votre structure de cours)
5. ⚠️ Ne cochez PAS "Add README"
6. Cliquez **"Create repository"**

### Étape 2 : Uploader les fichiers
1. Sur la page du repository vide, cliquez **"uploading an existing file"**
2. Faites glisser TOUS les fichiers du dossier `chatbot-groq` :
   ```
   ✓ api/
   ✓ public/
   ✓ src/
   ✓ .env.example
   ✓ .gitignore
   ✓ package.json
   ✓ README.md
   ✓ QUICKSTART.md
   ✓ test-groq.js
   ✓ vercel.json
   ```
   
   ⚠️ **N'UPLOADEZ PAS** :
   ```
   ✗ .env (si vous en avez créé un)
   ✗ node_modules/
   ```

3. Commit message: `Initial commit - Chatbot éducatif`
4. Cliquez **"Commit changes"**

### ✅ C'est fait ! Passez maintenant à Vercel.

---

## Option 2 : Via Git en ligne de commande (avancé)

### Prérequis
- Git installé : https://git-scm.com/downloads

### Commandes
```bash
# Aller dans le dossier
cd /chemin/vers/chatbot-groq

# Initialiser git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Chatbot éducatif"

# Lier au repository GitHub (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/chatbot-educatif.git

# Pousser vers GitHub
git branch -M main
git push -u origin main
```

### Si demandé de s'authentifier
```bash
# Utiliser un Personal Access Token
# Générer sur : https://github.com/settings/tokens
# Permissions : repo (tout cocher)
# Utilisez le token comme mot de passe
```

---

## ⚠️ SÉCURITÉ IMPORTANTE

### JAMAIS uploader ces fichiers :
- `.env` ou `.env.local` (contient votre clé API)
- `node_modules/` (trop gros, inutile)
- Fichiers de configuration locaux

### Le fichier .gitignore s'en charge automatiquement !

Vérifiez qu'il contient :
```
.env
.env.local
.env.production
node_modules/
```

---

## 🔄 Mettre à jour le code plus tard

### Via interface web
1. Allez sur votre repository
2. Cliquez sur le fichier à modifier
3. Cliquez sur l'icône crayon (Edit)
4. Faites vos modifications
5. "Commit changes"

### Via git
```bash
# Faire vos modifications dans les fichiers
# Puis :
git add .
git commit -m "Description de vos modifications"
git push
```

→ Vercel redéploiera automatiquement !

---

## 🆘 Problèmes courants

**"Permission denied" lors du push**
→ Vérifiez vos droits sur le repository
→ Utilisez un Personal Access Token

**"Repository not found"**
→ Vérifiez l'URL du remote
→ Commande : `git remote -v`

**Fichiers trop gros**
→ Assurez-vous de ne PAS uploader node_modules/

---

## ✅ Checklist finale

- [ ] Repository créé sur GitHub
- [ ] Fichiers uploadés (sauf .env et node_modules)
- [ ] .gitignore présent
- [ ] README.md visible sur la page principale
- [ ] Prêt pour connexion avec Vercel

**Prochaine étape → Déployer sur Vercel !**
