document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");
  const clearBtn = document.getElementById("clear-cart");
  const totalPriceEl = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");
  const waNumber = "6282299999202"; // Nomor WhatsApp tujuan

  function renderCart() {
    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Keranjang masih kosong.</p>";
      totalPriceEl.textContent = "Rp 0";
      checkoutBtn.style.display = "none";
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");

      const numericPrice = parseInt(item.price.replace(/[^\d]/g, ""));
      const subtotal = numericPrice * (item.qty || 1);
      total += subtotal;

      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.price}</p>
        <label>Jumlah (Ons):</label>
        <input type="number" min="1" value="${
          item.qty || 1
        }" class="qty-input" data-index="${index}">
        <p>Subtotal: Rp ${subtotal.toLocaleString("id-ID")}</p>
        <button class="btn-small" onclick="removeItem(${index})">Hapus</button>
      `;
      cartContainer.appendChild(div);
    });

    totalPriceEl.textContent = `Rp ${total.toLocaleString("id-ID")}`;
    checkoutBtn.style.display = "inline-block";

    const message = encodeURIComponent(
      `🛍️ *Pesanan dari Tembakau Serbarasa *Daftar Pesanan:${cart
        .map((item, i) => {
          const price = parseInt(item.price.replace(/[^\d]/g, ""));
          const subtotal = price * (item.qty || 1);
          return `${i + 1}. ${item.name} — ${item.price} x ${
            item.qty || 1
          } = Rp ${subtotal.toLocaleString("id-ID")}`;
        })
        .join("")}💰 *Total: Rp ${total.toLocaleString(
        "id-ID"
      )}ATerima kasih, saya ingin melakukan pemesanan ini 🙏`
    );

    checkoutBtn.href = `https://wa.me/${waNumber}?text=${message}`;
  }

  window.removeItem = (index) => {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    location.reload();
  });

  cartContainer.addEventListener("input", (e) => {
    if (e.target.classList.contains("qty-input")) {
      const index = e.target.dataset.index;
      const newQty = parseInt(e.target.value);
      cart[index].qty = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });

  renderCart();
});
