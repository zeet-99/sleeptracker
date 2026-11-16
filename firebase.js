// Koneksi ke Firebase Firestore (project "sleeptracker").
// 1) Ganti isi firebaseConfig dengan config dari Firebase Console.
// 2) Jalankan lewat Live Server (modul ES tidak jalan kalau file dibuka langsung).
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {getAuth,signInAnonymously,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {getFirestore,doc,setDoc,collection,query,orderBy,limit,getDocs} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBQXw9rLRM60QGVIlrELFKsPmudikE_KM0",
  authDomain: "sleeptracker-id.firebaseapp.com",
  projectId: "sleeptracker-id",
  storageBucket: "sleeptracker-id.firebasestorage.app",
  messagingSenderId: "648310395364",
  appId: "1:648310395364:web:9944fb85ff86837f2377f1",
  measurementId: "G-76GDMQP882"
};

let app, auth, db, uidPromise;

// Menyiapkan Firebase dan masuk otomatis sebagai pengguna anonim.
function ready() {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('ISI')) {
    return Promise.reject(new Error('firebaseConfig belum diisi'));
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
  if (!uidPromise) {
    uidPromise = new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (u) => { if (u) resolve(u.uid); });
      signInAnonymously(auth).catch(reject);
    });
    uidPromise.catch(() => { uidPromise = null; });
  }
  return uidPromise;
}

// Simpan satu catatan tidur ke users/{uid}/logs/{waktu}
export async function saveLog(rec) {
  const uid = await ready();
  await setDoc(doc(db, 'users', uid, 'logs', String(rec.ts)), rec);
}

// Ambil 20 catatan terbaru milik pengguna ini
export async function getLogs() {
  const uid = await ready();
  const q = query(collection(db, 'users', uid, 'logs'), orderBy('ts', 'desc'), limit(20));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}
