const searchByID = async () => {
  const searchCity = document.getElementById("searchCity");
  const searchTour = document.getElementById("searchTour");

  const params = localStorage.getItem("keyword") || "noItem";

  const data = await fetch(
    `https://api.ducvu.name.vn/student/hieu/tourList/${String(params)}`
  );

  const tours = await data.json();
  console.log("dataById", params, tours);

  if (params === "noItem") {
    return;
  }

  if (tours.length) {
    const allFights = document.getElementById("allFights");
    allFights.innerHTML = "";
    const title = document.getElementById("title");
    title.innerHTML = "";
  }

  //   <div class="Title">
  //   <h1> Tìm kiếm thông tin: keyword </h1>
  // </div>
  // <div class="400 h-10 mt-12 flex w-full justify-evenly items-center" id="ticketList">
  //   <div class="sort">Vé quốc nội</div>
  //   <div class="sort">Vé quốc tế</div>
  //   <div class="sort">Giờ bay</div>
  // </div>

  // <div class="400 h-10 mt-12 flex w-full justify-evenly items-center" id="tour">
  //   <div class="flight" onclick="addItemIntoCard('HaNoi - TP.HCM','90$')">HaNoi - TP.HCM</div>
  //   <div class="flight" onclick="addItemIntoCard('HN - ICH','189$')">HaNoi - Incheon</div>
  //   <div class="flight">18h - XX</div>
  // </div>

  const searchContainer = document.getElementById("searchContainer");

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("Title");
  const h1 = document.createElement("h1");
  h1.textContent = `Tìm kiếm thông tin: ${params}`;
  titleDiv.appendChild(h1);
  searchContainer.appendChild(titleDiv);

  const parentElement = document.createElement("div");
  parentElement.id = "ticketList";
  parentElement.className =
    "400 h-10 mt-12 flex w-full justify-evenly items-center";

  const sortDiv1 = document.createElement("div");
  sortDiv1.className = "sort";
  sortDiv1.textContent = "Chuyến bay";

  const sortDiv2 = document.createElement("div");
  sortDiv2.className = "sort";
  sortDiv2.textContent = "Giá vé";

  const sortDiv3 = document.createElement("div");
  sortDiv3.className = "sort";
  sortDiv3.textContent = "Giờ bay";

  parentElement.appendChild(sortDiv1);
  parentElement.appendChild(sortDiv2);
  parentElement.appendChild(sortDiv3);

  searchContainer.appendChild(parentElement); // Example: Append to document body

  tours.map((tour) => {
    const { route, price, time } = tour;

    const tourElement = document.createElement("div");
    tourElement.className =
      "400 h-10 mt-12 flex w-full justify-evenly items-center";
    tourElement.id = "tour";

    const flightDiv1 = document.createElement("div");
    flightDiv1.className = "flight";
    flightDiv1.textContent = route;
    flightDiv1.setAttribute(
      "onclick",
      `addItemIntoCard('${route}','${price}','${time}')`
    );
    tourElement.appendChild(flightDiv1);

    const flightDiv2 = document.createElement("div");
    flightDiv2.className = "flight";
    flightDiv2.textContent = `${price}$`;
    flightDiv2.setAttribute(
      "onclick",
      `addItemIntoCard('${route}','${price}','${time}')`
    );
    tourElement.appendChild(flightDiv2);

    const flightDiv3 = document.createElement("div");
    flightDiv3.className = "flight";
    flightDiv3.textContent = time;
    flightDiv3.setAttribute(
      "onclick",
      `addItemIntoCard('${route}','${price}','${time}')`
    );
    tourElement.appendChild(flightDiv3);

    // Append the 'tour' element to the document body or any other existing parent element
    searchContainer.appendChild(tourElement);
  });

  localStorage.removeItem("keyword");

  return tours;
};

const displayTours = async () => {
  const data = await fetch(`https://api.ducvu.name.vn/student/hieu/tourList`);
  const tours = await data.json();
  const allFights = document.getElementById("allFights");

  const parentElement = document.createElement("div");
  parentElement.id = "ticketList";
  parentElement.className =
    "400 h-10 mt-12 flex w-full justify-evenly items-center";

  const sortDiv1 = document.createElement("div");
  sortDiv1.className = "sort";
  sortDiv1.textContent = "Chuyến bay";

  const sortDiv2 = document.createElement("div");
  sortDiv2.className = "sort";
  sortDiv2.textContent = "Giá vé";

  const sortDiv3 = document.createElement("div");
  sortDiv3.className = "sort";
  sortDiv3.textContent = "Giờ bay";

  parentElement.appendChild(sortDiv1);
  parentElement.appendChild(sortDiv2);
  parentElement.appendChild(sortDiv3);

  allFights.appendChild(parentElement);

  tours.map((tour) => {
    const { route, price, time } = tour;

    const tourElement = document.createElement("div");
    tourElement.className =
      "400 h-10 mt-12 flex w-full justify-evenly items-center";
    tourElement.id = "tour";

    const flightDiv1 = document.createElement("div");
    flightDiv1.className = "flight";
    flightDiv1.textContent = route;
    flightDiv1.setAttribute(
      "onclick",
      `addItemIntoCard('${route}','${price}','${time}')`
    );
    tourElement.appendChild(flightDiv1);

    const flightDiv2 = document.createElement("div");
    flightDiv2.className = "flight";
    flightDiv2.textContent = `${price}$`;
    flightDiv2.setAttribute(
      "onclick",
      `addItemIntoCard('${route}','${price}','${time}')`
    );
    tourElement.appendChild(flightDiv2);

    const flightDiv3 = document.createElement("div");
    flightDiv3.className = "flight";
    flightDiv3.textContent = time;
    flightDiv3.setAttribute(
      "onclick",
      `addItemIntoCard('${route}','${price}','${time}')`
    );
    tourElement.appendChild(flightDiv3);

    allFights.appendChild(tourElement);
  });
};

displayTours();
searchByID();

const handleSearching = () => {
  const searchCity = document.getElementById("searchCity");
  const searchTour = document.getElementById("searchTour");

  const params = searchCity.value || searchTour.value || "";

  localStorage.setItem("keyword", String(params));

  window.location.assign("ShopCart.html");
};
