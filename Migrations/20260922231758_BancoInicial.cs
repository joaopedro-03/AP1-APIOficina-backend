using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiOficina.Migrations
{
    /// <inheritdoc />
    public partial class BancoInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Oficina",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    cliente = table.Column<string>(type: "TEXT", nullable: false),
                    veiculo = table.Column<string>(type: "TEXT", nullable: false),
                    valor = table.Column<double>(type: "REAL", nullable: false),
                    concluida = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Oficina", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Oficina");
        }
    }
}
