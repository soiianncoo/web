import { auth, signInWithEmailAndPassword} from "./firebase.js";

document.getElementById('save_btn').addEventListener('click', saveData);
// Hàm đăng nhập và lưu dữ liệu
async function saveData() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  // Kiểm tra xem người dùng đã nhập đầy đủ thông tin chưa
  if (!email || !password) {
    alert("Vui lòng nhập đầy đủ thông tin !");
    return;
  }

  try {
    // Đăng nhập người dùng
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user; // Lấy thông tin người dùng từ userCredential

    // Hiển thị thông báo đăng nhập thành công
    alert("Đăng nhập thành công !");
    const userData = {
      email: user.email, // Lưu email
      uid: user.uid      // Lưu UID
    };

    // Lưu object người dùng vào localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    window.location.href = "./index.html";

  } catch (error) {
    // Xử lý lỗi nếu có
    alert("Đăng nhập không thành công: " + error.message);
  }
}
