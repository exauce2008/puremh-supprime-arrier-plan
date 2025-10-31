// 🔥 Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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

// 🚀 Initialisation Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// 📸 Suppression d’arrière-plan avec remove.bg
const imageInput = document.getElementById('imageInput');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const downloadBtn = document.getElementById('downloadBtn');
const deleteBtn = document.getElementById('deleteBtn');

imageInput.addEventListener('change', async () => {
  const file = imageInput.files[0];
  if (!file) return;

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
      const user = result.user;
      alert("✅ Connecté avec Google : " + user.displayName);
      console.log("Nom :", user.displayName);
      console.log("Email :", user.email);
      console.log("Photo :", user.photoURL);
    })
    .catch(error => {
      alert("❌ Erreur Google : " + error.message);
    });
});

// 🧪 Connexions simulées pour Facebook et Apple
document.querySelector('.facebook').addEventListener('click', () => {
  alert("Connexion Facebook simulée !");
});

document.querySelector('.apple').addEventListener('click', () => {
  alert("Connexion Apple simulée !");
});
