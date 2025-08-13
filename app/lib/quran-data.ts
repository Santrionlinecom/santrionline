// File ini berisi data statis tentang semua surat dalam Al-Qur'an.
// Sumber data: Berbagai sumber data Al-Qur'an yang tersedia publik.

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  indonesianName: string; // <-- Properti baru ditambahkan
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  juz: number[];
}

export const allSurahs: Surah[] = [
  { number: 1, name: "Al-Fatihah", englishName: "The Opening", indonesianName: "Pembukaan", numberOfAyahs: 7, revelationType: "Meccan", juz: [1] },
  { number: 2, name: "Al-Baqarah", englishName: "The Cow", indonesianName: "Sapi Betina", numberOfAyahs: 286, revelationType: "Medinan", juz: [1, 2, 3] },
  { number: 3, name: "Ali 'Imran", englishName: "Family of Imran", indonesianName: "Keluarga Imran", numberOfAyahs: 200, revelationType: "Medinan", juz: [3, 4] },
  { number: 4, name: "An-Nisa", englishName: "The Women", indonesianName: "Wanita", numberOfAyahs: 176, revelationType: "Medinan", juz: [4, 5, 6] },
  { number: 5, name: "Al-Ma'idah", englishName: "The Table Spread", indonesianName: "Jamuan (Hidangan)", numberOfAyahs: 120, revelationType: "Medinan", juz: [6, 7] },
  { number: 6, name: "Al-An'am", englishName: "The Cattle", indonesianName: "Binatang Ternak", numberOfAyahs: 165, revelationType: "Meccan", juz: [7, 8] },
  { number: 7, name: "Al-A'raf", englishName: "The Heights", indonesianName: "Tempat Tertinggi", numberOfAyahs: 206, revelationType: "Meccan", juz: [8, 9] },
  { number: 8, name: "Al-Anfal", englishName: "The Spoils of War", indonesianName: "Harta Rampasan Perang", numberOfAyahs: 75, revelationType: "Medinan", juz: [9, 10] },
  { number: 9, name: "At-Tawbah", englishName: "The Repentance", indonesianName: "Pengampunan", numberOfAyahs: 129, revelationType: "Medinan", juz: [10, 11] },
  { number: 10, name: "Yunus", englishName: "Jonah", indonesianName: "Yunus", numberOfAyahs: 109, revelationType: "Meccan", juz: [11] },
  { number: 11, name: "Hud", englishName: "Hud", indonesianName: "Hud", numberOfAyahs: 123, revelationType: "Meccan", juz: [11, 12] },
  { number: 12, name: "Yusuf", englishName: "Joseph", indonesianName: "Yusuf", numberOfAyahs: 111, revelationType: "Meccan", juz: [12, 13] },
  { number: 13, name: "Ar-Ra'd", englishName: "The Thunder", indonesianName: "Guruh (Petir)", numberOfAyahs: 43, revelationType: "Medinan", juz: [13] },
  { number: 14, name: "Ibrahim", englishName: "Abraham", indonesianName: "Ibrahim", numberOfAyahs: 52, revelationType: "Meccan", juz: [13] },
  { number: 15, name: "Al-Hijr", englishName: "The Rocky Tract", indonesianName: "Bukit", numberOfAyahs: 99, revelationType: "Meccan", juz: [14] },
  { number: 16, name: "An-Nahl", englishName: "The Bee", indonesianName: "Lebah", numberOfAyahs: 128, revelationType: "Meccan", juz: [14] },
  { number: 17, name: "Al-Isra", englishName: "The Night Journey", indonesianName: "Perjalanan Malam", numberOfAyahs: 111, revelationType: "Meccan", juz: [15] },
  { number: 18, name: "Al-Kahf", englishName: "The Cave", indonesianName: "Gua", numberOfAyahs: 110, revelationType: "Meccan", juz: [15, 16] },
  { number: 19, name: "Maryam", englishName: "Mary", indonesianName: "Maryam", numberOfAyahs: 98, revelationType: "Meccan", juz: [16] },
  { number: 20, name: "Taha", englishName: "Ta-Ha", indonesianName: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan", juz: [16] },
  { number: 21, name: "Al-Anbya", englishName: "The Prophets", indonesianName: "Para Nabi", numberOfAyahs: 112, revelationType: "Meccan", juz: [17] },
  { number: 22, name: "Al-Hajj", englishName: "The Pilgrimage", indonesianName: "Haji", numberOfAyahs: 78, revelationType: "Medinan", juz: [17] },
  { number: 23, name: "Al-Mu'minun", englishName: "The Believers", indonesianName: "Orang-orang Mukmin", numberOfAyahs: 118, revelationType: "Meccan", juz: [18] },
  { number: 24, name: "An-Nur", englishName: "The Light", indonesianName: "Cahaya", numberOfAyahs: 64, revelationType: "Medinan", juz: [18] },
  { number: 25, name: "Al-Furqan", englishName: "The Criterion", indonesianName: "Pembeda", numberOfAyahs: 77, revelationType: "Meccan", juz: [18, 19] },
  { number: 26, name: "Asy-Syu'ara", englishName: "The Poets", indonesianName: "Para Penyair", numberOfAyahs: 227, revelationType: "Meccan", juz: [19] },
  { number: 27, name: "An-Naml", englishName: "The Ant", indonesianName: "Semut", numberOfAyahs: 93, revelationType: "Meccan", juz: [19, 20] },
  { number: 28, name: "Al-Qasas", englishName: "The Stories", indonesianName: "Kisah-kisah", numberOfAyahs: 88, revelationType: "Meccan", juz: [20] },
  { number: 29, name: "Al-'Ankabut", englishName: "The Spider", indonesianName: "Laba-laba", numberOfAyahs: 69, revelationType: "Meccan", juz: [20, 21] },
  { number: 30, name: "Ar-Rum", englishName: "The Romans", indonesianName: "Bangsa Romawi", numberOfAyahs: 60, revelationType: "Meccan", juz: [21] },
  { number: 31, name: "Luqman", englishName: "Luqman", indonesianName: "Luqman", numberOfAyahs: 34, revelationType: "Meccan", juz: [21] },
  { number: 32, name: "As-Sajdah", englishName: "The Prostration", indonesianName: "Sujud", numberOfAyahs: 30, revelationType: "Meccan", juz: [21] },
  { number: 33, name: "Al-Ahzab", englishName: "The Combined Forces", indonesianName: "Golongan yang Bersekutu", numberOfAyahs: 73, revelationType: "Medinan", juz: [21, 22] },
  { number: 34, name: "Saba", englishName: "Sheba", indonesianName: "Kaum Saba'", numberOfAyahs: 54, revelationType: "Meccan", juz: [22] },
  { number: 35, name: "Fatir", englishName: "Originator", indonesianName: "Pencipta", numberOfAyahs: 45, revelationType: "Meccan", juz: [22] },
  { number: 36, name: "Ya-Sin", englishName: "Ya Sin", indonesianName: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan", juz: [22, 23] },
  { number: 37, name: "As-Saffat", englishName: "Those who set the Ranks", indonesianName: "Barisan-barisan", numberOfAyahs: 182, revelationType: "Meccan", juz: [23] },
  { number: 38, name: "Sad", englishName: "The Letter 'Saad'", indonesianName: "Shad", numberOfAyahs: 88, revelationType: "Meccan", juz: [23] },
  { number: 39, name: "Az-Zumar", englishName: "The Troops", indonesianName: "Rombongan-rombongan", numberOfAyahs: 75, revelationType: "Meccan", juz: [23, 24] },
  { number: 40, name: "Ghafir", englishName: "The Forgiver", indonesianName: "Yang Mengampuni", numberOfAyahs: 85, revelationType: "Meccan", juz: [24] },
  { number: 41, name: "Fussilat", englishName: "Explained in Detail", indonesianName: "Yang Dijelaskan", numberOfAyahs: 54, revelationType: "Meccan", juz: [24, 25] },
  { number: 42, name: "Asy-Syura", englishName: "The Consultation", indonesianName: "Musyawarah", numberOfAyahs: 53, revelationType: "Meccan", juz: [25] },
  { number: 43, name: "Az-Zukhruf", englishName: "The Ornaments of Gold", indonesianName: "Perhiasan", numberOfAyahs: 89, revelationType: "Meccan", juz: [25] },
  { number: 44, name: "Ad-Dukhan", englishName: "The Smoke", indonesianName: "Kabut", numberOfAyahs: 59, revelationType: "Meccan", juz: [25] },
  { number: 45, name: "Al-Jathiyah", englishName: "The Crouching", indonesianName: "Yang Berlutut", numberOfAyahs: 37, revelationType: "Meccan", juz: [25] },
  { number: 46, name: "Al-Ahqaf", englishName: "The Wind-Curved Sandhills", indonesianName: "Bukit Pasir", numberOfAyahs: 35, revelationType: "Meccan", juz: [26] },
  { number: 47, name: "Muhammad", englishName: "Muhammad", indonesianName: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan", juz: [26] },
  { number: 48, name: "Al-Fath", englishName: "The Victory", indonesianName: "Kemenangan", numberOfAyahs: 29, revelationType: "Medinan", juz: [26] },
  { number: 49, name: "Al-Hujurat", englishName: "The Rooms", indonesianName: "Kamar-kamar", numberOfAyahs: 18, revelationType: "Medinan", juz: [26] },
  { number: 50, name: "Qaf", englishName: "The Letter 'Qaf'", indonesianName: "Qaf", numberOfAyahs: 45, revelationType: "Meccan", juz: [26] },
  { number: 51, name: "Adz-Dzariyah", englishName: "The Winnowing Winds", indonesianName: "Angin yang Menerbangkan", numberOfAyahs: 60, revelationType: "Meccan", juz: [26, 27] },
  { number: 52, name: "At-Tur", englishName: "The Mount", indonesianName: "Bukit", numberOfAyahs: 49, revelationType: "Meccan", juz: [27] },
  { number: 53, name: "An-Najm", englishName: "The Star", indonesianName: "Bintang", numberOfAyahs: 62, revelationType: "Meccan", juz: [27] },
  { number: 54, name: "Al-Qamar", englishName: "The Moon", indonesianName: "Bulan", numberOfAyahs: 55, revelationType: "Meccan", juz: [27] },
  { number: 55, name: "Ar-Rahman", englishName: "The Beneficent", indonesianName: "Yang Maha Pemurah", numberOfAyahs: 78, revelationType: "Medinan", juz: [27] },
  { number: 56, name: "Al-Waqi'ah", englishName: "The Inevitable", indonesianName: "Hari Kiamat", numberOfAyahs: 96, revelationType: "Meccan", juz: [27] },
  { number: 57, name: "Al-Hadid", englishName: "The Iron", indonesianName: "Besi", numberOfAyahs: 29, revelationType: "Medinan", juz: [27] },
  { number: 58, name: "Al-Mujadila", englishName: "The Pleading Woman", indonesianName: "Wanita yang Menggugat", numberOfAyahs: 22, revelationType: "Medinan", juz: [28] },
  { number: 59, name: "Al-Hasyr", englishName: "The Exile", indonesianName: "Pengusiran", numberOfAyahs: 24, revelationType: "Medinan", juz: [28] },
  { number: 60, name: "Al-Mumtahanah", englishName: "She that is to be examined", indonesianName: "Wanita yang Diuji", numberOfAyahs: 13, revelationType: "Medinan", juz: [28] },
  { number: 61, name: "As-Saf", englishName: "The Ranks", indonesianName: "Barisan", numberOfAyahs: 14, revelationType: "Medinan", juz: [28] },
  { number: 62, name: "Al-Jumu'ah", englishName: "The Congregation, Friday", indonesianName: "Hari Jum'at", numberOfAyahs: 11, revelationType: "Medinan", juz: [28] },
  { number: 63, name: "Al-Munafiqun", englishName: "The Hypocrites", indonesianName: "Orang-orang Munafik", numberOfAyahs: 11, revelationType: "Medinan", juz: [28] },
  { number: 64, name: "At-Taghabun", englishName: "The Mutual Disillusion", indonesianName: "Hari Dinampakkan Kesalahan", numberOfAyahs: 18, revelationType: "Medinan", juz: [28] },
  { number: 65, name: "At-Talaq", englishName: "The Divorce", indonesianName: "Talak", numberOfAyahs: 12, revelationType: "Medinan", juz: [28] },
  { number: 66, name: "At-Tahrim", englishName: "The Prohibition", indonesianName: "Mengharamkan", numberOfAyahs: 12, revelationType: "Medinan", juz: [28] },
  { number: 67, name: "Al-Mulk", englishName: "The Sovereignty", indonesianName: "Kerajaan", numberOfAyahs: 30, revelationType: "Meccan", juz: [29] },
  { number: 68, name: "Al-Qalam", englishName: "The Pen", indonesianName: "Pena", numberOfAyahs: 52, revelationType: "Meccan", juz: [29] },
  { number: 69, name: "Al-Haqqah", englishName: "The Reality", indonesianName: "Hari Kiamat", numberOfAyahs: 52, revelationType: "Meccan", juz: [29] },
  { number: 70, name: "Al-Ma'arij", englishName: "The Ascending Stairways", indonesianName: "Tempat Naik", numberOfAyahs: 44, revelationType: "Meccan", juz: [29] },
  { number: 71, name: "Nuh", englishName: "Noah", indonesianName: "Nuh", numberOfAyahs: 28, revelationType: "Meccan", juz: [29] },
  { number: 72, name: "Al-Jinn", englishName: "The Jinn", indonesianName: "Jin", numberOfAyahs: 28, revelationType: "Meccan", juz: [29] },
  { number: 73, name: "Al-Muzzammil", englishName: "The Enshrouded One", indonesianName: "Orang yang Berselimut", numberOfAyahs: 20, revelationType: "Meccan", juz: [29] },
  { number: 74, name: "Al-Muddaththir", englishName: "The Cloaked One", indonesianName: "Orang yang Berkemul", numberOfAyahs: 56, revelationType: "Meccan", juz: [29] },
  { number: 75, name: "Al-Qiyamah", englishName: "The Resurrection", indonesianName: "Hari Kiamat", numberOfAyahs: 40, revelationType: "Meccan", juz: [29] },
  { number: 76, name: "Al-Insan", englishName: "Man", indonesianName: "Manusia", numberOfAyahs: 31, revelationType: "Medinan", juz: [29] },
  { number: 77, name: "Al-Mursalat", englishName: "The Emissaries", indonesianName: "Malaikat yang Diutus", numberOfAyahs: 50, revelationType: "Meccan", juz: [29] },
  { number: 78, name: "An-Naba", englishName: "The Tidings", indonesianName: "Berita Besar", numberOfAyahs: 40, revelationType: "Meccan", juz: [30] },
  { number: 79, name: "An-Nazi'at", englishName: "Those who drag forth", indonesianName: "Malaikat yang Mencabut", numberOfAyahs: 46, revelationType: "Meccan", juz: [30] },
  { number: 80, name: "'Abasa", englishName: "He Frowned", indonesianName: "Ia Bermuka Masam", numberOfAyahs: 42, revelationType: "Meccan", juz: [30] },
  { number: 81, name: "At-Takwir", englishName: "The Overthrowing", indonesianName: "Menggulung", numberOfAyahs: 29, revelationType: "Meccan", juz: [30] },
  { number: 82, name: "Al-Infitar", englishName: "The Cleaving", indonesianName: "Terbelah", numberOfAyahs: 19, revelationType: "Meccan", juz: [30] },
  { number: 83, name: "Al-Mutaffifin", englishName: "The Defrauding", indonesianName: "Orang-orang Curang", numberOfAyahs: 36, revelationType: "Meccan", juz: [30] },
  { number: 84, name: "Al-Insyiqaq", englishName: "The Splitting Asunder", indonesianName: "Terbelah", numberOfAyahs: 25, revelationType: "Meccan", juz: [30] },
  { number: 85, name: "Al-Buruj", englishName: "The Mansions of the Stars", indonesianName: "Gugusan Bintang", numberOfAyahs: 22, revelationType: "Meccan", juz: [30] },
  { number: 86, name: "At-Tariq", englishName: "The Nightcommer", indonesianName: "Yang Datang di Malam Hari", numberOfAyahs: 17, revelationType: "Meccan", juz: [30] },
  { number: 87, name: "Al-A'la", englishName: "The Most High", indonesianName: "Yang Paling Tinggi", numberOfAyahs: 19, revelationType: "Meccan", juz: [30] },
  { number: 88, name: "Al-Ghasyiyah", englishName: "The Overwhelming", indonesianName: "Hari Pembalasan", numberOfAyahs: 26, revelationType: "Meccan", juz: [30] },
  { number: 89, name: "Al-Fajr", englishName: "The Dawn", indonesianName: "Fajar", numberOfAyahs: 30, revelationType: "Meccan", juz: [30] },
  { number: 90, name: "Al-Balad", englishName: "The City", indonesianName: "Negeri", numberOfAyahs: 20, revelationType: "Meccan", juz: [30] },
  { number: 91, name: "Asy-Syams", englishName: "The Sun", indonesianName: "Matahari", numberOfAyahs: 15, revelationType: "Meccan", juz: [30] },
  { number: 92, name: "Al-Lail", englishName: "The Night", indonesianName: "Malam", numberOfAyahs: 21, revelationType: "Meccan", juz: [30] },
  { number: 93, name: "Ad-Duha", englishName: "The Morning Hours", indonesianName: "Waktu Dhuha", numberOfAyahs: 11, revelationType: "Meccan", juz: [30] },
  { number: 94, name: "Asy-Syarh", englishName: "The Relief", indonesianName: "Melapangkan", numberOfAyahs: 8, revelationType: "Meccan", juz: [30] },
  { number: 95, name: "At-Tin", englishName: "The Fig", indonesianName: "Buah Tin", numberOfAyahs: 8, revelationType: "Meccan", juz: [30] },
  { number: 96, name: "Al-'Alaq", englishName: "The Clot", indonesianName: "Segumpal Darah", numberOfAyahs: 19, revelationType: "Meccan", juz: [30] },
  { number: 97, name: "Al-Qadr", englishName: "The Power", indonesianName: "Kemuliaan", numberOfAyahs: 5, revelationType: "Meccan", juz: [30] },
  { number: 98, name: "Al-Bayyinah", englishName: "The Clear Proof", indonesianName: "Bukti yang Nyata", numberOfAyahs: 8, revelationType: "Medinan", juz: [30] },
  { number: 99, name: "Az-Zalzalah", englishName: "The Earthquake", indonesianName: "Kegoncangan", numberOfAyahs: 8, revelationType: "Medinan", juz: [30] },
  { number: 100, name: "Al-'Adiyat", englishName: "The Courser", indonesianName: "Kuda Perang", numberOfAyahs: 11, revelationType: "Meccan", juz: [30] },
  { number: 101, name: "Al-Qari'ah", englishName: "The Calamity", indonesianName: "Hari Kiamat", numberOfAyahs: 11, revelationType: "Meccan", juz: [30] },
  { number: 102, name: "At-Takathur", englishName: "The Rivalry in world increase", indonesianName: "Bermegah-megahan", numberOfAyahs: 8, revelationType: "Meccan", juz: [30] },
  { number: 103, name: "Al-'Asr", englishName: "The Declining Day", indonesianName: "Masa", numberOfAyahs: 3, revelationType: "Meccan", juz: [30] },
  { number: 104, name: "Al-Humazah", englishName: "The Traducer", indonesianName: "Pengumpat", numberOfAyahs: 9, revelationType: "Meccan", juz: [30] },
  { number: 105, name: "Al-Fil", englishName: "The Elephant", indonesianName: "Gajah", numberOfAyahs: 5, revelationType: "Meccan", juz: [30] },
  { number: 106, name: "Quraisy", englishName: "Quraysh", indonesianName: "Suku Quraisy", numberOfAyahs: 4, revelationType: "Meccan", juz: [30] },
  { number: 107, name: "Al-Ma'un", englishName: "The Small Kindnesses", indonesianName: "Bantuan Penting", numberOfAyahs: 7, revelationType: "Meccan", juz: [30] },
  { number: 108, name: "Al-Kautsar", englishName: "The Abundance", indonesianName: "Nikmat Berlimpah", numberOfAyahs: 3, revelationType: "Meccan", juz: [30] },
  { number: 109, name: "Al-Kafirun", englishName: "The Disbelievers", indonesianName: "Orang-orang Kafir", numberOfAyahs: 6, revelationType: "Meccan", juz: [30] },
  { number: 110, name: "An-Nasr", englishName: "The Divine Support", indonesianName: "Pertolongan", numberOfAyahs: 3, revelationType: "Medinan", juz: [30] },
  { number: 111, name: "Al-Masad", englishName: "The Palm Fiber", indonesianName: "Gejolak Api", numberOfAyahs: 5, revelationType: "Meccan", juz: [30] },
  { number: 112, name: "Al-Ikhlas", englishName: "The Sincerity", indonesianName: "Ikhlas", numberOfAyahs: 4, revelationType: "Meccan", juz: [30] },
  { number: 113, name: "Al-Falaq", englishName: "The Daybreak", indonesianName: "Waktu Subuh", numberOfAyahs: 5, revelationType: "Meccan", juz: [30] },
  { number: 114, name: "An-Nas", englishName: "Mankind", indonesianName: "Manusia", numberOfAyahs: 6, revelationType: "Meccan", juz: [30] },
];


export const totalAyahsInQuran = 6236; // Tanpa menghitung Bismillah di awal surat

// Fungsi untuk mengelompokkan surat berdasarkan Juz
export function getSurahsByJuz() {
  const juzMap = new Array(30).fill(null).map(() => [] as Surah[]);
  allSurahs.forEach(surah => {
    surah.juz.forEach(juzNumber => {
      if (juzNumber >= 1 && juzNumber <= 30) {
        // Hindari duplikasi surat dalam satu juz
        if (!juzMap[juzNumber - 1].some(s => s.number === surah.number)) {
          juzMap[juzNumber - 1].push(surah);
        }
      }
    });
  });
  return juzMap;
}
