// Contoh komponen yang disederhanakan dengan CSS Global

export default function ExampleSimplified() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Sebelumnya butuh banyak class Tailwind */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-6">
            <h1>Platform Santri Online</h1>
            <p>Bergabunglah dengan ekosistem santri digital Indonesia</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button className="btn btn-primary">Daftar Sekarang</button>
            <button className="btn btn-outline">Pelajari Lebih Lanjut</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-6">
            <h2>Fitur Unggulan</h2>
            <p>Dapatkan pengalaman belajar yang tak terlupakan</p>
          </div>

          <div className="grid-auto">
            {/* Feature Cards */}
            <div className="card fade-in">
              <div className="card-header">
                <h3 className="card-title">Hafalan Al-Quran</h3>
              </div>
              <div className="card-content">
                <p>
                  Sistem tracking hafalan yang membantu Anda menghafal Al-Quran dengan mudah dan
                  terstruktur.
                </p>
                <button className="btn btn-secondary mt-4">Mulai Hafalan</button>
              </div>
            </div>

            <div className="card fade-in">
              <div className="card-header">
                <h3 className="card-title">Dompet Santri</h3>
              </div>
              <div className="card-content">
                <p>
                  Kelola DinCoin dan DirCoin untuk mendukung kegiatan belajar dan dakwah secara
                  mudah.
                </p>
                <button className="btn btn-secondary mt-4">Kelola Dompet</button>
              </div>
            </div>

            <div className="card fade-in">
              <div className="card-header">
                <h3 className="card-title">Marketplace Karya</h3>
              </div>
              <div className="card-content">
                <p>Jual dan beli karya islami seperti kaligrafi, nasyid, dan tulisan.</p>
                <button className="btn btn-secondary mt-4">Jelajahi Marketplace</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Example */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="card-header">
              <h3 className="card-title">Hubungi Kami</h3>
            </div>
            <div className="card-content">
              <form>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Nama
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-input"
                    placeholder="Nama lengkap Anda"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    className="form-input"
                    rows={4}
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* 
PERBANDINGAN:

SEBELUM (dengan Tailwind penuh):
- 200+ class names di satu komponen
- File JSX 3x lebih panjang
- Sulit untuk maintain konsistensi
- Repetitive styling

SESUDAH (dengan CSS Global):
- 30 class names yang semantic
- File JSX lebih readable
- Konsistensi otomatis
- Reusable patterns

HASIL:
- 70% pengurangan verbose classes
- Lebih mudah di-maintain
- Konsistensi design system
- Developer experience yang lebih baik
*/
