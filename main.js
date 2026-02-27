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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const noticiasRef = ref(db, 'noticias');

// --- SISTEMA DE LOGIN COM GOOGLE ---
document.addEventListener('DOMContentLoaded', () => {
    const btnGoogle = document.getElementById('btnGoogle');
    if (btnGoogle) {
        btnGoogle.onclick = () => {
            signInWithPopup(auth, provider)
                .then((result) => {
                    alert("Carregando API.......simmmm a melhor ia");
                })
                .catch((error) => {
                    alert("Erro no login: " + error.message);
                });
        };
    }
});

// Monitorar se o usuário está logado
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('user-info').style.display = "block";
        document.getElementById('user-name').innerText = user.displayName;
        
        // Se for o seu e-mail, libera o painel automático
        if(user.email === "lorenzodevcritor@gmail.com") {
             document.getElementById('login-painel').style.display = "none";
             document.getElementById('painel-real').style.display = "block";
        }
    }
});

// --- LOGIN POR SENHA ---
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

// --- LÓGICA DE IMAGEM (PREVIEW) ---
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
        alert("Preencha o título e escolha a foto, rlk!");
        return;
    }

    push(noticiasRef, {
        titulo: titulo,
        desc: desc,
        img: img,
        data: new Date().toLocaleString()
    }).then(() => {
        alert("NOTÍCIA POSTADA AO VIVO!");
        location.reload();
    });
};

// --- MOSTRAR NOTÍCIAS E GERENCIAR (VIEW/UPDATE/DELETE) ---
onValue(noticiasRef, (snapshot) => {
    const feed = document.getElementById('feed-noticias');
    const listaMaster = document.getElementById('lista-gerenciamento');
    if(!feed) return;
    
    feed.innerHTML = "";
    if(listaMaster) listaMaster.innerHTML = "";

    snapshot.forEach((item) => {
        const n = item.val();
        const id = item.key;

        // Adiciona no Feed do Site
        const cardHTML = `
            <div class="card">
                <div class="urgente-header">🚨 NOTÍCIA AO VIVO</div>
                <img src="${n.img}" class="imagem-noticia">
                <div class="conteudo-noticia">
                    <h2>${n.titulo}</h2>
                    <p>${n.desc}</p>
                </div>
                <button class="botao-noticia" onclick="alert('Carregando API.......simmmm a melhor ia')">LER COMPLETA</button>
            </div>`;
        feed.insertAdjacentHTML('afterbegin', cardHTML);

        // Adiciona no Painel Master (Gerenciamento)
        if(listaMaster) {
            const itemMaster = `
                <div style="border-bottom: 1px solid #444; padding: 10px; text-align: left;">
                    <span style="color:gold; font-weight:bold;">${n.titulo}</span><br>
                    <button class="btn-master btn-edit" onclick="renomearNoticia('${id}')">Renomear</button>
                    <button class="btn-master btn-del" onclick="excluirNoticia('${id}')">Excluir</button>
                </div>`;
            listaMaster.insertAdjacentHTML('beforeend', itemMaster);
        }
    });
});

// FUNÇÃO PARA EXCLUIR
window.excluirNoticia = function(id) {
    if(confirm("Quer apagar essa notícia rlk?")) {
        remove(ref(db, 'noticias/' + id));
    }
};

// FUNÇÃO PARA RENOMEAR
window.renomearNoticia = function(id) {
    const novoTitulo = prompt("Digite o novo título da notícia:");
    if(novoTitulo) {
        update(ref(db, 'noticias/' + id), { titulo: novoTitulo });
    }
};
