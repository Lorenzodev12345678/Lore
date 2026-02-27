import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Suas configurações que você pegou no Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBpX9m0gxH9Qg3RTDHNGwpbTawcRgh2fkY",
    authDomain: "oiiii-a3c17.firebaseapp.com",
    databaseURL: "https://oiiii-a3c17-default-rtdb.firebaseio.com",
    projectId: "oiiii-a3c17",
    storageBucket: "oiiii-a3c17.firebasestorage.app",
    messagingSenderId: "806380028597",
    appId: "1:806380028597:web:0e787ac163f7855711f4fc"
};

// Inicializa o Firebase e o Banco de Dados
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- FUNÇÃO 'CREATE' (POSTAR NOTÍCIA) ---
window.salvarNoticia = function() {
    const titulo = document.getElementById('novoTitulo').value;
    const desc = document.getElementById('novaDescricao').value;
    // Aqui usamos a imagem que você selecionou no preview
    const img = document.getElementById('preview').src;

    if (!titulo || img === "") {
        alert("Preencha o título e escolha uma foto, man!");
        return;
    }

    const noticiasRef = ref(db, 'noticias');
    push(noticiasRef, {
        titulo: titulo,
        desc: desc,
        img: img,
        data: new Date().toLocaleString()
    }).then(() => {
        alert("NOTÍCIA ENVIADA AO VIVO PRO MUNDO!");
        location.reload();
    }).catch((error) => {
        alert("Erro ao postar: " + error.message);
    });
};

// --- FUNÇÃO 'VIEW' (MOSTRAR EM TEMPO REAL) ---
const feedRef = ref(db, 'noticias');
onValue(feedRef, (snapshot) => {
    const feed = document.getElementById('feed-noticias');
    feed.innerHTML = ""; // Limpa para não duplicar

    snapshot.forEach((item) => {
        const n = item.val();
        const cardHTML = `
            <div class="card" style="display:block;">
                <div class="urgente-header">🚨 NOTÍCIA AO VIVO</div>
                <img src="${n.img}" class="imagem-noticia">
                <div class="conteudo-noticia">
                    <h2>${n.titulo}</h2>
                    <p>${n.desc}</p>
                </div>
                <button class="botao-noticia" onclick="alert('Carregando API.......simmmm a melhor ia')">
                    LER COMPLETA
                </button>
            </div>`;
        feed.insertAdjacentHTML('afterbegin', cardHTML);
    });
});
