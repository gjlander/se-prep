# API Testing

## Unit Testing in ASP.NET

- show testing pyramid

### Setup

- Upgrade packages to .NET 10 in `.csproj`

```bash
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="10.0.0" />
    <PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="10.0.0" />
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="10.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="10.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.0">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="10.0.0" />
    <PackageReference Include="Scalar.AspNetCore" Version="2.11.0" />
  </ItemGroup>

</Project>
```

- Since we're starting with a project, we have some additional commands here to move them into a nested directory before adding the new project

### Run API in development mode

- We could either `cd` into `BlogAPi`, or specify the `--project` from the root directory

### Unit Tests with EF InMemory

- EF Core can work with many databases, including an in-memory option. This will give us a good balance of speed and properly testing our services work properly with EF Core

### Show PostEndpointTest
