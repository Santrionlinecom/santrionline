-- Migration 0022: Ulama Seed using PRAGMA Guards (Idempotent / Self-Healing)
-- Tujuan:
--  * Memastikan tabel ulama, ulama_category, ulama_work ada (jika belum dibuat oleh migrasi sebelumnya)
--  * Menggunakan PRAGMA table_info untuk mendeteksi kolom penting & rekonstruksi search_index jika perlu
--  * Men-seed data hanya bila belum ada (tanpa menggandakan)
--  * Aman dijalankan berkali-kali (idempotent)
-- Catatan:
--  * SQLite tidak mendukung IF NOT EXISTS pada ADD COLUMN, jadi kita hindari ALTER repetitif.
--  * Guard insert memakai pola INSERT ... SELECT ... WHERE NOT EXISTS(...)
--  * PRAGMA hasilnya hanya bisa dibaca, tidak langsung dipakai dalam IF, jadi pattern: cek keberadaan kolom dengan EXISTS pada hasil pragma_table_info('table').
--  * Cloudflare D1 kompatibel dengan PRAGMA table_info.

BEGIN TRANSACTION;

-- 1. Pastikan tabel ada (struktur minimal sesuai schema.ts)
CREATE TABLE IF NOT EXISTS ulama_category (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ulama (
  id TEXT PRIMARY KEY NOT NULL,
  category_id TEXT NOT NULL,
  author_id TEXT,
  name TEXT NOT NULL,
  full_name TEXT,
  slug TEXT UNIQUE,
  birth TEXT,
  death TEXT,
  birth_place TEXT,
  biography TEXT,
  contribution TEXT,
  quote TEXT,
  image_url TEXT,
  references_json TEXT,
  period_century TEXT,
  search_index TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  deleted_at INTEGER,
  FOREIGN KEY(category_id) REFERENCES ulama_category(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY(author_id) REFERENCES pengguna(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS ulama_work (
  id TEXT PRIMARY KEY NOT NULL,
  ulama_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(ulama_id) REFERENCES ulama(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- 2. (Contoh) Cek kolom author_id & search_index dengan PRAGMA (tidak memodifikasi, hanya referensi)
--    Jika suatu saat kolom hilang, Anda bisa menambahkan migrasi terpisah untuk rebuild tabel.
-- SELECT name FROM pragma_table_info('ulama') WHERE name IN ('author_id','search_index');

-- 3. Seed kategori (guard per id)
INSERT INTO ulama_category (id, slug, name, description, sort_order, created_at)
SELECT 'cat_hanafi','hanafi','Madzhab Hanafi',NULL,1,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_category WHERE id='cat_hanafi');
INSERT INTO ulama_category (id, slug, name, description, sort_order, created_at)
SELECT 'cat_maliki','maliki','Madzhab Maliki',NULL,2,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_category WHERE id='cat_maliki');
INSERT INTO ulama_category (id, slug, name, description, sort_order, created_at)
SELECT 'cat_syafii','syafii','Madzhab Syafi''i',NULL,3,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_category WHERE id='cat_syafii');
INSERT INTO ulama_category (id, slug, name, description, sort_order, created_at)
SELECT 'cat_hanbali','hanbali','Madzhab Hanbali',NULL,4,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_category WHERE id='cat_hanbali');
INSERT INTO ulama_category (id, slug, name, description, sort_order, created_at)
SELECT 'cat_tasawuf','tasawuf','Imam Tasawuf & Thariqah',NULL,5,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_category WHERE id='cat_tasawuf');
INSERT INTO ulama_category (id, slug, name, description, sort_order, created_at)
SELECT 'cat_aqidah','aqidah','Ulama Aqidah',NULL,6,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_category WHERE id='cat_aqidah');
INSERT INTO ulama_category (id, slug, name, description, sort_order, created_at)
SELECT 'cat_thariqah','thariqah','Masyayikh Thariqah',NULL,7,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_category WHERE id='cat_thariqah');
INSERT INTO ulama_category (id, slug, name, description, sort_order, created_at)
SELECT 'cat_nu','nahdlatul-ulama','Nahdlatul Ulama',NULL,20,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_category WHERE id='cat_nu');
INSERT INTO ulama_category (id, slug, name, description, sort_order, created_at)
SELECT 'cat_muh','muhammadiyah','Muhammadiyah',NULL,21,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_category WHERE id='cat_muh');
INSERT INTO ulama_category (id, slug, name, description, sort_order, created_at)
SELECT 'cat_kontemporer','kontemporer','Ulama Kontemporer',NULL,30,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_category WHERE id='cat_kontemporer');

-- 4. Seed ulama (pattern guarded per id)
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_abu_hanifah','cat_hanafi','8gdEHkswuvfxngOlfXPzz','Imam Abu Hanifah','Nu''man bin Tsabit bin Zuta','imam-abu-hanifah','80 H','150 H','Kufah, Irak','Pendiri madzhab Hanafi dengan metodologi qiyas dan istihsan yang kuat.','Meletakkan dasar fiqih ra''y yang terukur.','Seandainya ilmu itu diangkat ke bintang Tsurayya, niscaya akan diambil oleh lelaki dari Persia.',json('["Al-Fiqh Al-Akbar","Tarikh Baghdad"]'),'2H',NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_abu_hanifah');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_malik','cat_maliki','8gdEHkswuvfxngOlfXPzz','Imam Malik','Malik bin Anas','imam-malik','93 H','179 H','Madinah','Penyusun Al-Muwatha dan imam Darul Hijrah.','Amal Ahlul Madinah sebagai hujjah.','Ilmu bukanlah banyaknya riwayat, tetapi cahaya yang Allah letakkan di hati.',json('["Al-Muwatha","Tadzkiratul Huffazh"]'),'2H',NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_malik');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_syafii','cat_syafii','8gdEHkswuvfxngOlfXPzz','Imam Asy-Syafi''i','Muhammad bin Idris','imam-asy-syafii','150 H','204 H','Gaza','Peletak dasar ushul fiqih melalui Ar-Risalah.','Sintesis metode hadits & ra''y.','Barangsiapa mempelajari fiqih tanpa hadits, ia seperti pedagang tanpa timbangan.',json('["Ar-Risalah","Manaqib Asy-Syafii"]'),'3H',NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_syafii');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_ahmad','cat_hanbali','8gdEHkswuvfxngOlfXPzz','Imam Ahmad bin Hanbal','Ahmad bin Muhammad','imam-ahmad-bin-hanbal','164 H','241 H','Baghdad','Imam hadits dan penjaga sunnah saat mihnah.','Musnad besar & keteguhan aqidah.','Al-Ilmu laisa bisurati ar-riwayah, innamal ilmu khosyah.',json('["Musnad Ahmad","Siyar Alam An-Nubala"]'),'3H',NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_ahmad');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_ghazali','cat_tasawuf','8gdEHkswuvfxngOlfXPzz','Imam Al-Ghazali','Abu Hamid Muhammad','imam-al-ghazali','450 H','505 H','Thus','Hujjatul Islam yang memadukan syariah & tasawuf.','Ihya Ulumuddin & reform tasawuf Sunni.','Lidahmu adalah singa, jika kau lepaskan ia akan menerkammu.',json('["Ihya Ulumuddin","Al-Munqidz"]'),'5H',NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_ghazali');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_qadir','cat_tasawuf','8gdEHkswuvfxngOlfXPzz','Syaikh Abdul Qadir Al-Jailani','Abdul Qadir bin Abi Shalih','syaikh-abdul-qadir-al-jailani','471 H','561 H','Jilan','Masyayikh besar pendiri Thariqah Qadiriyyah.','Menjaga tasawuf berbasis syariah.','Bersihkan hati dengan dzikir dan keikhlasan.',json('["Al-Ghunyah","Futuh Al-Ghaib"]'),'6H',NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_qadir');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_bahauddin','cat_thariqah','8gdEHkswuvfxngOlfXPzz','Syaikh Bahauddin Naqsyaband','Bahauddin Muhammad Uways Al-Bukhari','syaikh-bahauddin-naqsyaband','717 H','791 H','Bukhara','Pendiri Thariqah Naqsyabandiyyah yang menekankan khalwat dar anjuman.','Prinsip tasawuf sunni: hosh dar dam, nazar bar qadam.','Jadilah hadir bersama Allah di tengah manusia.',json('["Maqamat Naqsyaband","Rashahat"]'),'8H',NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_bahauddin');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_asyari','cat_aqidah','8gdEHkswuvfxngOlfXPzz','Imam Al-Ash''ari','Abu Al-Hasan Ali','imam-al-asyari','260 H','324 H','Basrah','Pendiri madzhab Asy''ariyyah setelah rujuk dari Mu''tazilah.','Metodologi kalam membela aqidah Ahlussunnah.','Aku keluar dari madzhab Mu''tazilah seperti aku menanggalkan bajuku ini.',json('["Al-Ibanah","Maqalat"]'),'4H',NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_asyari');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_maturidi','cat_aqidah','8gdEHkswuvfxngOlfXPzz','Imam Al-Maturidi','Abu Mansur Muhammad','imam-al-maturidi','238 H','333 H','Samarkand','Pendiri madzhab Maturidiyyah moderat.','Keseimbangan dalil naqli & aqli.','Akal adalah anugerah untuk memahami wahyu, bukan menentangnya.',json('["Kitab At-Tawhid","Tafsir Ta''wilat"]'),'4H',NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_maturidi');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_hasyim_asyari','cat_nu','8gdEHkswuvfxngOlfXPzz','KH. Hasyim Asy''ari','Muhammad Hasyim Asy''ari','u_hasyim_asyari','1871 M','1947 M','Jombang, Indonesia','Pendiri Nahdlatul Ulama dan penggerak resolusi jihad.','Mendirikan NU & mengokohkan jaringan pesantren.',NULL,NULL,NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_hasyim_asyari');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_maimun_zubair','cat_nu','8gdEHkswuvfxngOlfXPzz','KH. Maimun Zubair','Maimun Zubair','u_maimun_zubair','1928 M','2019 M','Rembang, Indonesia','Ulama kharismatik rujukan fikih & siyasah pesantren.','Pengokoh tradisi fikih siyasah moderat.',NULL,NULL,NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_maimun_zubair');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_gus_baha','cat_nu','8gdEHkswuvfxngOlfXPzz','Gus Baha','KH. Ahmad Bahauddin Nursalim','u_gus_baha','1970 M','', 'Rembang, Indonesia','Ulama tafsir kontemporer dengan pendekatan sederhana dan mendalam.','Memasyarakatkan tafsir turats kontekstual.',NULL,NULL,NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_gus_baha');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_ahmad_dahlan','cat_muh','8gdEHkswuvfxngOlfXPzz','KH. Ahmad Dahlan','Muhammad Darwis','u_ahmad_dahlan','1868 M','1923 M','Yogyakarta, Indonesia','Pendiri Muhammadiyah pelopor tajdid & pendidikan modern.','Modernisasi pendidikan & amal sosial.',NULL,NULL,NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_ahmad_dahlan');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_ramadan_buthi','cat_kontemporer','8gdEHkswuvfxngOlfXPzz','Syaikh Said Ramadan Al-Buthi','Said Ramadan Al-Buthi','u_ramadan_buthi','1929 M','2013 M','Suriah','Ulama fiqih & tasawuf moderat penulis produktif.','Membela fikih wasathiyah & melawan ekstremisme.',NULL,NULL,NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_ramadan_buthi');
INSERT INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
SELECT 'u_habib_umar','cat_kontemporer','8gdEHkswuvfxngOlfXPzz','Habib Umar bin Hafidz','Umar bin Muhammad bin Salim bin Hafidz','u_habib_umar','1963 M','', 'Tarim, Hadramaut','Mursyid Darul Mustafa, dai global sanad ilmu.','Jaringan dakwah sanad tradisional lintas negara.',NULL,NULL,NULL,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama WHERE id='u_habib_umar');

-- 5. Rebuild search_index untuk baris yang masih NULL / kosong
UPDATE ulama
SET search_index = lower(coalesce(name,'')||' '||coalesce(full_name,'')||' '||coalesce(biography,'')||' '||coalesce(contribution,''))
WHERE search_index IS NULL OR search_index = '';

-- 6. Seed karya (guarded)
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_abu_hanifah_w0','u_abu_hanifah','Al-Fiqh Al-Akbar',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_abu_hanifah_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_malik_w0','u_malik','Al-Muwatha',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_malik_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_syafii_w0','u_syafii','Ar-Risalah',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_syafii_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_syafii_w1','u_syafii','Al-Umm',NULL,1,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_syafii_w1');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_ahmad_w0','u_ahmad','Musnad',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_ahmad_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_ghazali_w0','u_ghazali','Ihya Ulumuddin',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_ghazali_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_qadir_w0','u_qadir','Al-Ghunyah',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_qadir_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_bahauddin_w0','u_bahauddin','Maqamat Naqsyaband',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_bahauddin_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_asyari_w0','u_asyari','Al-Ibanah',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_asyari_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_maturidi_w0','u_maturidi','Kitab At-Tawhid',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_maturidi_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_hasyim_asyari_w0','u_hasyim_asyari','Risalah Jihad',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_hasyim_asyari_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_maimun_zubair_w0','u_maimun_zubair','Nasihat Fikih Siyasah',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_maimun_zubair_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_gus_baha_w0','u_gus_baha','Majelis Tafsir',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_gus_baha_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_ahmad_dahlan_w0','u_ahmad_dahlan','Pembaharuan Pendidikan',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_ahmad_dahlan_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_ramadan_buthi_w0','u_ramadan_buthi','Fiqh As-Sirah',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_ramadan_buthi_w0');
INSERT INTO ulama_work (id, ulama_id, title, description, sort_order, created_at)
SELECT 'u_habib_umar_w0','u_habib_umar','Mauidzoh & Tausiyah',NULL,0,strftime('%s','now')
WHERE NOT EXISTS (SELECT 1 FROM ulama_work WHERE id='u_habib_umar_w0');

-- 7. Index (aman jika sudah ada)
CREATE INDEX IF NOT EXISTS idx_ulama_category ON ulama(category_id);
CREATE INDEX IF NOT EXISTS idx_ulama_slug ON ulama(slug);
CREATE INDEX IF NOT EXISTS idx_ulama_author_id ON ulama(author_id);
CREATE INDEX IF NOT EXISTS idx_ulama_search_index ON ulama(search_index);
CREATE INDEX IF NOT EXISTS idx_ulama_work_ulama_id ON ulama_work(ulama_id);

COMMIT;

SELECT 1; -- end
