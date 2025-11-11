namespace Generics.Models;

sealed class Employee : IIdentifiable
{
  public int Id { get; set; }
  public string Name { get; set; } = "";
  public string Department { get; set; } = "";

  public override string ToString() => $"{Id}: {Name} ({Department})";
}