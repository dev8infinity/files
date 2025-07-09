function main() {
  metadata.idCalculo = gerarId();

  const kmDeFuga = 300;
  const capacidadeTanque = Number(metadata.IcapacidadeTanque);
  const margemSeguranca = capacidadeTanque * 0.15;
  const consumoMedio = Number(metadata.ImetaMediaConsumo);
  const distanciaViagem = Number(metadata.Idistancia) + kmDeFuga;
  const postos = JSON.parse(metadata.Ipostos.replace(/\\r\\n/g, "").replace(/\\/g, ""));

  if (isNaN(capacidadeTanque) || isNaN(margemSeguranca) || isNaN(consumoMedio) || isNaN(distanciaViagem) || !postos || !postos.length) {
    metadata.erro = "Váriaveis de entrada inválidas. ";
    DataFile.Stage = 2;
    return;
  }

  const capacidadeEfetivaTanque = capacidadeTanque - margemSeguranca;
  const quantidadeNecessaria = Math.ceil(distanciaViagem / consumoMedio - capacidadeEfetivaTanque);
  if (quantidadeNecessaria <= 0) {
    metadata.erro = `Não houve necessidade de abastecimento na rota. `;
    return;
  }

  const listaPostoPorMenorPreco = postos.sort((a, b) => {
    if (a.precoLitro !== b.precoLitro) {
      return a.precoLitro - b.precoLitro;
    }
    return a.distanciaOrigem - b.distanciaOrigem;
  });
  const abastecimentos = [];
  let totalAbastecido = 0;

  const calcularAbastecimento = (qtdNecessariaAbastecer, indicePostoAtual = 0, minDistanciaOrigem = 0, maxDistanciaOrigem = Infinity) => {
    if (qtdNecessariaAbastecer <= 0) {
        return true; /** Já abastecemos o suficiente */
    }
    if (indicePostoAtual >= listaPostoPorMenorPreco.length) {
        return false; /** Não há mais postos para abastecer */
    }

    /** posto mais barato */
    const postoAtual = listaPostoPorMenorPreco[indicePostoAtual];

    if (
        postoAtual.distanciaOrigem <= minDistanciaOrigem ||
        postoAtual.distanciaOrigem > maxDistanciaOrigem
    ) {
        /** ignora posto atrás do mínimo permitido ou além do máximo permitido */
        return calcularAbastecimento(
            qtdNecessariaAbastecer,
            indicePostoAtual + 1,
            minDistanciaOrigem,
            maxDistanciaOrigem
        );
    }

    /** quantidade de litros no tanque ao chegar no posto */
    let litrosTanqueNoPosto =
        capacidadeEfetivaTanque +
        totalAbastecido -
        postoAtual.distanciaOrigem / consumoMedio;

    if (litrosTanqueNoPosto >= capacidadeEfetivaTanque) {
        /** Já temos litros suficientes no tanque, não podemos abastecer neste posto, tentar o próximo mais barato */
        return calcularAbastecimento(
            qtdNecessariaAbastecer,
            indicePostoAtual + 1,
            minDistanciaOrigem,
            maxDistanciaOrigem
        );
    }

    if (litrosTanqueNoPosto < 0) {
        /** abastecer em um posto com distancia menor que o atual para ter diesel para chegar nele */
        const totalAbastecimentoAteAgora = totalAbastecido;
        const abastecimentoAtePosto = calcularAbastecimento(
            -litrosTanqueNoPosto,
            indicePostoAtual + 1,
            minDistanciaOrigem,
            postoAtual.distanciaOrigem
        );
        if (abastecimentoAtePosto) {
            /** Atualiza a quantidade necessária para abastecer */
            qtdNecessariaAbastecer -= totalAbastecido - totalAbastecimentoAteAgora;
            litrosTanqueNoPosto =
                capacidadeEfetivaTanque +
                totalAbastecido -
                postoAtual.distanciaOrigem / consumoMedio;
        } else {
            return false; /** Não foi possível abastecer o suficiente para chegar ao próximo posto */
        }
    }

    /** Calcula a quantidade de litros que podemos abastecer neste posto */
    const litrosAbastecerNoPosto = Math.ceil(
        Math.min(
            qtdNecessariaAbastecer,
            capacidadeEfetivaTanque - litrosTanqueNoPosto
        )
    );

    /** Criar o abastecimento */
    abastecimentos.push({
        ...postoAtual,
        km: postoAtual.distanciaOrigem,
        litros: litrosAbastecerNoPosto,
        preco: litrosAbastecerNoPosto * postoAtual.precoLitro,
        completarTanque: (litrosTanqueNoPosto + litrosAbastecerNoPosto) >= capacidadeEfetivaTanque
    });
    qtdNecessariaAbastecer -= litrosAbastecerNoPosto;
    totalAbastecido += litrosAbastecerNoPosto;

    /** Chama recursivamente o próximo posto mais barato, filtrando os postos anteriores ao atual */
    return calcularAbastecimento(
        qtdNecessariaAbastecer,
        indicePostoAtual + 1,
        postoAtual.distanciaOrigem,
        maxDistanciaOrigem
    );
  }

  const abasteceuSuficiente = calcularAbastecimento(quantidadeNecessaria);

  metadata.Oerror = "";
  metadata.erro = metadata.erro || "";

  checarErros(abasteceuSuficiente, quantidadeNecessaria, totalAbastecido, abastecimentos);
  DataFile.Stage = 3;

  if (!metadata.erro) {
    importar(abastecimentos.filter(a => !a.foraDoConvenio));
  }
  if (metadata.erro) {
    metadata.Oerror = JSON.stringify(
      {
        abastecimentos,
        quantidadeNecessaria,
        totalAbastecido,
      }
    );
    DataFile.Stage = 2;
  }

  metadata.OpostosParaAbastecer = JSON.stringify(abastecimentos);

}
function importar(abastecimentos) {
  if (abastecimentos.length == 0) {
    metadata.erro = metadata.erro + `Nenhum item de abastecimento foi importado. `;
    return;
  }
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const futureDate = new Date();
  futureDate.setDate(yesterday.getDate() + 30);

  importarItemAbastecimento(
    abastecimentos.map((abastecimento) => {
      return {
        "idCalculo": metadata.idCalculo,
        "cnpj": abastecimento.id,
        "idManifesto": metadata.idManifesto,
        "valor": abastecimento.preco,
        "quantidadeLitros": abastecimento.litros,
        "codItem": abastecimento.idItem,
        "placa": metadata.Iplaca,
        "completarTanque": abastecimento.completarTanque,
        "dataValidadeInicial": yesterday.toISOString(),
        "dataValidadeFinal": futureDate.toISOString(),
      };
    })
  );

}
function checarErros(abasteceuSuficiente, qtdNecessariaAbastecer, totalAbastecido, abastecimentos) {
  if (!abasteceuSuficiente || totalAbastecido < qtdNecessariaAbastecer) {
    metadata.erro = metadata.erro + `Não há postos suficientes para chegar no destino/kmDeFuga. `;
  }

  if (abastecimentos.reduce((acc, item) => acc + item.litros, 0) != totalAbastecido) {
    metadata.erro = metadata.erro + `Houve um problema com o algoritmo. `;
  }
}
function importarItemAbastecimento(itens) {

  const itensImportacao = {
    Name: `Calculo ${metadata.idCalculo}`,
    MetadataTypeId: 573,
    Metas: itens
  };

  const sucessoNoImport = BALM.Import(itensImportacao);
  if (!sucessoNoImport) {
    metadata.erro = `Erro BALM: ao importar itens do Calculo ${metadata.idCalculo}. `;
  }
}
function gerarId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

