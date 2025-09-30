# Flappy Bird Game

## 🎮 Oyun Hakkında

Bu proje, **C# Blazor Server** teknolojisi kullanılarak geliştirilmiş modern bir Flappy Bird oyunudur. Oyun, klasik Flappy Bird mekaniklerini koruyarak, web tabanlı bir platformda akıcı bir deneyim sunar.

### 🚀 Özellikler

- **C# ile Geliştirilmiş**: Tüm oyun mantığı C# ile yazılmıştır
- **Blazor Server**: Modern web teknolojileri ile hızlı ve güvenilir
- **Responsive Tasarım**: Farklı ekran boyutlarında uyumlu
- **Ses Efektleri**: Orijinal Flappy Bird deneyimini tamamlayan sesler
- **Skor Sistemi**: Yerel depolama ile rekor takibi
- **Duraklat/Devam**: Oyunu istediğiniz zaman duraklatabilirsiniz

### 🎯 Nasıl Oynanır

1. **"Yeni Oyun"** butonuna tıklayın
2. Oyun birkaç saniye içinde başlayacaktır
3. **Space** tuşu veya **mouse tıklaması** ile kuşu zıplatın
4. Borulardan geçerek skor toplayın
5. Çarpışmadan kaçının!

### 🎮 Kontroller

- **Space Tuşu**: Kuşu zıplat
- **Mouse Tıklama**: Kuşu zıplat
- **Duraklat Butonu**: Oyunu duraklat/devam ettir

### 🛠️ Teknik Detaylar

- **Framework**: ASP.NET Core Blazor Server
- **Dil**: C# (.NET 8.0)
- **Frontend**: HTML5 Canvas, JavaScript (sadece rendering)
- **Ses**: Web Audio API
- **Depolama**: LocalStorage

### 📦 Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/king00-31/flappy-bird-game.git

# Proje dizinine gidin
cd flappy-bird-game

# Bağımlılıkları yükleyin
dotnet restore

# Projeyi çalıştırın
dotnet run
```

### 🌐 Canlı Demo

Oyunu canlı olarak test etmek için projeyi çalıştırın ve tarayıcıda `https://localhost:5001` adresine gidin.

### 📝 Not

- Oyun başlatıldıktan sonra birkaç saniye içinde aktif hale gelir
- İlk yüklemede asset'ler (görseller, sesler) yüklenir
- En iyi deneyim için modern bir tarayıcı kullanın

---

**Geliştirici**: Selam Tirit  
**Teknoloji**: C# Blazor Server  
**Lisans**: MIT