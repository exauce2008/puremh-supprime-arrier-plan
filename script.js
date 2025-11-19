// 🔐 Firebase setup
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

let imageCount = 0;
let isLoggedIn = false;

// 🚪 Déconnexion
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        alert("🚪 Déconnecté !");
        window.location.href = "index.html";
      })
      .catch(error => {
        alert("❌ Erreur déconnexion : " + error.message);
      });
  });
}

// 🔐 Connexion Google
const googleBtn = document.querySelector('.google');
if (googleBtn) {
  googleBtn.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        alert("✅ Connecté : " + (result.user.displayName || "Compte"));
        window.location.href = "index.html";
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
        alert("✅ Connecté : " + (result.user.displayName || "Compte"));
        window.location.href = "index.html";
      })
      .catch(error => {
        alert("❌ Erreur Facebook : " + error.message);
      });
  });
}

// ⚙️ Menu Paramètres
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
if (settingsBtn && settingsMenu) {
  settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('hidden');
  });
}

// 👀 État de connexion Firebase
onAuthStateChanged(auth, user => {
  const navLogin = document.getElementById('navLogin');
  const navSettings = document.getElementById('navSettings');
  const userInfo = document.getElementById('userInfo');
  const userName = document.getElementById('userName');

  // 🔹 Profil (page profile.html)
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileAvatar = document.getElementById('profileAvatar');

  if (user) {
    isLoggedIn = true;
    imageCount = 0;

    // Navigation
    navLogin?.classList.add('hidden');
    navSettings?.classList.remove('hidden');
    userInfo?.classList.remove('hidden');

    if (userName) userName.textContent = user.displayName || "Utilisateur";

    // Avatar dans la nav
    if (user.photoURL && userName) {
      const oldAvatar = document.getElementById('userAvatar');
      if (oldAvatar) oldAvatar.remove();

      const avatar = document.createElement('img');
      avatar.src = user.photoURL;
      avatar.alt = "Photo de profil";
      avatar.id = "userAvatar";
      avatar.style.width = "28px";
      avatar.style.height = "28px";
      avatar.style.borderRadius = "50%";
      avatar.style.marginRight = "8px";

      userName.before(avatar);
    }

    // 🔹 Remplissage du profil
    if (profileName) profileName.textContent = user.displayName || "Nom indisponible";
    if (profileEmail) profileEmail.textContent = user.email || "Email indisponible";
    if (profileAvatar && user.photoURL) {
      profileAvatar.src = user.photoURL;
      profileAvatar.classList.remove('hidden');
    }

  } else {
    isLoggedIn = false;

    navLogin?.classList.remove('hidden');
    navSettings?.classList.add('hidden');
    userInfo?.classList.add('hidden');

    // 🔹 Nettoyage profil si pas connecté
    if (profileName) profileName.textContent = "";
    if (profileEmail) profileEmail.textContent = "";
    if (profileAvatar) profileAvatar.classList.add('hidden');
  }
});

/* ------------------------------
   📸 Outil remove.bg (index)
------------------------------ */
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
    downloadBtn.classList.add('hidden');
    deleteBtn.classList.add('hidden');
    loadingDiv.style.display = 'block';

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': 'Ck5MT53W7vGfavrPaE7GfqvR' },
        body: formData
      });

      if (!response.ok) throw new Error('Erreur API: ' + response.statusText);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      resultDiv.innerHTML = `<img src="${url}" alt="Image sans arrière-plan" />`;
      downloadBtn.href = url;
      downloadBtn.classList.remove('hidden');
      deleteBtn.classList.remove('hidden');

      if (!isLoggedIn) imageCount++;
    } catch (error) {
      resultDiv.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
    } finally {
      loadingDiv.style.display = 'none';
    }
  });
}

if (deleteBtn) {
  deleteBtn.addEventListener('click', () => {
    resultDiv.innerHTML = '';
    downloadBtn.classList.add('hidden');
    deleteBtn.classList.add('hidden');
  });
}
