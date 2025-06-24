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
const consumoMedio = 1.3; // Consumo médio em litros por km
const kmDeFuga = 300; // Quantidade de km que o caminhão pode percorrer após o abastecimento
const distanciaViagem = 2935 + kmDeFuga; // Distância total da viagem em km
const capacidadeEfetivaTanque = capacidadeTanque - margemSeguranca;
const listaPostos: Posto[] = [
  {
    "seq_fornecedor": 3723,
    "precoLitro": "6.19",
    "cnpj": "15449677000189",
    "idItem": "28",
    "distanciaOrigem": "8",
    "posto": "POSTO FUTURAMA ** H ** | POSTO DE COMBUSTIVEIS FUTURAMA LTDA | DIAS D'ÁVILA | BA"
  },
  {
    "seq_fornecedor": 1509,
    "precoLitro": "5.83",
    "cnpj": "16496705000262",
    "idItem": "28",
    "distanciaOrigem": "73",
    "posto": "SERVE BEM ** H ** | COMERCIAL DE COMBUSTIVEIS MARTINS LTDA | AMELIA RODRIGUES | BA"
  },
  {
    "seq_fornecedor": 238,
    "precoLitro": "5.87",
    "cnpj": "11322064000125",
    "idItem": "28",
    "distanciaOrigem": "81",
    "posto": "POSTO SÃO GONÇALO 1 ** H ** | SOBRAL & FILHOS COMERCIO DE COMBUSTIVEIS LTDA | Feira de Santana | BA"
  },
  {
    "seq_fornecedor": 309,
    "precoLitro": "5.87",
    "cnpj": "13799101000469",
    "idItem": "28",
    "distanciaOrigem": "81",
    "posto": "POSTO SÃO GONÇALO 4 ** H ** | J A SOBRAL & CIA LTDA | Feira de Santana | BA"
  },
  {
    "seq_fornecedor": 4209,
    "precoLitro": "5.67",
    "cnpj": "47668571000162",
    "idItem": "28",
    "distanciaOrigem": "85",
    "posto": "SB COMERCIO DE COMBUSTIVEL LTDA ** H ** | POSTO SB | Feira de Santana | BA"
  },
  {
    "seq_fornecedor": 2305,
    "precoLitro": "5.67",
    "cnpj": "16737285000188",
    "idItem": "28",
    "distanciaOrigem": "85",
    "posto": "SUBAÉ 2 ** H ** | BRAX-FEIRA DERIVADOS DE PETROLEO E SERVICOS LTDA | Feira de Santana | BA"
  },
  {
    "seq_fornecedor": 2983,
    "precoLitro": "5.79",
    "cnpj": "00096068000116",
    "idItem": "28",
    "distanciaOrigem": "86",
    "posto": "POSTO SHANGAY ** H ** | MG DERIVADOS DE PETRÓLEO LTDA | FEIRA DE SANTANA | BA"
  },
  {
    "seq_fornecedor": 1604,
    "precoLitro": "5.77",
    "cnpj": "13569064003175",
    "idItem": "28",
    "distanciaOrigem": "117",
    "posto": "HG GRAO DE OURO ** H ** | REDE HG COMBUSTIVEIS LTDA | ANTONIO CARDOSO | BA"
  },
  {
    "seq_fornecedor": 199,
    "precoLitro": "5.87",
    "cnpj": "11322064000206",
    "idItem": "28",
    "distanciaOrigem": "119",
    "posto": "POSTO SÃO GONÇALO 2 ** H ** | SOBRAL & FILHOS COMERCIO DE COMBUSTIVEIS LTDA | ANTÔNIO CARDOSO | BA"
  },
  {
    "seq_fornecedor": 1841,
    "precoLitro": "5.84",
    "cnpj": "09372849000160",
    "idItem": "28",
    "distanciaOrigem": "138",
    "posto": "POSTO CAETANO 2 ** H ** | LIMA & CAVALCANTI DERIVADOS DE PETROLEO LTDA | SANTO ESTEVAO | BA"
  },
  {
    "seq_fornecedor": 3399,
    "precoLitro": "5.99",
    "cnpj": "38363831000109",
    "idItem": "28",
    "distanciaOrigem": "143",
    "posto": "POSTO PORTO BRASIL ** H ** | POSTO PORTP BRASIL LTDA | SANTO ESTÊVÃO | BA"
  },
  {
    "seq_fornecedor": 4011,
    "precoLitro": "6.98",
    "cnpj": "18258324000351",
    "idItem": "28",
    "distanciaOrigem": "146",
    "posto": "MACAUBENSE VII ** H ** | MACAUBENSE COMERCIO DE DERIVADOS DE PETROLEO LTDA  | Abaíra | BA"
  },
  {
    "seq_fornecedor": 3633,
    "precoLitro": "5.75",
    "cnpj": "20415295008078",
    "idItem": "28",
    "distanciaOrigem": "151",
    "posto": "DP SANTO ESTEVÃO 2 ** H ** | REDE DOM PEDRO DE POSTOS LTDA | Santo Estêvão | BA"
  },
  {
    "seq_fornecedor": 2922,
    "precoLitro": "5.75",
    "cnpj": "20415295004161",
    "idItem": "28",
    "distanciaOrigem": "158",
    "posto": "DP SANTO ESTEVAO ** H ** | REDE DOM PEDRO DE POSTOS LTDA – FILIAL 41 | Rafael Jambeiro | BA"
  },
  {
    "seq_fornecedor": 1268,
    "precoLitro": "5.77",
    "cnpj": "13569064003256",
    "idItem": "28",
    "distanciaOrigem": "158",
    "posto": "REDE HG - MARACANA ** H ** | REDE HG COMBUSTIVEIS LTDA | RAFAEL JAMBEIRO | BA"
  },
  {
    "seq_fornecedor": 1994,
    "precoLitro": "6.44",
    "cnpj": "18258324000190",
    "idItem": "28",
    "distanciaOrigem": "163",
    "posto": "POSTO MACAUBENSE IV ** H ** | MACAUBENSE COMERCIO DERIVADO DE PETROLEO LTDA | Rafael Jambeiro | BA"
  },
  {
    "seq_fornecedor": 2997,
    "precoLitro": "6.4",
    "cnpj": "31713774000193",
    "idItem": "28",
    "distanciaOrigem": "189",
    "posto": "POSTO JORGINHO ** H ** | J PETRO COMERCIO DE COMBUSTIVEIS E LUBRIFICANTES LTDA | ITATIM | BA"
  },
  {
    "seq_fornecedor": 1422,
    "precoLitro": "5.79",
    "cnpj": "13569064003094",
    "idItem": "28",
    "distanciaOrigem": "190",
    "posto": "HG PAPA LEGUAS 3 ** H ** | REDE HG COMBUSTIVEIS LTDA | ITATIM | BA"
  },
  {
    "seq_fornecedor": 1803,
    "precoLitro": "5.89",
    "cnpj": "07906908000108",
    "idItem": "28",
    "distanciaOrigem": "191",
    "posto": "POSTO REFORCO IV ** H ** | POSTO REFORCO 4 LTDA | Itatim | BA"
  },
  {
    "seq_fornecedor": 1561,
    "precoLitro": "5.59",
    "cnpj": "13569064002799",
    "idItem": "28",
    "distanciaOrigem": "192",
    "posto": "HG UIRAPURU ** H ** | REDE HG COMBUSTIVEIS LTDA | ITATIM | BA"
  },
  {
    "seq_fornecedor": 1560,
    "precoLitro": "5.99",
    "cnpj": "13569064002284",
    "idItem": "28",
    "distanciaOrigem": "193",
    "posto": "HG PQ DOS COQUEIROS ** H ** | REDE HG COMBUSTIVEIS LTDA | ITATIM | BA"
  },
  {
    "seq_fornecedor": 1883,
    "precoLitro": "5.81",
    "cnpj": "04182229000145",
    "idItem": "28",
    "distanciaOrigem": "213",
    "posto": "IRMAO CAMINHONERO I ** H ** | PETROCEZAR COMERCIAL DE DERIVADOS DE PETROLEO LTDA. | ITATIM | BA"
  },
  {
    "seq_fornecedor": 2929,
    "precoLitro": "5.7",
    "cnpj": "22838365000122",
    "idItem": "28",
    "distanciaOrigem": "213",
    "posto": "POSTO MONTE SIAO ** H ** | COMERCIAL CRM DE COMBUSTIVEIS LTDA | MILAGRES | BA"
  },
  {
    "seq_fornecedor": 1884,
    "precoLitro": "5.87",
    "cnpj": "25106380000174",
    "idItem": "28",
    "distanciaOrigem": "218",
    "posto": "PORTAL DA BAHIA ** H ** | ALMEIDA E SODRE COMERCIO DE COMBUSTIVEL LTDA | MILAGRES | BA"
  },
  {
    "seq_fornecedor": 4218,
    "precoLitro": "5.84",
    "cnpj": "13712435000100",
    "idItem": "28",
    "distanciaOrigem": "220",
    "posto": "POSTO ELITE (MILAGRES) ** H ** | COMERCIO DE PETROLEO R S SILVA LTDA | Milagres | BA"
  },
  {
    "seq_fornecedor": 4245,
    "precoLitro": "5.99",
    "cnpj": "26674475000157",
    "idItem": "28",
    "distanciaOrigem": "224",
    "posto": "POSTO ANDORINHAS ** H ** | AUTO POSTO E TRANSPORTE DE COMBUSTIVEIS ANDORINHAS LTDA | Milagres | BA"
  },
  {
    "seq_fornecedor": 2133,
    "precoLitro": "5.89",
    "cnpj": "13569064002446",
    "idItem": "28",
    "distanciaOrigem": "236",
    "posto": "POSTO HG NOVO PONTO ** H ** | REDE HG COMBUSTIVEIS LTDA | BREJÕES | BA"
  },
  {
    "seq_fornecedor": 1851,
    "precoLitro": "6.09",
    "cnpj": "08857014000138",
    "idItem": "28",
    "distanciaOrigem": "248",
    "posto": "JAGUAR BREJOES ** H ** | LSL COMERCIO DE DERIVADOS DE PETROLEO LTDA | BREJOES | BA"
  },
  {
    "seq_fornecedor": 2576,
    "precoLitro": "6.79",
    "cnpj": "23166953000120",
    "idItem": "28",
    "distanciaOrigem": "248",
    "posto": "POSTO DAL SERRANO KM 100 ** H ** | NL-ROSA COMBUSTIVEIS E LUBRIFICANTES LTDA | BREJÕES | BA"
  },
  {
    "seq_fornecedor": 1618,
    "precoLitro": "6.3",
    "cnpj": "04309086000190",
    "idItem": "28",
    "distanciaOrigem": "934",
    "posto": "POSTO CHIMBA ** H ** | RENON COSTA & CIA LTDA | FRANCISCO SA | MG"
  },
  {
    "seq_fornecedor": 3097,
    "precoLitro": "5.92",
    "cnpj": "20415295006962",
    "idItem": "28",
    "distanciaOrigem": "939",
    "posto": "DP MONTES CLAROS ** H ** | POSTO DOM PEDRO DE MONTES CLAROS LTDA | Francisco Sá | MG"
  },
  {
    "seq_fornecedor": 1601,
    "precoLitro": "6.46",
    "cnpj": "23174519000191",
    "idItem": "28",
    "distanciaOrigem": "946",
    "posto": "POSTO D ANGELIS I ** H ** | POSTO D ANGELIS LTDA | MONTES CLAROS | MG"
  },
  {
    "seq_fornecedor": 1607,
    "precoLitro": "6.46",
    "cnpj": "23174519000515",
    "idItem": "28",
    "distanciaOrigem": "946",
    "posto": "POSTO D ANGELIS II ** H ** | POSTO D ANGELIS LTDA | MONTES CLAROS | MG"
  },
  {
    "seq_fornecedor": 1423,
    "precoLitro": "6.24",
    "cnpj": "13569064003680",
    "idItem": "28",
    "distanciaOrigem": "955",
    "posto": "HG NORTE DE MINAS ** H ** | REDE HG COMBUSTIVEIS LTDA | MONTES CLAROS | MG"
  },
  {
    "seq_fornecedor": 3665,
    "precoLitro": "6.54",
    "cnpj": "13799101001007",
    "idItem": "28",
    "distanciaOrigem": "955",
    "posto": "POSTO POTENCIA\t ** H ** | J A SOBRAL & CIA LTDA | Montes Claros | MG"
  },
  {
    "seq_fornecedor": 724,
    "precoLitro": "5.88",
    "cnpj": "13569064000230",
    "idItem": "28",
    "distanciaOrigem": "959",
    "posto": "REDE HG POSTO MOC ** H ** | REDE HG COMBUSTIVEIS LTDA | MONTES CLAROS | MG"
  },
  {
    "seq_fornecedor": 3843,
    "precoLitro": "6.45",
    "cnpj": "25273657000153",
    "idItem": "28",
    "distanciaOrigem": "960",
    "posto": "POSTO FORMIGÃO ** H ** | COMERCIAL JP FILHO LTDA | MONTES CLAROS | MG"
  },
  {
    "seq_fornecedor": 2975,
    "precoLitro": "5.88",
    "cnpj": "20415295002037",
    "idItem": "28",
    "distanciaOrigem": "1279",
    "posto": "DP PARAOPEBA ** H ** | REDE DOM PEDRO DE POSTOS LTDA FILIAL 20 | Paraopeba | MG"
  },
  {
    "seq_fornecedor": 2940,
    "precoLitro": "5.99",
    "cnpj": "20415295002118",
    "idItem": "28",
    "distanciaOrigem": "1288",
    "posto": "DP CAETANÓPOLIS ** H ** | REDE DOM PEDRO DE POSTOS LTDA  FILIAL 21 | Caetanópolis | MG"
  },
  {
    "seq_fornecedor": 2551,
    "precoLitro": "6.16",
    "cnpj": "05076962000148",
    "idItem": "28",
    "distanciaOrigem": "1337",
    "posto": "GRANDE PARADA ** H ** | POSTO FLORIDA LTDA | ESMERALDAS | MG"
  },
  {
    "seq_fornecedor": 4342,
    "precoLitro": "6.15",
    "cnpj": "02015189000111",
    "idItem": "28",
    "distanciaOrigem": "1397",
    "posto": "POSTO FISCAL ** H ** | POSTO TRANSABRIL LTDA | São Joaquim de Bicas | MG"
  },
  {
    "seq_fornecedor": 2985,
    "precoLitro": "6.09",
    "cnpj": "20415295000921",
    "idItem": "28",
    "distanciaOrigem": "1420",
    "posto": "DP ITATIAIUÇU ** H ** | REDE DOM PEDRO DE POSTOS LTDA – FILIAL 09 | Itatiaiuçu | MG"
  },
  {
    "seq_fornecedor": 3781,
    "precoLitro": "5.99",
    "cnpj": "20415295000689",
    "idItem": "28",
    "distanciaOrigem": "1434",
    "posto": "DP ITAGUARA ** H ** | REDE DOM PEDRO DE POSTOS LTDA | Itatiaiuçu | MG"
  },
  {
    "seq_fornecedor": 3795,
    "precoLitro": "5.99",
    "cnpj": "20415295002207",
    "idItem": "28",
    "distanciaOrigem": "1473",
    "posto": "DP CARMOPOLIS ** H ** | REDE DOM PEDRO DE POSTOS LTDA | Carmópolis de Minas | MG"
  },
  {
    "seq_fornecedor": 3183,
    "precoLitro": "5.99",
    "cnpj": "20415295001901",
    "idItem": "28",
    "distanciaOrigem": "1494",
    "posto": "DP OLIVEIRA ** H ** | REDE DOM PEDRO DE POSTOS LTDA – FILIAL 19 | Oliveira | MG"
  },
  {
    "seq_fornecedor": 3731,
    "precoLitro": "6.12",
    "cnpj": "05333717000179",
    "idItem": "28",
    "distanciaOrigem": "1495",
    "posto": "GRAAL OLVEIRA ** H ** | RODOPOSTO OLIVEIRA LTDA | OLIVEIRA | MG"
  },
  {
    "seq_fornecedor": 3684,
    "precoLitro": "6.06",
    "cnpj": "02553038000117",
    "idItem": "28",
    "distanciaOrigem": "1567",
    "posto": "COMERCIAL MINAS GRILL LTDA ** H ** | COMERCIAL MINAS GRILL LTDA | Ribeirão Vermelho | MG"
  },
  {
    "seq_fornecedor": 3677,
    "precoLitro": "6.39",
    "cnpj": "13010283000102",
    "idItem": "28",
    "distanciaOrigem": "1573",
    "posto": "POSTO SANDRELE II ** H ** | AUTO POSTO SANDRELE II LTDA | LAVRAS | MG"
  },
  {
    "seq_fornecedor": 4803,
    "precoLitro": "6.48",
    "cnpj": "18935742000174",
    "idItem": "28",
    "distanciaOrigem": "1607",
    "posto": "POSTO NOVO RIO LTDA ** H ** | POSTO NOVO RIO LTDA | Carmo da Cachoeira | MG"
  },
  {
    "seq_fornecedor": 2326,
    "precoLitro": "6.69",
    "cnpj": "27599388000145",
    "idItem": "28",
    "distanciaOrigem": "1632",
    "posto": "AUTO POSTO RODOSUL ** H ** | AUTO POSTO SUPER RODASSUL LTDA | Três Corações | MG"
  },
  {
    "seq_fornecedor": 2888,
    "precoLitro": "6.99",
    "cnpj": "25235292000172",
    "idItem": "28",
    "distanciaOrigem": "1636",
    "posto": "POSTO CRUZAMENTO ** H ** | MARINS MARINS CIA LTDA | TRÊS CORAÇÕES | MG"
  },
  {
    "seq_fornecedor": 3679,
    "precoLitro": "6.39",
    "cnpj": "04303112000172",
    "idItem": "28",
    "distanciaOrigem": "1647",
    "posto": "POSTO FAZENDINHA ** H ** | POSTO FAZENDINHA COMBUSTIVEIS | CAMPANHA | MG"
  },
  {
    "seq_fornecedor": 4472,
    "precoLitro": "6.09",
    "cnpj": "20415295008906",
    "idItem": "28",
    "distanciaOrigem": "1668",
    "posto": "DP SAO GONCALO RODOVIA 3 SUL ** H ** | REDE DOM PEDRO DE POSTOS LTDA. | São Gonçalo do Sapucaí | MG"
  },
  {
    "seq_fornecedor": 3191,
    "precoLitro": "6.09",
    "cnpj": "20415295003513",
    "idItem": "28",
    "distanciaOrigem": "1675",
    "posto": "DP SÃO GONÇALO ** H ** | REDE DOM PEDRO DE POSTOS LTDA – FILIAL 35 | Santa Rita do Sapucaí | MG"
  },
  {
    "seq_fornecedor": 3211,
    "precoLitro": "6.77",
    "cnpj": "19848233001572",
    "idItem": "28",
    "distanciaOrigem": "1681",
    "posto": "POSTO CAXUXA MOINHO II ** H ** | FILIAL CAXUXA MOINHO II | São Gonçalo do Sapucaí | MG"
  },
  {
    "seq_fornecedor": 3017,
    "precoLitro": "5.449",
    "cnpj": "18678177000107",
    "idItem": "28",
    "distanciaOrigem": "1681",
    "posto": "POSTO MOINHO ** H ** | POSTO MOINHO LTDA | SÃO GONÇALO DO SAPUCAÍ | MG"
  },
  {
    "seq_fornecedor": 3120,
    "precoLitro": "6.77",
    "cnpj": "19848233001491",
    "idItem": "28",
    "distanciaOrigem": "1681",
    "posto": "POSTO SANTA EDWIGES PETROLEO LTDA - FILIAL CAXUXA MOINHO I ** H ** | POSTO SANTA EDWIGES PETROLEO LTDA - FILIAL CAXUXA MOINHO I | São Gonçalo do Sapucaí | MG"
  },
  {
    "seq_fornecedor": 1267,
    "precoLitro": "5.88",
    "cnpj": "13569064003507",
    "idItem": "28",
    "distanciaOrigem": "1695",
    "posto": "REDE HG MINAS GERAIS ** H ** | REDE HG COMBUSTIVEIS LTDA | CAREACU | MG"
  },
  {
    "seq_fornecedor": 4903,
    "precoLitro": "6.49",
    "cnpj": "02783114000180",
    "idItem": "28",
    "distanciaOrigem": "1704",
    "posto": "AUTO POSTO CAPIXABA ** H ** | AUTO POSTO CAPIXABA LTDA. | Careaçu | MG"
  },
  {
    "seq_fornecedor": 2517,
    "precoLitro": "5.88",
    "cnpj": "13569064004813",
    "idItem": "28",
    "distanciaOrigem": "1720",
    "posto": "POSTO BALANÇA HG ** H ** | REDE HG COMBUSTIVEIS LTDA | SÃO SEBASTIÃO DA BELA VISTA | MG"
  },
  {
    "seq_fornecedor": 4654,
    "precoLitro": "7.19",
    "cnpj": "21038716000158",
    "idItem": "28",
    "distanciaOrigem": "1728",
    "posto": "POSTO FERNANDAO ** H ** | BRITO & RODRIGUES LTDA | Pouso Alegre | MG"
  },
  {
    "seq_fornecedor": 2822,
    "precoLitro": "6.04",
    "cnpj": "20415295001146",
    "idItem": "28",
    "distanciaOrigem": "1745",
    "posto": "DP 2 ** H ** | REDE DOM PEDRO DE POSTOS LTDA – FILIAL 11 | Pouso Alegre | MG"
  },
  {
    "seq_fornecedor": 2823,
    "precoLitro": "5.94",
    "cnpj": "20415295001308",
    "idItem": "28",
    "distanciaOrigem": "1748",
    "posto": "DP POUSO ALEGRE ** H ** | REDE DOM PEDRO DE POSTOS LTDA – FILIAL 13 | Pouso Alegre | MG"
  },
  {
    "seq_fornecedor": 3178,
    "precoLitro": "5.99",
    "cnpj": "20415295001065",
    "idItem": "28",
    "distanciaOrigem": "1751",
    "posto": "DP ESTIVA ROTA SUL ** H ** | REDE DOM PEDRO DE POSTOS LTDA – FILIAL 10 | Estiva | MG"
  },
  {
    "seq_fornecedor": 3006,
    "precoLitro": "6.09",
    "cnpj": "20415295000174",
    "idItem": "28",
    "distanciaOrigem": "1756",
    "posto": "DP 1 ** H ** | REDE DOM PEDRO DE POSTOS LTDA – MATRIZ | Estiva | MG"
  },
  {
    "seq_fornecedor": 3119,
    "precoLitro": "5.99",
    "cnpj": "20415295001650",
    "idItem": "28",
    "distanciaOrigem": "1764",
    "posto": "DP DE CAMBUÍ ** H ** | REDE DOM PEDRO DE POSTOS LTDA | Cambuí | MG"
  },
  {
    "seq_fornecedor": 3180,
    "precoLitro": "5.99",
    "cnpj": "20415295001731",
    "idItem": "28",
    "distanciaOrigem": "1799",
    "posto": "DP ITAPEVA ** H ** | REDE DOM PEDRO DE POSTOS LTDA – FILIAL 17 | Itapeva | MG"
  },
  {
    "seq_fornecedor": 1997,
    "precoLitro": "6.14",
    "cnpj": "31765703000134",
    "idItem": "28",
    "distanciaOrigem": "1823",
    "posto": "POSTO JR FAISAO X ** H ** | POSTO JR FAISÃO X LTDA | Extrema | MG"
  },
  {
    "seq_fornecedor": 2004,
    "precoLitro": "6.14",
    "cnpj": "31765703000215",
    "idItem": "28",
    "distanciaOrigem": "1823",
    "posto": "POSTO JR FAISAO X FL ** H ** | POSTO JR FAISAO X LTDA | Extrema | MG"
  },
  {
    "seq_fornecedor": 3861,
    "precoLitro": "6.09",
    "cnpj": "20415295006458",
    "idItem": "28",
    "distanciaOrigem": "1837",
    "posto": "DP BRAGANÇA RODOVIA ** H ** | REDE DOM PEDRO DE POSTOS LTDA | Bragança Paulista | SP"
  },
  {
    "seq_fornecedor": 3014,
    "precoLitro": "6.09",
    "cnpj": "20415295002975",
    "idItem": "28",
    "distanciaOrigem": "1850",
    "posto": "DP ATIBAIA ** H ** | REDE DOM PEDRO DE POSTOS LTDA – FILIAL 29 | Atibaia | SP"
  },
  {
    "seq_fornecedor": 4850,
    "precoLitro": "6.39",
    "cnpj": "65513848000160",
    "idItem": "28",
    "distanciaOrigem": "1852",
    "posto": "AUTO POSTO GIGIO ** H ** | AUTO POSTO GIGIO LTDA | Atibaia | SP"
  },
  {
    "seq_fornecedor": 3617,
    "precoLitro": "6.19",
    "cnpj": "45583184000106",
    "idItem": "28",
    "distanciaOrigem": "1992",
    "posto": "POSTO BATALHA ** H ** | AUTO POSTO BATALHA | ITAPECERICA DA SERRA | SP"
  },
  {
    "seq_fornecedor": 3852,
    "precoLitro": "6.25",
    "cnpj": "00473804000108",
    "idItem": "28",
    "distanciaOrigem": "2015",
    "posto": "POSTO PANTERÃO ** H ** | PETROLEO SÃO LOURENÇO LTDA | SÃO LOURENÇO DA SERRA | SP"
  },
  {
    "seq_fornecedor": 2147,
    "precoLitro": "6.14",
    "cnpj": "01528658000133",
    "idItem": "28",
    "distanciaOrigem": "2024",
    "posto": "POSTO JUQUITIBA ** H ** | PRESIDENTE JUQUITIBA AUTO POSTO LTDA | JUQUITIBA | SP"
  },
  {
    "seq_fornecedor": 3058,
    "precoLitro": "5.99",
    "cnpj": "20415295003270",
    "idItem": "28",
    "distanciaOrigem": "2066",
    "posto": "DP MIRACATU NORTE ** H ** | REDE DOM PEDRO DE POSTOS LTDA - FILIAL 32 | Miracatu | SP"
  },
  {
    "seq_fornecedor": 3862,
    "precoLitro": "6.04",
    "cnpj": "19242074000324",
    "idItem": "28",
    "distanciaOrigem": "2094",
    "posto": "PELANDA MIRACATU ** H ** | PELANDA PARTICIPAÇÕES LTDA | MIRACATU | SP"
  },
  {
    "seq_fornecedor": 2932,
    "precoLitro": "5.99",
    "cnpj": "54052204000103",
    "idItem": "28",
    "distanciaOrigem": "2136",
    "posto": "REDE GRAAL ** H ** | AUTO POSTO OURO VERDE DE REGISTRO | Registro | SP"
  },
  {
    "seq_fornecedor": 3261,
    "precoLitro": "6.22",
    "cnpj": "55854533000122",
    "idItem": "28",
    "distanciaOrigem": "2143",
    "posto": "GRAAL BUENOS AIRES ** H ** | RODOPOSTO REGISTRO BUENOS AIRES LTDA | Registro | SP"
  },
  {
    "seq_fornecedor": 4339,
    "precoLitro": "6.27",
    "cnpj": "82600834000100",
    "idItem": "28",
    "distanciaOrigem": "2155",
    "posto": "AUTO POSTO PETROPEN ** H ** | AUTO POSTO PETROPEN LTDA | Pariquera-Açu | SP"
  },
  {
    "seq_fornecedor": 3586,
    "precoLitro": "6.79",
    "cnpj": "50947605000162",
    "idItem": "28",
    "distanciaOrigem": "2155",
    "posto": "AUTO POSTO PETROPEN ANHANGUERA LTDA ** H ** | AUTO POSTO PETROPEN ANHANGUERA LTDA | Jundiaí | SP"
  },
  {
    "seq_fornecedor": 3256,
    "precoLitro": "6.39",
    "cnpj": "08425298000193",
    "idItem": "28",
    "distanciaOrigem": "2156",
    "posto": "POSTO MONTE CARLO MENEGUETTI ** H ** | AUTO POSTO JOTAVE LTDA. | PARIQUERA-AÇU | SP"
  },
  {
    "seq_fornecedor": 1606,
    "precoLitro": "6.17",
    "cnpj": "46209847000181",
    "idItem": "28",
    "distanciaOrigem": "2161",
    "posto": "POSTO 4 IRMAOS ** H ** | POSTO 4 IRMAOS JL LTDA | JACUPIRANGA | SP"
  },
  {
    "seq_fornecedor": 1605,
    "precoLitro": "6.17",
    "cnpj": "22307189000100",
    "idItem": "28",
    "distanciaOrigem": "2171",
    "posto": "POSTO ONGARATO ** H ** | POSTO ONGARATO LTDA | Jacupiranga | SP"
  },
  {
    "seq_fornecedor": 3625,
    "precoLitro": "5.89",
    "cnpj": "26616517000101",
    "idItem": "28",
    "distanciaOrigem": "2192",
    "posto": "POSTO ONGARATO 500 ** H ** | AUTO POSTO DE SERVIÇOS ILSE LTDA | CAJATI | SP"
  },
  {
    "seq_fornecedor": 3537,
    "precoLitro": "6.1",
    "cnpj": "27993587000133",
    "idItem": "28",
    "distanciaOrigem": "2217",
    "posto": "POSTO DE COMBUSTIVEIS 528 DA REGIS LTDA ** H ** | POSTO DE COMBUSTIVEIS 528 DA REGIS LTDA | Barra do Turvo | SP"
  },
  {
    "seq_fornecedor": 2502,
    "precoLitro": "6.04",
    "cnpj": "78901915000831",
    "idItem": "28",
    "distanciaOrigem": "2273",
    "posto": "POSTO PELANDA ALPINO III ** H ** | POSTOS PELANDA COMBUSTÍVEIS LTDA | ANTONINA | PR"
  },
  {
    "seq_fornecedor": 2503,
    "precoLitro": "6.04",
    "cnpj": "78901915000670",
    "idItem": "28",
    "distanciaOrigem": "2274",
    "posto": "POSTO PELANDA ALPINO IV ** H ** | POSTOS PELANDA COMBUSTÍVEIS LTDA | ANTONINA | PR"
  },
  {
    "seq_fornecedor": 1619,
    "precoLitro": "5.85",
    "cnpj": "03459313000109",
    "idItem": "28",
    "distanciaOrigem": "2276",
    "posto": "DINOSSAURO NORTE ** H ** | DINOSSAURO NORTE COMERCIO DE COMBUSTIVEIS E LUBRIFICANTES LT | ANTONINA | PR"
  },
  {
    "seq_fornecedor": 1620,
    "precoLitro": "5.85",
    "cnpj": "04313302000170",
    "idItem": "28",
    "distanciaOrigem": "2276",
    "posto": "DINOSSAURO SUL ** H ** | DINOSSAURO SUL COMERCIO DE COMBUSTIVEIS E LUBRIFICANTES LTDA | ANTONINA | PR"
  },
  {
    "seq_fornecedor": 2497,
    "precoLitro": "6.04",
    "cnpj": "78901915000246",
    "idItem": "28",
    "distanciaOrigem": "2281",
    "posto": "POSTO PELANDA ALPINO II ** H ** | POSTOS PELANDA COMBUSTÍVEIS LTDA | CAMPINA GRANDE DO SUL | PR"
  },
  {
    "seq_fornecedor": 3531,
    "precoLitro": "6.1",
    "cnpj": "21542309000183",
    "idItem": "28",
    "distanciaOrigem": "2289",
    "posto": "BR 116 SUL COMERCIO DE COMBUSTIVEIS LTDA ** H ** | BR 116 SUL COMERCIO DE COMBUSTIVEIS LTDA | Campina Grande do Sul | PR"
  },
  {
    "seq_fornecedor": 1336,
    "precoLitro": "6.2",
    "cnpj": "75797530000101",
    "idItem": "28",
    "distanciaOrigem": "2301",
    "posto": "MAHLE CAMPINA GRANDE ** H ** | MAHLE CAMPINA COM DE COMB LTDA | CAMPINA GRANDE DO SUL | PR"
  },
  {
    "seq_fornecedor": 3877,
    "precoLitro": "6.56",
    "cnpj": "47781936000160",
    "idItem": "28",
    "distanciaOrigem": "2320",
    "posto": "POSTO COSTA BRAVA ** H ** | COMERCIO DE COMBUSTIVEIS JM LTDA | QUATRO BARRAS | PR"
  },
  {
    "seq_fornecedor": 3654,
    "precoLitro": "6.64",
    "cnpj": "03302675000183",
    "idItem": "28",
    "distanciaOrigem": "2364",
    "posto": "POSTO 2 IRMAOS ** H ** | PETROTRUCK COM DE COMBUSTIVEIS | CURITIBA | PR"
  },
  {
    "seq_fornecedor": 3653,
    "precoLitro": "6.64",
    "cnpj": "08704174000147",
    "idItem": "28",
    "distanciaOrigem": "2366",
    "posto": "POSTO 2 IRMAOS 3 ** H ** | MSKT COMERCIO DE COMBUSTÍVEIS | CURITIBA | PR"
  },
  {
    "seq_fornecedor": 2293,
    "precoLitro": "6.45",
    "cnpj": "07473735014212",
    "idItem": "28",
    "distanciaOrigem": "2374",
    "posto": "SIM CAMPO DE SANTANA ** H ** | SIM REDE DE POSTOS LTDA | CURITIBA | PR"
  },
  {
    "seq_fornecedor": 1555,
    "precoLitro": "6.45",
    "cnpj": "07473735014301",
    "idItem": "28",
    "distanciaOrigem": "2374",
    "posto": "SIM TATUQUARA ** H ** | SIM REDE DE POSTOS LTDA | CURITIBA | PR"
  },
  {
    "seq_fornecedor": 2734,
    "precoLitro": "6.04",
    "cnpj": "78901915001307",
    "idItem": "28",
    "distanciaOrigem": "2375",
    "posto": "POSTOS PELANDA 16 ** H ** | POSTOS PELANDA | CURITIBA | PR"
  },
  {
    "seq_fornecedor": 3863,
    "precoLitro": "6.04",
    "cnpj": "19242074000405",
    "idItem": "28",
    "distanciaOrigem": "2379",
    "posto": "PELANDA 21 ** H ** | PELANDA PARTICIPAÇÕES LTDA | FAZENDA RIO GRANDE | PR"
  },
  {
    "seq_fornecedor": 1726,
    "precoLitro": "6.04",
    "cnpj": "77969251000103",
    "idItem": "28",
    "distanciaOrigem": "2381",
    "posto": "PELANDA GRALHA AZUL ** H ** | AUTO POSTO PELANDA LTDA | FAZENDA RIO GRANDE | PR"
  },
  {
    "seq_fornecedor": 1837,
    "precoLitro": "6.2",
    "cnpj": "27175818000100",
    "idItem": "28",
    "distanciaOrigem": "2443",
    "posto": "AUTO POSTO MANU ** H ** | AUTO POSTO MANU LTDA - ME | CAMPO DO TENENTE | PR"
  },
  {
    "seq_fornecedor": 2424,
    "precoLitro": "6.55",
    "cnpj": "78637030000109",
    "idItem": "28",
    "distanciaOrigem": "2470",
    "posto": "AUTO POSTO AG6 ** H ** | AUTO POSTO AG6 LTDA | MAFRA | SC"
  },
  {
    "seq_fornecedor": 2093,
    "precoLitro": "6.49",
    "cnpj": "17571257000104",
    "idItem": "28",
    "distanciaOrigem": "2514",
    "posto": "AUTO POSTO NORTE SUL LTDA ** H ** | POSTO CARRETAO II | Abdon Batista | SC"
  },
  {
    "seq_fornecedor": 1727,
    "precoLitro": "6.04",
    "cnpj": "97423784000100",
    "idItem": "28",
    "distanciaOrigem": "2561",
    "posto": "PELANDA RESIDENCIA F ** H ** | AUTO POSTO RESIDENCIA FUCK LTDA | MONTE CASTELO | SC"
  },
  {
    "seq_fornecedor": 2219,
    "precoLitro": "6.96",
    "cnpj": "80979107000324",
    "idItem": "28",
    "distanciaOrigem": "2591",
    "posto": "POSTO SERRANO III ** H ** | CESCA E CIA LTDA  III | SANTA CECÍLIA | SC"
  },
  {
    "seq_fornecedor": 2421,
    "precoLitro": "6.74",
    "cnpj": "26186151000170",
    "idItem": "28",
    "distanciaOrigem": "2600",
    "posto": "AUTO POSTO AG5 ** H ** | AUTO POSTO AG5 LTDA | SANTA CECÍLIA | SC"
  },
  {
    "seq_fornecedor": 3206,
    "precoLitro": "6.5",
    "cnpj": "00306799000149",
    "idItem": "28",
    "distanciaOrigem": "2605",
    "posto": "POSTO SCARIOT ** H ** | POSTO SCARIOT LTDA | SANTA CECÍLIA | SC"
  },
  {
    "seq_fornecedor": 2223,
    "precoLitro": "6.96",
    "cnpj": "80979107000243",
    "idItem": "28",
    "distanciaOrigem": "2626",
    "posto": "POSTO SERRANO II ** H ** | CESCA E CIA LTDA  II | Ponte Alta do Norte | SC"
  },
  {
    "seq_fornecedor": 2221,
    "precoLitro": "6.96",
    "cnpj": "82732322000190",
    "idItem": "28",
    "distanciaOrigem": "2626",
    "posto": "POSTO SERRANO VII ** H ** | COMÉRCIO DE COMBUSTÍVEIS E LUBRIFICANTES TANGARÁ | PONTE ALTA DO NORTE | SC"
  },
  {
    "seq_fornecedor": 2218,
    "precoLitro": "6.96",
    "cnpj": "80979107000162",
    "idItem": "28",
    "distanciaOrigem": "2643",
    "posto": "POSTO SERRANO ** H ** | CESCA E CIA LTDA | SÃO CRISTOVÃO DO SUL | SC"
  },
  {
    "seq_fornecedor": 2286,
    "precoLitro": "6.65",
    "cnpj": "80979107000596",
    "idItem": "28",
    "distanciaOrigem": "2654",
    "posto": "POSTO SERRANO V ** H ** | CESCA & CIA LTDA | PONTE ALTA | SC"
  },
  {
    "seq_fornecedor": 2220,
    "precoLitro": "6.96",
    "cnpj": "80979107000405",
    "idItem": "28",
    "distanciaOrigem": "2664",
    "posto": "POSTO SERRANO IV ** H ** | CESCA E CIA LTDA IV | PONTE ALTA | SC"
  },
  {
    "seq_fornecedor": 4549,
    "precoLitro": "6.59",
    "cnpj": "80959588000306",
    "idItem": "28",
    "distanciaOrigem": "2703",
    "posto": "POSTO LEO AMPESSAN LTDA ** H ** | POSTO LEO AMPESSAN LTDA | Correia Pinto | SC"
  },
  {
    "seq_fornecedor": 668,
    "precoLitro": "6.96",
    "cnpj": "80959588000144",
    "idItem": "28",
    "distanciaOrigem": "2703",
    "posto": "POSTO SERRANO VIII ** H ** | POSTO LEO AMPESSAN LTDA | LAGES | SC"
  },
  {
    "seq_fornecedor": 1500,
    "precoLitro": "6.17",
    "cnpj": "07473735004330",
    "idItem": "28",
    "distanciaOrigem": "2804",
    "posto": "SIM MONTE CLARO ** H ** | SIM REDE DE POSTOS LTDA | VACARIA | RS"
  }
].map(posto => ({
    ...posto,
    precoLitro: parseFloat(posto.precoLitro),
    distanciaOrigem: parseInt(posto.distanciaOrigem)
}));

function main() {
    console.time('tempo-script');


    const qtdNecessariaAbastecer = Math.ceil(distanciaViagem / consumoMedio - capacidadeEfetivaTanque);
    if (qtdNecessariaAbastecer <= 0) {
        return;
    }
    const listaPostoPorMenorPreco = listaPostos.sort((a, b) => a.precoLitro - b.precoLitro);
    const abastecimentos: Abastecimento[] = [];
    const abasteceuSuficiente = calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, 0, abastecimentos);

    console.log("Abastecimentos realizados:");
    console.table(abastecimentos.map(a => ({
        ...a,
        posto: a.posto.posto,
    })));
    console.log("Necessita abastecer:", qtdNecessariaAbastecer, "litros");
    console.log("Abasteceu:", abastecimentos.reduce((total, a) => total + a.litros, 0), "litros");
    console.log("Abasteceu o suficiente? ", abasteceuSuficiente ? "Sim" : "Não");

    console.timeEnd('tempo-script');

}
main()

function calcularAbastecimento(qtdNecessariaAbastecer: number, listaPostoPorMenorPreco: Posto[], indicePostoAtual: number, abastecimentos: Abastecimento[]): boolean {
    if (qtdNecessariaAbastecer <= 0) {
        return true; // Já abastecemos o suficiente
    }
    if (indicePostoAtual >= listaPostoPorMenorPreco.length) {
        return false; // Não há mais postos para abastecer
    }

    // posto mais barato
    const postoAtual = listaPostoPorMenorPreco[indicePostoAtual];
    // quantidade de litros no tanque ao chegar no posto
    let litrosTanqueNoPosto = getLitrosTanqueNoPosto(postoAtual.distanciaOrigem, abastecimentos);

    if (litrosTanqueNoPosto >= capacidadeEfetivaTanque) {
        // Já temos litros suficientes no tanque, não podemos abastecer neste posto, tentar o próximo mais barato
        return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco, indicePostoAtual + 1, abastecimentos);
    }

    if (litrosTanqueNoPosto < 0) {
        // abastecer em um posto com distancia menor que o atual para ter diesel para chegar nele
        const abasteceuSuficiente = calcularAbastecimento(-litrosTanqueNoPosto, listaPostoPorMenorPreco.filter(p => p.distanciaOrigem < postoAtual.distanciaOrigem), 0, abastecimentos);
        if (abasteceuSuficiente) {
            qtdNecessariaAbastecer -= -litrosTanqueNoPosto; // Atualiza a quantidade necessária para abastecer
            litrosTanqueNoPosto = 0;
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

    // Chama recursivamente o próximo posto mais barato, filtrando os postos anteriores ao atual
    return calcularAbastecimento(qtdNecessariaAbastecer, listaPostoPorMenorPreco.filter(p => p.distanciaOrigem > postoAtual.distanciaOrigem), 0, abastecimentos);

}
// Calcula a quantidade de litros no tanque ao chegar no posto
function getLitrosTanqueNoPosto(distanciaOrigem: number, abastecimentos: Abastecimento[]): number {
    const abastecimentoAteKm = abastecimentos.filter(a => a.km <= distanciaOrigem).reduce((total, a) => total + a.litros, 0);
    return capacidadeEfetivaTanque + abastecimentoAteKm - (distanciaOrigem / consumoMedio);
}
