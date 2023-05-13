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

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Avatar> UsersAvatars { get; set; } = null!;
    public DbSet<RefreshToken> UsersRefreshTokens { get; set; } = null!;

    public DbSet<Event> Events { get; set; } = null!;
    public DbSet<EventLocation> EventsLocations { get; set; } = null!;
    public DbSet<EventTag> EventTags { get; set; } = null!;
    public DbSet<EventUser> EventsUsers { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ConfigureUsersTable();
        modelBuilder.ConfigureUsersAvatarsTable();
        modelBuilder.ConfigureUsersRefreshTokensTable();

        modelBuilder.ConfigureEventsTable();
        modelBuilder.ConfigureEventsLocationsTable();
        modelBuilder.ConfigureEventTagsTable();
        modelBuilder.ConfigureEventsUsersTable();
    }
}