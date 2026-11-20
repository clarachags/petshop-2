// leitura por voz

const botaoOuvir = document.getElementById("ouvir-conteudo");
const botaoPausar = document.getElementById("pausar-leitura");
const botaoParar = document.getElementById("parar-leitura");
const statusLeitura = document.getElementById("status-leitura");

// verifica se o navegador oferece suporte à leitura por voz
if ("speechSynthesis" in window) {

    let leituraAtual = null;

    botaoOuvir.addEventListener("click", function () {

        window.speechSynthesis.cancel();

        const conteudo = document.querySelector("main");

        if (!conteudo) {
            statusLeitura.textContent = "Não foi possível encontrar o conteúdo para leitura.";
            return;
        }

        leituraAtual = new SpeechSynthesisUtterance(
            conteudo.innerText
        );

        leituraAtual.lang = "pt-BR";

        // inicia a leitura
        window.speechSynthesis.speak(leituraAtual);

        statusLeitura.textContent = "Leitura iniciada.";
    });

    // pausa ou continua a leitura
    botaoPausar.addEventListener("click", function () {

        if (window.speechSynthesis.speaking &&
            !window.speechSynthesis.paused) {

            window.speechSynthesis.pause();
            botaoPausar.textContent = "Continuar leitura";
            statusLeitura.textContent = "Leitura pausada.";

        } else if (window.speechSynthesis.paused) {

            window.speechSynthesis.resume();
            botaoPausar.textContent = "Pausar leitura";
            statusLeitura.textContent = "Leitura continuada.";
        }
    });

    // encerra a leitura
    botaoParar.addEventListener("click", function () {

        window.speechSynthesis.cancel();

        leituraAtual = null;
        botaoPausar.textContent = "Pausar leitura";

        statusLeitura.textContent = "Leitura encerrada.";
    });

} else {

    // informa quando o navegador não oferece suporte
    statusLeitura.textContent =
        "Seu navegador não oferece suporte à leitura por voz.";

    botaoOuvir.disabled = true;
    botaoPausar.disabled = true;
    botaoParar.disabled = true;
}
