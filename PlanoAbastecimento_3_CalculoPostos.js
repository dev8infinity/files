function main(){
    metadata.Oerror = "";
    metadata.erro = metadata.erro || "";
    metadata.idCalculo = gerarId();

    const kmDeFuga = 300;
    const litrosTanqueInicioViagem = metadata.IcapacidadeTanque;
    const margemSegurancaTanque = 15;

    const postos = JSON.parse(metadata.Ipostos.replace(/\\r\\n/g, "").replace(/\\/g, ""));
    /*
    postos.forEach(p => {
        if(p.cnpj === "base-udia") {
            p.valor = BALM.GetProperty("PlanoAbastecimento_ValorBaseUdia");
        } 
        else if(p.cnpj === "base-jun") {
            p.valor = BALM.GetProperty("PlanoAbastecimento_ValorBaseJun");
        }
        
    });
    */
    const calcular = new Calcular(
        metadata.Idistancia,
        metadata.ImetaMediaConsumo,
        metadata.IcapacidadeTanque,
        margemSegurancaTanque,
        postos,
        litrosTanqueInicioViagem,
        kmDeFuga,
    );
    calcular.calcularMelhorAbastecimento();
    /*calcular.calcularAbstInterno();*/

    metadata.OpostosParaAbastecer = calcular.getPostosAbastecer();
    metadata.OrotaCompleta = calcular.getPostos();

    checarErros(metadata.OrotaCompleta, calcular, metadata.OpostosParaAbastecer);
    importar(metadata.OpostosParaAbastecer.filter(p => !p.foraDoConvenio));
    definirEstagios(metadata.OrotaCompleta);

    metadata.OpostosParaAbastecer = JSON.stringify(metadata.OpostosParaAbastecer);
    metadata.OrotaCompleta = JSON.stringify(metadata.OrotaCompleta);

}
function importar(postoParaAbastecer){
    if(postoParaAbastecer.length == 0) {
        metadata.erro =  metadata.erro + `Nenhum item de abastecimento foi importado. `;
        return;
    }
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const futureDate = new Date();
    futureDate.setDate(yesterday.getDate() + 30);
    if(!metadata.erro) {
        importarItemAbastecimento(
            postoParaAbastecer.map((posto) => {
                return {
                    "idCalculo": metadata.idCalculo,
                    "placa": metadata.Iplaca,
                    "cnpj": posto.cnpj,
                    "idManifesto": metadata.idManifesto,
                    "valor": posto.valor,
                    "quantidadeLitros": posto.abastecerLitros,
                    "codItem": posto.idItem,
                    "completarTanque": posto.completarTanque,
                    "dataValidadeInicial": yesterday.toISOString(),
                    "dataValidadeFinal": futureDate.toISOString(),
                };
            })
        ); 
    }
}
function definirEstagios(rotaCompleta){
    DataFile.Stage = 3;
    if(metadata.erro) {
        metadata.Oerror = JSON.stringify( 
            rotaCompleta.filter(i => i.Autonomia < 0 || i.Posto != "Ponto Intermediario")
        );
        DataFile.Stage = 2;
    }
    if(metadata.erro == "Não houve abastecimento na rota. ") {
        DataFile.Stage = 1;
    }
}
function checarErros(rotaCompleta, calcular, postosParaAbastecer){
    if(postosParaAbastecer.length == 0) {
        metadata.erro =  metadata.erro + `Não houve abastecimento na rota. `; 
        return;
    }
    if(rotaCompleta[rotaCompleta.length - 2]["Tem no tanque (Litros) - Margem de segurança"] < 0){
        metadata.erro =  metadata.erro + `Não há postos suficientes para chegar no destino. `;
    }
    if(rotaCompleta[rotaCompleta.length - 1]["Tem no tanque (Litros) - Margem de segurança"] < 0){
        metadata.erro =  metadata.erro + `Não há postos suficientes para ter KM de fuga de ${calcular.kmDeFugaNoFinal}. `; 
    }
    if(rotaCompleta.filter(i => i.Posto != "KM de fuga" && i.Posto != "Chegada").some(item => item["Tem no tanque (Litros) - Margem de segurança"] < 0)){
        metadata.erro =  metadata.erro + `Não há postos suficientes para chegar em um ou mais pontos intermediários. `; 
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
function gerarId(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
class Calcular {
    distancia = undefined;
    metaMediaConsumo = undefined;
    tanque = undefined;
    porcMargemSegurancaTanque = undefined;
    postos = undefined;
    litrosTanqueInicioViagem = undefined;
    kmDeFugaNoFinal = undefined;

    maximoAbastecimento = undefined;

    litroMargemSegurancaTanque = undefined;
    constructor(
        _distancia,
        _metaMediaConsumo,
        _tanque,
        _porcMargemSegurancaTanque,
        _postos,
        _litrosTanqueInicioViagem,
        _kmDeFugaNoFinal,
    ) {
        if (!_distancia) {
            throw new Error("Distância não informada");
        }
        if (!_metaMediaConsumo) {
            throw new Error("Meta de consumo não informada");
        }
        if (!_tanque) {
            throw new Error("Tanque não informado");
        }
        if (!_porcMargemSegurancaTanque) {
            throw new Error("Margem de segurança do tanque não informada");
        }
        if (!_postos) {
            throw new Error("Postos não informados");
        }
        if (!_litrosTanqueInicioViagem) {
            throw new Error("Litros no tanque não informados");
        }
        if (!_kmDeFugaNoFinal) {
            throw new Error("Km de fuga no final não informados");
        }

        this.distancia = Number(_distancia);
        this.metaMediaConsumo = Number((_metaMediaConsumo || "").replace(',', '.'));
        this.tanque = Number(_tanque);
        this.porcMargemSegurancaTanque = Number((_porcMargemSegurancaTanque || "").replace('%', '')) / 100;
        this.postos = _postos;
        this.litrosTanqueInicioViagem = Number(_litrosTanqueInicioViagem);
        this.kmDeFugaNoFinal = Number(_kmDeFugaNoFinal);
        
        this.litroMargemSegurancaTanque = this.tanque * this.porcMargemSegurancaTanque; 
        this.maximoAbastecimento = this.tanque - this.litroMargemSegurancaTanque;

        this.init();
    }
    init() {
        this.formatarPostos();
        this.criarPontosIntermediarios();
        this.criarKmDeFuga();
    }

    formatarPostos() {
        const postos = this.postos.map(posto => {
            if (!posto['distanciaOrigem']) {
                throw new Error("Distância do posto não informada");
            }
            if (!posto['precoLitro']) {
                throw new Error("Preço do posto não informado");
            }
            return {
                "idItem": posto['idItem'],
                "cnpj": posto['cnpj'],
                "posto": posto['posto'],
                "distanciaOrigem": Number(posto['distanciaOrigem']),
                "precoLitro": Number(posto['precoLitro'].replace(',', '.')),
                'autonomia': undefined,
                'abastecerLitros': undefined,
                'autonomiaAbast': undefined,
                'quantidadeTanque': undefined,
                'valor': undefined,
                'foraDoConvenio': posto['foraDoConvenio'],
            }
        })
            /* function CLASSIFICAR */
            .sort((a, b) => a['distanciaOrigem'] - b['distanciaOrigem']);
      
        postos.forEach((item, index) => {
            item['precoLitro'] = Number((item['precoLitro'] + 0.0000016 + (index * 0.0000001)).toFixed(7));
            if(isNaN(item['precoLitro'])){
                throw new Error("Preço do posto não pôde ser convertido para número");
            }
        });

        this.postos = postos;
    }

    criarKmDeFuga() {
        this.postos.push({
            "posto": "KM de fuga",
            "distanciaOrigem": this.distancia + this.kmDeFugaNoFinal,
            'abastecerLitros': undefined,
        });
    }

    calcularCamposDerivados() {
        let abstTotal = 0;
        for (let i = 0; i < this.postos.length; i++) {
            const posto = this.postos[i];
            const distanciaOrigem = posto['distanciaOrigem'];

            const autonomia = ((this.litrosTanqueInicioViagem - this.litroMargemSegurancaTanque) * this.metaMediaConsumo) - posto['distanciaOrigem'] + (abstTotal * this.metaMediaConsumo);
            posto['autonomia'] = autonomia < 0 ? Math.ceil(autonomia) : Math.floor(autonomia);

            abstTotal = abstTotal + (posto['abastecerLitros'] || 0);
            posto['quantidadeTanque'] = Math.round(this.litrosTanqueInicioViagem - (distanciaOrigem / this.metaMediaConsumo) + abstTotal - this.litroMargemSegurancaTanque);

            posto['valor'] = this.isNumber(posto['abastecerLitros']) && this.isNumber(posto['precoLitro']) ? posto['abastecerLitros'] * posto['precoLitro'] : 0;
            posto['valor'] = Number(posto['valor'].toFixed(2));

            posto['autonomiaAbast'] = this.isNumber(posto['abastecerLitros']) ? posto['abastecerLitros'] * this.metaMediaConsumo : 0;
            posto['autonomiaAbast'] = Math.round(posto['autonomiaAbast']);

            this.postos[i] = posto;
        }
     
    }
    getMaximoAbastecimentoPossivel(indexPosto) {
        const valores = [this.maximoAbastecimento - this.postos[indexPosto]['quantidadeTanque']];
        for (let i = this.postos.length - 1; i > indexPosto; i--) {
            const posto = this.postos[i];
            const qtdMaxAbastecimento = this.maximoAbastecimento - posto['quantidadeTanque'];
            valores.push(qtdMaxAbastecimento);
        }
        return Math.min(...valores);
    }
    calcularMelhorAbastecimento() {
        this.calcularCamposDerivados();
 
        for (let i = 0; i < this.postos.length; i++) {
            const postoZerado = this.postos[i];
            if (postoZerado['quantidadeTanque'] >= 0) {
                continue;
            }

            let qtdAbstFaltando = postoZerado['quantidadeTanque'] * -1;
            const postosAnterioresOrdenadosValor = this.postos.slice(0, i)
                .filter(p => p.pontoIntermediario !== true)
                .sort((a, b) => a['precoLitro']  - b['precoLitro'] );

            const queue = new Queue(postosAnterioresOrdenadosValor);
            while (!queue.isEmpty() && qtdAbstFaltando > 0) {
                const postoParaAbastecer = queue.dequeue();
                if(postoParaAbastecer['quantidadeTanque'] >= this.maximoAbastecimento){
                    continue;
                }
                const index = this.postos.findIndex(p => p['posto'] == postoParaAbastecer['posto'] && p['idItem'] == postoParaAbastecer['idItem'] && p['precoLitro'] == postoParaAbastecer['precoLitro'] && p['distanciaOrigem'] == postoParaAbastecer['distanciaOrigem']);
                
                const qtdPossivelAbastec = this.getMaximoAbastecimentoPossivel(index);
                if (qtdPossivelAbastec <= 0) {
                    continue;
                }
                const qtdAbastecimento = (qtdAbstFaltando <= qtdPossivelAbastec) ? qtdAbstFaltando : qtdPossivelAbastec;
                
                /** Abastecimento */
                this.postos[index]['abastecerLitros'] = (this.postos[index]['abastecerLitros'] || 0) + qtdAbastecimento; 
                
                qtdAbstFaltando = qtdAbstFaltando - qtdAbastecimento;
                this.calcularCamposDerivados();
            }
            

        }
    }
    /*
    calcularAbstInterno() {
        if (false) {

            this.postos[this.postos.length - 1]['abastecerLitros'] = this.maximoAbastecimento;
            this.calcularCamposDerivados();
        } else {


            for (let i = this.postos.length - 1; i >= 0; i--) {
                const posto = this.postos[i];
                if (posto['abastecerLitros'] > 0) {

                    posto['abastecerLitros'] = this.maximoAbastecimento - (posto['quantidadeTanque'] - posto['abastecerLitros']);
                    this.calcularCamposDerivados();
                    break;
                }
            }
        }

        let VERIF = false;
        let VALOR_ANTERIOR;
        for (let i = this.postos.length - 1; i >= 0; i--) {
            const posto = this.postos[i];
            if (posto['autonomia'] < 0) {

                VERIF = true;
                break;
            }
        }

        if (true && !VERIF) {

            for (let i = this.postos.length - 1; i >= 0; i--) {
                const posto = this.postos[i];
                if (posto['abastecerLitros'] > 0) {

                    VALOR_ANTERIOR = posto['abastecerLitros'];
                    posto['abastecerLitros'] = this.kmDeFugaNoFinal / this.metaMediaConsumo;
                    this.calcularCamposDerivados();
                    break;
                }
            }
        }

        for (let i = this.postos.length - 1; i >= 0; i--) {
            const posto = this.postos[i];
            if (posto['autonomia'] < 0) {

                VERIF = true;
                break;
            }
        }

        if (true && VERIF) {

            for (let i = this.postos.length - 1; i >= 0; i--) {
                const posto = this.postos[i];
                if (posto['abastecerLitros'] > 0) {

                    posto['abastecerLitros'] = VALOR_ANTERIOR;
                    this.calcularCamposDerivados();
                    break;
                }
            }
        }
    }
    */

    isNumber(anytype) {
        return typeof anytype === 'number';
    }

    getPostosAbastecer() {
        return this.postos.filter(posto => posto['abastecerLitros'] > 0).map(posto => {
            posto['precoLitro'] = posto['precoLitro'].toFixed(2);
            posto['valor'] = posto['valor'].toFixed(2);
            posto['completarTanque'] = posto['abastecerLitros'] == this.maximoAbastecimento;
            return posto;
        });
    }
    getPostos() {
        return this.postos.map(posto => {
            return {
                "Posto": posto['posto'],
                "KM (distância origem)": posto['distanciaOrigem'],
                "Preço (L)": posto['precoLitro'],
                "Autonomia": posto['autonomia'],
                "Programação de Abastecimento (Lts)": posto['abastecerLitros'],
                "Autonomia do Abastecimento": posto['autonomiaAbast'],
                "Tem no tanque (Litros) - Margem de segurança": posto['quantidadeTanque'],
                "Valor (R$)": posto['valor'],
            }
        });
    }
    criarPontosIntermediarios() {
        let distanciaAtual = 100;
        while(distanciaAtual <= this.distancia){
            this.postos.push({
                "posto": `Ponto Intermediario`,
                "distanciaOrigem": distanciaAtual,
                "pontoIntermediario": true,
            });
            distanciaAtual += 100;
        }
        this.postos.push({
            "posto": `Chegada`,
            "distanciaOrigem": this.distancia,
            "pontoIntermediario": true, 
        });
        this.postos = this.postos.sort((a, b) => a['distanciaOrigem'] - b['distanciaOrigem']);
    }

}
class Queue {
    constructor(initialValues = []) {
        this.items = [...initialValues]; 
        this.head = 0;
        this.size = this.items.length;
    }

    enqueue(value) {
        this.items.push(value);
        this.size++;
    }

    dequeue() {
        if(this.isEmpty()) {
            return undefined;
        }
        const item = this.items[this.head];
        this.head++;
        this.size--;

        return item; 
    }

    isEmpty() {
        return this.size === 0;
    }

}