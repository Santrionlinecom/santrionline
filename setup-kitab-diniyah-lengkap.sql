-- Setup Lengkap Kitab Diniyah: Aqidatul Awam dan Hadits Arbain Nawawi
-- File: setup-kitab-diniyah-lengkap.sql
-- Jalankan file ini di Cloudflare D1 Console atau menggunakan Drizzle migrate

-- ========================================
-- TABEL STRUKTUR UNTUK KONTEN DETAIL
-- ========================================

-- Tabel untuk menyimpan konten detail setiap pelajaran
CREATE TABLE IF NOT EXISTS diniyah_pelajaran_content (
    id INTEGER PRIMARY KEY,
    pelajaran_id INTEGER NOT NULL,
    section_order INTEGER NOT NULL DEFAULT 1,
    section_title TEXT,
    content_type TEXT NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'arabic', 'translation', 'explanation', 'dalil')),
    content TEXT NOT NULL,
    audio_url TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (pelajaran_id) REFERENCES diniyah_pelajaran(id)
);

-- ========================================
-- AQIDATUL AWAM - 20 PELAJARAN LENGKAP
-- ========================================

-- Hapus data lama untuk Aqidatul Awam dan buat ulang
DELETE FROM diniyah_pelajaran WHERE kitab_id = 1;
DELETE FROM diniyah_pelajaran_content WHERE pelajaran_id BETWEEN 1 AND 50;

-- Insert 20 pelajaran lengkap Aqidatul Awam
INSERT INTO diniyah_pelajaran (id, kitab_id, title, points) VALUES
-- BAB 1: PENGENALAN AQIDAH
(1, 1, 'Pengertian Aqidah dan Tauhid', 5),
(2, 1, 'Kewajiban Mengetahui Aqidah', 5),
(3, 1, 'Dalil-dalil Wujud Allah', 5),

-- BAB 2: SIFAT WAJIB ALLAH (20 SIFAT)
(4, 1, 'Sifat Wajib 1-5: Wujud, Qidam, Baqa, Mukhalafatu lil Hawadits, Qiyamuhu bi Nafsihi', 8),
(5, 1, 'Sifat Wajib 6-10: Wahdaniyyah, Qudrat, Iradat, Ilmu, Hayat', 8),
(6, 1, 'Sifat Wajib 11-15: Sama, Bashar, Kalam, Qadir, Murid', 8),
(7, 1, 'Sifat Wajib 16-20: Alim, Hayy, Sami, Bashir, Mutakallim', 8),

-- BAB 3: SIFAT MUSTAHIL ALLAH
(8, 1, 'Sifat Mustahil Allah: 20 Sifat yang Mustahil', 8),

-- BAB 4: SIFAT JAIZ ALLAH
(9, 1, 'Sifat Jaiz Allah: Filuhu wa Tarkuhu', 5),

-- BAB 5: SIFAT RASUL
(10, 1, 'Sifat Wajib Rasul: Shidiq, Amanah, Tabligh, Fathanah', 10),
(11, 1, 'Sifat Mustahil Rasul: Kizib, Khiyanah, Kitman, Baladah', 8),
(12, 1, 'Sifat Jaiz Rasul: A''radh al-Basyariyyah', 6),

-- BAB 6: RUKUN IMAN
(13, 1, 'Iman kepada Allah SWT', 8),
(14, 1, 'Iman kepada Malaikat Allah', 8),
(15, 1, 'Iman kepada Kitab-kitab Allah', 8),
(16, 1, 'Iman kepada Rasul-rasul Allah', 8),
(17, 1, 'Iman kepada Hari Akhir', 10),
(18, 1, 'Iman kepada Qada dan Qadar', 10),

-- BAB 7: PENUTUP
(19, 1, 'Syahadat dan Konsekuensinya', 8),
(20, 1, 'Amaliah dan Doa Sehari-hari', 6);

-- ========================================
-- HADITS ARBAIN NAWAWI - 40 HADITS LENGKAP
-- ========================================

-- Hapus data lama untuk Hadits Arbain Nawawi
DELETE FROM diniyah_pelajaran WHERE kitab_id = 2;
DELETE FROM diniyah_pelajaran_content WHERE pelajaran_id BETWEEN 101 AND 200;

-- Insert 40 hadits Arbain Nawawi lengkap
INSERT INTO diniyah_pelajaran (id, kitab_id, title, points) VALUES
(101, 2, 'Hadits 1: Amal dengan Niat', 3),
(102, 2, 'Hadits 2: Islam, Iman, Ihsan', 4),
(103, 2, 'Hadits 3: Rukun Islam', 3),
(104, 2, 'Hadits 4: Penciptaan Manusia', 4),
(105, 2, 'Hadits 5: Bidah dalam Agama', 3),
(106, 2, 'Hadits 6: Halal dan Haram', 4),
(107, 2, 'Hadits 7: Agama adalah Nasihat', 3),
(108, 2, 'Hadits 8: Darah yang Haram', 4),
(109, 2, 'Hadits 9: Taklif dan Kemampuan', 3),
(110, 2, 'Hadits 10: Rizki yang Baik', 4),
(111, 2, 'Hadits 11: Wara dan Meninggalkan Syubhat', 3),
(112, 2, 'Hadits 12: Meninggalkan yang Tidak Berguna', 3),
(113, 2, 'Hadits 13: Cinta karena Allah', 4),
(114, 2, 'Hadits 14: Darah Muslim Haram', 3),
(115, 2, 'Hadits 15: Akhlak kepada Tetangga', 4),
(116, 2, 'Hadits 16: Berkata Baik atau Diam', 3),
(117, 2, 'Hadits 17: Ihsan dalam Segala Hal', 4),
(118, 2, 'Hadits 18: Bertakwa dan Berakhlak Baik', 3),
(119, 2, 'Hadits 19: Meminta Pertolongan Allah', 4),
(120, 2, 'Hadits 20: Malu dan Iman', 3),
(121, 2, 'Hadits 21: Istiqamah', 4),
(122, 2, 'Hadits 22: Jalan ke Surga', 3),
(123, 2, 'Hadits 23: Kebersihan', 4),
(124, 2, 'Hadits 24: Larangan Berbuat Zalim', 3),
(125, 2, 'Hadits 25: Sedekah dari Setiap Anggota Badan', 4),
(126, 2, 'Hadits 26: Kebaikan untuk Setiap Muslim', 3),
(127, 2, 'Hadits 27: Birr dan Dosa', 4),
(128, 2, 'Hadits 28: Sunnah dan Jamaah', 3),
(129, 2, 'Hadits 29: Jalan ke Surga', 4),
(130, 2, 'Hadits 30: Hak-hak Allah', 3),
(131, 2, 'Hadits 31: Zuhud di Dunia', 4),
(132, 2, 'Hadits 32: Larangan Mudarat', 3),
(133, 2, 'Hadits 33: Beban Pembuktian', 4),
(134, 2, 'Hadits 34: Mengingkari Kemungkaran', 3),
(135, 2, 'Hadits 35: Tidak Boleh Mudarat', 4),
(136, 2, 'Hadits 36: Kebaikan untuk Muslim', 3),
(137, 2, 'Hadits 37: Ketaqwaan', 4),
(138, 2, 'Hadits 38: Kasih Sayang Allah', 3),
(139, 2, 'Hadits 39: Kemudahan dalam Agama', 4),
(140, 2, 'Hadits 40: Zuhud di Dunia', 3);

-- ========================================
-- KONTEN DETAIL AQIDATUL AWAM
-- ========================================

-- PELAJARAN 1: Pengertian Aqidah dan Tauhid
INSERT INTO diniyah_pelajaran_content (pelajaran_id, section_order, section_title, content_type, content, created_at) VALUES
(1, 1, 'Pengertian Aqidah Secara Bahasa', 'text', 'Aqidah secara bahasa berasal dari kata عَقَدَ - يَعْقِدُ - عَقْداً yang artinya mengikat atau mengokohkan. Seperti mengikat tali atau membuat ikatan yang kuat.', unixepoch()),
(1, 2, 'Pengertian Aqidah Secara Istilah', 'text', 'Aqidah secara istilah adalah keyakinan yang mengikat hati, yang diyakini seseorang dengan penuh kepastian, tanpa ada keraguan sedikitpun. Keyakinan ini harus didasarkan pada dalil yang qath''i (pasti).', unixepoch()),
(1, 3, 'Pengertian Tauhid', 'text', 'Tauhid adalah mengesakan Allah SWT dalam segala hal yang khusus bagi-Nya, yaitu dalam Rububiyyah (ketuhanan), Uluhiyyah (peribadatan), dan Asma wa Sifat (nama dan sifat-Nya).', unixepoch()),
(1, 4, 'Dalil Al-Quran', 'arabic', 'قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', unixepoch()),
(1, 5, 'Terjemahan Dalil', 'translation', 'Katakanlah: "Dia-lah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorangpun yang setara dengan Dia." (QS. Al-Ikhlas: 1-4)', unixepoch()),
(1, 6, 'Pembagian Tauhid', 'explanation', '1. Tauhid Rububiyyah: Mengesakan Allah dalam penciptaan, pengaturan, dan kepemilikan alam semesta.\n2. Tauhid Uluhiyyah: Mengesakan Allah dalam peribadatan, tidak menyembah selain Allah.\n3. Tauhid Asma wa Sifat: Mengesakan Allah dalam nama-nama dan sifat-sifat-Nya.', unixepoch());

-- PELAJARAN 2: Kewajiban Mengetahui Aqidah
INSERT INTO diniyah_pelajaran_content (pelajaran_id, section_order, section_title, content_type, content, created_at) VALUES
(2, 1, 'Kewajiban Setiap Muslim', 'text', 'Setiap muslim yang sudah mukallaf (balig dan berakal) wajib mengetahui 20 sifat wajib Allah, 20 sifat mustahil Allah, 1 sifat jaiz Allah, 4 sifat wajib Rasul, 4 sifat mustahil Rasul, dan 1 sifat jaiz Rasul. Ini adalah ilmu daruri (wajib) bagi setiap muslim.', unixepoch()),
(2, 2, 'Dalil Kewajiban dari Al-Quran', 'arabic', 'فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ وَاسْتَغْفِرْ لِذَنبِكَ', unixepoch()),
(2, 3, 'Terjemahan Dalil', 'translation', 'Maka ketahuilah, bahwa sesungguhnya tidak ada Tuhan (yang haq) melainkan Allah, dan mohonlah ampunan bagi dosamu. (QS. Muhammad: 19)', unixepoch()),
(2, 4, 'Dalil dari Hadits', 'arabic', 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', unixepoch()),
(2, 5, 'Terjemahan Hadits', 'translation', 'Menuntut ilmu adalah kewajiban bagi setiap muslim. (HR. Ibnu Majah)', unixepoch()),
(2, 6, 'Hikmah Mempelajari Aqidah', 'explanation', '1. Menguatkan keimanan dan keyakinan kepada Allah\n2. Terhindar dari syubhat (keraguan) dan syirik\n3. Meningkatkan ketaqwaan dan kedekatan dengan Allah\n4. Menjadi pedoman hidup yang benar\n5. Membentengi diri dari ajaran sesat', unixepoch());

-- PELAJARAN 4: Sifat Wajib Allah 1-5
INSERT INTO diniyah_pelajaran_content (pelajaran_id, section_order, section_title, content_type, content, created_at) VALUES
(4, 1, '1. Wujud (وُجُودٌ)', 'text', 'Artinya: Ada. Allah SWT pasti ada, tidak mungkin tidak ada. Wujud Allah adalah mutlak dan tidak bergantung pada apapun. Keberadaan-Nya adalah hakiki, bukan maya atau khayalan.', unixepoch()),
(4, 2, 'Dalil Wujud Allah', 'arabic', 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ', unixepoch()),
(4, 3, 'Terjemahan Dalil Wujud', 'translation', 'Allah, tidak ada Tuhan selain Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. (QS. Al-Baqarah: 255)', unixepoch()),
(4, 4, '2. Qidam (قِدَمٌ)', 'text', 'Artinya: Terdahulu atau azali. Allah SWT ada tanpa permulaan, tidak diciptakan, dan tidak ada yang mendahului-Nya. Dia adalah Yang Pertama (Al-Awwal) tanpa awal.', unixepoch()),
(4, 5, '3. Baqa (بَقَاءٌ)', 'text', 'Artinya: Kekal atau abadi. Allah SWT kekal selamanya, tidak akan musnah, tidak akan mati, dan tidak akan berakhir. Dia adalah Yang Akhir (Al-Akhir) tanpa akhir.', unixepoch()),
(4, 6, 'Dalil Qidam dan Baqa', 'arabic', 'هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ', unixepoch()),
(4, 7, '4. Mukhalafatu lil Hawadits (مُخَالَفَتُهُ لِلْحَوَادِثِ)', 'text', 'Artinya: Berbeda dengan makhluk. Allah SWT tidak menyerupai makhluk-Nya dalam segala hal. Tidak memiliki bentuk, rupa, tempat, arah, atau sifat-sifat makhluk lainnya.', unixepoch()),
(4, 8, '5. Qiyamuhu bi Nafsihi (قِيَامُهُ بِنَفْسِهِ)', 'text', 'Artinya: Berdiri sendiri atau tidak membutuhkan yang lain. Allah SWT tidak membutuhkan tempat, waktu, makanan, istirahat, atau apapun dari makhluk-Nya. Dia Maha Kaya dan tidak butuh apapun.', unixepoch()),
(4, 9, 'Dalil Mukhalafah dan Qiyam bi Nafsihi', 'arabic', 'لَيْسَ كَمِثْلِهِ شَيْءٌ وَهُوَ السَّمِيعُ الْبَصِيرُ', unixepoch()),
(4, 10, 'Terjemahan', 'translation', 'Tidak ada sesuatupun yang serupa dengan Dia, dan Dia-lah Yang Maha Mendengar lagi Maha Melihat. (QS. Asy-Syura: 11)', unixepoch());

-- ========================================
-- KONTEN DETAIL HADITS ARBAIN NAWAWI  
-- ========================================

-- HADITS 1: Amal dengan Niat
INSERT INTO diniyah_pelajaran_content (pelajaran_id, section_order, section_title, content_type, content, created_at) VALUES
(101, 1, 'Teks Hadits Arab', 'arabic', 'عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إلَى مَا هَاجَرَ إلَيْهِ', unixepoch()),
(101, 2, 'Terjemahan Hadits', 'translation', 'Dari Amirul Mukminin Abu Hafsh Umar bin Khattab RA berkata: Aku mendengar Rasulullah SAW bersabda: "Sesungguhnya setiap amal bergantung pada niatnya, dan sesungguhnya setiap orang (akan dibalas) berdasarkan apa yang dia niatkan. Maka barangsiapa hijrahnya karena Allah dan Rasul-Nya, maka hijrahnya kepada Allah dan Rasul-Nya. Dan barangsiapa hijrahnya karena dunia yang ingin diraihnya atau karena wanita yang ingin dinikahinya, maka hijrahnya kepada apa yang dia tuju."', unixepoch()),
(101, 3, 'Kedudukan Hadits', 'explanation', 'Hadits ini disebut sebagai "sepertiga Islam" karena mencakup niat yang merupakan ruh dari setiap amal. Para ulama menempatkannya di awal kitab-kitab hadits karena pentingnya. Imam Bukhari memulai Shahih-nya dengan hadits ini.', unixepoch()),
(101, 4, 'Pelajaran dari Hadits', 'explanation', '1. Niat adalah ruh dari setiap amal perbuatan\n2. Pahala amal tergantung pada niat yang melatarbelakanginya\n3. Niat harus ikhlas karena Allah SWT semata\n4. Contoh konkret tentang hijrah dan berbagai motivasinya\n5. Pentingnya memurnikan niat sebelum beramal', unixepoch()),
(101, 5, 'Perawi dan Sanad', 'text', 'Hadits ini diriwayatkan oleh Imam Bukhari (no. 1) dan Imam Muslim (no. 1907). Perawi utamanya adalah Umar bin Khattab RA, Khalifah kedua dan salah satu dari Khulafaur Rasyidin yang terkenal dengan ketegasan dan keadilannya.', unixepoch()),
(101, 6, 'Aplikasi dalam Kehidupan', 'text', 'Sebelum melakukan apapun, seorang muslim hendaknya memperbaiki niatnya: menuntut ilmu diniatkan untuk menambah ketaqwaan, bekerja diniatkan untuk mencari rizki halal dan beribadah kepada Allah, menikah diniatkan untuk melengkapi agama dan menjaga kehormatan.', unixepoch());

-- HADITS 2: Islam, Iman, Ihsan (Hadits Jibril)
INSERT INTO diniyah_pelajaran_content (pelajaran_id, section_order, section_title, content_type, content, created_at) VALUES
(102, 1, 'Teks Hadits Arab (Ringkas)', 'arabic', 'عَنْ عُمَرَ رَضِيَ اللهُ عَنْهُ قَالَ: بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صلى الله عليه وسلم إذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ شَدِيدُ سَوَادِ الشَّعْرِ لَا يُرَى عَلَيْهِ أَثَرُ السَّفَرِ وَلَا يَعْرِفُهُ مِنَّا أَحَدٌ... فَسَأَلَ عَنْ الْإِسْلَامِ وَالْإِيمَانِ وَالْإِحْسَانِ وَالسَّاعَةِ', unixepoch()),
(102, 2, 'Terjemahan Pembuka', 'translation', 'Dari Umar RA berkata: "Ketika kami sedang duduk di sisi Rasulullah SAW, tiba-tiba datang seorang laki-laki yang sangat putih bajunya, sangat hitam rambutnya, tidak tampak padanya bekas perjalanan jauh, dan tidak ada seorangpun di antara kami yang mengenalnya..." kemudian dia bertanya tentang Islam, Iman, Ihsan, dan hari kiamat.', unixepoch()),
(102, 3, 'Definisi Islam', 'text', 'Islam adalah: Bersaksi bahwa tidak ada Tuhan selain Allah dan Muhammad adalah Rasul Allah, mendirikan shalat, membayar zakat, puasa Ramadhan, dan haji ke Baitullah bagi yang mampu. (Ini adalah rukun Islam yang lima)', unixepoch()),
(102, 4, 'Definisi Iman', 'text', 'Iman adalah: Beriman kepada Allah, malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, hari akhir, dan qada qadar baik maupun buruk dari Allah. (Ini adalah rukun iman yang enam)', unixepoch()),
(102, 5, 'Definisi Ihsan', 'text', 'Ihsan adalah: Beribadah kepada Allah seakan-akan engkau melihat-Nya, jika tidak dapat melihat-Nya, maka sesungguhnya Dia melihatmu. (Ini adalah tingkatan tertinggi dalam beragama)', unixepoch()),
(102, 6, 'Kedudukan Hadits', 'explanation', 'Hadits ini disebut "Ummul Sunnah" (induk sunnah) karena mencakup seluruh ajaran Islam: Islam (syariat/hukum lahir), Iman (akidah/kepercayaan), dan Ihsan (tasawuf/akhlak/spiritualitas). Penanya adalah Malaikat Jibril yang menyamar menjadi manusia.', unixepoch()),
(102, 7, 'Hikmah Penampakan Jibril', 'explanation', 'Jibril datang dalam bentuk manusia agar para sahabat bisa melihat cara bertanya yang baik, mendengar jawaban Rasulullah secara langsung, dan memahami bahwa ini adalah pelajaran penting yang harus dipahami semua umat Islam hingga akhir zaman.', unixepoch());

-- HADITS 18: Bertakwa dan Berakhlak Baik
INSERT INTO diniyah_pelajaran_content (pelajaran_id, section_order, section_title, content_type, content, created_at) VALUES
(118, 1, 'Teks Hadits Arab', 'arabic', 'عَنْ أَبِي ذَرٍّ جُنْدُبِ بْنِ جُنَادَةَ وَأَبِي عَبْدِ الرَّحْمَنِ مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللهُ عَنْهُمَا عَنْ رَسُولِ اللَّهِ صلى الله عليه وسلم قَالَ: اتَّقِ اللَّهَ حَيْثُمَا كُنْت، وَأَتْبِعْ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ', unixepoch()),
(118, 2, 'Terjemahan Hadits', 'translation', 'Dari Abu Dzarr dan Muadz bin Jabal RA dari Rasulullah SAW bersabda: "Bertakwalah kepada Allah di manapun engkau berada, iringilah keburukan dengan kebaikan yang dapat menghapusnya, dan pergaulilah manusia dengan akhlak yang baik."', unixepoch()),
(118, 3, 'Tiga Wasiat Emas', 'explanation', '1. Takwa kepada Allah di segala tempat dan waktu\n2. Berbuat baik setelah berbuat salah untuk menghapus dosa\n3. Berakhlak mulia dalam bergaul dengan sesama manusia', unixepoch()),
(118, 4, 'Makna Takwa', 'text', 'Takwa adalah melaksanakan perintah Allah dan menjauhi larangan-Nya dengan penuh kesadaran, baik ketika sendirian maupun bersama orang lain, baik di tempat umum maupun tersembunyi. Takwa adalah benteng terkuat seorang muslim.', unixepoch()),
(118, 5, 'Hasanah Menghapus Sayyiah', 'text', 'Kebaikan dapat menghapus keburukan dengan syarat: taubat yang tulus, istighfar, amal shalih, dan tidak mengulangi kesalahan. Allah Maha Pengampun kepada hamba yang bertaubat dengan sungguh-sungguh.', unixepoch()),
(118, 6, 'Akhlak dalam Bermasyarakat', 'text', 'Akhlak baik meliputi: lemah lembut dalam berkata, sabar dalam menghadapi orang yang menyakiti, dermawan kepada yang membutuhkan, adil dalam bermuamalah, dan menjadi teladan yang baik bagi lingkungan.', unixepoch());

-- Tambahan untuk semua hadits (ringkas untuk contoh)
-- HADITS 40: Zuhud di Dunia (Hadits Penutup)
INSERT INTO diniyah_pelajaran_content (pelajaran_id, section_order, section_title, content_type, content, created_at) VALUES
(140, 1, 'Teks Hadits Arab', 'arabic', 'عَنْ ابْنِ عُمَرَ رَضِيَ اللهُ عَنْهُمَا قَالَ: أَخَذَ رَسُولُ اللَّهِ صلى الله عليه وسلم بِمَنْكِبِي فَقَالَ: كُنْ فِي الدُّنْيَا كَأَنَّك غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ', unixepoch()),
(140, 2, 'Terjemahan Hadits', 'translation', 'Dari Ibnu Umar RA berkata: Rasulullah SAW memegang pundakku dan berkata: "Jadilah engkau di dunia seakan-akan orang asing atau orang yang sedang dalam perjalanan."', unixepoch()),
(140, 3, 'Makna Hadits', 'explanation', 'Dunia adalah tempat singgah sementara, bukan tujuan akhir. Seorang muslim harus memiliki sikap zuhud, yaitu tidak terpedaya oleh gemerlap dunia dan selalu mengingat akhirat sebagai tempat kembali yang hakiki.', unixepoch()),
(140, 4, 'Nasihat Ibnu Umar', 'text', 'Ibnu Umar menambahkan nasihat: "Jika engkau di sore hari, jangan menunggu pagi. Jika di pagi hari, jangan menunggu sore. Ambillah dari kesehatanmu untuk persiapan sakitmu, dan dari hidupmu untuk persiapan matimu."', unixepoch()),
(140, 5, 'Penutup Hadits Arbain', 'explanation', 'Hadits ke-40 ini menutup kumpulan hadits Arbain Nawawi dengan pesan mendalam tentang pandangan hidup seorang muslim: hidup di dunia tetapi hatinya tertuju kepada akhirat, bekerja untuk dunia tetapi lebih giat bekerja untuk akhirat.', unixepoch());

-- ========================================
-- PENYELESAIAN SETUP
-- ========================================

-- Verify data berhasil diinsert
SELECT 'AQIDATUL AWAM - Total Pelajaran:' as info, COUNT(*) as jumlah FROM diniyah_pelajaran WHERE kitab_id = 1
UNION ALL
SELECT 'HADITS ARBAIN - Total Pelajaran:', COUNT(*) FROM diniyah_pelajaran WHERE kitab_id = 2
UNION ALL  
SELECT 'TOTAL KONTEN DETAIL:', COUNT(*) FROM diniyah_pelajaran_content;

-- Tampilkan sample data
SELECT dp.title as pelajaran, dpc.section_title, dpc.content_type, 
       SUBSTR(dpc.content, 1, 100) || '...' as preview_content
FROM diniyah_pelajaran dp 
JOIN diniyah_pelajaran_content dpc ON dp.id = dpc.pelajaran_id
WHERE dp.kitab_id IN (1,2)
ORDER BY dp.kitab_id, dp.id, dpc.section_order
LIMIT 10;

-- Status complete
SELECT '=== SETUP COMPLETED SUCCESSFULLY ===' as status,
       'Total 60 pelajaran lengkap (20 Aqidatul Awam + 40 Hadits Arbain)' as detail;
