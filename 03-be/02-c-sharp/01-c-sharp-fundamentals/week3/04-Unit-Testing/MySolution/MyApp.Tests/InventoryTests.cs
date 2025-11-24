using MyApp;

public class InventoryTests
{
  [Fact]
  public void AddAndGetAll_ContainsItems_InOrder()
  {
    var inv = new Inventory();
    inv.Add("apple");
    inv.Add("banana");

    var all = inv.GetAll();
    Assert.Equal(2, all.Count);
    Assert.Contains("apple", all);
    Assert.DoesNotContain("cherry", all);
    Assert.Collection(all,
        first => Assert.Equal("apple", first),
        second => Assert.Equal("banana", second));
  }
}