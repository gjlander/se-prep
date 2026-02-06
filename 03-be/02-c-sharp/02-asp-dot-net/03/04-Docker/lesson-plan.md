# Docker

## Notes for tutorial/exercise

- `DockerFile` is the name of the file, no file extension
- Update docker file to .NET 10
- Make sure `sln` file name matches `.csproj` name
- add dev environment
- make sure to run initial migration

## Docker Article

## Docker Tutorial

### `Dockerfile`

- We'll use a 2 part build. In the first part, we get the whole .NET SDK and copy in our whole project

#### Part 1

`FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build`

- .NET has an official docker image, and that's the initial image that we pull FROM (this will be the base image that begins our unique project image)
- We can give an alias with the `AS` keyword to let us refer to it in later commands

`WORKDIR /src`

- Here we set the working directory commands further down the line will run from this directory

`COPY . .`

- The first `.` tells it to copy everything from Docker build context (all of the files in the directory you run `docker build`, so in our case, our whole project)
- The second `.` tells it where to copy it to, since we declared `/src` as our working directory, it will copy it there

`RUN dotnet publish -c Release -o /app`

- In this line we give the build command. `dotnet publish` will build our project into a directory that is ready for deployment, with all the needed files.
  `-c Release` will set the build configuration (the other main option is `Debug`). This will optimize the code for production, and won't include debugging info

  - `-o /app` just as with `dotnet new web -o Folder` this names the output directory

- And the end of this build stage, we have the full .NET SDK as part of our image, so we want to make it smaller in part 2

#### Part 2

`FROM mcr.microsoft.com/dotnet/aspnet:10.0`

- Now instead of the full .NET SDK, we pull from the smaller runtime image for ASP.NET

`WORKDIR /app`

- We set `/app` as our new working directory

`COPY --from=build /app .`

- Here's where we can use that alias from Part 1, we copy the contents of `/app` in part 1, which is where our production ready code is, and we copy it to our current working directory

`ENV ASPNETCORE_URLS=http://+:8080`

- We add environmental variables for our URL, instead of getting it from `launchSettings.json`
  - the `+` is a wildcard, and we bind it to port `8080`

`EXPOSE 8080`

- This documents that this container will use TCP on port 8080. We will still need to publish it to make it available when we run `docker run`

`ENTRYPOINT ["dotnet", "TinyApi.dll"]`

- This setup up the primary process/command. This would be like running `dotnet TinyApi.dll` in the terminal. DLL stands for "Dynamic Link Library", and it's what C# compiles to
  - C# unlike C doesn't actually compile to machine code. By using DLL, it allows it to work across several operating systems

### Building and running the container

#### Building

- With Docker Desktop running, we can now build our image
  `docker build -t tinyapi .`
- `docker` tells us to connect with the Docker daemon (like `node`, `npm` or `dotnet`)
- `build` is the build command that will generate the image
- `-t tinyapi` gives a tag, we can later use that to run the image
- `.` here again means the root directory, and looks for our `Dockerfile` there

#### Running

- Once the image is built, we can either use the CLI or docker desktop to run it. From the CLI we run
  `docker run -p 8080:8080 tinyapi`
  - `8080:8080` will map requests from the host port (our device) to the container port. To make life easy, we're mapping our real port 8080 to Docker's 8080
  - Here we use the tag name that we set earlier to tell Docker which image to run

### Modify the app to include a barebones database

- Now instead of relying on SQLite, we'll use Docker to run a full MS SQL Server instance
- Since we don't have any tables here, we don't need to do anything extra, but for a proper db connection, we'd still need to run `dotnet ef add migration InitialCreate` and make sure we have a `Migrations` directory

### Modify the image and add Compose to orchestrate the database

- To orchestrate our DB and our API, we'll need to use Docker Compose
- We need a `docker-compose.yaml` file (newer versions of Docker also accept `compose.yaml`)

  - YAML is originally said to mean "Yet Another Markup Language", but it retroactively stands for "YAML Ain't a Markup Language" to reflect that, unlike HTML, or XML the focus is on data, rather than markup
    - It's kind of like the Python-oriented equivalent to JSON (in that it uses indentations, and no curly brackets, not a true 1:1 with JSON)

- Let's break it down line by line

`services:`

- We declare the set of services (containers) that this file defines

#### db service

` db:`

- 1 indentation in, we give the name of our first service, which is our database
  ` image: mcr.microsoft.com/mssql/server:2022-latest`
- Similar to `FROM`, this tells Docker which image to run

```yaml
environment:
  SA_PASSWORD: 'Your_password123'
  ACCEPT_EULA: 'Y'
```

- We set environmental variables
  - System admin password
  - Yes to accepting MS's license agreement

```yaml
ports:
  - '1433:1433'
```

- We map host (device) ports to Docker ports (must be an unused port, so not 8080 if we want that for our API still)

```yaml
platform: linux/amd64
```

- We request a specific CPU architecture image - we won't have a full linux OS, but it will simulate enough of it to run as if it was on linux, even if our device is Windows/mac

```yaml
volumes:
  - db-data:/var/opt/mssql
```

- Volumes are Docker's word for persistence data. We create a named volume `db-data`, and then the path to where SQL Server will write database queries too. This gives us persistence so our db is stable across container recreation and image updates.

```yaml
healthcheck:
```

- Similar to our health checks for our API, here we can define some commands for docker to run to mark the container as `healthy/unhealthy`

```yaml
test:
  [
    'CMD-SHELL',
    "/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $$SA_PASSWORD -C -Q 'SELECT 1' > /dev/null 2>&1 || /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $$SA_PASSWORD -Q 'SELECT 1' > /dev/null 2>&1 || exit 1"
  ]
```

- Similar to our Dockerfile, we pass commandline arguments as an array
- Without going deep into it, the command attempts to make a simple query to check the DB, and returns 0 for healthy, and 1 (or any non-zero number) for error (following CL error code conventions)

```yaml
interval: 5s
      timeout: 3s
      retries: 30
```

- How often to run the health check.

- How long to wait for the check to complete before considering it failed.

- How many consecutive failures before the container is marked unhealthy.

#### api service

```yaml
api:
```

- We give a name to our second service, which is our API

```yaml
build: .
```

- Instead of pulling from a remote image, we use our local Dockerfile. This is like running `docker build` in the CLI

```yaml
ports:
  - '8080:8080'
```

- Mapping host ports to Docker ports

```yaml
depends_on:
  db:
    condition: service_healthy
```

- Here we can say that our API has the db as a dependency, so it should wait until the db has passed it's health check before it starts running

```yaml
environment:
  - ConnectionStrings__DefaultConnection=Server=db;Database=TinyDb;User=sa;Password=Your_password123;TrustServerCertificate=true;Encrypt=false
  - ApplyMigrations=true
```

- Here we can set environment variables

```yaml
volumes:
  db-data:
```

- We need `volumes` to reference the db volume, so that Docker can properly manage it and use it across services

#### Starting the services

```bash
docker compose up --build
```

- `docker compose up` will create and start containers for our services
- `--build` tells it to create image files for each service
