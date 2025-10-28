import type { MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  BookOpen,
  ShoppingCart,
  MessageSquare,
} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Kontak Kami - Santri Online' },
    {
      name: 'description',
      content:
        'Hubungi tim Santri Online untuk pertanyaan, saran, atau bantuan. Kami siap membantu Anda 24/7.',
    },
    { name: 'keywords', content: 'kontak santri online, customer service, bantuan, support' },
  ];
};

export default function KontakPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'websantrionline@gmail.com',
      description: 'Kirim email untuk pertanyaan umum atau bantuan teknis',
      action: 'mailto:websantrionline@gmail.com',
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '+62 878-5454-5274',
      description: 'Chat langsung untuk bantuan cepat',
      action: 'https://wa.me/6287854545274',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      value: 'Chat Online',
      description: 'Tersedia 24/7 untuk bantuan instan',
      action: '#',
    },
    {
      icon: MapPin,
      title: 'Alamat',
      value: 'Jakarta, Indonesia',
      description: 'Kantor pusat tim pengembang',
      action: '#',
    },
  ];

  const officeHours = [
    { day: 'Senin - Jumat', hours: '09:00 - 17:00 WIB' },
    { day: 'Sabtu', hours: '09:00 - 15:00 WIB' },
    { day: 'Minggu', hours: 'Tutup' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Santri Online</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/masuk" className="text-gray-600 hover:text-gray-900">
                Masuk
              </Link>
              <Link
                to="/daftar"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Kontak{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Kami
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Ada pertanyaan atau butuh bantuan? Tim kami siap membantu Anda kapan saja. Jangan ragu
              untuk menghubungi kami!
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cara Menghubungi Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pilih metode komunikasi yang paling nyaman untuk Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <method.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-blue-600 font-medium mb-2">{method.value}</p>
                <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                {method.action !== '#' && (
                  <a
                    href={method.action}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    target={method.action.startsWith('http') ? '_blank' : undefined}
                    rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    Hubungi
                    <Send className="w-4 h-4 ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form & Office Hours */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih kategori pertanyaan</option>
                    <option value="technical">Bantuan Teknis</option>
                    <option value="account">Masalah Akun</option>
                    <option value="payment">Pembayaran & Transaksi</option>
                    <option value="feature">Saran Fitur</option>
                    <option value="general">Pertanyaan Umum</option>
                    <option value="partnership">Kerjasama</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Kirim Pesan
                </button>
              </form>
            </div>

            {/* Office Hours & Additional Info */}
            <div className="space-y-8">
              {/* Office Hours */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-blue-600" />
                  Jam Operasional
                </h3>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-700 font-medium">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Catatan:</strong> Live chat tersedia 24/7, namun respons tim mungkin
                    lebih lambat di luar jam operasional.
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Link Berguna</h3>
                <div className="space-y-4">
                  <Link
                    to="/bantuan"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600">
                        Pusat Bantuan
                      </div>
                      <div className="text-sm text-gray-600">FAQ dan panduan lengkap</div>
                    </div>
                  </Link>
                  <Link
                    to="/tutorial"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600">
                        Tutorial
                      </div>
                      <div className="text-sm text-gray-600">Video dan panduan penggunaan</div>
                    </div>
                  </Link>
                  <Link
                    to="/marketplace"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <ShoppingCart className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-600">
                        Marketplace Karya
                      </div>
                      <div className="text-sm text-gray-600">
                        Dukung karya islami pilihan santri
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Siap Bergabung dengan Santri Online?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Daftar sekarang dan mulai perjalanan pembelajaran Islam digital Anda bersama ribuan
            santri lainnya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/daftar"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Daftar Gratis Sekarang
            </Link>
            <Link
              to="/"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Santri Online</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Selalu siap membantu perjalanan pembelajaran Islam Anda
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link to="/tentang" className="text-gray-400 hover:text-white">
                Tentang
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white">
                Privasi
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white">
                Syarat
              </Link>
              <Link to="/bantuan" className="text-gray-400 hover:text-white">
                Bantuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
