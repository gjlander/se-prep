using System.ComponentModel.DataAnnotations;

namespace TravelApi.Dtos.Users;

public record UpdateUserDto(
    [property: StringLength(100, MinimumLength = 1)]
    string? Name,

    [property: EmailAddress]
    string? Email
);