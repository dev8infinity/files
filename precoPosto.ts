const capacidadeTanque = 800;
const margemSeguranca = 120;
const consumoMedio = 2; // Consumo médio em litros por km
const distanciaViagem = 3000; // Distância total da viagem em km

type Posto = {
    posto: string;
    precoLitro: number;
    distanciaOrigem: number;
    index: number;
};
type Abastecimento = {
    indexPosto: number;
    litros: number;
    preco: number;
};

const listaPostosPorDistancia: Posto[] = [
    { posto: 'Posto A', precoLitro: 4.5, distanciaOrigem: 100, index: 0 },
    { posto: 'Posto B', precoLitro: 4.2, distanciaOrigem: 200, index: 1 },
    { posto: 'Posto C', precoLitro: 4.8, distanciaOrigem: 300, index: 2 },
    { posto: 'Posto D', precoLitro: 4.0, distanciaOrigem: 400, index: 3 }
]

const capacidadeEfetivaTanque = capacidadeTanque - margemSeguranca;
let qtdNecessariaAbastecer = distanciaViagem - capacidadeEfetivaTanque * consumoMedio;
if (qtdNecessariaAbastecer <= 0) {
    return;
}
const listaPostoPorMenorPreco = listaPostosPorDistancia.sort((a, b) => b.precoLitro - a.precoLitro);

function calcularAbastecimento(qtdNecessariaAbastecer: number, listaPostosPorDistancia: Posto[], listaPostoPorMenorPreco: Posto[], indexAtual = 0, abastecimentos: Abastecimento[] = []): boolean {
    if (qtdNecessariaAbastecer <= 0) {
        return true; // Já abastecemos o suficiente
    }
    if (indexAtual >= listaPostoPorMenorPreco.length) {
        return false; // Não há mais postos para abastecer
    }

    const postoAtual = listaPostoPorMenorPreco[indexAtual];
    let litrosTanqueNoPosto = getLitrosTanqueNoPosto(postoAtual, listaPostosPorDistancia);
    
    if(litrosTanqueNoPosto >= capacidadeEfetivaTanque) {
        // Já temos litros suficientes no tanque, não podemos abastecer neste posto
        return calcularAbastecimento(qtdNecessariaAbastecer, listaPostosPorDistancia, listaPostoPorMenorPreco, indexAtual + 1, abastecimentos);
    }

    if (litrosTanqueNoPosto < 0) {
        //abastecer em um posto com distancia menor que o atual
        const backupAbastecimentos = JSON.parse(JSON.stringify(abastecimentos));
        const sucesso = calcularAbastecimento(capacidadeEfetivaTanque - litrosTanqueNoPosto, listaPostosPorDistancia, listaPostoPorMenorPreco.filter(p => p.distanciaOrigem < postoAtual.distanciaOrigem), 0, abastecimentos);
        if(sucesso) {
            litrosTanqueNoPosto = 0;
        } else {
            return calcularAbastecimento(qtdNecessariaAbastecer, listaPostosPorDistancia, listaPostoPorMenorPreco, indexAtual + 1, backupAbastecimentos);
        }
    }

    const qtdAbastecer = Math.min(qtdNecessariaAbastecer, capacidadeEfetivaTanque - litrosTanqueNoPosto);
    abastecimentos.push({
        posto: postoAtual.nome,
        litros: qtdAbastecer,
        preco: postoAtual.preco
    });

    // Atualiza a quantidade necessária para abastecer
    qtdNecessariaAbastecer -= qtdAbastecer;

    // Chama recursivamente para o próximo posto
    return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, indexAtual + 1, abastecimentos);

}
function getLitrosTanqueNoPosto(postoAtual: Posto, listaPostosPorDistancia: Posto[]): number {
    //
    return 0;
}
