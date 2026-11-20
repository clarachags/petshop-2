// agendamento de serviços

// recupera os agendamentos armazenados
function carregarAgendamentos() {
    return JSON.parse(localStorage.getItem("agendamentos")) || [];
}

// salva os agendamentos no localStorage
function salvarAgendamentos(agendamentos) {
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
}

function obterDataAtualAgendamento() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

// converte um horário HH:MM em minutos
function converterHorarioEmMinutos(horario) {
    const [hora, minuto] = horario.split(":").map(Number);

    return hora * 60 + minuto;
}

// verifica se o horário está dentro do funcionamento
function horarioDentroDoFuncionamento(horario) {
    const minutos = converterHorarioEmMinutos(horario);

    return minutos >= 540 && minutos <= 1080;
}

// verifica se a data é válida e não corresponde a um domingo
function validarDataAgendamento(data) {
    const [ano, mes, dia] = data.split("-").map(Number);

    const dataEscolhida = new Date(ano, mes - 1, dia);

    // impede datas inexistentes
    if (
        dataEscolhida.getFullYear() !== ano ||
        dataEscolhida.getMonth() !== mes - 1 ||
        dataEscolhida.getDate() !== dia
    ) {
        return false;
    }

    // impede datas anteriores ao dia atual
    if (data < obterDataAtualAgendamento()) {
        return false;
    }

    // impede agendamentos aos domingos
    if (dataEscolhida.getDay() === 0) {
        return false;
    }

    return true;
}

// carrega os clientes no formulário
function atualizarClientesAgendamento() {
    const campoCliente = document.getElementById("cliente-agendamento");
    const clientes = carregarClientes();

    campoCliente.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione o cliente";

    campoCliente.appendChild(opcaoInicial);

    clientes.forEach(cliente => {
        const opcao = document.createElement("option");

        opcao.value = cliente.id;
        opcao.textContent = cliente.nome;

        campoCliente.appendChild(opcao);
    });
}

// carrega somente os pets pertencentes ao cliente selecionado
function atualizarPetsAgendamento() {
    const clienteId = document.getElementById("cliente-agendamento").value;
    const campoPet = document.getElementById("pet-agendamento");

    const pets = carregarPets();

    campoPet.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione o pet";

    campoPet.appendChild(opcaoInicial);

    const petsDoCliente = pets.filter(pet => pet.clienteId === clienteId);

    if (!clienteId || petsDoCliente.length === 0) {
        const opcaoVazia = document.createElement("option");

        opcaoVazia.value = "";
        opcaoVazia.textContent = "Nenhum pet cadastrado para este cliente";
        opcaoVazia.disabled = true;

        campoPet.appendChild(opcaoVazia);
        campoPet.disabled = true;

        return;
    }

    petsDoCliente.forEach(pet => {
        const opcao = document.createElement("option");

        opcao.value = pet.id;
        opcao.textContent = pet.nome;

        campoPet.appendChild(opcao);
    });

    campoPet.disabled = false;
}

// exibe ou oculta os campos de tele-busca
function atualizarModalidadeAgendamento() {
    const teleBusca = document.getElementById("tele-busca");
    const dadosTelebusca = document.getElementById("dados-telebusca");

    const endereco = document.getElementById("endereco-telebusca");
    const horario = document.getElementById("horario-telebusca");

    const teleBuscaSelecionada = teleBusca.checked;

    dadosTelebusca.hidden = !teleBuscaSelecionada;

    endereco.disabled = !teleBuscaSelecionada;
    endereco.required = teleBuscaSelecionada;

    horario.disabled = !teleBuscaSelecionada;
    horario.required = teleBuscaSelecionada;
}

function exibirMensagemAgendamento(tipo, mensagem) {
    const erro = document.getElementById("erro-agendamento");
    const sucesso = document.getElementById("sucesso-agendamento");

    erro.textContent = "";
    sucesso.textContent = "";

    if (tipo === "erro") {
        erro.textContent = mensagem;
    } else if (tipo === "sucesso") {
        sucesso.textContent = mensagem;
    }
}

// verifica se dois serviços ocupam algum período em comum
function existeConflitoAgendamento(data, inicio, fim) {
    const agendamentos = carregarAgendamentos();

    return agendamentos.some(agendamento => {
        if (agendamento.data !== data) {
            return false;
        }

        const inicioExistente = converterHorarioEmMinutos(agendamento.horario);
        const fimExistente = converterHorarioEmMinutos(agendamento.horarioFim);

        return inicio < fimExistente && fim > inicioExistente;
    });
}

const formularioAgendamento = document.getElementById("form-agendamento");
const campoClienteAgendamento = document.getElementById("cliente-agendamento");
const campoDataAgendamento = document.getElementById("data-agendamento");
const campoHorarioAgendamento = document.getElementById("horario-agendamento");

// define a data mínima como o dia atual
campoDataAgendamento.min = obterDataAtualAgendamento();

// carrega os clientes ao abrir a página
atualizarClientesAgendamento();

// atualiza a lista quando um novo cliente é cadastrado
window.addEventListener("clientesAtualizados", atualizarClientesAgendamento);

// prepara a seleção de pets ao abrir a página
atualizarPetsAgendamento();

// atualiza os pets quando o cliente muda
campoClienteAgendamento.addEventListener("change", atualizarPetsAgendamento);

// atualiza os pets quando um novo cadastro é realizado
window.addEventListener("petsAtualizados", atualizarPetsAgendamento);

// atualiza os campos quando a modalidade muda
document.querySelectorAll('input[name="modalidade"]').forEach(opcao => {
    opcao.addEventListener("change", atualizarModalidadeAgendamento);
});

formularioAgendamento.addEventListener("submit", function (event) {
    event.preventDefault();

    exibirMensagemAgendamento("", "");

    if (!formularioAgendamento.checkValidity()) {
        formularioAgendamento.reportValidity();
        return;
    }

    const clienteId = campoClienteAgendamento.value;
    const petId = document.getElementById("pet-agendamento").value;
    const servico = document.getElementById("servico-agendamento").value;
    const data = campoDataAgendamento.value;
    const horario = campoHorarioAgendamento.value;

    const modalidade = document.querySelector(
        'input[name="modalidade"]:checked'
    ).value;

    const endereco = document.getElementById("endereco-telebusca").value.trim();
    const horarioTelebusca = document.getElementById("horario-telebusca").value;

    // confirma que o cliente existe
    const clientes = carregarClientes();

    const clienteExiste = clientes.some(cliente => cliente.id === clienteId);

    if (!clienteExiste) {
        exibirMensagemAgendamento("erro", "Selecione um cliente cadastrado.");
        campoClienteAgendamento.focus();
        return;
    }

    // confirma que o pet pertence ao cliente
    const pets = carregarPets();

    const petExiste = pets.some(pet =>
        pet.id === petId && pet.clienteId === clienteId
    );

    if (!petExiste) {
        exibirMensagemAgendamento("erro", "Selecione um pet pertencente ao cliente.");
        document.getElementById("pet-agendamento").focus();
        return;
    }
    
    // valida a data
    if (!validarDataAgendamento(data)) {
        exibirMensagemAgendamento(
            "erro",
            "Escolha uma data válida, de segunda a sábado, sem datas passadas."
        );

        campoDataAgendamento.focus();
        return;
    }

    // valida o horário de início
    const inicio = converterHorarioEmMinutos(horario);
    const duracaoServico = 90;
    const fim = inicio + duracaoServico;

    if (
        inicio < 540 ||
        inicio > 990 ||
        inicio % 30 !== 0 ||
        fim > 1080
    ) {
        exibirMensagemAgendamento(
            "erro",
            "Escolha um horário de início entre 09h e 16h30, em intervalos de 30 minutos."
        );

        campoHorarioAgendamento.focus();
        return;
    }

    // verifica conflitos com outros serviços
    if (existeConflitoAgendamento(data, inicio, fim)) {
        exibirMensagemAgendamento(
            "erro",
            "Este horário está ocupado. Escolha outro horário."
        );

        campoHorarioAgendamento.focus();
        return;
    }

    // verifica a modalidade
    if (modalidade !== "Cliente levará o pet" && modalidade !== "Tele-busca") {
        exibirMensagemAgendamento("erro", "Selecione uma modalidade válida.");
        return;
    }

    // valida os dados da tele-busca
    if (modalidade === "Tele-busca") {
        if (!endereco) {
            exibirMensagemAgendamento("erro", "Informe o endereço para a tele-busca.");
            document.getElementById("endereco-telebusca").focus();
            return;
        }

        const horarioBusca = converterHorarioEmMinutos(horarioTelebusca);

        if (
            !horarioDentroDoFuncionamento(horarioTelebusca) ||
            horarioBusca >= inicio
        ) {
            exibirMensagemAgendamento(
                "erro",
                "A tele-busca deve ocorrer entre 09h e 18h e antes do início do serviço."
            );

            document.getElementById("horario-telebusca").focus();
            return;
        }
    }

    const novoAgendamento = {
        id: crypto.randomUUID(),
        clienteId,
        petId,
        servico,
        data,
        horario,
        horarioFim: `${String(Math.floor(fim / 60)).padStart(2, "0")}:${String(fim % 60).padStart(2, "0")}`,
        modalidade,
        endereco: modalidade === "Tele-busca" ? endereco : "",
        horarioTelebusca: modalidade === "Tele-busca" ? horarioTelebusca : ""
    };

    // salva o agendamento
    const agendamentos = carregarAgendamentos();

    agendamentos.push(novoAgendamento);
    salvarAgendamentos(agendamentos);

    exibirMensagemAgendamento(
        "sucesso",
        "Agendamento realizado com sucesso!"
    );

    formularioAgendamento.reset();
    atualizarPetsAgendamento();
    atualizarModalidadeAgendamento();
});
