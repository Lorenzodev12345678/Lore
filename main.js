import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpX9m0gxH9Qg3RTDHNGwpbTawcRgh2fkY",
    authDomain: "oiiii-a3c17.firebaseapp.com",
    databaseURL: "https://oiiii-a3c17-default-rtdb.firebaseio.com",
    projectId: "oiiii-a3c17",
    storageBucket: "oiiii-a3c17.firebasestorage.app",
    messagingSenderId: "806380028597",
    appId: "1:806380028597:web:0e787ac163f7855711f4fc"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const noticiasRef = ref(db, 'noticias');

// --- LÓGICA DE LOGIN COM GOOGLE (REDIRECT) ---
document.addEventListener('DOMContentLoaded', () => {
    const btnGoogle = document.getElementById('btnGoogle');
    if (btnGoogle) {
        btnGoogle.onclick = () => {
            signInWithRedirect(auth, provider);
        };
    }
});

// Verifica se o usuário voltou do login do Google
getRedirectResult(auth).then((result) => {
    if (result) {
        alert("Carregando API.......simmmm a melhor ia");
    }
}).catch((error) => {
    console.error("Erro no login:", error.message);
});

// Monitorar o estado do usuário
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('user-info').style.display = "block";
        document.getElementById('user-name').innerText = user.displayName;
        
        // Se o email for o seu, abre o painel de criação direto
        if(user.email === "lorenzodevcritor@gmail.com") {
             document.getElementById('login-painel').style.display = "none";
             document.getElementById('painel-real').style.display = "block";
        }
    }
});

// --- LOGIN POR SENHA (FALLBACK) ---
window.validarSenha = function() {
    const senha = document.getElementById('senhaAcesso').value;
    if (senha === ".?????×[&&&&&;") {
        document.getElementById('login-painel').style.display = "none";
        document.getElementById('painel-real').style.display = "block";
    } else if (senha === "28jsnznnnn29888") {
        document.getElementById('login-painel').style.display = "none";
        document.getElementById('painel-master').style.display = "block";
    } else {
        alert("SENHA INCORRETA, MAN!");
    }
};

// --- PREVIEW DA IMAGEM ---
let imagemBase64 = "";
const inputImg = document.getElementById('inputImagem');
if(inputImg) {
    inputImg.addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function() {
            imagemBase64 = reader.result;
            document.getElementById('preview').src = imagemBase64;
            document.getElementById('preview').style.display = "block";
        }
        if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
    });
}

// --- CRIAR NOTÍCIA (CREATE) ---
window.salvarNoticia = function() {
    const titulo = document.getElementById('novoTitulo').value;
    const desc = document.getElementById('novaDescricao').value;
    const img = document.getElementById('preview').src;

    if (!titulo || !imagemBase64) {
        alert("Preencha o título e a foto, man!");
        return;
    }

    push(noticiasRef, {
        titulo: titulo,
        desc: desc,
        img: img,
        data: new Date().toLocaleString()
    }).then(() => {
        alert("POSTADO NO PORTAL LORE!");
        location.reload();
    });
};

// --- MOSTRAR E GERENCIAR NOTÍCIAS (VIEW/UPDATE/DELETE) ---
onValue(noticiasRef, (snapshot) => {
    const feed = document.getElementById('feed-noticias');
    const listaMaster = document.getElementById('lista-gerenciamento');
    if(!feed) return;
    
    feed.innerHTML = "";
    if(listaMaster) listaMaster.innerHTML = "";

    snapshot.forEach((item) => {
        const n = item.val();
        const id = item.key;

        // Mostrar no Feed Público
        feed.insertAdjacentHTML('afterbegin', `
            <div class="card">
                <div class="urgente-header">🚨 NOTÍCIA AO VIVO</div>
                <img src="${n.img}" class="imagem-noticia">
                <div class="conteudo-noticia">
                    <h2>${n.titulo}</h2>
                    <p>${n.desc}</p>
                </div>
                <button class="botao-noticia" onclick="alert('Carregando API.......simmmm a melhor ia')">LER COMPLETA</button>
            </div>`);

        // Mostrar no Painel Master
        if(listaMaster) {
            listaMaster.insertAdjacentHTML('beforeend', `
                <div style="border-bottom: 1px solid #444; padding: 10px; text-align: left;">
                    <span style="color:gold;">${n.titulo}</span><br>
                    <button class="btn-master btn-edit" onclick="renomearNoticia('${id}')">Renomear</button>
                    <button class="btn-master btn-del" onclick="excluirNoticia('${id}')">Excluir</button>
                </div>`);
        }
    });
});

// FUNÇÕES DE GERENCIAMENTO
window.excluirNoticia = function(id) {
    if(confirm("Deseja apagar essa notícia rlk?")) {
        remove(ref(db, 'noticias/' + id));
    }
};

window.renomearNoticia = function(id) {
    const novo = prompt("Digite o novo título:");
    if(novo) {
        update(ref(db, 'noticias/' + id), { titulo: novo });
    }
};
