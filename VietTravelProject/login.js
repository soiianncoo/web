function saveData() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Vui lòng nhập đầy đủ thông tin !");
    return;
  } else {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("Đăng nhập thành công !");
        window.location.assign("index.html");
      })
      .catch((error) => {
        alert(error);
      });
  }
}
