type Posto = {
    /** Necessarios para o cálculo */
    precoLitro: number;
    distanciaOrigem: number;

    /** Necessarios para identificação do posto */
    posto?: string;
    cnpj?: string;
    seq_fornecedor?: number;
    idItem?: string;
};
type Abastecimento = {
    // em qual KM do percurso foi realizado o abastecimento
    km: number;
    // Quantidade de litros abastecidos
    litros: number;
    // Preço total do abastecimento
    preco: number;
    // Posto onde foi realizado o abastecimento
    posto: Posto;
};
const capacidadeTanque = 840;
const margemSeguranca = 126;
const consumoMedio = 1.5; // Consumo médio em litros por km
const distanciaViagem = 3190; // Distância total da viagem em km
const capacidadeEfetivaTanque = capacidadeTanque - margemSeguranca;

function main() {
    console.time('tempo-script');

    const listaPostosPorDistancia: Posto[] = [
        {
            posto: 'BASE JUNDIAI',
            distanciaOrigem: 130,
            precoLitro: 5.66,
        },
        {
            posto: 'POSTO HG QUILOMETRAGEM',
            distanciaOrigem: 835,
            precoLitro: 6.05,
        },
        {
            posto: 'POSTO HG MOC',
            distanciaOrigem: 1180,
            precoLitro: 6.05,
        },
        {
            posto: 'REDE HG SAO MARCOS',
            distanciaOrigem: 1650,
            precoLitro: 5.86,
        },
        {
            posto: 'POSTO SAO GONÇALO 4',
            distanciaOrigem: 2050,
            precoLitro: 5.99,
        },
        {
            posto: 'POSTO PORTAL DA BAHIA 2',
            distanciaOrigem: 2205,
            precoLitro: 6.00,
        },
        {
            posto: 'POSTO SANTO ANTONIO',
            distanciaOrigem: 2830,
            precoLitro: 6.24,
        },
    ];

    const qtdNecessariaAbastecer = Math.ceil(distanciaViagem / consumoMedio - capacidadeEfetivaTanque);
    if (qtdNecessariaAbastecer <= 0) {
        return;
    }
    const listaPostoPorMenorPreco = listaPostosPorDistancia.sort((a, b) => a.precoLitro - b.precoLitro);
    const abastecimentos: Abastecimento[] = [];
    const sucesso = calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, 0, abastecimentos);
    console.log("Abastecimentos realizados:", abastecimentos);
    console.log("Necessita abastecer:", qtdNecessariaAbastecer, "litros");
    console.log("Abasteceu:", abastecimentos.reduce((total, a) => total + a.litros, 0), "litros");
    console.log("Abasteceu o suficiente? ", sucesso ? "Sim" : "Não");

    console.timeEnd('tempo-script');

}
main()

function calcularAbastecimento(qtdNecessariaAbastecer: number, listaPostoPorMenorPreco: Posto[], indexAtual: number, abastecimentos: Abastecimento[]): boolean {
    if (qtdNecessariaAbastecer <= 0) {
        return true; // Já abastecemos o suficiente
    }
    if (indexAtual >= listaPostoPorMenorPreco.length) {
        return false; // Não há mais postos para abastecer
    }

    // posto mais barato
    const postoAtual = listaPostoPorMenorPreco[indexAtual];
    // quantidade de litros no tanque ao chegar no posto
    let litrosTanqueNoPosto = getLitrosTanqueNoPosto(postoAtual.distanciaOrigem, abastecimentos);

    if (litrosTanqueNoPosto >= capacidadeEfetivaTanque) {
        // Já temos litros suficientes no tanque, não podemos abastecer neste posto, tentar o próximo mais barato
        return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, indexAtual + 1, abastecimentos);
    }

    if (litrosTanqueNoPosto < 0) {
        // abastecer em um posto com distancia menor que o atual para ter diesel para chegar nele
        const sucesso = calcularAbastecimento(-litrosTanqueNoPosto, listaPostoPorMenorPreco.filter(p => p.distanciaOrigem < postoAtual.distanciaOrigem), 0, abastecimentos);
        if (sucesso) {
            qtdNecessariaAbastecer -= -litrosTanqueNoPosto; // Atualiza a quantidade necessária para abastecer
            litrosTanqueNoPosto = 0;
        } else {
            return false; // Não foi possível abastecer o suficiente para chegar ao próximo posto
        }
    }

    // Calcula a quantidade de litros que podemos abastecer neste posto
    const qtdAbastecer = Math.ceil(
        Math.min(qtdNecessariaAbastecer, capacidadeEfetivaTanque - litrosTanqueNoPosto)
    );


    // Criar o abastecimento
    abastecimentos.push({
        posto: postoAtual,
        km: postoAtual.distanciaOrigem,
        litros: qtdAbastecer,
        preco: qtdAbastecer * postoAtual.precoLitro
    });
    qtdNecessariaAbastecer -= qtdAbastecer;

    // Chama recursivamente o próximo posto mais barato, filtrando os postos anteriores ao atual
    return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco.filter(p => p.distanciaOrigem > postoAtual.distanciaOrigem), 0, abastecimentos);

}
// Calcula a quantidade de litros no tanque ao chegar no posto
function getLitrosTanqueNoPosto(distanciaOrigem: number, abastecimentos: Abastecimento[]): number {
    const abastecimentoAteKm = abastecimentos.filter(a => a.km <= distanciaOrigem).reduce((total, a) => total + a.litros, 0);
    return capacidadeEfetivaTanque + abastecimentoAteKm - (distanciaOrigem / consumoMedio);
}