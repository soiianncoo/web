function saveData() {
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (username == "" || email == "" || password == "") {
    alert("Vui lòng nhập đầy đủ thông tin !");
    return;
  } else {
    const userInfo = {
      username: username,
      email: email,
      password: password,
    };
    firebase
      .auth()
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((userCredential) => {
        let userUid = userCredential.user.uid;
        firebase.firestore().collection("users").doc(userUid).set({
          uid: userUid,
          username: userInfo.username,
          email: userInfo.email,
        });
        alert("Đăng ký thành công!");
        window.location.assign("index.html");
      })
      .catch((error) => {
        alert(error);
      });
  }
}
