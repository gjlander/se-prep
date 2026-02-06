# Generics and Constraints

## Lesson Plan

- Very similar to TS, syntax as well
- Built-in Generics
  - `List<T>`, `Dictionary<TKey, Tvalue>`, `Func<in T, out T>`
- Generic classes
- Constraints
- IEquatable (for exercise)
- IComparable (for exercise)

## Generics Refresher (start with LMS article)

- Generics in C# are very similar to Generics in TS. They allow us to write flexible, reusable code.
- They both use the `<T>` syntax, where `T` is a placeholder for the type
- Generics are essentially types that rely on other types to be complete
  - e.g. I have a list, but a list of WHAT?

## Built-in Generics

- Also like TS, C# has some built-in generics you've already been working with - such as?
  - `List<T>` (What are 4 ways we can init a list of strings?)

```c#
// List<string> myStrings = new List<string> { "hi", "yes", "no", "why" };
// List<string> myStrings = new() {"hi", "yes", "no", "why" };
// List<string> myStrings = ["hi", "yes", "no", "why"];
var myStrings = new List<string> { "hi", "yes", "no", "why" };
```

- `Dictionary<TKey, Tvalue>`

```c#
Dictionary<string, string> phoneBook = new()
{
  ["Jeff"] = "0123456789"
};
// var phoneBook = new Dictionary<string, string>
// {
//   ["Jeff"] = "0123456789"
// };
```

- `Func<in T, out T>`

```c#
Func<decimal, decimal, decimal> divide = (n1, n2) => n1 / n2;

Console.WriteLine(divide(20m, 7m));
```

- `Nullable<T>` (`T?`)
  - Generics are what also give us nullable values. We don't normally use the generic syntax, but it's doing the same thing for us
  - Note that the generic syntax only works for values that aren't already nullable (wouldn't work with strings)

```c#
// Nullable<int> nullableInt =  5;
int? nullableInt = 5;
nullableInt = null;
nullableInt = 7;
// string? nullableString = null;
// nullableString = "Not null anymore!";

Console.WriteLine(nullableInt);
```

## Generic Classes

- Just as with TS, most of the time when we use generics, we won't be building them ourselves, but rather built-in generics, or generics from libraries (think `useState` in React or `RequestHandler` in Express)
- But to get familiar (and in case we need to), it's good to look at how to build our own generic classes

### Breaking down the `GenericList` class

- Remember Linked Lists all the way back from DSA? Let's break down the `GenericList` example in the LMS where we build a custom linked list
- We first need to declare our class as generic
- `Utils/GenericList.cs`

```c#
public class GenericList<T>
{

}
```

- We'll also create a nested `Node` class. We could declare this class outside, but by nesting it, we limit the scope and use our OOP principle of encapsulation
  - We're using a primary constructor, and pass our `T` type
  - Remember `Node` needs to be nullable, because we use `null` to find the end of the list

```c#
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
}
```

- We add a private `head` field to store the start of the list

```c#
 // First item in the linked list
    private Node? head;
```

- We use the generic `T` to type our method parameters too

```c#
 public void AddHead(T t)
    {
        Node n = new(t);
        n.Next = head;
        head = n;
    }
```

- From here, we can take the usage examples, and add items to our list

```c#
using Generics.Utils

GenericList<string> stringList = new();

stringList.AddHead("C#");
stringList.AddHead("from");
stringList.AddHead("World");
stringList.AddHead("Hello");

foreach (string s in stringList)
{
  Console.WriteLine(s);
}

GenericList<int> numberList = new();

numberList.AddHead(4);
numberList.AddHead(3);
numberList.AddHead(2);
numberList.AddHead(1);

foreach (int i in numberList)
{
  Console.WriteLine(i);
}
```

- We get an error in our `foreach` loop though, which essentially tells us we need the missing `GetEnumerator` method
- `GetEnumerator` will return an `IEnumerator` that we can also type (showing how we can use generics for the return type of a method)
  - `yield return` in an iterator will provide the next value, or signal the end
  - so we essentially make a while loop to iterate over all the items in our list until we reach `null` (the end of the list)

```c#
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
```

- Now we can use `foreach` to iterate over our list

## Generic Methods

- Methods can be generic, even if the class they belong to isn't
  - Remember top-level statements in `Program.cs` belong to the `Program` class

```c#
int a = 1, b = 2;
Swap(ref a, ref b);
Console.WriteLine($"a = {a}, b = {b}"); // a = 2, b = 1

string x = "hello", y = "world";
Swap(ref x, ref y);
Console.WriteLine($"x = {x}, y = {y}"); // x = world, y = hello

void Swap<T>(ref T lhs, ref T rhs)
{
    (lhs, rhs) = (rhs, lhs);
}
```

## Constraints (go to LMS constraint keywords)

- Again, just as with TS, we can provide some constraints that our generic type must satisfy
- Let's build a variation of the `Repository` example in the LMS, based on specs in the exercise today (finishing the class will be up to you)
- Let's start with creating our `GenericRepository` class
  - We'll use a `Dictionary` instead of a `List`, but either could work
- We start with the constraint `class`, this means that our `T` has to be a reference type (so no numeric types, `bool`, or `char`, `structs`, etc.)

```c#
namespace Generics.Services;

public class GenericRepository<T> where T : class
{
  private readonly Dictionary<int, T> _store = new();
}
```

- We want to add a second constraint - we want to ensure whatever get's passed here, also has an `Id` property. So we can make an interface to support that
- `Models/IIdentifiable.cs`

```c#
namespace Generics.Models;

public interface IIdentifiable { int Id { get; } }
```

- We can add multiple constraints with comma separated values

```c#
namespace Generics.Services;

using Generics.Models;
public class GenericRepository<T> where T : class, IIdentifiable
{
  private readonly Dictionary<int, T> _store = new();

}
```

- Because we're enforcing that `T` has an `int Id` property, we can safely access that property, and use it for our key

```c#
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
```

- We can make a couple of classes that implement `IIdentifiable` to test
  - Similar to Python, every class in C# has a `ToString()` method that determines the output when you cast it to a string (as when using string interpolation/formatted strings). When building our own classes, we can override this to give meaning information
  - It bears repeating, that you can instantiate a class without a constructor, and the C# compiler will provide one automatically, you can then directly set the properties when instantiating an instance of the class.
  - You can use these classes for testing in the exercise today
- `Models/Employee.cs`

```c#
namespace Generics.Models;

sealed class Employee : IIdentifiable
{
  public int Id { get; set; }
  public string Name { get; set; } = "";
  public string Department { get; set; } = "";

  public override string ToString() => $"{Id}: {Name} ({Department})";
}
```

- `Models/BlogPost.cs`

```c#
namespace Generics.Models;

sealed class BlogPost : IIdentifiable
{
  public int Id { get; set; }
  public string Title { get; set; } = "";
  public int Likes { get; set; }

  public override string ToString() => $"{Id}: {Title} [Likes: {Likes}]";
}
```

- We can test in `Program.cs`

```c#
using Generics.Models;
Console.WriteLine("== GenericRepository<T> demo ==");
Console.WriteLine("== Employees ==");
var empRepo = new GenericRepository<Employee>();
empRepo.Add(new Employee { Id = 1, Name = "Ada", Department = "R&D" });
empRepo.Add(new Employee { Id = 2, Name = "Grace", Department = "Ops" });

var e = empRepo.GetById(1);
Console.WriteLine($"GetById(1): {e}");
Console.WriteLine();
```

- and `BlogPosts`

```c#
Console.WriteLine("== BlogPosts ==");
var blogRepo = new GenericRepository<BlogPost>();
blogRepo.Add(new BlogPost { Id = 1, Title = "Generics in C#", Likes = 10 });
blogRepo.Add(new BlogPost { Id = 2, Title = "Understanding Delegates", Likes = 25 });

var post = blogRepo.GetById(2);
Console.WriteLine($"GetById(2): {post}");
```

#### I will offer some tips, but treat `Pair<T1, T2>` and `FindMax<T>` as **bonus**. They're pretty complicated, and we don't really revisit those concepts.
