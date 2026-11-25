namespace ApiOficina.Data;
using Microsoft.EntityFrameworkCore;
using ApiOficina.Models;

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }

    public DbSet<OficinaEntity> Oficina => Set<OficinaEntity>();
}