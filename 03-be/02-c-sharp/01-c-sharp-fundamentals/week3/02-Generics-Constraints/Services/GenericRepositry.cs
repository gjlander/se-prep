namespace Generics.Services;

using Generics.Models;
public class GenericRepository<T> where T : class, IIdentifiable
{
  private readonly Dictionary<int, T> _store = new();

  public void Add(T item)
  {
    _store[item.Id] = item;
    Console.WriteLine($"Saved entity of type {typeof(T).Name} with Id {item.Id}");
  }
  public T? GetById(int id)
  {
    _store.TryGetValue(id, out T? item);
    return item;
  }
}