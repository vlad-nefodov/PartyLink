using Microsoft.EntityFrameworkCore;
using PartyLink.Domain.Entities;
using PartyLink.Domain.Extensions;

namespace PartyLink.Domain;

public sealed class PartyLinkDbContext : DbContext
{
    public PartyLinkDbContext(DbContextOptions<PartyLinkDbContext> options) : base(options)
    {
        Database.EnsureCreated();
    }

    public DbSet<RefreshToken> UsersRefreshTokens { get; set; } = null!;
    public DbSet<Avatar> UsersAvatars { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ConfigureUsersRefreshTokensTable();
        modelBuilder.ConfigureUsersAvatarsTable();
        modelBuilder.ConfigureUsersTable();
    }
}