const items = [];

function openCartModal() {
  var modal = document.getElementById("cartModal");
  modal.style.display = "block";
}

function closeCartModal() {
  var modal = document.getElementById("cartModal");
  modal.style.display = "none";
}

function displayCartItems() {
  var cartItemsElement = document.getElementById("cartItems");
  cartItemsElement.innerHTML = "";

  const tableContent = document.getElementById("tableContent");

  items.forEach(function (item) {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.textContent = item.route;

    const td2 = document.createElement("td");
    td2.textContent = item.price;

    const td3 = document.createElement("td");
    td3.textContent = item.time;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    tableContent.appendChild(tr);
  });
}

const addItemIntoCard = (route, price, time) => {
  items.push({
    route,
    price,
    time,
  });
  alert(`Đã thêm chuyến bay ${route} vào giỏ hàng`);
  displayCartItems();
};
function moveToHome() {
  // console.log(window.location);
  location.replace(`${window.location.origin}/index.html`);
}
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}