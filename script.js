/* script.js - Código Final (Trabalho III - Momento II) */

// =======================================================
// REGRA 1: TODOS OS CAMPOS SÃO OBRIGATÓRIOS (VERIFICAÇÃO JS)
// =======================================================
function validarCamposVazios(event) {
    const form = event.target;
    // Seleciona todos os campos em que o usuário digita/escolhe algo (ignora botões e checkboxes)
    const campos = form.querySelectorAll('input:not([type="submit"]):not([type="reset"]):not([type="button"]):not([type="radio"]):not([type="checkbox"]), select, textarea');

    for (let i = 0; i < campos.length; i++) {
        if (campos[i].value.trim() === '') {
            alert("ATENÇÃO (Regra do Sistema): Todos os campos do formulário são obrigatórios! Por favor, preencha o campo vazio.");
            campos[i].focus();      // Coloca o cursor piscando no campo vazio
            event.preventDefault(); // Impede o envio do formulário
            return false;
        }
    }
    return true; // Se passar por todos e nenhum estiver vazio, continua.
}

// =======================================================
// REGRA 2: VALIDAÇÕES ESPECÍFICAS DE CLIENTE
// =======================================================
function validarFormularioCliente(event) {
    const nome = document.querySelector('input[name="nome"]').value;
    const documento = document.getElementById("cpf").value;
    const dataNasc = document.getElementById("nasc").value;
    const telefone = document.getElementById("tel").value;
    const email = document.getElementById("email").value;

    // Regra 2.a: O nome deve ter pelo menos duas palavras
    if (nome) {
        // Separa o texto pelos espaços
        const palavrasNome = nome.trim().split(/\s+/);
        if (palavrasNome.length < 2) {
            alert("Erro: O campo de nome deve conter pelo menos duas palavras (nome e sobrenome).");
            event.preventDefault();
            return false;
        }
    }

    // Regra 2.b: A data de nascimento deve ser anterior à data atual
    if (dataNasc) {
        // T00:00:00 garante que o fuso horário não vai atrapalhar o dia
        const dataInformada = new Date(dataNasc + "T00:00:00");
        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0); // Zera a hora atual para comparar só os dias

        if (dataInformada >= dataAtual) {
            alert("Erro: A data de nascimento informada deve ser estritamente anterior à data de hoje.");
            event.preventDefault();
            return false;
        }
    }

    // Regra 2.c: Validação 'não oficial' de CPF/CNPJ (Soma = 2 últimos)
    if (documento) {
        let docLimpo = documento.replace(/\D/g, ''); // Remove traços e pontos

        if (docLimpo.length !== 11 && docLimpo.length !== 14) {
            alert("Erro: O documento deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ).");
            event.preventDefault();
            return false;
        }

        let soma = 0;
        let quantidadeParaSomar = docLimpo.length - 2; // Pega tudo, menos os 2 últimos

        for (let i = 0; i < quantidadeParaSomar; i++) {
            soma += parseInt(docLimpo.charAt(i));
        }

        let ultimosDigitos = parseInt(docLimpo.substring(quantidadeParaSomar));

        if (soma !== ultimosDigitos) {
            alert(`Erro no CPF/CNPJ (Regra não oficial): A soma dos primeiros números (${soma}) deve ser igual aos dois últimos dígitos (${ultimosDigitos}).`);
            event.preventDefault();
            return false;
        }
    }

    // Regra 2.d: O telefone deve possuir 9 dígitos (com ou sem hífen no 5º)
    if (telefone) {
        // RegEx que aceita exatos 5 números, um hífen opcional, e 4 números.
        const regexTel = /^\d{5}-?\d{4}$/;
        if (!regexTel.test(telefone)) {
            alert("Erro: O telefone deve possuir 9 dígitos. Exemplos válidos: 98745-8855 ou 987458855.");
            event.preventDefault();
            return false;
        }
    }

    // Regra 2.e: E-mail deve possuir @ e . depois do @
    if (email) {
        const posArroba = email.indexOf('@');
        const posPonto = email.indexOf('.', posArroba); // Procura o ponto DEPOIS do @

        if (posArroba < 1 || posPonto < posArroba + 2) {
            alert("Erro: O e-mail informado deve possuir '@' e conter um '.' depois do '@'.");
            event.preventDefault();
            return false;
        }
    }

    return true;
}

// =======================================================
// REGRA 3: ESTADO E CIDADE DINÂMICOS
// =======================================================
const cidadesPorEstado = {
    "SP": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba"],
    "RJ": ["Rio de Janeiro", "Niterói", "Petrópolis", "Cabo Frio", "Búzios"],
    "MG": ["Belo Horizonte", "Uberlândia", "Araguari", "Juiz de Fora", "Ouro Preto"],
    "PR": ["Curitiba", "Londrina", "Ponta Grossa", "Maringá", "Foz do Iguaçu"]

};

function atualizarCidades() {
    const estadoSelect = document.getElementById("estado");
    const cidadeSelect = document.getElementById("cidade");

    if (!estadoSelect || !cidadeSelect) return;

    const estadoEscolhido = estadoSelect.value;

    // Limpa cidades antigas
    cidadeSelect.innerHTML = '<option value="">Selecione uma cidade...</option>';

    if (estadoEscolhido && cidadesPorEstado[estadoEscolhido]) {
        let cidades = cidadesPorEstado[estadoEscolhido];
        for (let i = 0; i < cidades.length; i++) {
            let option = document.createElement("option");
            option.value = cidades[i];
            option.text = cidades[i];
            cidadeSelect.appendChild(option);
        }
    }
}

// =======================================================
// REGRA 4: FORMULÁRIO DE VENDAS DINÂMICO (Adicionar Itens)
// =======================================================
let contadorItens = 1;

function adicionarItemVenda() {
    contadorItens++;
    const listaItens = document.getElementById("lista-itens");

    if (!listaItens) return;

    const novoItem = document.createElement("div");
    novoItem.className = "item-compra";

    // Cria a nova linha do item
    novoItem.innerHTML = `
        <h4>Item ${contadorItens}</h4>
        <label>Código ISBN do Livro:</label><br>
        <input type="number" name="isbn_livro[]" placeholder="Digite os 13 dígitos"><br><br>

        <label>Quantidade:</label><br>
        <input type="number" name="qtd[]" min="1" max="50" value="1"><br><br>
        
        <label>Desconto Autorizado pela Gerência (%):</label><br>
        <input type="number" name="desconto[]" min="0" max="100" value="0">
        <br><br>
        <button type="button" class="btn-remover-item">Remover Item</button>
    `;

    listaItens.appendChild(novoItem);

    // Ativa o botão de "Remover" que acabou de ser criado
    const botaoRemover = novoItem.querySelector(".btn-remover-item");
    botaoRemover.addEventListener("click", function () {
        listaItens.removeChild(novoItem);
    });
}

// =======================================================
// 5. GATILHOS (Liga o HTML com as funções do JavaScript)
// =======================================================
document.addEventListener("DOMContentLoaded", function () {

    // Varre todos os formulários da página
    const formularios = document.querySelectorAll("form");

    formularios.forEach(form => {
        form.addEventListener("submit", function (event) {
            // PASSO 1: Verifica os campos vazios (Regra 1 em todos os formulários)
            if (!validarCamposVazios(event)) {
                return; // Para o código aqui se tiver campo vazio
            }

            // PASSO 2: Se for o formulário de cliente, roda as 5 regras extras (Regra 2)
            if (form.id === "form-cliente") {
                if (!validarFormularioCliente(event)) {
                    return; // Para o código se o CPF, Nome ou Data estiverem errados
                }
            }

            // PASSO 3: Se for o formulário de vendas, valida a forma de pagamento
            if (form.id === "form-venda") {
                const radioPag = form.querySelector('input[name="forma_pag"]:checked');
                if (!radioPag) {
                    alert("ATENÇÃO: Selecione uma forma de pagamento antes de finalizar a venda.");
                    event.preventDefault();
                    return;
                }
            }

            alert("Formulário validado com sucesso pelo JavaScript!");
        });
    });

    // Gatilho para a Regra 3 (Estado e Cidade)
    const estadoSelect = document.getElementById("estado");
    if (estadoSelect) {
        estadoSelect.addEventListener("change", atualizarCidades);
    }

    // Gatilho para a Regra 4 (Adicionar Item Venda)
    const btnAdicionar = document.getElementById("btn-adicionar-item");
    if (btnAdicionar) {
        btnAdicionar.addEventListener("click", adicionarItemVenda);
    }
});