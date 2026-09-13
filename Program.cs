var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var ordens = new List<OrdemServico>
{
    new OrdemServico(1, "João Pedro", "Corsa Classic", "Troca de óleo", 150.00, false),
    new OrdemServico(2, "Carlos Silva", "Gol 2018", "Troca de pastilhas de freio", 350.00, true)
};

app.MapGet("/", () => "API da Oficina está no ar!");

app.MapGet("/api/ordens", () =>
{
    return Results.Ok(ordens);
});

app.MapGet("/api/ordens/{id:int}", (int id) =>
{
    var ordemEncontrada = ordens.Find(ordem => ordem.Id == id);

    if (ordemEncontrada is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(ordemEncontrada);
});

app.MapPost("/api/ordens", (OrdemServicoEntradaDTO dados) =>
{
    int proximoId = ordens.Count + 1;

    var novaOrdem = new OrdemServico(
        proximoId, dados.cliente, dados.veiculo, dados.servico, dados.valor, false
    );

    ordens.Add(novaOrdem);

    return Results.Created($"/api/ordens/{novaOrdem.Id}", novaOrdem);
});

app.MapPut("/api/ordens/{id:int}", (int id, OrdemServicoEntradaDTO dados) =>
{
    int indice = ordens.FindIndex(ordemDaLista => ordemDaLista.Id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }

    var atualizado = new OrdemServico(
        id, dados.cliente, dados.veiculo, dados.servico, dados.valor, dados.concluida
    );

    ordens[indice] = atualizado;

    return Results.Ok(atualizado);
});

app.MapDelete("/api/ordens/{id:int}", (int id) =>
{
    int indice = ordens.FindIndex(ordemDaLista => ordemDaLista.Id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }

    ordens.RemoveAt(indice);

    return Results.NoContent();
});

app.Run();

record OrdemServico(
    int Id, string cliente, string veiculo, string servico, double valor, bool concluida
);

record OrdemServicoDTO(
    int Id, string cliente, string veiculo, string servico, double valor, bool concluida
);

record OrdemServicoEntradaDTO(
    string cliente, string veiculo, string servico, double valor, bool concluida
);