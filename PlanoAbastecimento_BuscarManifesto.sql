WITH Manifesto AS (
    SELECT               
        V.CODVEI as placaVeiculo,
        V.CODMDV,
        SUM(N.PESOKG) AS peso,
        CONCAT(M.CODFIL, '-', M.SERMAN, '-', M.CODMAN) AS idManifesto,
        HOR.CODINT as idRotograma,
        V.QTDLIT as capacidadeTanque,
        M.DATINC
    FROM 
        RODMAN M          
    INNER JOIN 
        RODIMA I ON M.CODFIL = I.FILMAN AND M.SERMAN = I.SERMAN AND M.CODMAN = I.CODMAN
        AND M.MDFEAUT = 'S' 
        AND M.SITUAC NOT IN ('I','C') 
        AND M.DATINC >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE())-5, 0)  -- A data de inclusão do manifesto deve ser nos últimos 5 dias
        --AND M.DATINC >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE())-3, 0) 
       -- AND M.DATINC <= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE())-1, 0)
    INNER JOIN 
        RODCON C ON C.CODFIL = I.FILDOC AND C.SERCON = I.SERDOC AND C.CODCON = I.CODDOC  
    INNER JOIN 
        RODNFC N ON C.CODFIL = N.CODFIL AND C.SERCON = N.SERCON AND C.CODCON = N.CODCON 
    INNER JOIN 
        RODVEI AS V ON C.PLACA = V.CODVEI
    INNER JOIN 
        RODHOR HOR ON HOR.CODHOR = M.CODHOR 
    WHERE 
        (M.LIBUSU IS NULL OR M.LIBUSU NOT LIKE '%PA%')
        --AND HOR.CODINT IN ('1951329') --REMOVER 
        AND HOR.CODINT IS NOT NULL
    GROUP BY 
        M.CODFIL, M.SERMAN, M.CODMAN, V.CODVEI, V.CODMDV, HOR.CODINT, V.QTDLIT, M.DATINC
)
--RankedManifesto AS (
    SELECT
    --TOP 1 --REMOVER 
        M.*,
        --ROW_NUMBER() OVER (PARTITION BY M.idRotograma ORDER BY M.peso DESC) as rn,
        (
            SELECT TOP 1 RHICM.INIFAX 
            FROM RHCOMI RHC 
            LEFT JOIN RHICO RHI ON RHC.CODCOM = RHI.CODCOM
            LEFT JOIN RHICM ON RHICM.ID_ICO = RHI.ID_ICO 
            WHERE RHC.CODMDV = M.CODMDV
            AND (M.peso BETWEEN RHI.INIFAX AND RHI.FIMFAX OR (SELECT MAX(FIMFAX) FROM RHICO WHERE CODCOM = RHC.CODCOM ) = RHI.FIMFAX)
            AND RHICM.INIFAX > 1 
            ORDER BY RHICM.INIFAX ASC
        ) as metaMediaVeiculo,
        300 as kmDeFuga,
        M.capacidadeTanque as litrosTanqueNoInicio,
        15 as margemSegurancaTanque
    FROM 
        Manifesto M  
--)
--SELECT *
--FROM RankedManifesto
--WHERE rn = 1
--ORDER BY DATINC DESC
--OFFSET 0 ROWS FETCH NEXT 300 ROWS ONLY;
