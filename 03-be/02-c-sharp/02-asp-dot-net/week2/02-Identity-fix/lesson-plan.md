# ASP.NET Core Identity

- Specify version again if using .NET 10
- update versions in `.csproj` to `9.0.10`

```bash
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 9.0.10
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 9.0.10
```

- will cover hiding secrets later

- Need to add using directives to `PostEndpoints`

```c#
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
```

- Bonus challenge to add authorization

## Adding Identity and JWT

- We'll cover next week how to keep these secret with env variables

## 1. Extend your User
