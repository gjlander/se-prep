# Filters and Validation

## Extra points for exercise

- can add `= string.Empty` to get rid of warnings about nullable string
- Change port to `5001` in `launchSettings.json` to match example
- can make requests in Postman instead of using curl
- more data annotations
- `object` is basically `any`

## Filters and Validation (start in LMS)

- Express made no distinction between application, router/group, and single route middleware. The setup was essentially the same, you would just place it at whatever level you wanted
- ASP.NET has middleware - which is application level. Then endpoint filters for more specific "middleware", and to give us access to bound parameters (the request body, query params, dynamic parts of URL, etc)

## Baseline: No Validation

- In our starter example we have a single `POST` endpoint (I'm going to add namespaces and using directives)
- `Program.cs`

```c#
using FiltersLecture.Dtos;
using FiltersLecture.Models;
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapPost("/entries", (JournalEntryRequestDto entry) =>
{
    // No body validation by default on Minimal APIs
    var journalEntry = new JournalEntry
    {
        Id = Guid.NewGuid(),
        Title = entry.Title,
        Content = entry.Content,
        CreatedAt = DateTime.UtcNow
    };
    return Results.Created($"/entries/{journalEntry.Id}", journalEntry);
});

app.Run();
```

- `Dtos/JournalEntryRequestDto.cs`

```c#
namespace FiltersLecture.Dtos;
public record JournalEntryRequestDto(string Title, string Content);
```

- `Models/JournalEntry.cs`

```c#
namespace FiltersLecture.Models;
public class JournalEntry
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

## Demonstration

- We can update our port to `5001` in `launchSettings.json` to match the LMS example, or update to our port
- We'll make requests in Postman over using curl (which allows us to make HTTP requests in the terminal)
- The main point here, is we see no validation, and get `null` for missing fields, which isn't what we want!

## 1) Annotate the DTO

- Just like we saw with Unit Testing, here we can also add attributes to decorate (or in this case annotate ) fields. This would be our Zod equivalent, not validate not only is the field there, and the correct type, but does it meet any other requirements we might have

```c#
using System.ComponentModel.DataAnnotations;

namespace FiltersLecture.Dtos;

public record JournalEntryRequestDto(
    [property: Required]
    [property: StringLength(100, MinimumLength = 1)]
    string Title,

    [property: Required]
    [property: StringLength(10_000, MinimumLength = 1)]
    string Content
);
```

- When looking at the [docs](https://learn.microsoft.com/en-us/dotnet/api/system.componentmodel.dataannotations?view=net-10.0), anything that ends with `Attribute` can be used here to annotate our fields.
- To see what arguments the constructor takes (many of them don't take anything), and what properties you can assign, look at `Constructors` and `Properties`
  - i.e for `StringLength` we see it takes an `int` and we can set additional properties like `MinimumLength`
- We can also add then as comma separated values (though I'd argue this is a bit less readable at a glance)

```c#
public record JournalEntryRequestDto(
    [property: Required]
    [property: StringLength(100, MinimumLength = 1)]
    string Title,

    [property: Required, StringLength(10_000, MinimumLength = 1)]
    // [property: StringLength(10_000, MinimumLength = 1)]
    string Content
);
```

## 2) Create a Validation Filter

- Let's break down what's happing in this big filter here
- `Filters/ValidationFilter.cs`
  - Since everything in C# is a class, we start there
  -
  - So we can have 1 general purpose validation filter, we make it generic (think of our middleware factories in Express)
  - Our filter needs to implement the `IEndpointFilter` interface - C# is yelling at us since we don't have the `InvokeAsync()` method this interface requires
  - Our generic `T` type needs to be a reference value (records, classes, etc), so we add a constraint

```c#

public sealed class ValidationFilter<T> : IEndpointFilter where T : class
{

}
```

- The signature of `InvokeAsync()` looks similar to our endpoints, we have `context` and `next`, here we see the actual type of each
  - `ValueTask<T>` instead of `Task<T>`. In short, `ValueTask` can be a more lightweight version of a `Task`. The differences for us won't be super relevant, and you can continue using `Task` anytime you make an `async` method
  - By using `object?` for return type, we allow flexibility to call `next()` or `Results*`

```c#
public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
  {

  }
```

- _DTo Detection:_ We check for an argument that matches the Dto we are using (a Dto is just a record/class with the specific fields we want for this endpoint).

```c#
// find the first argument of type T (our DTO)
    var dto = context.Arguments.OfType<T>().FirstOrDefault();
```

- _Null Check:_ If that `DTO` is missing (essentially if the request Body doesn't match our DTO), then it is `null`, and we give an error response

```c#
 if (dto is null)
    {
      // No DTO of type T present — return BadRequest
      return Results.BadRequest(new { error = $"Request body must include a {typeof(T).Name}" });
    }
```

- _Validation:_ We can create a new `ValidationContext` and use `Validator.TryValidateObject()` to run our custom validations

```c#
var validationResults = new List<ValidationResult>();
var vc = new ValidationContext(dto);
bool isValid = Validator.TryValidateObject(dto, vc, validationResults, validateAllProperties: true);
```

- _Error Processing:_ We can use LINQ to shape our errors into a dictionary that matches the `ProblemDetails` class
- _Response Generation:_ We can then use the `ValidationProblem` helper to give the proper error response. And use the `StatusCodes` class to give the correct status code

```c#
if (!isValid)
        {
            // Convert to a ProblemDetails-like payload: <https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.problemdetails?view=aspnetcore-9.0>
            var errors = validationResults
                .GroupBy(v => v.MemberNames.FirstOrDefault() ?? string.Empty)
                .ToDictionary(g => g.Key, g => g.Select(r => r.ErrorMessage ?? "Invalid").ToArray());

            return Results.ValidationProblem(errors, statusCode: StatusCodes.Status400BadRequest);
        }
```

- _Continue Pipeline:_ If all was well, we simply call `next()` and pass along the context (unlike Express, passing an argument to `next()` doesn't automatically land you in an error handler)

```c#
   return await next(context);
```

- We then use the `AddEndpointFilter()` method to add this to our endpoint
  - We need a nested generic here, since `ValidationFilter` is also generic

```c#
using FiltersLecture.Dtos;
using FiltersLecture.Models;
using FiltersLecture.Filters;
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapPost("/entries", (JournalEntryRequestDto entry) =>
{
  // No body validation by default on Minimal APIs
  var journalEntry = new JournalEntry
  {
    Id = Guid.NewGuid(),
    Title = entry.Title,
    Content = entry.Content,
    CreatedAt = DateTime.UtcNow
  };
  return Results.Created($"/entries/{journalEntry.Id}", journalEntry);
}).AddEndpointFilter<ValidationFilter<JournalEntryRequestDto>>();

app.Run();
```

## 3) Add a Convenience Extension

- Having to write that nested generic on every endpoint where we want body validation could get annoying, so we can make an extension method
- `Filters/ValidationExtensions.cs`
  - `this` before the parameter is what makes this an extension method (essentially letting us add new methods to an existing class)
  - the `RouteHandlerBuilder` class let's us customize endpoints or endpoint groups
  - we need the same constraint as our `ValidationFilter`
  - it returns a new method that is essentially doing what we did before, just in a different context - adding a new endpoint filter that uses our `ValidationFilter`

```c#
namespace FiltersLecture.Filters;

public static class ValidationExtensions
{
  public static RouteHandlerBuilder WithValidation<T>(this RouteHandlerBuilder builder) where T : class
      => builder.AddEndpointFilter(new ValidationFilter<T>());
}
```

- Using the validation filter becomes simpler then

```c#
app.MapPost("/entries", (JournalEntryRequestDto entry) =>
{
  // No body validation by default on Minimal APIs
  var journalEntry = new JournalEntry
  {
    Id = Guid.NewGuid(),
    Title = entry.Title,
    Content = entry.Content,
    CreatedAt = DateTime.UtcNow
  };
  return Results.Created($"/entries/{journalEntry.Id}", journalEntry);
}).WithValidation<JournalEntryRequestDto>();
```

## Why Filters (not Middleware) for Body Validation?

- back to LMS
