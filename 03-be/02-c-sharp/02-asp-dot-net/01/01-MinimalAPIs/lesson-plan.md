# Minimal APIs Intro

# Hosting

## Creating a new Web App

- `web` instead of `console` - can also use `webapi` to get a little more boilerplate

## Program.cs Breakdown

- Very similar to starting an Express app, we'll dive a bit deeper into this file soon

## Running the app

- ASP.NET gives us a lot more setup than Express offered. We had to add our own `console.log()` to see the local URL, that's taken care of for us
- Unlike Express, where we set the port in a variable, now it's in our `launchSettings.json` file

## Enabling HTTPS locally

- This is technically possible with Express as well, but kind of a pain. We don't strictly need HTTPS when testing locally, but it can be nice to have to more closely mirror what will be happening in production (i.e. using the same cookie settings in DEV and PROD). Since it's convenient to setup with ASP.NET we might as well take advantage of it

## Note on Running vs Watching

- My experience has been that the hot-reload is a bit buggy, but you can trigger a rebuild manually with `Cmd + R` (which is still more convenient than manually stopping and restarting the server)

## Configuration files in .NET

- Nothing to add

## Hosting in .NET

- To run JS on the server, we used Node as our runtime environment. For C# we use .NET. .NET not only includes the runtime, but also
  - Runtime -- executes application code.
  - Libraries -- provides utility functionality like JSON parsing.
  - Compiler -- compiles C# (and other languages) source code into (runtime) executable code.
  - SDK and other tools -- enable building and monitoring apps with modern workflows.
  - App stacks -- like ASP.NET Core and Windows Forms, that enable writing apps.

# Program.cs

## Playing with configuration

- Null coalescer gives us a default value in case none is found

## Accessing services

- This is how we will later add things like our DB connection, auth/auth, documentation, and other services.

# Middleware Pipeline

## The Request Pipeline

- Diagram: https://juliocasal.com/assets/images/what-is-middleware.png

## Adding Middleware

- Very similar signature to Express to add application level middleware
- `context` instead of `req` and `res` - can access both as properties on `context`
- Calling `next()` and `next.Invoke()` are functionally the same, just stylistic difference
- Anything before `await next()` is during the request, anything after happens during the response

## Built-in Middleware

- Just as in Express, there are many built-in middleware (in fact there are more than Express has)
- Also like Express, middleware are called in the order that the show up in your code - so line order matters

## Example Pipeline with Multiple Middleware

- Actually serving static files is a bit more involved, but outside of the scope of today's lecture.

# Endpoint Routing

## Defining Endpoints

- We don't need `req` and `res` as in Express, we can pass parameters directly
- `{}` instead of `:` for dynamic sections of URL
- Remember DTO stands for Data Transfer Object - this represents just the data we want to cross the API layer. It allows us to shape the data for each response, removing methods, and any properties we don't want to include (such as sensitive data like passwords). Records are a popular choice for this task because they are lightweight and immutable

## Grouping Endpoints

- Again, similar to Express routers, we can group endpoints together

## Tidying Up with Extension Methods

- Because C# is OOP, we organize the endpoint groups in a class

# Minimal Endpoints

- Not only do they feel similar to Express and Flask, Minimal APIs are the recommended choice for starting new projects.
- You don't need to dive deep into Controller-based APIs, but it's good to know it exists, since you may see it in legacy code bases, or very large scale enterprise applications
