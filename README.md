# Nyenyak · Pelacak Tidur

Isi folder:
- index.html, style.css, script.js: tampilan dan logika web
- firebase.js: koneksi ke Firestore (isi firebaseConfig di sini)
- firestore.rules: aturan keamanan Firestore (tempel di Firebase Console)

## Cara menjalankan
1. Firebase Console > project "sleeptracker" > Project settings > Your apps > web app: salin firebaseConfig, tempel ke firebase.js.
2. Build > Firestore Database > Create database.
3. Build > Authentication > Sign-in method > aktifkan Anonymous.
4. Firestore > Rules: tempel isi firestore.rules, lalu Publish.
5. Di VS Code, klik kanan index.html > Open with Live Server (modul ES tidak jalan kalau file dibuka langsung).

Tanpa langkah 1-4, web tetap jalan dan riwayat disimpan di browser (localStorage).
Data tersimpan di Firestore pada: users/{uid}/logs/{waktu}
