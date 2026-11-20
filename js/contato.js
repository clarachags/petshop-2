// formulário de contato

// recupera as mensagens armazenadas
function carregarMensagensContato() {
    return JSON.parse(localStorage.getItem("mensagensContato")) || [];
}

// salva as mensagens no localStorage
function salvarMensagensContato(mensagens) {
    localStorage.setItem("mensagensContato", JSON.stringify(mensagens));
}

const formularioContato = document.getElementById("form-contato");
const campoNomeContato = document.getElementById("contato-nome");
const campoEmailContato = document.getElementById("contato-email");
const campoMensagemContato = document.getElementById("contato-mensagem");

const erroContato = document.getElementById("erro-contato");
const sucessoContato = document.getElementById("sucesso-contato");

formularioContato.addEventListener("submit", function (event) {
    event.preventDefault();

    // limpa as mensagens anteriores
    erroContato.textContent = "";
    sucessoContato.textContent = "";

    // verifica a validade dos campos
    if (!formularioContato.checkValidity()) {
        formularioContato.reportValidity();
        return;
    }

    // recupera os dados
    const nome = campoNomeContato.value.trim();
    const email = campoEmailContato.value.trim();
    const mensagem = campoMensagemContato.value.trim();

    if (!nome || !email || !mensagem) {
        erroContato.textContent = "Preencha todos os campos antes de enviar.";
        return;
    }

    const novaMensagem = {
        id: crypto.randomUUID(),
        nome,
        email,
        mensagem,
        dataEnvio: new Date().toISOString()
    };

    const mensagens = carregarMensagensContato();

    mensagens.push(novaMensagem);

    salvarMensagensContato(mensagens);

    sucessoContato.textContent =
        "Mensagem enviada com sucesso! Agradecemos seu contato.";

    formularioContato.reset();

    campoNomeContato.focus();
});
