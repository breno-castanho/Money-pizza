document.addEventListener('DOMContentLoaded', (event) => {
    let transacoes = [];
    let pieChart1, pieChart2;

    // Inicializa o Cleave.js no campo de valor
    new Cleave('#precoGasto', {
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        prefix: 'R$ ',
        numeralDecimalMark: ',',
        delimiter: '.',
        numeralDecimalScale: 2,
        onValueChanged: function (e) {
            document.getElementById('precoGasto').value = e.formattedValue;
        }
    });

    const labels = ['Transporte', 'Alimentação', 'Economias', 'Gastos Fixos', 'Atividades e Bem Estar', 'Livre'];
    const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',  // Vermelho
        'rgba(75, 255, 75, 0.6)',  // Verde
        'rgba(255, 204, 0, 0.6)',  // Amarelo Forte
        'rgba(139, 69, 19, 0.6)',   // Marrom
        'rgba(153, 102, 255, 0.6)', // Roxo
        'rgba(54, 162, 235, 0.6)'   // Azul claro
    ];

    // Função para adicionar transação
    window.adicionarTransacao = function adicionarTransacao() {
        const nome = document.getElementById('nome').value;
        const precoGasto = document.getElementById('precoGasto').value; // Captura o valor digitado
        const setor = document.getElementById('setor').value;
        const tipo = document.getElementById('tipo').value;
        const data = document.getElementById('data').value;

        // Adiciona a transação ao array
        transacoes.push({ nome, precoGasto, setor, tipo, data });

        // Adiciona a linha na tabela
        const tabelaTransacoes = document.getElementById('tabela-transacoes').getElementsByTagName('tbody')[0];
        const novaLinha = tabelaTransacoes.insertRow();
        novaLinha.insertCell(0).textContent = nome;
        novaLinha.insertCell(1).textContent = precoGasto; // Exibe o valor corretamente
        novaLinha.insertCell(2).textContent = setor;
        novaLinha.insertCell(3).textContent = tipo;
        novaLinha.insertCell(4).textContent = data;

        // Limpa os campos de entrada
        document.getElementById('nome').value = '';
        document.getElementById('precoGasto').value = ''; // Limpa corretamente o valor
        document.getElementById('setor').value = 'Transporte'; // Reset para o primeiro setor
        document.getElementById('tipo').value = 'Entrada'; // Reset para entrada
        document.getElementById('data').value = '';

        // Atualiza os gráficos
        atualizarGraficos();
    }

    // Função para atualizar gráficos
    function atualizarGraficos() {
        const idealDados = [15, 30, 10, 25, 10, 10]; // Porcentagens para o gráfico ideal
        const realDados = [0, 0, 0, 0, 0, 0]; // Inicializa os dados reais

        transacoes.forEach(transacao => {
            const valor = parseFloat(transacao.precoGasto.replace('R$ ', '').replace('.', '').replace(',', '.'));
            const setorIndex = labels.indexOf(transacao.setor);

            if (transacao.tipo === "Saída") {
                realDados[setorIndex] += valor;
            } else if (transacao.tipo === "Entrada") {
                realDados[2] += valor; // Considera economias como entradas
            }
        });

        // Atualiza o gráfico ideal
        const ctx1 = document.getElementById('pie-chart-ideal').getContext('2d');
        if (pieChart1) {
            pieChart1.destroy(); // Destrói o gráfico existente antes de criar um novo
        }
        pieChart1 = new Chart(ctx1, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gastos (%) - Ideal',
                    data: idealDados,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Gastos - Ideal'
                    }
                }
            }
        });

        // Atualiza o gráfico real
        const ctx2 = document.getElementById('pie-chart-real').getContext('2d');
        if (pieChart2) {
            pieChart2.destroy(); // Destrói o gráfico existente antes de criar um novo
        }
        pieChart2 = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gastos (%) - Real',
                    data: realDados,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Gastos - Real'
                    }
                }
            }
        });
    }

    // Inicializa os gráficos
    atualizarGraficos();
});
