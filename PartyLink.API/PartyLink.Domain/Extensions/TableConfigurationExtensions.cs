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
}