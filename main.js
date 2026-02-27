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

// --- LÓGICA DE SENHAS ---
window.validarSenha = function() {
    const senha = document.getElementById('senhaAcesso').value;
    if (senha === ".?????×[&&&&&;") {
        document.getElementById('login-secao').style.display = 'none';
        document.getElementById('painel-lorenzo').style.display = 'block';
    } else if (senha === "28jsnznnnn29888") {
        document.getElementById('login-secao').style.display = 'none';
        document.getElementById('painel-master').style.display = 'block';
    } else {
        alert("Senha incorreta, man!");
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

// --- CREATE (POSTAR) ---
window.salvarNoticia = function() {
    const titulo = document.getElementById('novoTitulo').value;
    const desc = document.getElementById('novaDescricao').value;
    if (!titulo || !imagemBase64) return alert("Coloque título e foto!");

    push(noticiasRef, {
        titulo: titulo,
        desc: desc,
        img: imagemBase64
    }).then(() => {
        alert("POSTADO!");
        location.reload();
    });
};

// --- VIEW / UPDATE / DELETE (Sincronização Total) ---
onValue(noticiasRef, (snapshot) => {
    const feed = document.getElementById('feed-noticias');
    const listaMaster = document.getElementById('lista-master');
    feed.innerHTML = "";
    listaMaster.innerHTML = "";

    snapshot.forEach((item) => {
        const n = item.val();
        const id = item.key;

        // Adiciona no Feed Público
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

        // Adiciona no Painel Master
        listaMaster.insertAdjacentHTML('beforeend', `
            <div style="background:#333; margin:10px; padding:10px; border-radius:5px;">
                <strong>${n.titulo}</strong><br>
                <button class="btn-master btn-edit" onclick="renomearNoticia('${id}')">Renomear</button>
                <button class="btn-master btn-del" onclick="excluirNoticia('${id}')">Excluir</button>
            </div>
        `);
    });
});

// --- FUNÇÃO EXCLUIR ---
window.excluirNoticia = function(id) {
    if(confirm("Tem certeza que quer apagar para TODOS?")) {
        remove(ref(db, 'noticias/' + id));
    }
};

// --- FUNÇÃO RENOMEAR ---
window.renomearNoticia = function(id) {
    const novoTitulo = prompt("Digite o novo título da notícia:");
    if(novoTitulo) {
        update(ref(db, 'noticias/' + id), {
            titulo: novoTitulo
        });
    }
};
