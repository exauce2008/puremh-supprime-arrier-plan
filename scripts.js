import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// 🔐 Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDt4-K1aAGU7XEwDWh2tRVd-00PzjMY3sM",
  authDomain: "arrier-plan-55c3a.firebaseapp.com",
  projectId: "arrier-plan-55c3a",
  storageBucket: "arrier-plan-55c3a.appspot.com",
  messagingSenderId: "1013076603520",
  appId: "1:1013076603520:web:51fd3fc5bc15b33d802c65",
  measurementId: "G-WWW0X9F8N8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// 🔢 Limite d'utilisation
let imageCount = 0;
let isLoggedIn = false;

// 📸 Suppression d’arrière-plan
const imageInput = document.getElementById('imageInput');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const downloadBtn = document.getElementById('downloadBtn');
const deleteBtn = document.getElementById('deleteBtn');

if (imageInput) {
  imageInput.addEventListener('change', async () => {
    const file = imageInput.files[0];
    if (!file) return;

    if (!isLoggedIn && imageCount >= 2) {
      alert("🚫 Tu as atteint la limite de 2 images. Connecte-toi pour un accès illimité !");
      return;
    }

    resultDiv.innerHTML = '';
    downloadBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    loadingDiv.style.display = 'block';

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'Ck5MT53W7vGfavrPaE7GfqvR'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur API: ' + response.statusText);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      resultDiv.innerHTML = `<img src="${url}" alt="Image sans arrière-plan" />`;
      downloadBtn.href = url;
      downloadBtn.style.display = 'inline-block';
      deleteBtn.style.display = 'inline-block';

      if (!isLoggedIn) imageCount++;
    } catch (error) {
      resultDiv.innerHTML = `<p style="color:red;">Erreur : ${error.message}. Vérifie ta connexion ou ta clé API.</p>`;
    } finally {
      loadingDiv.style.display = 'none';
    }
  });
}

if (deleteBtn) {
  deleteBtn.addEventListener('click', () => {
    resultDiv.innerHTML = '';
    downloadBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
  });
}

// 🔐 Connexion Google
const googleBtn = document.querySelector('.google');
if (googleBtn) {
  googleBtn.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        alert("✅ Connecté avec Google : " + result.user.displayName);
        window.location.href = "index.html"; // Redirection vers accueil
      })
      .catch(error => {
        alert("❌ Erreur Google : " + error.message);
      });
  });
}

// 🔐 Connexion Facebook
const facebookBtn = document.querySelector('.facebook');
if (facebookBtn) {
  facebookBtn.addEventListener('click', () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        alert("✅ Connecté avec Facebook : " + result.user.displayName);
        window.location.href = "index.html"; // Redirection vers accueil
      })
      .catch(error => {
        alert("❌ Erreur Facebook : " + error.message);
      });
  });
}

// 🚪 Déconnexion
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        alert("🚪 Déconnecté !");
        window.location.href = "index.html"; // Retour accueil
      })
      .catch(error => {
        alert("❌ Erreur déconnexion : " + error.message);
      });
  });
}

// ⚙️ Menu Paramètres
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
  });
}

// 👀 État de connexion
onAuthStateChanged(auth, user => {
  const navLogin = document.querySelector('.nav-login');
  const navSettings = document.querySelector('.nav-settings');
  const userInfo = document.getElementById('userInfo');
  const userName = document.getElementById('userName');

  if (user) {
    isLoggedIn = true;
    imageCount = 0;

    // ✅ Cacher login/signup
    if (navLogin) navLogin.style.display = 'none';

    // ✅ Afficher Paramètres
    if (navSettings) navSettings.style.display = 'block';

    // ✅ Afficher infos utilisateur
    if (userInfo) userInfo.style.display = 'block';
    if (userName) userName.textContent = user.displayName;

  } else {
    isLoggedIn = false;

    // ❌ Afficher login/signup
    if (navLogin) navLogin.style.display = 'flex';

    // ❌ Cacher Paramètres
    if (navSettings) navSettings.style.display = 'none';

    // ❌ Cacher infos utilisateur
    if (userInfo) userInfo.style.display = 'none';
  }
});