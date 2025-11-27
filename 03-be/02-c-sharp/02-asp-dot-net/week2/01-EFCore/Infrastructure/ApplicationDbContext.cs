using Microsoft.EntityFrameworkCore;
using BlogApi.Models;

namespace BlogApi.Infrastructure;

public class ApplicationDbContext : DbContext
{
  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

  public DbSet<User> Users => Set<User>();
  public DbSet<Post> Posts => Set<Post>();

  // protected override void OnModelCreating(ModelBuilder modelBuilder)
  // {
  //   base.OnModelCreating(modelBuilder);

  //   var userAliceId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
  //   var userBobId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
  //   var post1Id = Guid.Parse("11111111-1111-1111-1111-111111111111");
  //   var post2Id = Guid.Parse("22222222-2222-2222-2222-222222222222");

  //   modelBuilder.Entity<User>().HasData(
  //       new User { Id = userAliceId, Name = "Alice", Email = "alice@mail", CreatedAt = new DateTimeOffset(2025, 11, 3, 12, 10, 30, new TimeSpan(1, 0, 0)) },
  //       new User { Id = userBobId, Name = "Bob", Email = "bob@mail", CreatedAt = new DateTimeOffset(2025, 11, 3, 12, 10, 30, new TimeSpan(1, 0, 0)) }
  //   );

  //   modelBuilder.Entity<Post>().HasData(
  //       new Post { Id = post1Id, UserId = userAliceId, Title = "Hello World", Content = "First post", PublishedAt = new DateTimeOffset(2025, 11, 3, 12, 10, 30, new TimeSpan(1, 0, 0)) },
  //       new Post { Id = post2Id, UserId = userBobId, Title = "Second", Content = "Another post", PublishedAt = null }
  //   );
  // }
}