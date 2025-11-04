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
    resultDiv.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
  } finally {
    loadingDiv.style.display = 'none';
  }
});

deleteBtn.addEventListener('click', () => {
  resultDiv.innerHTML = '';
  downloadBtn.style.display = 'none';
  deleteBtn.style.display = 'none';
});

// 🔐 Connexion Google
document.querySelector('.google').addEventListener('click', () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      alert("✅ Connecté avec Google : " + result.user.displayName);
    })
    .catch(error => {
      alert("❌ Erreur Google : " + error.message);
    });
});

// 🔐 Connexion Facebook
document.querySelector('.facebook').addEventListener('click', () => {
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      alert("✅ Connecté avec Facebook : " + result.user.displayName);
    })
    .catch(error => {
      alert("❌ Erreur Facebook : " + error.message);
    });
});

// 🚪 Déconnexion
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      alert("🚪 Déconnecté !");
    })
    .catch(error => {
      alert("❌ Erreur déconnexion : " + error.message);
    });
});

// 👀 État de connexion
onAuthStateChanged(auth, user => {
  const userInfo = document.getElementById('userInfo');
  const authSection = document.getElementById('authSection');
  const userName = document.getElementById('userName');

  if (user) {
    isLoggedIn = true;
    imageCount = 0;
    userInfo.style.display = 'block';
    authSection.style.display = 'none';
    userName.textContent = user.displayName;

    if (user.photoURL) {
      const avatar = document.createElement('img');
      avatar.src = user.photoURL;
      avatar.alt = "Photo de profil";
      avatar.id = "userAvatar";
      userInfo.insertBefore(avatar, userName);
    }
  } else {
    isLoggedIn = false;
    userInfo.style.display = 'none';
    authSection.style.display = 'block';
  }
});