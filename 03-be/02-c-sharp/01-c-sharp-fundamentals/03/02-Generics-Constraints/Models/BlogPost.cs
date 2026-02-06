namespace Generics.Models;

sealed class BlogPost : IIdentifiable
{
  public int Id { get; set; }
  public string Title { get; set; } = "";
  public int Likes { get; set; }

  public override string ToString() => $"{Id}: {Title} [Likes: {Likes}]";
}