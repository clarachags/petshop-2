// cadastro de clientes

// recupera os clientes armazenados no navegador
function carregarClientes() {
    return JSON.parse(localStorage.getItem("clientes")) || [];
}

// salva a lista de clientes no localStorage
function salvarClientes(clientes) {
    localStorage.setItem("clientes", JSON.stringify(clientes));
}

// remove caracteres que não sejam números do CPF
function normalizarCPF(cpf) {
    return cpf.replace(/\D/g, "");
}

// valida os dígitos verificadores do CPF
function validarCPF(cpf) {
    cpf = normalizarCPF(cpf);

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let primeiroDigito = (soma * 10) % 11;

    if (primeiroDigito === 10) {
        primeiroDigito = 0;
    }

    if (primeiroDigito !== Number(cpf[9])) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    let segundoDigito = (soma * 10) % 11;

    if (segundoDigito === 10) {
        segundoDigito = 0;
    }

    return segundoDigito === Number(cpf[10]);
}

// retorna a data atual no formato AAAA-MM-DD.
function obterDataAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

const formularioCliente = document.getElementById("form-cliente");

formularioCliente.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!formularioCliente.checkValidity()) {
        formularioCliente.reportValidity();
        return;
    }

    // recupera os dados preenchidos
    const nome = document.getElementById("nome-cliente").value.trim();
    const email = document.getElementById("email-cliente").value.trim();
    const telefone = document.getElementById("telefone-cliente").value.trim();
    const cpf = normalizarCPF(document.getElementById("cpf-cliente").value);
    const sexo = document.getElementById("sexo-cliente").value;
    const dataNascimento = document.getElementById("nascimento-cliente").value;

    // valida o CPF
    if (!validarCPF(cpf)) {
        alert("CPF inválido. Verifique o número informado.");
        return;
    }

    // verifica se a data de nascimento não é futura
    if (dataNascimento > obterDataAtual()) {
        alert("A data de nascimento não pode ser futura.");
        return;
    }

    // Recupera os clientes já cadastrados.
    const clientes = carregarClientes();

    // impede o cadastro de CPFs duplicados
    const cpfJaCadastrado = clientes.some(cliente => cliente.cpf === cpf);

    if (cpfJaCadastrado) {
        alert("Já existe um cliente cadastrado com esse CPF.");
        return;
    }

    const novoCliente = {
        id: crypto.randomUUID(),
        nome,
        email,
        telefone,
        cpf,
        sexo,
        dataNascimento
    };

    clientes.push(novoCliente);
    salvarClientes(clientes);
    
    // avisa que a lista de clientes foi atualizada
    window.dispatchEvent(new Event("clientesAtualizados"));
    
    atualizarListaClientesNoFormularioPet();

    alert("Cliente cadastrado com sucesso!");

    formularioCliente.reset();
});