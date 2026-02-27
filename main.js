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

// --- LÓGICA DE LOGIN ---
window.validarSenha = function() {
    const senha = document.getElementById('senhaAcesso').value;
    if (senha === ".?????×[&&&&&;") {
        document.getElementById('login-painel').style.display = "none";
        document.getElementById('painel-real').style.display = "block";
        alert("BEM-VINDO, LORENZO!");
    } else if (senha === "28jsnznnnn29888") {
        document.getElementById('login-painel').style.display = "none";
        document.getElementById('painel-master').style.display = "block";
        alert("MODO MASTER ATIVADO!");
    } else {
        alert("SENHA INCORRETA, MAN!");
    }
};

// --- PREVIEW DA IMAGEM ---
let imagemBase64 = "";
document.getElementById('inputImagem').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        imagemBase64 = reader.result;
        document.getElementById('preview').src = imagemBase64;
        document.getElementById('preview').style.display = "block";
    }
    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

// --- CREATE (POSTAR NOTÍCIA) ---
window.salvarNoticia = function() {
    const titulo = document.getElementById('novoTitulo').value;
    const desc = document.getElementById('novaDescricao').value;
    const img = document.getElementById('preview').src;

    if (!titulo || img === "" || img.includes('window')) {
        alert("Preencha o título e a foto!");
        return;
    }

    push(noticiasRef, {
        titulo: titulo,
        desc: desc,
        img: img,
        data: new Date().toLocaleString()
    }).then(() => {
        alert("POSTADO COM SUCESSO!");
        location.reload();
    });
};

// --- VIEW / UPDATE / DELETE (AO VIVO) ---
onValue(noticiasRef, (snapshot) => {
    const feed = document.getElementById('feed-noticias');
    const listaMaster = document.getElementById('lista-gerenciamento');
    feed.innerHTML = "";
    listaMaster.innerHTML = "";

    snapshot.forEach((item) => {
        const n = item.val();
        const id = item.key;

        // Mostrar no Feed
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

        // Mostrar no Painel Master (Gerenciamento)
        const itemMaster = `
            <div style="border-bottom: 1px solid #444; padding: 10px; text-align: left; color: white;">
                <span style="color:gold; font-weight:bold;">${n.titulo}</span><br>
                <button class="btn-master btn-edit" onclick="renomearNoticia('${id}')">Renomear</button>
                <button class="btn-master btn-del" onclick="excluirNoticia('${id}')">Excluir</button>
            </div>`;
        listaMaster.insertAdjacentHTML('beforeend', itemMaster);
    });
});

// FUNÇÃO EXCLUIR
window.excluirNoticia = function(id) {
    if(confirm("Deseja apagar essa notícia para todos os usuários?")) {
        remove(ref(db, 'noticias/' + id));
    }
};

// FUNÇÃO RENOMEAR
window.renomearNoticia = function(id) {
    const novo = prompt("Digite o novo título da notícia:");
    if(novo) {
        update(ref(db, 'noticias/' + id), { titulo: novo });
    }
};
