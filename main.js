import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpX9m0gxH9Qg3RTDHNGwpbTawcRgh2fkY",
    authDomain: "oiiii-a3c17.firebaseapp.com",
    databaseURL: "https://oiiii-a3c17-default-rtdb.firebaseio.com",
    projectId: "oiiii-a3c17",
    storageBucket: "oiiii-a3c17.firebasestorage.app",
    messagingSenderId: "806380028597",
    appId: "1:806380028597:web:0e787ac163f7855711f4fc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// FORÇANDO O BOTÃO A FUNCIONAR
document.addEventListener('DOMContentLoaded', () => {
    const btnGoogle = document.getElementById('btnGoogle');
    if (btnGoogle) {
        btnGoogle.onclick = () => {
            console.log("Botão clicado, man!"); // Isso aparece no F12 para testar
            signInWithPopup(auth, provider)
                .then((result) => {
                    alert("Carregando API.......simmmm a melhor ia! Logado como: " + result.user.displayName);
                })
                .catch((error) => {
                    console.error(error);
                    alert("Erro ao logar: " + error.message);
                });
        };
    }
});

// O resto do código (onValue, salvarNoticia) continua igual abaixo...
