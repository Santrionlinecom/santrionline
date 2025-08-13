import type { MetaFunction } from "@remix-run/cloudflare";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { ArrowLeft, Shield, AlertTriangle, Users, BookOpen } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Syarat & Ketentuan - Santri Online" },
    {
      name: "description",
      content: "Syarat dan ketentuan penggunaan platform Santri Online. Baca dengan teliti sebelum menggunakan layanan kami.",
    },
  ];
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Syarat & Ketentuan
            </h1>
            <p className="text-muted-foreground text-lg">
              Berlaku efektif: 1 Januari 2025
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Terakhir diperbarui: 4 Agustus 2025
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Pendahuluan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Selamat datang di Santri Online, platform edukasi Islam modern yang dikembangkan oleh 
              <strong> Yogik Pratama Aprilian</strong>. Dengan menggunakan platform ini, Anda menyetujui 
              untuk terikat dengan syarat dan ketentuan berikut.
            </p>
            <p>
              Platform Santri Online berkomitmen untuk menyediakan layanan edukasi Islam yang berkualitas 
              tinggi dan sesuai dengan nilai-nilai syariah Islam.
            </p>
          </CardContent>
        </Card>

        {/* Acceptance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Penerimaan Syarat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Dengan mendaftar, mengakses, atau menggunakan layanan Santri Online, Anda menyatakan bahwa:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anda telah membaca, memahami, dan menyetujui syarat dan ketentuan ini</li>
              <li>Anda berusia minimal 13 tahun atau memiliki izin dari orang tua/wali</li>
              <li>Anda akan menggunakan platform ini sesuai dengan nilai-nilai Islam</li>
              <li>Informasi yang Anda berikan adalah akurat dan terkini</li>
            </ul>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              2. Layanan Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Santri Online menyediakan berbagai layanan edukasi Islam, termasuk:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Hafalan Al-Quran:</strong> Sistem tracking dan validasi hafalan digital</li>
              <li><strong>Biolink Santri:</strong> Profil digital islami untuk santri dan ustadz</li>
              <li><strong>Pembelajaran Interaktif:</strong> Materi dan kursus Islam online</li>
              <li><strong>Komunitas:</strong> Forum diskusi dan grup belajar</li>
              <li><strong>Marketplace Karya:</strong> Platform jual beli karya islami</li>
              <li><strong>Dompet Digital:</strong> Sistem pembayaran DinCoin dan DirCoin</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Obligations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              3. Kewajiban Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Sebagai pengguna Santri Online, Anda wajib:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Menjaga kerahasiaan akun dan kata sandi Anda</li>
              <li>Menggunakan platform untuk tujuan edukasi yang baik</li>
              <li>Menghormati hak cipta dan kekayaan intelektual</li>
              <li>Tidak mengunggah konten yang melanggar syariah atau hukum</li>
              <li>Berinteraksi dengan sopan dan menghormati pengguna lain</li>
              <li>Tidak melakukan spam, phishing, atau aktivitas merugikan lainnya</li>
            </ul>
          </CardContent>
        </Card>

        {/* Prohibited Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              4. Konten Terlarang
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Dilarang keras mengunggah atau membagikan konten yang:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bertentangan dengan ajaran Islam dan nilai-nilai syariah</li>
              <li>Mengandung unsur SARA, pornografi, atau kekerasan</li>
              <li>Melanggar hak cipta atau kekayaan intelektual pihak lain</li>
              <li>Menyebarkan informasi palsu atau menyesatkan</li>
              <li>Melakukan ujaran kebencian atau diskriminasi</li>
              <li>Mengandung virus, malware, atau kode berbahaya</li>
            </ul>
          </CardContent>
        </Card>

        {/* Digital Currency */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Mata Uang Digital (DinCoin & DirCoin)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              DinCoin dan DirCoin adalah mata uang digital internal platform yang digunakan untuk:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pembelian konten premium dan kursus</li>
              <li>Transaksi di marketplace karya islami</li>
              <li>Reward untuk pencapaian akademik</li>
              <li>Donasi untuk sesama santri</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Catatan: Mata uang digital ini tidak dapat diuangkan dan hanya berlaku di dalam platform.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Batasan Tanggung Jawab</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Santri Online dan Yogik Pratama Aprilian tidak bertanggung jawab atas:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Kerugian yang timbul dari penggunaan platform</li>
              <li>Gangguan teknis atau downtime server</li>
              <li>Konten yang dibuat oleh pengguna lain</li>
              <li>Kehilangan data akibat kelalaian pengguna</li>
              <li>Penyalahgunaan akun oleh pihak ketiga</li>
            </ul>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Privasi dan Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Kami menghormati privasi Anda dan berkomitmen melindungi data pribadi sesuai dengan 
              <Link to="/privacy" className="text-primary hover:underline"> Kebijakan Privasi</Link> kami.
            </p>
            <p>
              Data yang dikumpulkan hanya digunakan untuk meningkatkan layanan dan pengalaman belajar Anda.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. Penghentian Layanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Kami berhak menghentikan atau menangguhkan akses Anda jika:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Melanggar syarat dan ketentuan ini</li>
              <li>Melakukan aktivitas yang merugikan platform atau pengguna lain</li>
              <li>Tidak menggunakan akun dalam waktu yang lama</li>
              <li>Atas permintaan Anda sendiri</li>
            </ul>
          </CardContent>
        </Card>

        {/* Changes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. Perubahan Syarat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku 
              setelah dipublikasikan di platform. Penggunaan berkelanjutan setelah perubahan 
              menandakan persetujuan Anda terhadap syarat yang baru.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>10. Kontak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> websantrionline@gmail.com</p>
              <p><strong>WhatsApp:</strong> 087854545274</p>
              <p><strong>Developer:</strong> Yogik Pratama Aprilian</p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button asChild>
            <Link to="/">
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
