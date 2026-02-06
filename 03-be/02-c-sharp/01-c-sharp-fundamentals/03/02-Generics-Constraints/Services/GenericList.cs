namespace Generics.Services;

// Type parameter T in angle brackets.
public class GenericList<T>
{
  // The nested class is also generic, and
  // holds a data item of type T.
  private class Node(T t)
  {
    // T as property type.
    public T Data { get; set; } = t;

    public Node? Next { get; set; }
  }

  // First item in the linked list
  private Node? head;

  public void AddHead(T t)
  {
    Node n = new(t);
    n.Next = head;
    head = n;
  }

  // T in method return type.
  public IEnumerator<T> GetEnumerator()
  {
    Node? current = head;

    while (current is not null)
    {
      yield return current.Data;
      current = current.Next;
    }
  }
}