// cadastro de pets

// recupera os pets armazenados no navegador
function carregarPets() {
    return JSON.parse(localStorage.getItem("pets")) || [];
}

// salva a lista de pets no localStorage
function salvarPets(pets) {
    localStorage.setItem("pets", JSON.stringify(pets));
}

// preenche o campo de seleção com os clientes cadastrados
function atualizarListaClientesNoFormularioPet() {
    const campoCliente = document.getElementById("cliente-pet");
    const clientes = carregarClientes();

    campoCliente.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione o tutor";
    campoCliente.appendChild(opcaoInicial);

    if (clientes.length === 0) {
        const opcaoVazia = document.createElement("option");
        opcaoVazia.value = "";
        opcaoVazia.textContent = "Nenhum cliente cadastrado";
        opcaoVazia.disabled = true;
        campoCliente.appendChild(opcaoVazia);
        return;
    }

    // adiciona os clientes como opções
    clientes.forEach(cliente => {
        const opcao = document.createElement("option");

        opcao.value = cliente.id;
        opcao.textContent = cliente.nome;

        campoCliente.appendChild(opcao);
    });
}

function exibirMensagemPet(tipo, mensagem) {
    const erro = document.getElementById("erro-cadastro-pet");
    const sucesso = document.getElementById("sucesso-cadastro-pet");

    erro.textContent = "";
    sucesso.textContent = "";

    if (tipo === "erro") {
        erro.textContent = mensagem;
    } else {
        sucesso.textContent = mensagem;
    }
}

const formularioPet = document.getElementById("form-pet");

// carrega os tutores quando a página é aberta
atualizarListaClientesNoFormularioPet();

formularioPet.addEventListener("submit", function (event) {
    event.preventDefault();

    exibirMensagemPet("", "");

    if (!formularioPet.checkValidity()) {
        formularioPet.reportValidity();
        return;
    }

    // recupera os dados
    const clienteId = document.getElementById("cliente-pet").value;
    const nome = document.getElementById("nome-pet").value.trim();
    const especie = document.getElementById("especie-pet").value;
    const raca = document.getElementById("raca-pet").value.trim();
    const idade = Number(document.getElementById("idade-pet").value);
    const unidadeIdade = document.getElementById("unidade-idade").value;
    const observacoes = document.getElementById("observacoes-pet").value.trim();

    // recupera os clientes cadastrados
    const clientes = carregarClientes();

    // verifica se o tutor selecionado existe
    const clienteExiste = clientes.some(cliente => cliente.id === clienteId);

    if (!clienteExiste) {
        exibirMensagemPet("erro", "Selecione um tutor cadastrado.");
        document.getElementById("cliente-pet").focus();
        return;
    }

    // verifica se a espécie é permitida
    if (especie !== "Cão" && especie !== "Gato") {
        exibirMensagemPet("erro", "Selecione uma espécie válida.");
        document.getElementById("especie-pet").focus();
        return;
    }

    // verifica a idade
    if (!Number.isSafeInteger(idade) || idade < 0) {
        exibirMensagemPet("erro", "Informe uma idade inteira igual ou superior a zero.");
        document.getElementById("idade-pet").focus();
        return;
    }

    // verifica a unidade de idade
    if (unidadeIdade !== "meses" && unidadeIdade !== "anos") {
        exibirMensagemPet("erro", "Selecione uma unidade de idade válida.");
        document.getElementById("unidade-idade").focus();
        return;
    }

    const novoPet = {
        id: crypto.randomUUID(),
        clienteId,
        nome,
        especie,
        raca,
        idade,
        unidadeIdade,
        observacoes
    };

    // recupera os pets já cadastrados
    const pets = carregarPets();

    // adiciona e salva o novo pet
    pets.push(novoPet);
    salvarPets(pets);

    // avisa que a lista de pets foi atualizada
    window.dispatchEvent(new Event("petsAtualizados"));

    exibirMensagemPet("sucesso", "Pet cadastrado com sucesso!");

    formularioPet.reset();
});