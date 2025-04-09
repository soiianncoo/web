import {db, auth, onAuthStateChanged, collection, addDoc, signOut } from './firebase.js'

document.getElementById('form').addEventListener('submit', async function(e) {
  e.preventDefault();
  if(!localStorage.getItem('user')){
    alert("Bạn cần đăng nhập để sử dụng tính năng này!");
    return;
  }
  const departure = document.getElementById("departure").value;
  const arrival = document.getElementById("arrival").value;
  const departuredate = document.getElementById("depart-date").value;
  const returndate = document.getElementById("return-date").value;
  const passengers = document.getElementById("passengers").value;
  const promocode = document.getElementById("promo-code").value;
  const userId = JSON.parse(localStorage.getItem('user')).uid
  if(departure==="" || arrival==="" || departuredate==="" || returndate==="" || passengers===""){
    alert("Bạn cần điền đầy đủ thông tin!")
  }
  else{
    try {
      await addDoc(collection(db, "bookings"), {
        userId,
        departure,
        arrival,
        departuredate,
        returndate,
        passengers,
        promocode,
        createdAt: new Date(),
      });
      alert("Đặt vé thành công!");
      document.getElementById('form').reset();
    } catch (err) {
      console.error("Lỗi khi đặt vé:", err);
      alert("Có lỗi xảy ra.");
    }
  }
})

// check if user is logged in
onAuthStateChanged(auth, (user) => {
  const tools = document.getElementById("tools");
  if (user) {
    // User is signed in.
    const search = document.createElement("i");
    search.className = "fa-solid fa-magnifying-glass";

    const cart = document.createElement("i");
    cart.className = "fa-solid fa-cart-shopping";
    cart.id="moveShopCart";
    cart.addEventListener("click", ()=>{
      location.replace(`${window.location.origin}/ShopCart.html`);
    })

    const userIcon = document.createElement("i");
    userIcon.className = "fa-solid fa-user";

    const line = document.createElement("div");
    line.className = "line";

    const line2 = document.createElement("div");
    line2.className = "line";

    const p = document.createElement("p");
    p.innerHTML = "Hello, " + user.email;

    const globe = document.createElement("i");
    globe.className = "fa-solid fa-globe";

    const button = document.createElement("button");
    button.onclick = () => {
      signOut(auth)
      .then(()=>{
        localStorage.removeItem('user');
        window.location.href = "login.html"; 
      })
      .catch((error) => {
        console.error("Lỗi khi đăng xuất:", error);
      });
      window.location.reload();
    };
    button.className = "log1";
    button.innerHTML =
      "Sign Out <i class='fa-solid fa-right-from-bracket'></i>";

    tools.appendChild(search);
    tools.appendChild(cart);
    tools.appendChild(line);
    tools.appendChild(userIcon);
    tools.appendChild(p);
    tools.appendChild(line2);
    tools.appendChild(globe);
    tools.appendChild(button);
  } else {
    // No user is signed in.
    const button = document.createElement("button");
    button.className = "log1";
    button.onclick = moveToLogin;
    button.innerHTML = "Login <i class='fa-solid fa-right-from-bracket'></i>";

    tools.appendChild(button);
  }
});

