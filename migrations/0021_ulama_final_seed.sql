-- Migration 0021: Final Ulama Complete Seed (Idempotent)
-- Gunakan ini jika migrasi sebelumnya (0018 / 0020) gagal mengisi data atau ingin memastikan data konsisten.
-- Strategi: INSERT OR IGNORE lalu UPDATE terarah untuk memperbaiki kolom penting & search_index.
-- Aman dijalankan berkali-kali.

BEGIN TRANSACTION;

-- 1. Kategori (INSERT OR IGNORE)
INSERT OR IGNORE INTO ulama_category (id, slug, name, description, sort_order, created_at) VALUES
 ('cat_hanafi','hanafi','Madzhab Hanafi',NULL,1,strftime('%s','now')),
 ('cat_maliki','maliki','Madzhab Maliki',NULL,2,strftime('%s','now')),
 ('cat_syafii','syafii','Madzhab Syafi''i',NULL,3,strftime('%s','now')),
 ('cat_hanbali','hanbali','Madzhab Hanbali',NULL,4,strftime('%s','now')),
 ('cat_tasawuf','tasawuf','Imam Tasawuf & Thariqah',NULL,5,strftime('%s','now')),
 ('cat_aqidah','aqidah','Ulama Aqidah',NULL,6,strftime('%s','now')),
 ('cat_thariqah','thariqah','Masyayikh Thariqah',NULL,7,strftime('%s','now')),
 ('cat_nu','nahdlatul-ulama','Nahdlatul Ulama',NULL,20,strftime('%s','now')),
 ('cat_muh','muhammadiyah','Muhammadiyah',NULL,21,strftime('%s','now')),
 ('cat_kontemporer','kontemporer','Ulama Kontemporer',NULL,30,strftime('%s','now'));

-- 2. Data ulama inti (INSERT OR IGNORE) - Gunakan individual INSERT untuk menghindari parsing error
INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_abu_hanifah','cat_hanafi','8gdEHkswuvfxngOlfXPzz','Imam Abu Hanifah','Nu''man bin Tsabit bin Zuta','imam-abu-hanifah','80 H','150 H','Kufah, Irak','Pendiri madzhab Hanafi dengan metodologi qiyas dan istihsan yang kuat.','Meletakkan dasar fiqih ra''y yang terukur.','Seandainya ilmu itu diangkat ke bintang Tsurayya, niscaya akan diambil oleh lelaki dari Persia.',json('["Al-Fiqh Al-Akbar","Tarikh Baghdad"]'),'2H',NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_malik','cat_maliki','8gdEHkswuvfxngOlfXPzz','Imam Malik','Malik bin Anas','imam-malik','93 H','179 H','Madinah','Penyusun Al-Muwatha dan imam Darul Hijrah.','Amal Ahlul Madinah sebagai hujjah.','Ilmu bukanlah banyaknya riwayat, tetapi cahaya yang Allah letakkan di hati.',json('["Al-Muwatha","Tadzkiratul Huffazh"]'),'2H',NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_syafii','cat_syafii','8gdEHkswuvfxngOlfXPzz','Imam Asy-Syafi''i','Muhammad bin Idris','imam-asy-syafii','150 H','204 H','Gaza','Peletak dasar ushul fiqih melalui Ar-Risalah.','Sintesis metode hadits & ra''y.','Barangsiapa mempelajari fiqih tanpa hadits, ia seperti pedagang tanpa timbangan.',json('["Ar-Risalah","Manaqib Asy-Syafii"]'),'3H',NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_ahmad','cat_hanbali','8gdEHkswuvfxngOlfXPzz','Imam Ahmad bin Hanbal','Ahmad bin Muhammad','imam-ahmad-bin-hanbal','164 H','241 H','Baghdad','Imam hadits dan penjaga sunnah saat mihnah.','Musnad besar & keteguhan aqidah.','Al-Ilmu laisa bisurati ar-riwayah, innamal ilmu khosyah.',json('["Musnad Ahmad","Siyar Alam An-Nubala"]'),'3H',NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_ghazali','cat_tasawuf','8gdEHkswuvfxngOlfXPzz','Imam Al-Ghazali','Abu Hamid Muhammad','imam-al-ghazali','450 H','505 H','Thus','Hujjatul Islam yang memadukan syariah & tasawuf.','Ihya Ulumuddin & reform tasawuf Sunni.','Lidahmu adalah singa, jika kau lepaskan ia akan menerkammu.',json('["Ihya Ulumuddin","Al-Munqidz"]'),'5H',NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_qadir','cat_tasawuf','8gdEHkswuvfxngOlfXPzz','Syaikh Abdul Qadir Al-Jailani','Abdul Qadir bin Abi Shalih','syaikh-abdul-qadir-al-jailani','471 H','561 H','Jilan','Masyayikh besar pendiri Thariqah Qadiriyyah.','Menjaga tasawuf berbasis syariah.','Bersihkan hati dengan dzikir dan keikhlasan.',json('["Al-Ghunyah","Futuh Al-Ghaib"]'),'6H',NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_bahauddin','cat_thariqah','8gdEHkswuvfxngOlfXPzz','Syaikh Bahauddin Naqsyaband','Bahauddin Muhammad Uways Al-Bukhari','syaikh-bahauddin-naqsyaband','717 H','791 H','Bukhara','Pendiri Thariqah Naqsyabandiyyah yang menekankan khalwat dar anjuman.','Prinsip tasawuf sunni: hosh dar dam, nazar bar qadam.','Jadilah hadir bersama Allah di tengah manusia.',json('["Maqamat Naqsyaband","Rashahat"]'),'8H',NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_asyari','cat_aqidah','8gdEHkswuvfxngOlfXPzz','Imam Al-Ash''ari','Abu Al-Hasan Ali','imam-al-asyari','260 H','324 H','Basrah','Pendiri madzhab Asy''ariyyah setelah rujuk dari Mu''tazilah.','Metodologi kalam membela aqidah Ahlussunnah.','Aku keluar dari madzhab Mu''tazilah seperti aku menanggalkan bajuku ini.',json('["Al-Ibanah","Maqalat"]'),'4H',NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_maturidi','cat_aqidah','8gdEHkswuvfxngOlfXPzz','Imam Al-Maturidi','Abu Mansur Muhammad','imam-al-maturidi','238 H','333 H','Samarkand','Pendiri madzhab Maturidiyyah moderat.','Keseimbangan dalil naqli & aqli.','Akal adalah anugerah untuk memahami wahyu, bukan menentangnya.',json('["Kitab At-Tawhid","Tafsir Ta''wilat"]'),'4H',NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_hasyim_asyari','cat_nu','8gdEHkswuvfxngOlfXPzz','KH. Hasyim Asy''ari','Muhammad Hasyim Asy''ari','u_hasyim_asyari','1871 M','1947 M','Jombang, Indonesia','Pendiri Nahdlatul Ulama dan penggerak resolusi jihad.','Mendirikan NU & mengokohkan jaringan pesantren.',NULL,NULL,NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_maimun_zubair','cat_nu','8gdEHkswuvfxngOlfXPzz','KH. Maimun Zubair','Maimun Zubair','u_maimun_zubair','1928 M','2019 M','Rembang, Indonesia','Ulama kharismatik rujukan fikih & siyasah pesantren.','Pengokoh tradisi fikih siyasah moderat.',NULL,NULL,NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_gus_baha','cat_nu','8gdEHkswuvfxngOlfXPzz','Gus Baha','KH. Ahmad Bahauddin Nursalim','u_gus_baha','1970 M','', 'Rembang, Indonesia','Ulama tafsir kontemporer dengan pendekatan sederhana dan mendalam.','Memasyarakatkan tafsir turats kontekstual.',NULL,NULL,NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_ahmad_dahlan','cat_muh','8gdEHkswuvfxngOlfXPzz','KH. Ahmad Dahlan','Muhammad Darwis','u_ahmad_dahlan','1868 M','1923 M','Yogyakarta, Indonesia','Pendiri Muhammadiyah pelopor tajdid & pendidikan modern.','Modernisasi pendidikan & amal sosial.',NULL,NULL,NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_ramadan_buthi','cat_kontemporer','8gdEHkswuvfxngOlfXPzz','Syaikh Said Ramadan Al-Buthi','Said Ramadan Al-Buthi','u_ramadan_buthi','1929 M','2013 M','Suriah','Ulama fiqih & tasawuf moderat penulis produktif.','Membela fikih wasathiyah & melawan ekstremisme.',NULL,NULL,NULL,strftime('%s','now'));

INSERT OR IGNORE INTO ulama (id, category_id, author_id, name, full_name, slug, birth, death, birth_place, biography, contribution, quote, references_json, period_century, search_index, created_at)
VALUES ('u_habib_umar','cat_kontemporer','8gdEHkswuvfxngOlfXPzz','Habib Umar bin Hafidz','Umar bin Muhammad bin Salim bin Hafidz','u_habib_umar','1963 M','', 'Tarim, Hadramaut','Mursyid Darul Mustafa, dai global sanad ilmu.','Jaringan dakwah sanad tradisional lintas negara.',NULL,NULL,NULL,strftime('%s','now'));

-- 3. Perbaiki search_index (baris lama atau baru)
UPDATE ulama
SET search_index = lower(coalesce(name,'')||' '||coalesce(full_name,'')||' '||coalesce(biography,'')||' '||coalesce(contribution,''))
WHERE search_index IS NULL OR search_index = '';

-- 4. Karya (INSERT OR IGNORE)
INSERT OR IGNORE INTO ulama_work (id, ulama_id, title, description, sort_order, created_at) VALUES
 ('u_abu_hanifah_w0','u_abu_hanifah','Al-Fiqh Al-Akbar',NULL,0,strftime('%s','now')),
 ('u_malik_w0','u_malik','Al-Muwatha',NULL,0,strftime('%s','now')),
 ('u_syafii_w0','u_syafii','Ar-Risalah',NULL,0,strftime('%s','now')),
 ('u_syafii_w1','u_syafii','Al-Umm',NULL,1,strftime('%s','now')),
 ('u_ahmad_w0','u_ahmad','Musnad',NULL,0,strftime('%s','now')),
 ('u_ghazali_w0','u_ghazali','Ihya Ulumuddin',NULL,0,strftime('%s','now')),
 ('u_qadir_w0','u_qadir','Al-Ghunyah',NULL,0,strftime('%s','now')),
 ('u_bahauddin_w0','u_bahauddin','Maqamat Naqsyaband',NULL,0,strftime('%s','now')),
 ('u_asyari_w0','u_asyari','Al-Ibanah',NULL,0,strftime('%s','now')),
 ('u_maturidi_w0','u_maturidi','Kitab At-Tawhid',NULL,0,strftime('%s','now')),
 ('u_hasyim_asyari_w0','u_hasyim_asyari','Risalah Jihad',NULL,0,strftime('%s','now')),
 ('u_maimun_zubair_w0','u_maimun_zubair','Nasihat Fikih Siyasah',NULL,0,strftime('%s','now')),
 ('u_gus_baha_w0','u_gus_baha','Majelis Tafsir',NULL,0,strftime('%s','now')),
 ('u_ahmad_dahlan_w0','u_ahmad_dahlan','Pembaharuan Pendidikan',NULL,0,strftime('%s','now')),
 ('u_ramadan_buthi_w0','u_ramadan_buthi','Fiqh As-Sirah',NULL,0,strftime('%s','now')),
 ('u_habib_umar_w0','u_habib_umar','Mauidzoh & Tausiyah',NULL,0,strftime('%s','now'));

-- 5. Index tambahan jika belum
CREATE INDEX IF NOT EXISTS idx_ulama_search_index ON ulama(search_index);
CREATE INDEX IF NOT EXISTS idx_ulama_created_at ON ulama(created_at);
CREATE INDEX IF NOT EXISTS idx_ulama_work_ulama_id ON ulama_work(ulama_id);

COMMIT;

SELECT 1; -- end
