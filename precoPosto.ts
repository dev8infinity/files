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
const kmDeFuga = 300; // Quantidade de km que o caminhão pode percorrer após o abastecimento
const distanciaViagem = 2890 + kmDeFuga; // Distância total da viagem em km
const capacidadeEfetivaTanque = capacidadeTanque - margemSeguranca;
const listaPostos: Posto[] =  [
              {
                "seq_fornecedor": 3183,
                "precoLitro": "5.66",
                "cnpj": "20415295001901",
                "idItem": "28",
                "distanciaOrigem": "130",
                "posto": "BASE JUNDIAI | JUNDIAI | SP"
              },
              {
                "seq_fornecedor": 3184,
                "precoLitro": "6.05",
                "cnpj": "20415295002380",
                "idItem": "28",
                "distanciaOrigem": "835",
                "posto": "POSTO HG QUILOMETRAGEM | CURVELO | MG"
              },
              {
                "seq_fornecedor": 3185,
                "precoLitro": "6.05",
                "cnpj": "20415295002967",
                "idItem": "28",
                "distanciaOrigem": "1180",
                "posto": "POSTO HG MOC | MONTES CLAROS | MG"
              },
              {
                "seq_fornecedor": 3186,
                "precoLitro": "5.86",
                "cnpj": "20415295003501",
                "idItem": "28",
                "distanciaOrigem": "1650",
                "posto": "REDE HG SAO MARCOS | VITORIA DA CONQUISTA | BA"
              },
              {
                "seq_fornecedor": 3187,
                "precoLitro": "5.99",
                "cnpj": "20415295004213",
                "idItem": "28",
                "distanciaOrigem": "2050",
                "posto": "POSTO SAO GONÇALO 4 | FEIRA DE SANTANA | BA"
              },
              {
                "seq_fornecedor": 3188,
                "precoLitro": "6.00",
                "cnpj": "20415295004892",
                "idItem": "28",
                "distanciaOrigem": "2205",
                "posto": "POSTO PORTAL DA BAHIA 2 | TUCANO | BA"
              },
              {
                "seq_fornecedor": 3189,
                "precoLitro": "6.24",
                "cnpj": "20415295005372",
                "idItem": "28",
                "distanciaOrigem": "2830",
                "posto": "POSTO SANTO ANTONIO | CAMPINA GRANDE | PB"
              }
            ]
    .map(posto => ({
      ...posto,
      precoLitro: parseFloat(posto.precoLitro),
      distanciaOrigem: parseInt(posto.distanciaOrigem)
    }));


export default function main() {


  const qtdNecessariaAbastecer = Math.ceil(distanciaViagem / consumoMedio - capacidadeEfetivaTanque);
  if (qtdNecessariaAbastecer <= 0) {
    return;
  }
  const listaPostoPorMenorPreco = listaPostos.sort((a, b) => {
    if (a.precoLitro !== b.precoLitro) {
      return a.precoLitro - b.precoLitro;
    }
    return a.distanciaOrigem - b.distanciaOrigem;
  });
  const abastecimentos: Abastecimento[] = [];
  console.time('tempo-script');
  const abasteceuSuficiente = calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, 0, abastecimentos, 0, 0);
  console.timeEnd('tempo-script');

  console.log("Abastecimentos realizados:");
  console.table(abastecimentos.map(a => ({
    ...a,
    posto: a.posto.posto,
  })));
  console.log("Necessita abastecer:", qtdNecessariaAbastecer, "litros");
  console.log("Abasteceu:", abastecimentos.reduce((total, a) => total + a.litros, 0), "litros (", abasteceuSuficiente ? abasteceuSuficiente.totalAbastecido : "false", ")");
  console.log("Abasteceu o suficiente? ", abasteceuSuficiente ? "Sim" : "Não");

}
function calcularAbastecimento(
  qtdNecessariaAbastecer: number, 
  listaPostoPorMenorPreco: Posto[], 
  indicePostoAtual: number, 
  abastecimentos: Abastecimento[], 
  minDistanciaOrigem: number,
  totalAbastecido: number,
  maxDistanciaOrigem: number = Infinity, 
): {totalAbastecido: number, abastecimentos: Abastecimento[]} | false {
  if (qtdNecessariaAbastecer <= 0) {
    return {
      totalAbastecido,
      abastecimentos
    }; // Já abastecemos o suficiente
  }
  if (indicePostoAtual >= listaPostoPorMenorPreco.length) {
    return false; // Não há mais postos para abastecer
  }

  // posto mais barato
  const postoAtual = listaPostoPorMenorPreco[indicePostoAtual];

  if (postoAtual.distanciaOrigem <= minDistanciaOrigem || postoAtual.distanciaOrigem > maxDistanciaOrigem) {
    // ignora posto atrás do mínimo permitido ou além do máximo permitido
    return calcularAbastecimento(
      qtdNecessariaAbastecer,
      listaPostoPorMenorPreco,
      indicePostoAtual + 1,
      abastecimentos,
      minDistanciaOrigem,
      totalAbastecido,
      maxDistanciaOrigem
    );
  }
  // quantidade de litros no tanque ao chegar no posto
  let litrosTanqueNoPosto = capacidadeEfetivaTanque + totalAbastecido - (postoAtual.distanciaOrigem / consumoMedio);

  if (litrosTanqueNoPosto >= capacidadeEfetivaTanque) {
    // Já temos litros suficientes no tanque, não podemos abastecer neste posto, tentar o próximo mais barato
    return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, indicePostoAtual + 1, abastecimentos, minDistanciaOrigem, totalAbastecido, maxDistanciaOrigem);
  }

  if (litrosTanqueNoPosto < 0) {
    // abastecer em um posto com distancia menor que o atual para ter diesel para chegar nele
    const abastecimentoAtePosto = calcularAbastecimento(
      -litrosTanqueNoPosto,
      listaPostoPorMenorPreco,
      indicePostoAtual + 1, 
      abastecimentos, 
      minDistanciaOrigem,
      totalAbastecido,
      postoAtual.distanciaOrigem
    );
    if (abastecimentoAtePosto) {
      qtdNecessariaAbastecer -= abastecimentoAtePosto.totalAbastecido - totalAbastecido; // Atualiza a quantidade necessária para abastecer
      totalAbastecido = abastecimentoAtePosto.totalAbastecido; // Atualiza o total abastecido
      litrosTanqueNoPosto = capacidadeEfetivaTanque + totalAbastecido - (postoAtual.distanciaOrigem / consumoMedio);
      abastecimentos = abastecimentoAtePosto.abastecimentos; // Atualiza os abastecimentos
    } else {
      return false; // Não foi possível abastecer o suficiente para chegar ao próximo posto
    }
  }

  // Calcula a quantidade de litros que podemos abastecer neste posto
  const litrosAbastecerNoPosto = Math.ceil(
    Math.min(qtdNecessariaAbastecer, capacidadeEfetivaTanque - litrosTanqueNoPosto)
  );


  // Criar o abastecimento
  abastecimentos.push({
    posto: postoAtual,
    km: postoAtual.distanciaOrigem,
    litros: litrosAbastecerNoPosto,
    preco: litrosAbastecerNoPosto * postoAtual.precoLitro
  });
  qtdNecessariaAbastecer -= litrosAbastecerNoPosto;
  totalAbastecido += litrosAbastecerNoPosto;

  // Chama recursivamente o próximo posto mais barato, filtrando os postos anteriores ao atual
  return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, indicePostoAtual + 1, abastecimentos, postoAtual.distanciaOrigem, totalAbastecido, maxDistanciaOrigem);

}
