namespace ApiOficina.Dtos;
record OrdemServicoEntradaDTO(
    string cliente,
    string veiculo,
    string servico,
    double valor,
    bool concluida
);
