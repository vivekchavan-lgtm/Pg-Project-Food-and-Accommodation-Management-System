# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["AdminService.csproj", "./"]
RUN dotnet restore "./AdminService.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "AdminService.csproj" -c Release -o /app/publish

# Serve Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "AdminService.dll"]
