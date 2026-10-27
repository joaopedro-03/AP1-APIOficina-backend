
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api", () => "API da Oficina está no ar!");

app.MapPost("/api/ordens", async (OrdemServicoEntradaDTO dados, ApiDbContext db) =>
{
    var oficina = new OficinaEntity
    {
        cliente = dados.cliente,
        veiculo = dados.veiculo,
        servico = dados.servico,
        valor = dados.valor,
        concluida = dados.concluida
    };

    db.Oficina.Add(oficina);
    await db.SaveChangesAsync();

    return Results.Created($"/api/ordens/{oficina.Id}", oficina);
});

app.MapGet("/api/ordens", async (ApiDbContext db) =>
{
    var ordens = await db.Oficina.ToListAsync();
    return Results.Ok(ordens);
});

app.MapGet("/api/ordens/{id:int}", async (int id, ApiDbContext db) =>
{
    var ordemEncontrada = await db.Oficina.FindAsync(id);

    if (ordemEncontrada is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(ordemEncontrada);
});

app.MapPut("/api/ordens/{id:int}", async (int id, OrdemServicoEntradaDTO dados, ApiDbContext db) =>
{
    var ordemEncontrada = await db.Oficina.FindAsync(id);

    if (ordemEncontrada is null)
    {
        return Results.NotFound();
    }

    ordemEncontrada.cliente = dados.cliente;
    ordemEncontrada.veiculo = dados.veiculo;
    ordemEncontrada.servico = dados.servico;
    ordemEncontrada.valor = dados.valor;
    ordemEncontrada.concluida = dados.concluida;

    await db.SaveChangesAsync();

    return Results.Ok(ordemEncontrada);
});

app.MapDelete("/api/ordens/{id:int}", async (int id, ApiDbContext db) =>
{
    var ordemEncontrada = await db.Oficina.FindAsync(id);

    if (ordemEncontrada is null)
    {
        return Results.NotFound();
    }

    db.Oficina.Remove(ordemEncontrada);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();

// MODEL
class OficinaEntity
{
    public int Id { get; set; }
    public string cliente { get; set; } = string.Empty;
    public string veiculo { get; set; } = string.Empty;
    public string servico { get; set; } = string.Empty;
    public double valor { get; set; }
    public bool concluida { get; set; }
}

// DBCONTEXT
class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }

    public DbSet<OficinaEntity> Oficina => Set<OficinaEntity>();
}

// DTO DE ENTRADA
record OrdemServicoEntradaDTO(
    string cliente,
    string veiculo,
    string servico,
    double valor,
    bool concluida
);
