namespace ApiOficina.Models;
class OficinaEntity
{
    public int Id { get; set; }
    public string cliente { get; set; } = string.Empty;
    public string veiculo { get; set; } = string.Empty;
    public string servico { get; set; } = string.Empty;
    public double valor { get; set; }
    public bool concluida { get; set; }
}