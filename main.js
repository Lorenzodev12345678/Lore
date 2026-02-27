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
const noticiasRef = ref(db, 'noticias');

// --- LOGIN COM GOOGLE ---
document.getElementById('btnGoogle').addEventListener('click', () => {
    signInWithPopup(auth, provider).catch((e) => alert("Erro: " + e.message));
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('user-info').style.display = "block";
        document.getElementById('user-name').innerText = user.displayName;
        if(user.email === "lorenzodevcritor@gmail.com") {
             document.getElementById('login-painel').style.display = "none";
             document.getElementById('painel-real').style.display = "block";
        }
    }
});

// --- LOGIN COM SENHA ---
window.validarSenha = function() {
    const senha = document.getElementById('senhaAcesso').value;
    if (senha === ".?????×[&&&&&;") {
        document.getElementById('login-painel').style.display = "none";
        document.getElementById('painel-real').style.display = "block";
    } else if (senha === "28jsnznnnn29888") {
        document.getElementById('login-painel').style.display = "none";
        document.getElementById('painel-master').style.display = "block";
    } else {
        alert("SENHA INCORRETA!");
    }
};

// --- PREVIEW IMAGEM ---
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

// --- SALVAR NOTÍCIA (CREATE) ---
window.salvarNoticia = function() {
    const titulo = document.getElementById('novoTitulo').value;
    const desc = document.getElementById('novaDescricao').value;
    const img = document.getElementById('preview').src;

    if (!titulo || img === "") return alert("Preencha o título e a foto!");

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

// --- VIEW / UPDATE / DELETE (AO VIVO) ---
onValue(noticiasRef, (snapshot) => {
    const feed = document.getElementById('feed-noticias');
    const listaMaster = document.getElementById('lista-gerenciamento');
    feed.innerHTML = "";
    listaMaster.innerHTML = "";

    snapshot.forEach((item) => {
        const n = item.val();
        const id = item.key;

        // Feed Público
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

        // Lista Master
        listaMaster.insertAdjacentHTML('beforeend', `
            <div style="border-bottom: 1px solid #444; padding: 10px; text-align: left;">
                <span style="color:gold;">${n.titulo}</span><br>
                <button class="btn-master btn-edit" onclick="renomearNoticia('${id}')">Renomear</button>
                <button class="btn-master btn-del" onclick="excluirNoticia('${id}')">Excluir</button>
            </div>`);
    });
});

window.excluirNoticia = (id) => { if(confirm("Apagar para todos?")) remove(ref(db, 'noticias/' + id)); };
window.renomearNoticia = (id) => {
    const novo = prompt("Novo título:");
    if(novo) update(ref(db, 'noticias/' + id), { titulo: novo });
};
