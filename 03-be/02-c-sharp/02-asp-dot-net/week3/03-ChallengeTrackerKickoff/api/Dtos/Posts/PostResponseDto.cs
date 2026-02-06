namespace TravelApi.Dtos.Posts;

public record PostResponseDto(Guid Id, Guid UserId, string Title, string Content, string Image, DateTimeOffset? PublishedAt);