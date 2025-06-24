import { getPontosMonisat } from "./monisat/getPontosMonisat";
import { calcularDistancia } from "./utils/calcularDistancia";
import { CalculatedPoint } from "./utils/types";
import { getPathLength } from 'geolib';
import { length } from '@turf/turf';
import { lineString } from '@turf/helpers';
import { getDistanciaBetweenPoints } from "./index1"


export async function getPontosFiltrados(rotaId: string, distMinKm: number = 1.0) {
    type LatLng = [number, number];

    //1818205
    // https://www.google.com/maps/dir/Ituiutaba,+State+of+Minas+Gerais/Goi%C3%A2nia,+State+of+Goi%C3%A1s/Lu%C3%ADs+Eduardo+Magalhaes+-+State+of+Bahia/Auto+posto+ddd+242+-+LARANJEIRAS,+Seabra+-+State+of+Bahia/Feira+de+Santana+-+State+of+Bahia/@-15.2853692,-47.6679746,7z/data=!4m32!4m31!1m5!1m1!1s0x94a231e725c3250f:0xb7ad5532a9c14226!2m2!1d-49.4600885!2d-18.9745738!1m5!1m1!1s0x935ef6bd58d80867:0xef692bad20d2678e!2m2!1d-49.2707899!2d-16.6868491!1m5!1m1!1s0x934a7137ed5a9181:0x10823c215600d25e!2m2!1d-45.8080265!2d-12.0953041!1m5!1m1!1s0x769d7f0193bfb4d:0x4ff179e94d31a4b3!2m2!1d-41.8388446!2d-12.4195709!1m5!1m1!1s0x714378df10f9afb:0xb5f00f82796f4aa6!2m2!1d-38.9600273!2d-12.2535651!3e0?entry=ttu&g_ep=EgoyMDI1MDUwNi4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D

    //1480261
    //https://www.google.com/maps/dir/Cama%C3%A7ari,+State+of+Bahia/Balsas,+State+of+Maranh%C3%A3o/@-8.8129304,-44.3961205,8z/data=!4m14!4m13!1m5!1m1!1s0x71669db54e018a1:0xda0908d77a4e28ad!2m2!1d-38.325345!2d-12.7001932!1m5!1m1!1s0x92d5ef9625fb9fa5:0x697ed5cde68bbfe7!2m2!1d-46.0406425!2d-7.5335065!3e0?entry=ttu&g_ep=EgoyMDI1MDUwNi4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D

    //1877365
    //https://www.google.com/maps/dir/Vit%C3%B3ria+da+Conquista,+State+of+Bahia/-18.8500248,-48.2978062/Dois+Vizinhos,+State+of+Paran%C3%A1/@-19.5009302,-47.727682,7z/data=!4m40!4m39!1m10!1m1!1s0x7463b073025e405:0x78be45452bd92ae3!2m2!1d-40.8400759!2d-14.8577988!3m4!1m2!1d-48.1928394!2d-18.9268973!3s0x94a44e2fb9a94623:0xa346906ad8d9a663!1m20!3m4!1m2!1d-49.0569231!2d-18.8781224!3s0x94a3c2bdf2c811b9:0x5c26f0b8d4f99389!3m4!1m2!1d-53.1921085!2d-25.4222898!3s0x94f1ba96b68d397f:0x2af534e86ca5ed73!3m4!1m2!1d-53.2399352!2d-25.4986556!3s0x94f1ae343c646a33:0x542266922facce00!3m4!1m2!1d-53.2399352!2d-25.4986556!3s0x94f1ae343c646a33:0x542266922facce00!1m5!1m1!1s0x94f047ed43a4d2dd:0xc57179d696514a97!2m2!1d-53.0606298!2d-25.7511034!3e0?entry=ttu&g_ep=EgoyMDI1MDUwNi4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D
    const pontos = await getPontosMonisat(rotaId);
    if (!pontos) {
        console.log("err", pontos);
        return;
    }

    // Lista de pontos filtrados
    const pontosFiltrados: LatLng[] = [pontos[0]];

    for (const ponto of pontos) {
        const ultimo = pontosFiltrados[pontosFiltrados.length - 1];
        const distancia = calcularDistancia(ultimo, ponto);
        if (distancia >= distMinKm) {
            pontosFiltrados.push(ponto);
        }
    }
    const calculatedPoints: CalculatedPoint[] = [];
    pontosFiltrados.reduce((acc, ponto, index, array) => {
        if (index === 0) {
            calculatedPoints.push({ point: ponto, distance: 0 });
            return 0;
        }
        const pointDistance = calcularDistancia(array[index - 1], ponto);
        const distance = acc + pointDistance;

        calculatedPoints.push({ point: ponto, distance });

        return distance;
    }, 0) ?? 0;

    const calculatedPoints2: CalculatedPoint[] = [];
    pontos.reduce((acc, ponto, index, array) => {
        if (index === 0) {
            calculatedPoints2.push({ point: ponto, distance: 0 });
            return 0;
        }
        const pointDistance = calcularDistancia(array[index - 1], ponto);
        const distance = acc + pointDistance;

        calculatedPoints2.push({ point: ponto, distance });

        return distance;
    }, 0) ?? 0;

    console.log("Distancia menor entre pontos calculado filtrado: ", await getDistanciaBetweenPoints(pontosFiltrados));
    console.log("Distancia menor entre pontos calculado: ", await getDistanciaBetweenPoints(pontos));
    console.log()

    console.log("Distância origem destino calculado filtrado: ", calculatedPoints[calculatedPoints.length - 1].distance);
    console.log("Distância origem destino calculado: ", calculatedPoints2[calculatedPoints2.length - 1].distance);

    //     console.log()

    //     console.log("Distância origem destino geolib filtrado: ",  getPathLength(pontosFiltrados.map(c => {return   { latitude: c[0], longitude: c[1] }}))/1000);
    //     console.log("Distância origem destino geolib: ", getPathLength(pontos.map(c => {return   { latitude: c[0], longitude: c[1] }}))/1000);


    // const linha = lineString(pontosFiltrados);
    // const distanciaKm = length(linha, { units: 'kilometers' });

    //     console.log()

    // console.log("Distância origem destino turf filtrado: ",  distanciaKm);

    // const linha2 = lineString(pontos);
    // const distanciaKm2 = length(linha2, { units: 'kilometers' });
    // console.log("Distância origem destino turf: ", distanciaKm2);


    // Mostrar o resultado
    return pontosFiltrados;

}
// getPontosFiltrados("1877365")
type Posto = {
    posto: string;
    precoLitro: number;
    distanciaOrigem: number;
    index: number;
    cnpj?: string;
    seq_fornecedor?: number;
    idItem?: string;
};
type Abastecimento = {
    kmAbastecimento: number;
    litros: number;
    preco: number;
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
].map((posto, index) => ({
        index,
        ...posto
    }));

    const qtdNecessariaAbastecer = Math.ceil(distanciaViagem / consumoMedio - capacidadeEfetivaTanque);
    // console.log("Quantidade necessária para abastecer:", qtdNecessariaAbastecer, "litros");
    // return;
    if (qtdNecessariaAbastecer <= 0) {
        return;
    }
    const listaPostoPorMenorPreco = listaPostosPorDistancia.sort((a, b) => a.precoLitro - b.precoLitro);
    const abastecimentos: Abastecimento[] = [];
    const sucesso = calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, 0, abastecimentos);
    // console.log("Abastecimentos realizados:", sucesso, abastecimentos);
    console.log("Necessita abastecer:", qtdNecessariaAbastecer, "litros");
    console.log("Abasteceu:", abastecimentos.reduce((total, a) => total + a.litros, 0), "litros");
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
    let litrosTanqueNoPosto = getLitrosTanqueNoPosto(postoAtual, abastecimentos);

    if (litrosTanqueNoPosto >= capacidadeEfetivaTanque) {
        // Já temos litros suficientes no tanque, não podemos abastecer neste posto, tentar o próximo mais barato
        return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, indexAtual + 1, abastecimentos);
    }

    if (litrosTanqueNoPosto < 0) {
        // realizar backup dos abastecimentos caso não consiga abastecer        
        const backupAbastecimentos = JSON.parse(JSON.stringify(abastecimentos));
        //abastecer em um posto com distancia menor que o atual para ter diesel para chegar nele
        const sucesso = calcularAbastecimento(-litrosTanqueNoPosto, listaPostoPorMenorPreco.filter(p => p.distanciaOrigem < postoAtual.distanciaOrigem), 0, abastecimentos);
        if (sucesso) {
            qtdNecessariaAbastecer -= -litrosTanqueNoPosto; // Atualiza a quantidade necessária para abastecer
            litrosTanqueNoPosto = 0;
        } else {
            return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, indexAtual + 1, backupAbastecimentos);
        }
    }

    const qtdAbastecer = Math.ceil(
        Math.min(qtdNecessariaAbastecer, capacidadeEfetivaTanque - litrosTanqueNoPosto)
    );


    // Atualiza a quantidade necessária para abastecer
    console.log(`Abastecido ${qtdAbastecer} litros no posto ${postoAtual.posto} (${postoAtual.distanciaOrigem} km) a R$ ${postoAtual.precoLitro.toFixed(2)} por litro.`);
    console.log(`Total abastecido: ${abastecimentos.reduce((total, a) => total + a.litros, 0)} litros.`);
    console.log(`QTD necessária para abastecer: ${qtdNecessariaAbastecer} litros.`);
    console.log('-----------------------------------');
    abastecimentos.push({
        posto: postoAtual,
        kmAbastecimento: postoAtual.distanciaOrigem,
        litros:qtdAbastecer,
        preco: qtdAbastecer * postoAtual.precoLitro
    });
    qtdNecessariaAbastecer -= qtdAbastecer;

    // Chama recursivamente para o próximo posto
    // return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, indexAtual + 1, abastecimentos);

    return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco.filter(p => p.distanciaOrigem > postoAtual.distanciaOrigem), 0, abastecimentos);

}
function getLitrosTanqueNoPosto(postoAtual: Posto, abastecimentos: Abastecimento[]): number {
    const abastecimentoAteKm = abastecimentos.filter(a => a.kmAbastecimento <= postoAtual.distanciaOrigem).reduce((total, a) => total + a.litros, 0);
    const litrosNoTanque = capacidadeEfetivaTanque + abastecimentoAteKm - (postoAtual.distanciaOrigem / consumoMedio);
    return litrosNoTanque;
}