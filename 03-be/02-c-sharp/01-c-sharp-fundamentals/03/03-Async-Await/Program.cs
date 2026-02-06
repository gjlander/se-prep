using System.Diagnostics;
static async Task<object> FetchDataAsync(string url)
{
  using var httpClient = new HttpClient();
  var data = await httpClient.GetStringAsync(url);
  return data;
}

// var ducks = await FetchDataAsync("https://duckpond-89zn.onrender.com/wild-ducks");
// Console.WriteLine(ducks);


static async Task DelayedLogAsync(string message)
{
  await Task.Delay(500);
  // throw new NotImplementedException("You didn't write this yet?");
  Console.WriteLine(message);
}



try
{

  var stopWatch = Stopwatch.StartNew();
  Console.WriteLine("Hello");
  Console.WriteLine($"Sync elapsed: {stopWatch.ElapsedMilliseconds} ms\n");

  // var firstTask = DelayedLogAsync("Delayed hello");
  // await DelayedLogAsync("Another Delayed hello");
  // await firstTask;

  var tasks = new[] { DelayedLogAsync("Delayed hello"), DelayedLogAsync("Another Delayed hello") };
  await Task.WhenAll(tasks);

  Console.WriteLine($"Async elapsed: {stopWatch.ElapsedMilliseconds} ms\n");
}
catch (Exception ex)
{
  Console.WriteLine($"Error: {ex.Message}");
}

// var result = await DoWork();
// Console.WriteLine(result);


// static async Task<string> DoWork()
// {
//   Task.Delay(1000); // Assume some I/O operation happens here
//   // await Task.Delay(1000); // Assume some I/O operation happens here
//   return "Work completed!";
// }