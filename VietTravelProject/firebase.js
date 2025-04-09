// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} 
from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//
const firebaseConfig = {
  apiKey: "AIzaSyDUr57lgHSTSy_sHEIaEF9MpD-mauQL-O0",
  authDomain: "test-d9527.firebaseapp.com",
  projectId: "test-d9527",
  storageBucket: "test-d9527.firebasestorage.app",
  messagingSenderId: "724586606822",
  appId: "1:724586606822:web:6c9250418787e35e548b27",
  measurementId: "G-E1EE4S4964",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Authentication
const auth = getAuth(app);
const db = getFirestore(app); // Lấy đối tượng Firestore


// Hàm trả về danh sách các bản ghi có userId = userId
export async function getDataByUid(userId) {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, where("userId", "==", userId));

  try {
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return null;
  }
}

export async function handleEdit(id, data){
  const docRef = doc(db, "bookings", id); 

  try {
    await updateDoc(docRef, data);
    console.log("Cập nhật thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
  }
}

export async function handleDelete(id) {
  const confirmDelete = confirm("Bạn có chắc chắn muốn xoá bản ghi này không?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "bookings", id)); 
    alert("Xoá thành công!");
  } catch (error) {
    console.error("Lỗi khi xoá bản ghi:", error);
    alert("Xoá thất bại!");
  }
}

export async function getDocumentById(docId) {
  const docRef = doc(db, "bookings", docId); 
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("Không tìm thấy bản ghi!");
    return null;
  }
}

export { auth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, db , onAuthStateChanged, collection, addDoc };