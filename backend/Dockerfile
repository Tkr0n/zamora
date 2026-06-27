FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY FuerzaCivil.Api/FuerzaCivil.Api.csproj FuerzaCivil.Api/
RUN dotnet restore FuerzaCivil.Api/FuerzaCivil.Api.csproj
COPY FuerzaCivil.Api/ FuerzaCivil.Api/
WORKDIR /src/FuerzaCivil.Api
RUN dotnet publish -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FuerzaCivil.Api.dll"]
