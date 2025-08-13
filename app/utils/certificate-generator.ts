// Utility untuk generate PDF sertifikat dan raport menggunakan pdf-lib + html2canvas (lazy import agar aman di SSR)
// Catatan: Modul ini hanya boleh dipakai di event handler browser. Jangan panggil di loader / server.

type PdfLib = typeof import('pdf-lib');
let pdfLibPromise: Promise<PdfLib> | null = null;
const loadPdfLib = () => {
  if (!pdfLibPromise) pdfLibPromise = import('pdf-lib');
  return pdfLibPromise;
};

type Html2Canvas = typeof import('html2canvas');
let html2CanvasPromise: Promise<Html2Canvas> | null = null;
const loadHtml2Canvas = () => {
  if (!html2CanvasPromise) html2CanvasPromise = import('html2canvas');
  return html2CanvasPromise;
};

export interface SantriData {
  name: string;
  nisn: string;
  totalJuz: number;
  completedBooks: string[];
  achievements: Achievement[];
  totalScore: number;
  isApprovedByAdmin: boolean;
  certificateId?: string;
  approvedDate?: string;
  approvedBy?: string;
  verificationUrl?: string; // URL publik untuk verifikasi (akan di-QR)
}

export interface Achievement {
  type: 'Hafalan' | 'Kitab';
  target: string;
  completedDate: string;
  score: number;
}

export class CertificateGenerator {
  private santriData: SantriData;

  constructor(santriData: SantriData) {
    this.santriData = santriData;
  }

  // Generate PDF dengan halaman depan (sertifikat) dan belakang (raport)
  async generatePDF(): Promise<Blob> {
    if (typeof window === 'undefined') throw new Error('PDF hanya bisa digenerate di browser');

    const { PDFDocument, PageSizes } = await loadPdfLib();
    const pdfDoc = await PDFDocument.create();
    const [a4Width, a4Height] = PageSizes.A4; // Points (1/72 inch)

    // Helper to add a canvas as a full-page PNG
    const addCanvasAsPage = async (canvas: HTMLCanvasElement) => {
      const pngDataUrl = canvas.toDataURL('image/png');
      const pngBytes = await fetch(pngDataUrl).then((r) => r.arrayBuffer());
      const pngImage = await pdfDoc.embedPng(pngBytes);
      const page = pdfDoc.addPage([a4Width, a4Height]);
      // Scale image to fit full page while preserving aspect ratio
      const imgWidth = pngImage.width;
      const imgHeight = pngImage.height;
      const scale = Math.min(a4Width / imgWidth, a4Height / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      const x = (a4Width - drawWidth) / 2;
      const y = (a4Height - drawHeight) / 2;
      page.drawImage(pngImage, { x, y, width: drawWidth, height: drawHeight });
    };

    // Page 1: Certificate
    const certificateHTML = this.generateCertificateHTML();
    const certificateCanvas = await this.htmlToCanvas(certificateHTML);
    await addCanvasAsPage(certificateCanvas);

    // Page 2: Report
    const reportHTML = this.generateReportHTML();
    const reportCanvas = await this.htmlToCanvas(reportHTML);
    await addCanvasAsPage(reportCanvas);

    const pdfBytes = await pdfDoc.save();
    // Ensure proper BlobPart typing by converting to a standard ArrayBuffer
    const arrayBuffer = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength,
    );
    return new Blob([arrayBuffer as ArrayBuffer], { type: 'application/pdf' });
  }

  // Generate HTML untuk sertifikat
  private generateCertificateHTML(): string {
    // Generate QR code canvas data URL jika ada verificationUrl
    // Kita tidak bisa menunggu async disini; QR akan digenerate di htmlToCanvas step dengan elemen img src
    const qrHtml = this.santriData.verificationUrl
      ? `
      <img id="qr-img" data-qr="${this.santriData.verificationUrl}" style="width:80px;height:80px;" />
    `
      : `
      <div style="width:80px;height:80px;border:2px solid #0066cc;display:flex;align-items:center;justify-content:center;font-size:24px;">📱</div>
    `;
    return `
      <div class="certificate-container certificate-front">
        <div style="position: absolute; top: 20px; left: 20px; font-size: 12px;">
          <strong>SANTRI ONLINE</strong><br>
          <span style="color: #666;">Platform Pembelajaran Islam Digital</span>
        </div>
        
        <div style="position: absolute; top: 20px; right: 20px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #0066cc, #004499); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
            🏆
          </div>
        </div>

        <div class="certificate-header">
          <h1 class="certificate-title">SERTIFIKAT HAFALAN AL-QUR'AN</h1>
        </div>

        <div style="text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
          <p style="font-size: 18px; margin-bottom: 10px;">Diberikan kepada:</p>
          <div class="certificate-recipient">${this.santriData.name}</div>
          <p style="font-size: 14px; margin: 10px 0; color: #666;">NISN: ${this.santriData.nisn}</p>
          
          <div class="certificate-description">
            Telah berhasil menyelesaikan program hafalan Al-Qur'an sebanyak <strong>${this.santriData.totalJuz} Juz</strong> 
            dengan nilai rata-rata <strong>${this.santriData.totalScore}</strong> dan memenuhi standar kualitas 
            yang ditetapkan oleh Santri Online
          </div>
        </div>

        <div class="certificate-footer">
          <div class="signature-section">
            <p style="margin-bottom: 5px;">Jakarta, ${this.santriData.approvedDate}</p>
            <p style="margin-bottom: 80px;">Direktur Santri Online</p>
            <div class="signature-line"></div>
            <p style="font-weight: bold; margin-top: 10px;">${this.santriData.approvedBy}</p>
          </div>
          
          <div class="qr-code-section">
            ${qrHtml}
            <p style="font-size: 10px;">ID: ${this.santriData.certificateId}</p>
            ${this.santriData.verificationUrl ? `<p style="font-size:8px;max-width:100px;word-break:break-word;">Verifikasi:<br>${this.santriData.verificationUrl}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // Generate HTML untuk raport
  private generateReportHTML(): string {
    const achievementsHTML = this.santriData.achievements
      .map(
        (achievement) => `
      <div class="achievement-item">
        <div>
          <strong>${achievement.target}</strong> (${achievement.type})<br>
          <small style="color: #666;">${achievement.completedDate}</small>
        </div>
        <div class="achievement-score">${achievement.score}/100</div>
      </div>
    `,
      )
      .join('');

    const booksHTML = this.santriData.completedBooks
      .map(
        (book) => `
      <li style="margin-bottom: 5px;">✅ ${book}</li>
    `,
      )
      .join('');

    return `
      <div class="certificate-container certificate-back">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0066cc; font-size: 24px; margin-bottom: 10px;">RAPORT PROGRESS HAFALAN</h1>
          <p style="color: #666; font-size: 14px;">Periode: Januari - Agustus 2024</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
          <div>
            <div class="report-title">📊 Data Santri</div>
            <table style="width: 100%; font-size: 12px;">
              <tr><td><strong>Nama:</strong></td><td>${this.santriData.name}</td></tr>
              <tr><td><strong>NISN:</strong></td><td>${this.santriData.nisn}</td></tr>
              <tr><td><strong>Total Juz:</strong></td><td>${this.santriData.totalJuz} Juz</td></tr>
              <tr><td><strong>Nilai Rata-rata:</strong></td><td>${this.santriData.totalScore}</td></tr>
            </table>
          </div>
          
          <div>
            <div class="report-title">📚 Kitab yang Dipelajari</div>
            <ul style="font-size: 12px; margin: 0; padding-left: 20px;">
              ${booksHTML}
            </ul>
          </div>
        </div>

        <div class="report-section">
          <div class="report-title">📈 Detail Progress Hafalan & Pembelajaran</div>
          ${achievementsHTML}
        </div>

        <div class="report-footer">
          <p>Raport ini digenerate otomatis pada ${new Date().toLocaleDateString('id-ID')} 
          dan telah diverifikasi oleh sistem Santri Online</p>
          <p style="margin-top: 10px;"><strong>🔒 Dokumen ini telah diverifikasi secara digital</strong></p>
        </div>
      </div>
    `;
  }

  // Convert HTML to Canvas
  private async htmlToCanvas(html: string): Promise<HTMLCanvasElement> {
    const { default: html2canvas } = await loadHtml2Canvas();
    // Jika perlu QR code, generate terlebih dahulu menggunakan library qrcode secara dinamis
    if (this.santriData.verificationUrl) {
      // Buat container sementara untuk generate QR image dataURL sebelum render utama
      const { toDataURL } = await import('qrcode');
      try {
        const qrDataUrl = await toDataURL(this.santriData.verificationUrl, {
          margin: 0,
          width: 160,
        });
        // Sisipkan data URL ke placeholder img tag
        html = html.replace(
          /<img id="qr-img" data-qr="[^"]+"[^>]*>/,
          `<img id="qr-img" src="${qrDataUrl}" style="width:80px;height:80px;" />`,
        );
      } catch (e) {
        // fallback biarkan placeholder
      }
    }
    // Create temporary div
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '210mm';
    tempDiv.style.height = '297mm';

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .certificate-container { 
        width: 210mm; 
        height: 297mm; 
        padding: 20mm; 
        box-sizing: border-box; 
        font-family: Arial, sans-serif;
        background: white;
      }
      .certificate-front { 
        border: 4px solid #0066cc; 
        padding: 40px; 
        height: 100%; 
        position: relative; 
        display: flex; 
        flex-direction: column;
      }
      .certificate-back { 
        border: 2px solid #0066cc; 
        padding: 30px; 
        height: 100%; 
      }
      .certificate-title { 
        font-size: 28px; 
        font-weight: bold; 
        color: #0066cc; 
        text-transform: uppercase; 
        letter-spacing: 2px; 
      }
      .certificate-recipient { 
        font-size: 24px; 
        font-weight: bold; 
        border-bottom: 2px solid #ccc; 
        padding-bottom: 10px; 
        display: inline-block; 
        min-width: 300px; 
      }
      .report-title { 
        font-size: 18px; 
        font-weight: bold; 
        color: #0066cc; 
        margin-bottom: 15px; 
        border-bottom: 1px solid #ccc; 
        padding-bottom: 5px; 
      }
      .achievement-item { 
        display: flex; 
        justify-content: space-between; 
        padding: 10px; 
        border: 1px solid #ddd; 
        margin-bottom: 8px; 
        border-radius: 4px; 
      }
      .achievement-score { 
        font-weight: bold; 
        color: #0066cc; 
      }
    `;

    tempDiv.appendChild(style);
    document.body.appendChild(tempDiv);

    // Generate canvas
    const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      scale: 2, // Higher quality
      backgroundColor: '#ffffff',
    });

    // Cleanup
    document.body.removeChild(tempDiv);

    return canvas;
  }

  // Download PDF
  async downloadPDF(filename?: string): Promise<void> {
    if (!this.santriData.isApprovedByAdmin) {
      throw new Error('Sertifikat belum disetujui oleh admin');
    }

    const blob = await this.generatePDF();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download =
      filename || `Sertifikat_${this.santriData.name}_${this.santriData.certificateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}

// Factory function
export function createCertificateGenerator(santriData: SantriData): CertificateGenerator {
  return new CertificateGenerator(santriData);
}

// Helper function untuk validasi data santri
export function validateSantriData(data: Partial<SantriData>): boolean {
  const required = ['name', 'nisn', 'totalJuz', 'achievements', 'isApprovedByAdmin'];
  return required.every((field) => data[field as keyof SantriData] !== undefined);
}

// Mock function untuk get data santri dari database
export async function getSantriData(): Promise<SantriData | null> {
  // TODO: Implement actual database query
  // Untuk sekarang return mock data
  return {
    name: 'Ahmad Fauzi',
    nisn: '2024001001',
    totalJuz: 5,
    completedBooks: ['Iqro 1-6', "Al-Qur'an Juz 1-5", 'Tajwid Dasar'],
    achievements: [
      { type: 'Hafalan', target: 'Juz 1', completedDate: '2024-01-15', score: 95 },
      { type: 'Hafalan', target: 'Juz 2', completedDate: '2024-02-20', score: 92 },
      { type: 'Hafalan', target: 'Juz 3', completedDate: '2024-03-25', score: 94 },
      { type: 'Hafalan', target: 'Juz 4', completedDate: '2024-05-10', score: 96 },
      { type: 'Hafalan', target: 'Juz 5', completedDate: '2024-06-15', score: 98 },
      { type: 'Kitab', target: 'Tajwid Dasar', completedDate: '2024-04-01', score: 89 },
    ],
    totalScore: 95.8,
    isApprovedByAdmin: true,
    certificateId: 'STO-2024-001',
    approvedDate: '2024-08-01',
    approvedBy: 'Ustadz Ahmad Syarif',
  };
}
