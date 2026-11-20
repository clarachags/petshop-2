// função temporal que indica se estabelecimento está fechado ou aberto

function atualizarHorarioFuncionamento() {
    const mensagem = document.getElementById("mensagem-funcionamento");

    const agora = new Date();

    const diaSemana = agora.getDay();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();

    const horarioAtual = hora * 60 + minutos;

    const abertura = 9 * 60;
    const fechamento = 18 * 60;

   if (diaSemana === 0) {
        mensagem.textContent = "Fechado hoje. Voltamos na segunda-feira às 09h.";
        mensagem.className = "fechado";
        return;
    }

    if (horarioAtual >= abertura && horarioAtual < fechamento) {
        mensagem.textContent = "Estamos abertos! Nosso atendimento vai até às 18h.";
        mensagem.className = "aberto";
    } else if (horarioAtual < abertura) {
        mensagem.textContent = "Estamos fechados. Abriremos às 09h.";
        mensagem.className = "fechado";
    } else {
        mensagem.textContent = "Estamos fechados. Voltamos amanhã às 09h.";
        mensagem.className = "fechado";
    }
}

atualizarHorarioFuncionamento();
setInterval(atualizarHorarioFuncionamento, 60000);
