import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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
const noticiasRef = ref(db, 'noticias');

// --- SISTEMA DE SENHAS ---
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

// --- PREVIEW DE IMAGEM ---
document.getElementById('inputImagem').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('preview').src = reader.result;
        document.getElementById('preview').style.display = "block";
    }
    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

// --- FUNÇÃO CRIAR ---
window.salvarNoticia = function() {
    const titulo = document.getElementById('novoTitulo').value;
    const desc = document.getElementById('novaDescricao').value;
    const img = document.getElementById('preview').src;

    if (!titulo || img === "") return alert("Preencha tudo!");

    push(noticiasRef, {
        titulo: titulo,
        desc: desc,
        img: img,
        data: new Date().toLocaleString()
    }).then(() => {
        alert("POSTADO!");
        location.reload();
    });
};

// --- MOSTRAR NOTÍCIAS E PAINEL MASTER AO VIVO ---
onValue(noticiasRef, (snapshot) => {
    const feed = document.getElementById('feed-noticias');
    const listaMaster = document.getElementById('lista-master');
    feed.innerHTML = "";
    listaMaster.innerHTML = "";

    snapshot.forEach((child) => {
        const n = child.val();
        const id = child.key;

        // Adiciona ao Feed
        feed.insertAdjacentHTML('afterbegin', `
            <div class="card">
                <div class="urgente-header">🚨 NOTÍCIA AO VIVO</div>
                <img src="${n.img}" class="imagem-noticia">
                <div class="conteudo-noticia">
                    <h2>${n.titulo}</h2>
                    <p>${n.desc}</p>
                </div>
                <button class="botao-noticia" onclick="alert('Carregando API.......simmmm a melhor ia')">LER COMPLETA</button>
            </div>
        `);

        // Adiciona ao Painel Master
        listaMaster.insertAdjacentHTML('beforeend', `
            <div class="item-master">
                <strong>${n.titulo}</strong><br><br>
                <button class="btn-master btn-renomear" onclick="renomearNoticia('${id}')">Renomear</button>
                <button class="btn-master btn-excluir" onclick="excluirNoticia('${id}')">Excluir</button>
            </div>
        `);
    });
});

// --- FUNÇÕES MASTER ---
window.excluirNoticia = (id) => {
    if(confirm("Apagar para todos?")) {
        remove(ref(db, 'noticias/' + id));
    }
};

window.renomearNoticia = (id) => {
    const novo = prompt("Novo título:");
    if(novo) {
        update(ref(db, 'noticias/' + id), { titulo: novo });
    }
};
