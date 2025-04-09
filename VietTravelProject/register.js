import { auth, createUserWithEmailAndPassword} from "./firebase.js";
const registerForm = document.getElementById("form");
registerForm.addEventListener("submit", async function(event) {
  event.preventDefault();  // Ngừng gửi form mặc định

  // Lấy dữ liệu từ form
  const name = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (username == "" || email == "" || password == "") {
    alert("Vui lòng nhập đầy đủ thông tin !");
    return;
  }

  // Đăng ký người dùng mới với Firebase Auth
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Đăng ký thành công, lấy thông tin người dùng
      const user = userCredential.user;
      console.log("User registered:", user);
      window.location.assign("./login.html");
      alert("Đăng ký thành công!");
    })
    .catch((error) => {
      // Xử lý lỗi khi đăng ký
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error during registration:", errorCode, errorMessage);
      alert("Đăng ký không thành công: " + errorMessage);
    });
});