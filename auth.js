import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Suas chaves novas que você acabou de me dar!
const firebaseConfig = {
    apiKey: "AIzaSyC42GmqAcrDvUDPEah1Sx2u1UMD8IEBxiA",
    authDomain: "login-abc62.firebaseapp.com",
    projectId: "login-abc62",
    storageBucket: "login-abc62.firebasestorage.app",
    messagingSenderId: "409348964887",
    appId: "1:409348964887:web:f9dbe687a417cc45751252"
};

// Inicializa o Firebase de Login
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Função para abrir o login do Google
export function logarComGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            alert("Carregando API.......simmmm a melhor ia");
        })
        .catch((error) => {
            console.error("Erro no login:", error.code);
            alert("Erro: " + error.message);
        });
}

// Função para sair
export function sairDaConta() {
    signOut(auth).then(() => {
        alert("Até logo, rlk!");
        location.reload();
    });
}

// Fica vigiando quem entrou
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário logado:", user.displayName);
        document.getElementById('user-info').style.display = "block";
        document.getElementById('user-name').innerText = user.displayName;
        
        // Se for o seu email, abre o painel de notícias (que usa o outro projeto)
        if(user.email === "lorenzodevcritor@gmail.com") {
            document.getElementById('login-painel').style.display = "none";
            document.getElementById('painel-real').style.display = "block";
        }
    }
});
