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

/* ------------------------------
   🚪 Déconnexion
------------------------------ */
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

/* ------------------------------
   🔐 Connexion Google & Facebook
------------------------------ */
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

/* ------------------------------
   ⚙️ Menu Paramètres
------------------------------ */
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
if (settingsBtn && settingsMenu) {
  settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('hidden');
  });
}

/* ------------------------------
   👀 État de connexion Firebase
------------------------------ */
onAuthStateChanged(auth, user => {
  const navLogin = document.getElementById('navLogin');
  const navSettings = document.getElementById('navSettings');
  const userInfo = document.getElementById('userInfo');
  const userName = document.getElementById('userName');

  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileAvatar = document.getElementById('profileAvatar');

  if (user) {
    isLoggedIn = true;
    imageCount = 0;

    navLogin?.classList.add('hidden');
    navSettings?.classList.remove('hidden');
    userInfo?.classList.remove('hidden');

    if (userName) userName.textContent = user.displayName || "Utilisateur";

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

    if (profileName) profileName.textContent = "";
    if (profileEmail) profileEmail.textContent = "";
    if (profileAvatar) profileAvatar.classList.add('hidden');
  }
});

/* ------------------------------
   🎨 Assistant Logo avec backend Stability AI
------------------------------ */
const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const generatedLogo = document.getElementById('generatedLogo');

let step = 0;
let logoData = { description: "", color: "", text: "" };

function addMessage(text, sender="bot") {
  const msg = document.createElement("div");
  msg.classList.add("chat-message", sender === "bot" ? "chat-bot" : "chat-user");
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getGreeting() {
  const now = new Date();
  const hour = now.getHours();
  return (hour >= 6 && hour < 18)
    ? "Bonjour 👋, je suis ton assistant de création de logos."
    : "Bonsoir 🌙, je suis ton assistant de création de logos.";
}

// 🔑 Fonction pour appeler ton backend Node.js
async function generateLogo(prompt) {
  try {
    const response = await fetch("http://localhost:3000/generate-logo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) throw new Error("Erreur backend : " + response.statusText);

    const data = await response.json();
    const imageUrl = data.image; // ton backend renvoie l’URL

    generatedLogo.src = imageUrl;
    generatedLogo.classList.remove("hidden");
  } catch (error) {
    addMessage("❌ Erreur : " + error.message);
  }
}

if (sendBtn && chatBox) {
  addMessage(getGreeting());
  addMessage("Décris ton logo en quelques mots.");

  sendBtn.addEventListener("click", async () => {
    const userText = chatInput.value.trim();
    if (!userText) return;
    addMessage(userText, "user");
    chatInput.value = "";

    if (step === 0) {
      logoData.description = userText;
      addMessage("Super 👍. Quelle couleur veux-tu pour ton logo ?");
      step++;
    } else if (step === 1) {
      logoData.color = userText;
      addMessage("Parfait 🎨. Quel texte veux-tu afficher sur ton logo ?");
      step++;
    } else if (step === 2) {
      logoData.text = userText;
      addMessage("Merci ✅. Je vais générer ton logo...");

      const finalPrompt = `${logoData.description}, couleur ${logoData.color}, texte "${logoData.text}", style minimaliste et professionnel`;
      await generateLogo(finalPrompt);
    }
  });
}
