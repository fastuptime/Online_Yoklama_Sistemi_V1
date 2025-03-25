# 📝 Online Yoklama Sistemi v1 

![Online Yoklama Sistemi Banner](https://github.com/fastuptime/Online_Yoklama_Sistemi_V1/raw/main/banner.png)

> 🌍 Konum tabanlı, öğretim görevlileri ve öğrenciler için gerçek zamanlı online yoklama sistemi

[![GitHub Yıldız](https://img.shields.io/github/stars/fastuptime/Online_Yoklama_Sistemi_V1?style=social)](https://github.com/fastuptime/Online_Yoklama_Sistemi_V1)
[![GitHub Lisans](https://img.shields.io/github/license/fastuptime/Online_Yoklama_Sistemi_V1)](https://github.com/fastuptime/Online_Yoklama_Sistemi_V1/blob/main/LICENSE)

## 🚀 Özellikler

- ✅ **Konum Tabanlı Doğrulama**: En fazla 1km sapma payı ile yoklamaya katılım
- ⚡ **Gerçek Zamanlı Güncelleme**: Socket.io ile yoklamalara anlık katılım bildirimleri
- 🔐 **TC ve Şifre ile Güvenli Giriş**: Bcrypt ile şifrelenmiş kullanıcı doğrulama
- 👨‍🏫 **Öğretmen Paneli**: Yoklama açma/kapama, geçmiş yoklamaları görüntüleme
- 👨‍🎓 **Öğrenci Paneli**: Aktif yoklamaları görüntüleme ve katılma
- 📊 **Raporlama**: Ders ve yoklama istatistikleri
- 🔄 **Yetkili Müdahale**: Yoklamadan öğrenci çıkarma veya ekleme
- 📱 **Cihaz ve IP Takibi**: Yoklama katılımlarında cihaz bilgisi ve IP kaydı
- 🎨 **Modern Arayüz**: Tailwind CSS ile tasarım

## 🛠️ Kullanılan Teknolojiler

- **Backend**: Express.js, Prisma ORM
- **Veritabanı**: PostgreSQL
- **Oturum Yönetimi**: Redis, Express-Session
- **Gerçek Zamanlı İletişim**: Socket.io
- **Konum Servisleri**: HTML5 Geolocation API, Geolib
- **Frontend**: HTML, Tailwind CSS
- **Güvenlik**: Bcrypt, Helmet
- **Bildirimler**: Notyf

## 📋 Gereksinimler

- Node.js (v14+)
- PostgreSQL
- Redis

## 🔧 Kurulum

1. Repo'yu klonlayın:
```bash
git clone https://github.com/fastuptime/Online_Yoklama_Sistemi_V1.git
cd Online_Yoklama_Sistemi_V1
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. .env dosyasını yapılandırın:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/yoklama_db"
REDIS_URL="redis://localhost:6379"
SESSION_SECRET="gizli_anahtar_buraya"
PORT=3000
```

4. Veritabanı şemasını oluşturun:
```bash
npx prisma migrate dev
```

5. Örnek verileri yükleyin:
```bash
node prisma/seed.js
```

6. Uygulamayı başlatın:
```bash
npm start  # veya geliştirme için: npm run dev
```

## 👨‍💻 Kullanım

### 👨‍🏫 Öğretim Görevlisi 
- **TC**: 12345678901
- **Şifre**: 123456

Öğretim görevlisi panelinde:
1. Yeni ders oluşturabilirsiniz
2. Mevcut dersler için yoklama açabilirsiniz
3. Aktif yoklamada katılan öğrencileri anlık görebilirsiniz
4. Geçmiş yoklama kayıtlarına erişebilirsiniz
5. İstediğiniz öğrenciyi yoklamadan çıkarabilir veya ekleyebilirsiniz

### 👨‍🎓 Öğrenci
- **TC**: 12345678902 veya 12345678903
- **Şifre**: 123456

Öğrenci panelinde:
1. Kayıtlı olduğunuz dersleri görebilirsiniz
2. Aktif yoklamaları görüntüleyebilirsiniz
3. Yoklamalara konum bilginizle katılabilirsiniz
4. Geçmiş yoklama kayıtlarınızı kontrol edebilirsiniz

## 📸 Ekran Görüntüleri

### Giriş Ekranı
![Giriş Ekranı](https://github.com/fastuptime/Online_Yoklama_Sistemi_V1/raw/main/screenshots/login.png)

### Öğretim Görevlisi Paneli
![Öğretim Görevlisi Paneli](https://github.com/fastuptime/Online_Yoklama_Sistemi_V1/raw/main/screenshots/instructor_dashboard.png)

### Öğrenci Paneli
![Öğrenci Paneli](https://github.com/fastuptime/Online_Yoklama_Sistemi_V1/raw/main/screenshots/student_dashboard.png)

### Aktif Yoklama
![Aktif Yoklama](https://github.com/fastuptime/Online_Yoklama_Sistemi_V1/raw/main/screenshots/active_attendance.png)

## 🤝 Katkıda Bulunma

1. Bu repo'yu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inize push edin (`git push origin feature/amazing-feature`)
5. Pull request oluşturun

## 📄 Lisans

Bu proje [MIT Lisansı](https://github.com/fastuptime/Online_Yoklama_Sistemi_V1/blob/main/LICENSE) altında lisanslanmıştır.

## ✨ İletişim

Fast Uptime - [https://github.com/fastuptime](https://github.com/fastuptime)

Proje Link: [https://github.com/fastuptime/Online_Yoklama_Sistemi_V1](https://github.com/fastuptime/Online_Yoklama_Sistemi_V1)

---

⭐️ **Eğer bu proje yardımcı olduysa bir yıldız verebilirsiniz!** ⭐️