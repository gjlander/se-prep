# Documenting APIs

## Extra points for exercise

- `WithTags()`
- `WithSummary()`
- `WithDescription()`

## Enabling OpenAPI Documentation

- Much easier to setup than with Express, even has native support
- Need to have built a project with `dotnet new web`
- Add package

```bash
dotnet add package Microsoft.AspNetCore.OpenApi
```

- Register service, and only show docs if we are in development

```c#
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.Run();
```

- Can already see info at `<base_url>/openapi/v1.json`

## Example API

- Using the start code in the LMS (records would go in their own directory for a real project), we get even more info

```c#
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// User Endpoints
app.MapGet("/users", () =>
{
    var users = new List<UserResponseDto>
    {
        new UserResponseDto(1, "Alice", "alice@mail"),
        new UserResponseDto(2, "Bob", "bob@mail")
    };
    return users;
});

app.MapPost("/users", (UserRequestDto user) =>
{
    var createdUser = new UserResponseDto(3, user.Name, user.Email);
    return Results.Created($"/users/{createdUser.Id}", createdUser);
});

// Post Endpoints
app.MapGet("/posts", () =>
{
    var posts = new List<PostResponseDto>
    {
        new PostResponseDto(1, "First Post", "This is the content of the first post.", 1),
        new PostResponseDto(2, "Second Post", "This is the content of the second post.", 2)
    };
    return posts;
});

app.MapPost("/posts", (PostRequestDto post) =>
{
    var createdPost = new PostResponseDto(3, post.Title, post.Content, post.AuthorId);
    return Results.Created($"/posts/{createdPost.Id}", createdPost);
});

app.Run();

// DTOs
public record UserRequestDto(string Name, string Email);
public record UserResponseDto(int Id, string Name, string Email);
public record PostRequestDto(string Title, string Content, int AuthorId);
public record PostResponseDto(int Id, string Title, string Content, int AuthorId);
```

- This JSON file isn't super readable, but we can use this URL to create a Postman collection, which is really nice (demo)
- We can also then use the spec for a UI viewer like Swagger or Scalar

## Swagger UI (va NSwag)

- We need to add the package

```bash
dotnet add package NSwag.AspNetCore
```

- Then simply add it under our `OpenAPI` docs method

```c#
if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
  app.UseSwaggerUi(options =>
   {
     options.DocumentPath = "/openapi/v1.json";
   });
}
```

- Now we see it at `<base_url>/swagger/index.html?url=/openapi/v1.json`
- And you see the SwaggerUI you're familiar with

## Scalar UI

- I personally prefer Scalar UI, and it's just as easy to setup (plus the URL is easier to remember)
- Add the package

```bash
dotnet add package Scalar.AspNetCore
```

- For this one, we need to add a `using` directive

```c#
using Scalar.AspNetCore;
if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
  app.UseSwaggerUi(options =>
   {
     options.DocumentPath = "/openapi/v1.json";
   });
  app.MapScalarApiReference();
}
```

## Notes on Response Types

- Simply returning the resource will allow the response type to correctly be inferred, but to use our `Results.*` helpers, we need to be more explicit
- `GET /posts` when returning `posts` is correct

```c#
app.MapGet("/posts", () =>
{
    var posts = new List<PostResponseDto>
    {
        new PostResponseDto(1, "First Post", "This is the content of the first post.", 1),
        new PostResponseDto(2, "Second Post", "This is the content of the second post.", 2)
    };
    return posts;
});
```

- But `Results.Ok(posts)` will be wrong

- For simple endpoints with a single potential response, `TypedResults.Ok()` will usually be enough

### `.Produces<T>()`

- If we have branching potential responses (`try/catch` or `if`), we can additionally add `.Produces<T>()` - note this still uses `TypedResults()`
  - All of these helpers are part of ASP.NET
  - `.Produces()` is an endpoint filter

```c#
app.MapGet("/posts", () =>
{
  try
  {
    var posts = new List<PostResponseDto>
        {
            new PostResponseDto(1, "First Post", "This is the content of the first post.", 1),
            new PostResponseDto(2, "Second Post", "This is the content of the second post.", 2)
        };
    return TypedResults.Ok(posts);
  }
  catch (ArgumentException)
  {
    return Results.BadRequest("User not found");
  }
})
.Produces<List<PostResponseDto>>(200);
```

## Adding Response Metadata

- We use `.Produces()` for what a success response looks like, and `.ProducesProblem()` to indicate which error responses we might get
- Add to `/posts`
- We only need to add `ProducesProblem` when we return error responses

```c#
.ProducesProblem(400)
.ProducesProblem(500);
```

- We can also use the `StatusCodes` helper class instead or numbers

```c#
.ProducesProblem(StatusCodes.Status400BadRequest)
.ProducesProblem(StatusCodes.Status500InternalServerError);
```

- If we look at the response, we see a few properties. These are based on the `Problem Details` web standard, and ASP.NET has a class for these properties: https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.problemdetails?view=aspnetcore-9.0#properties

## Adding in error handling to match that response

- ASP.NET makes it very easy for us to add in error handling. We can essentially do it with 3 lines of code
- We register the `AddProblemDetails()` service, so any empty error response will generate a problem details

```c#
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
```

- We then use a built-in middleware to convert unhandled exceptions into a Problem Details response

```c#
app.UseExceptionHandler();
```

- Then a second built-in middleware to send the problem details in the response body for empty non-successful responses

```c#
app.UseStatusCodePages();
```

- If we bring back our error, we see our Problem details

```c#
app.MapGet("/posts", () =>
{
  try
  {
    throw new ArgumentException("User not found");
    var posts = new List<PostResponseDto>
        {
            new PostResponseDto(1, "First Post", "This is the content of the first post.", 1),
            new PostResponseDto(2, "Second Post", "This is the content of the second post.", 2)
        };
    return TypedResults.Ok(posts);
  }
  catch (ArgumentException)
  {
    return Results.BadRequest();
  }
})
```

- If we want to add the `detail` field, we can do that easily

```c#
app.MapGet("/posts", () =>
{
  try
  {
    throw new ArgumentException("User not found");
    var posts = new List<PostResponseDto>
        {
            new PostResponseDto(1, "First Post", "This is the content of the first post.", 1),
            new PostResponseDto(2, "Second Post", "This is the content of the second post.", 2)
        };
    return TypedResults.Ok(posts);
  }
  catch (ArgumentException ex)
  {
    return Results.Problem(detail: ex.Message, statusCode: StatusCodes.Status400BadRequest);
  }
})
.Produces<List<PostResponseDto>>(200)
.ProducesProblem(StatusCodes.Status400BadRequest)
.ProducesProblem(StatusCodes.Status500InternalServerError);
```
