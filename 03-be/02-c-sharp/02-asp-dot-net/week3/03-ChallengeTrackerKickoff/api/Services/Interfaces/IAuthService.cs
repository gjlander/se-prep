using TravelApi.Dtos.Auth;

namespace TravelApi.Services;

public interface IAuthService
{
  Task<(bool Success, IEnumerable<object> Errors)> RegisterAsync(RegisterRequestDto request);
  Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
  Task<object?> GetCurrentUserAsync(string userId);
}