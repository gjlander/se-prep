# Unit Testing

## Outline

- Walk through tutorial article
  - What a cancellation token is
- Walk through Journal Start
- Points for exercise
  - `Assert.ThrowsAsync()`
  - `Assert.True()`
  - `Assert.Empty()`
  - `Assert.Single()`
  - `FakeJournalStore` mock class for testing `JournalService`
  - create and delete directories instead of temp directories
  - creating a fixed `DateTimeOffset`

## What and Why Testing?

- Same as you learned at the end of FE, we want to test that our code works as intended in a formal way

## Project Structure

- C# Dev Kit is automatically generating solution files for us, usually per project. We can use it to coordinate multiple projects. In the case of testing, it allows for separation of concerns, we can have 1 project for our code base, and a second four our testing suite

## Explanation of commands

- Run command one at a time, and talk through explanation for each
- In `MyApp.Tests` we see a default `UnitTest1.cs` instead of `Program.cs`

## Writing a simple test

- For many use cases, a single test case is enough, but you may want to test multiple inputs
- This extra info for the methods are known as **Attributes** in C# (very similar to decorators in Python or TS). They essentially add some context/metadata to the method. They can also be used to decorate classes.

## Running Tests

- Just like `dotnet run`, will also run `dotnet build`, then run all tests

## Common Assertions

### Equality & boolean checks

- If checking for just `true` or just false can use `Assert.True()` and `Assert.False()` instead of `.Equals()`

### Exceptions & argument validation

- Will need to use `.ThrowsAsync()` if testing an async operation

### Collections: contains, order, and counts

- Can also iterate with `foreach` instead of accessing with `.Collection()` if condition is same for all
- To check for empty or single collections can use `.Empty()` and `.Single()` respectively instead of `.Count`

### Reference vs. value equality

- We are mostly comparing value, but in case you need to compare references, this is how you'd do it

### Ranges, prefixes, and null checks

- Can also `Assert.Null()`

### Event Subscription Assertions

- Nothing to add

# Unit Testing Exercise

- This is a decently complex console app (and a good reference for the BudgetTracker). Instructions for setup are all there. I will include some additional instruction in the _general_ channel. Before you start with writing tests, make sure to spend several minutes getting to know the app. Run it, and look and how it operates.

## JournalEntry

- The `init` keyword here might be new. It makes the property immutable. There are subtle differences between `{get;}` and `{get; init;}`, but both enforce immutability and are essentially the same. Adding `init` could be a way of being more explicit about your intention of making this an immutable (unchangeable/readonly) property

## IJournalStore

- Cancellation tokens allow you to cancel an async operation after a certain amount of time (similar to `AbortController` in JS). It has a default value, and we won't be adding logic to cancel, so don't worry too much about it
