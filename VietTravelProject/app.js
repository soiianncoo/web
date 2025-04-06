function moveToShopCart() {
  // console.log(window.location);
  location.replace(`${window.location.origin}/ShopCart.html`);
}

function moveToRegister() {
  // console.log(window.location);
  location.replace(`${window.location.origin}/register.html`);
}

function moveToLogin() {
  // console.log(window.location);
  location.replace(`${window.location.origin}/login.html`);
}

// check if user is logged in
firebase.auth().onAuthStateChanged((user) => {
  const tools = document.getElementById("tools");

  if (user) {
    // User is signed in.
    const search = document.createElement("i");
    search.className = "fa-solid fa-magnifying-glass";

    const cart = document.createElement("i");
    cart.className = "fa-solid fa-cart-shopping";
    cart.onclick = moveToShopCart;

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
      firebase.auth().signOut();
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

function moveToHome() {
  // console.log(window.location);
  location.replace(`${window.location.origin}/index.html`);
}
