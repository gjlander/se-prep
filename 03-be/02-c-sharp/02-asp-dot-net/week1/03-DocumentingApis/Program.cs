using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
  app.UseSwaggerUi(options =>
   {
     options.DocumentPath = "/openapi/v1.json";
   });
  app.MapScalarApiReference();
}

app.UseExceptionHandler();
app.UseStatusCodePages();


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
// app.MapGet("/posts", () =>
// {
//   var posts = new List<PostResponseDto>
//     {
//         new PostResponseDto(1, "First Post", "This is the content of the first post.", 1),
//         new PostResponseDto(2, "Second Post", "This is the content of the second post.", 2)
//     };
//   // return posts;
//   return TypedResults.Ok(posts);
// });
app.MapGet("/posts", () =>
{
  try
  {
    // throw new ArgumentException("User not found");
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
public record User(int Id);