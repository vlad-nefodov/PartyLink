using Microsoft.EntityFrameworkCore;
using PartyLink.Domain.Entities;

namespace PartyLink.Domain.Extensions;

public static class TableConfigurationExtensions
{
    public static void ConfigureUsersTable(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().ToTable(t => t.IsTemporal());

        modelBuilder.Entity<User>().Property(u => u.Id).ValueGeneratedOnAdd();
        modelBuilder.Entity<User>().Property(u => u.Name).HasMaxLength(25);
        modelBuilder.Entity<User>().Property(u => u.Surname).HasMaxLength(25);
        modelBuilder.Entity<User>().Property(u => u.Email).HasMaxLength(50);
        modelBuilder.Entity<User>().Property(u => u.MobilePhone).HasMaxLength(16);
        modelBuilder.Entity<User>().Property(u => u.PasswordHash).HasMaxLength(64);

        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.MobilePhone).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.PasswordHash).IsUnique();

        modelBuilder.Entity<User>()
            .HasOne(u => u.Avatar)
            .WithOne(a => a.User)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasOne(u => u.RefreshToken)
            .WithOne(rt => rt.User)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public static void ConfigureUsersAvatarsTable(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Avatar>().ToTable(t => t.IsTemporal());
        modelBuilder.Entity<Avatar>().HasKey(a => a.UserId);
    }

    public static void ConfigureUsersRefreshTokensTable(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RefreshToken>().ToTable(t => t.IsTemporal());

        modelBuilder.Entity<RefreshToken>().HasKey(rt => rt.UserId);
        modelBuilder.Entity<RefreshToken>().Property(rt => rt.Hash).HasMaxLength(64);
        modelBuilder.Entity<RefreshToken>().HasIndex(rt => rt.Hash).IsUnique();
    }

    public static void ConfigureEventsTable(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Event>().ToTable(t =>
        {
            t.IsTemporal();
            t.HasCheckConstraint($"CK_Events_{nameof(Event.EndsAt)}",
                $"{nameof(Event.EndsAt)} > {nameof(Event.StartsAt)}");
        });

        modelBuilder.Entity<Event>().Property(e => e.Id).ValueGeneratedOnAdd();
        modelBuilder.Entity<Event>().Property(e => e.Title).HasMaxLength(80);
        modelBuilder.Entity<Event>().Property(e => e.Description).HasMaxLength(200);

        modelBuilder.Entity<Event>().HasIndex(e => new {e.Title, e.Description}).IsUnique();

        modelBuilder.Entity<Event>()
            .HasOne(e => e.Location)
            .WithOne(el => el.Event)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public static void ConfigureEventsLocationsTable(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EventLocation>().ToTable(t =>
        {
            t.IsTemporal();
            t.HasCheckConstraint($"CK_EventsLocations_{nameof(EventLocation.Latitude)}",
                $"{nameof(EventLocation.Latitude)} >= -90 AND {nameof(EventLocation.Latitude)} <= 90");
            t.HasCheckConstraint($"CK_EventsLocations_{nameof(EventLocation.Longitude)}",
                $"{nameof(EventLocation.Longitude)} >= -180 AND {nameof(EventLocation.Longitude)} <= 180");
        });
        modelBuilder.Entity<EventLocation>().HasKey(el => el.EventId);
    }

    public static void ConfigureEventTagsTable(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EventTag>().ToTable(t => t.IsTemporal());

        modelBuilder.Entity<EventTag>().Property(e => e.Id).ValueGeneratedOnAdd();
        modelBuilder.Entity<EventTag>().Property(et => et.Title).HasMaxLength(30);
    }

    public static void ConfigureEventsUsersTable(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EventUser>().ToTable(t => t.IsTemporal());

        modelBuilder.Entity<EventUser>().HasKey(eu => new {eu.EventId, eu.UserId});

        modelBuilder.Entity<EventUser>()
            .HasOne(eu => eu.Event)
            .WithMany(e => e.Users)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EventUser>()
            .HasOne(eu => eu.User)
            .WithMany(u => u.Events)
            .OnDelete(DeleteBehavior.Cascade);
    }
}