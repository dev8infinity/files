const DISTANCIA_ACEITAVEL_PONTO_POSTO = Number(BALM.GetProperty("PlanoAbastecimento_Distancia_Raio_Ponto_Posto"));
function main(){
    if(!Array.isArray(Result) || Result.length == 0) {
        throw new Error("Nenhuma rota encontrada");
    }
    const ID_ROTOGRAMA = Result[0].ID_ROTOGRAMA;
    const dataUltimaAtualizacao = new Date();
    const pontosHTML = JSON.parse(Result[0].pontosHTML);

    const postosForaDoConvenio = JSON.parse(BALM.GetProperty("PlanoAbastecimento_PostosForaDoConvenio"));
    const postos = JSON.parse(BALM.GetProperty("PlanoAbastecimento_TodosPostos")).concat(postosForaDoConvenio);

    const postosDaRota = JSON.stringify(
        calcularPostosNaRota(postos, pontosHTML)
            .sort((a, b) => Number(a.distanciaOrigem) - Number(b.distanciaOrigem))
    );
    
    Result = {postosDaRota, dataUltimaAtualizacao, ID_ROTOGRAMA, conciliacao: "Sim"};
   
}
function calcularPostosNaRota(postos, pontos) {
    if (!pontos) throw new Error("Pontos não foram fornecidos.");
    if (!postos || !Array.isArray(postos) || postos.length === 0) throw new Error("Postos não foram fornecidos.");

    const pontosCalculados = [];
    pontos.reduce((acc, ponto, index, array) => {
        if (index === 0) {
            pontosCalculados.push({ point: ponto, distance: 0 });
            return 0;
        }
        const pointDistance = calcularDistancia(array[index - 1], ponto);
        const distance = acc + pointDistance;

        pontosCalculados.push({ point: ponto, distance });

        return distance;
    }, 0) ?? 0;

    const postosCalc = [];
    for (const posto of postos) {
        const postoCalc = calcularDistanciaPontoMaisProx(pontos, posto, pontosCalculados);
        if (postoCalc) {
            postoCalc.distanciaOrigem = String(Math.ceil(postoCalc.distanciaOrigem));
            postosCalc.push(postoCalc);
        }
    }

    return postosCalc;
}
function calcularDistanciaPontoMaisProx(pontos, posto, pontosCalculados) {
    const pontoPosto = [Number(posto.latitude), Number(posto.longitude)];

    const pontoMaisProximo = pontos.reduce((closest, point, index) => {
        const distancePontoPosto = calcularDistancia(pontoPosto, point);
        if (distancePontoPosto < closest.distancePontoPosto) {

            return { point, index, distancePontoPosto };
        }
        return closest;
    }, { point: pontos[0], index: 0, distancePontoPosto: Infinity });
    if (pontoMaisProximo.distancePontoPosto > DISTANCIA_ACEITAVEL_PONTO_POSTO) {
        return undefined;
    }
    const index = pontoMaisProximo.index == 0 ? 0 : pontoMaisProximo.index - 1;
    posto.distanciaOrigem = String(
        calcularDistancia(pontoPosto, pontosCalculados[index].point) + pontosCalculados[index].distance
    );
    return posto;
}
function calcularDistancia(point1, point2) {
    const [lat1, lon1] = point1;
    const [lat2, lon2] = point2;
    const R = 6371;
    const toRad = (angulo) => angulo * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = R * c;

    return distancia;
}