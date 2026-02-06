using TravelApi.Models;

namespace TravelApi.Services;

public interface IPostService
{
    Task<Post?> GetAsync(Guid id);
    Task<IReadOnlyList<Post>> ListAsync();
    Task<IReadOnlyList<Post>> ListByUserAsync(Guid userId);
    Task<Post> CreateAsync(Guid userId, string title, string content, string image);
    Task<Post?> UpdateAsync(Guid id, string? title, string? content, string? image);
    Task<bool> DeleteAsync(Guid id);
}