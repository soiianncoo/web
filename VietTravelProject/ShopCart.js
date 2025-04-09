import { getDataByUid, handleDelete, handleEdit, getDocumentById } from "./firebase.js";

// Gọi ban đầu khi click mở giỏ hàng
document.getElementById('openCartModal').addEventListener('click', async function () {
  openCartModal(); // Mở modal giỏ hàng
  await renderCartTable(); // Load bảng
});

async function renderCartTable() {
  const userId = JSON.parse(localStorage.getItem('user')).uid;
  const data = await getDataByUid(userId);
  const tbody = document.getElementById("tableBody");

  tbody.innerHTML = ""; // Clear bảng

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.arrival || ""}</td>
      <td>${item.departure || ""}</td>
      <td>${item.departuredate || ""}</td>
      <td>${item.returndate || ""}</td>
      <td>${item.passengers || ""}</td>
      <td><button class="edit-btn" data-id="${item.id}">Sửa</button></td>
      <td><button class="delete-btn" data-id="${item.id}">Xóa</button></td>
    `;
    tbody.appendChild(row);
  });

  tbody.onclick = async function (e) {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("edit-btn")) {
      const data = await getDocumentById(id);
      document.getElementById("popupForm").style.display = "block";

      document.getElementById("departure").value = data.departure;
      document.getElementById("arrival").value = data.arrival;
      document.getElementById("depart-date").value = data.departuredate;
      document.getElementById("return-date").value = data.returndate;
      document.getElementById("passengers").value = data.passengers;
      document.getElementById("promo-code").value = data.promocode || "";

      document.getElementById("form").dataset.editingId = id;
    }

    if (e.target.classList.contains("delete-btn")) {
      handleDelete(id);
      await renderCartTable();
    }
  };
}

document.getElementById("submit").addEventListener("click", async function (e) {
  e.preventDefault(); 

  const editingId = document.getElementById("form").dataset.editingId;
console.log(editingId);

  const updatedData = {
    departure: document.getElementById("departure").value,
    arrival: document.getElementById("arrival").value,
    departuredate: document.getElementById("depart-date").value,
    returndate: document.getElementById("return-date").value,
    passengers: document.getElementById("passengers").value,
    promocode: document.getElementById("promo-code").value
  };

  try {
    await handleEdit(editingId, updatedData);
    alert("Cập nhật thành công!");
    document.getElementById("popupForm").style.display = "none";
    await renderCartTable(); 
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    alert("Cập nhật thất bại!");
  }
});