using Generics.Services;
using Generics.Models;
// List<string> myStrings = new List<string> { "hi", "yes", "no", "why" };
// List<string> myStrings = new() {"hi", "yes", "no", "why" };
// List<string> myStrings = ["hi", "yes", "no", "why"];
var myStrings = new List<string> { "hi", "yes", "no", "why" };

Dictionary<string, string> phoneBook = new()
{
  ["Jeff"] = "0123456789"
};
// var phoneBook = new Dictionary<string, string>
// {
//   ["Jeff"] = "0123456789"
// };

Func<decimal, decimal, decimal> divide = (n1, n2) => n1 / n2;

Console.WriteLine(divide(20m, 7m));




// Nullable<int> nullableInt =  5;
int? nullableInt = 5;
nullableInt = null;
nullableInt = 7;
// string? nullableString = null;
// nullableString = "Not null anymore!";

// Console.WriteLine(nullableInt);


GenericList<string> stringList = new();

stringList.AddHead("C#");
stringList.AddHead("from");
stringList.AddHead("World");
stringList.AddHead("Hello");

// foreach (string s in stringList)
// {
//   Console.WriteLine(s);
// }

GenericList<int> numberList = new();

numberList.AddHead(4);
numberList.AddHead(3);
numberList.AddHead(2);
numberList.AddHead(1);

// foreach (int i in numberList)
// {
//   Console.WriteLine(i);
// }

Console.WriteLine("== GenericRepository<T> demo ==");
Console.WriteLine("== Employees ==");
var empRepo = new GenericRepository<Employee>();
empRepo.Add(new Employee { Id = 1, Name = "Ada", Department = "R&D" });
empRepo.Add(new Employee { Id = 2, Name = "Grace", Department = "Ops" });

var e = empRepo.GetById(1);
Console.WriteLine($"GetById(1): {e}");
Console.WriteLine();

Console.WriteLine("== BlogPosts ==");
var blogRepo = new GenericRepository<BlogPost>();
blogRepo.Add(new BlogPost { Id = 1, Title = "Generics in C#", Likes = 10 });
blogRepo.Add(new BlogPost { Id = 2, Title = "Understanding Delegates", Likes = 25 });

var post = blogRepo.GetById(2);
Console.WriteLine($"GetById(2): {post}");