# .NET 8.0 SDK kullanarak build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Proje dosyalarını kopyala
COPY *.csproj ./
RUN dotnet restore

# Tüm kaynak kodları kopyala
COPY . ./

# Uygulamayı build et
RUN dotnet publish -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Port 10000'i expose et (Render'ın beklediği port)
EXPOSE 10000

# Uygulamayı başlat
ENTRYPOINT ["dotnet", "FlappyBird.dll"]
