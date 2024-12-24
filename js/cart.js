// Membuat class untuk mengelola keranjang belanja
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
    }

    addItem(product, quantity) {
        this.items.push({
            name: product.name,
            price: product.price,
            quantity: quantity,
            subtotal: product.price * quantity
        });
        this.calculateTotal();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    }

    clear() {
        this.items = [];
        this.total = 0;
    }
}

// Inisialisasi keranjang belanja
const cart = new ShoppingCart();

// Data produk
const products = {
    'Kemeja Pria': { price: 150000 },
    'Dress Wanita': { price: 200000 },
    'Sepatu Sneakers': { price: 300000 },
    'Jaket Musim Dingin': { price: 450000 },
    'Celana Jeans': { price: 250000 },
    'Topi Baseball': { price: 75000 }
};

// Menangani pengiriman form pemesanan
document.querySelectorAll('.order-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const quantity = parseInt(this.querySelector('input[name="quantity"]').value);
        const productName = this.parentElement.querySelector('h3').innerText;
        const product = {
            name: productName,
            price: products[productName].price
        };

        // Menambahkan ke keranjang
        cart.addItem(product, quantity);

        // Membuat atau memperbarui tampilan keranjang
        updateCartDisplay();

        // Menampilkan pesan konfirmasi
        alert(`${quantity} ${productName} telah ditambahkan ke keranjang.`);
    });
});

// Fungsi untuk memperbarui tampilan keranjang
function updateCartDisplay() {
    let cartDisplay = document.getElementById('cart-display');
    
    if (!cartDisplay) {
        cartDisplay = document.createElement('div');
        cartDisplay.id = 'cart-display';
        document.querySelector('header').appendChild(cartDisplay);
    }

    let cartHTML = '<div class="cart-content">';
    cartHTML += '<h3>Keranjang Belanja</h3>';
    
    if (cart.items.length === 0) {
        cartHTML += '<p>Keranjang kosong</p>';
    } else {
        cart.items.forEach(item => {
            cartHTML += `
                <div class="cart-item">
                    <p>${item.name} x ${item.quantity}</p>
                    <p>Rp${item.subtotal.toLocaleString()}</p>
                </div>
            `;
        });
        cartHTML += `<div class="cart-total">Total: Rp${cart.total.toLocaleString()}</div>`;
        cartHTML += '<button onclick="checkout()">Checkout</button>';
    }
    
    cartHTML += '</div>';
    cartDisplay.innerHTML = cartHTML;
}

// Fungsi untuk proses checkout
function checkout() {
    if (cart.items.length === 0) {
        alert('Keranjang belanja kosong!');
        return;
    }

    // Membuat form checkout
    const checkoutForm = document.createElement('div');
    checkoutForm.innerHTML = `
        <div id="checkout-form" class="checkout-overlay">
            <div class="checkout-content">
                <h2>Checkout</h2>
                <form id="payment-form">
                    <div class="form-group">
                        <label for="nama">Nama Lengkap:</label>
                        <input type="text" id="nama" required>
                    </div>
                    <div class="form-group">
                        <label for="alamat">Alamat Pengiriman:</label>
                        <textarea id="alamat" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="telepon">Nomor Telepon:</label>
                        <input type="tel" id="telepon" required>
                    </div>
                    <div class="form-group">
                        <label for="pembayaran">Metode Pembayaran:</label>
                        <select id="pembayaran" required>
                            <option value="transfer">Transfer Bank</option>
                            <option value="cod">Cash on Delivery</option>
                        </select>
                    </div>
                    <div class="order-summary">
                        <h3>Ringkasan Pesanan</h3>
                        ${cart.items.map(item => `
                            <div class="order-item">
                                <span>${item.name} x ${item.quantity}</span>
                                <span>Rp${item.subtotal.toLocaleString()}</span>
                            </div>
                        `).join('')}
                        <div class="order-total">
                            <strong>Total: Rp${cart.total.toLocaleString()}</strong>
                        </div>
                    </div>
                    <button type="submit">Konfirmasi Pesanan</button>
                    <button type="button" onclick="closeCheckout()">Batal</button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(checkoutForm);

    // Menangani submit form checkout
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const nama = document.getElementById('nama').value;
        const alamat = document.getElementById('alamat').value;
        const telepon = document.getElementById('telepon').value;
        const pembayaran = document.getElementById('pembayaran').value;

        // Proses pesanan
        alert(`Pesanan berhasil!\n\nTerima kasih ${nama}.\nPesanan akan dikirim ke: ${alamat}\nTotal pembayaran: Rp${cart.total.toLocaleString()}`);
        
        // Reset keranjang dan tampilan
        cart.clear();
        updateCartDisplay();
        closeCheckout();
    });
}

// Fungsi untuk menutup form checkout
function closeCheckout() {
    const checkoutForm = document.querySelector('#checkout-form');
    if (checkoutForm) {
        checkoutForm.remove();
    }
}