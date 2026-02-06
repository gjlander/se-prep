using System.ComponentModel.DataAnnotations;

namespace FiltersLecture.Dtos;

public record JournalEntryRequestDto(
    [property: Required]
    [property: StringLength(100, MinimumLength = 1)]
    string Title,

    [property: Required, StringLength(10_000, MinimumLength = 1)]
    // [property: StringLength(10_000, MinimumLength = 1)]
    string Content
);