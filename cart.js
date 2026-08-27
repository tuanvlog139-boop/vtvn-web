// ==================== SHOPPING CART SYSTEM ====================
// Hệ thống giỏ hàng - LocalStorage + JavaScript thuần

console.log('cart.js loaded successfully');

// Khởi tạo giỏ hàng từ LocalStorage
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// ==================== CÁC HÀM CHÍNH ====================

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {Object} product - Thông tin sản phẩm (name, price, image, id, description)
 */
function addToCart(product) {
    console.log('addToCart called with:', product);

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        // Nếu đã có, tăng số lượng lên +1
        existingItem.quantity += 1;
    } else {
        // Nếu chưa có, thêm mới với số lượng = 1
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Lưu vào LocalStorage
    saveCart();

    // Cập nhật giao diện
    updateCartUI();

    // Hiển thị thông báo
    showToast(`Đã thêm ${product.name} vào giỏ hàng!`);
}

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {string} productId - ID của sản phẩm cần xóa
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showToast('Đã xóa sản phẩm khỏi giỏ hàng');
}

/**
 * Thay đổi số lượng sản phẩm
 * @param {string} productId - ID của sản phẩm
 * @param {number} change - Số lượng thay đổi (+1 hoặc -1)
 */
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;

        // Nếu số lượng <= 0, xóa sản phẩm
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        saveCart();
        updateCartUI();
    }
}

/**
 * Lưu giỏ hàng vào LocalStorage
 */
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

/**
 * Tính tổng tiền của giỏ hàng
 * @returns {number} Tổng tiền
 */
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Cập nhật giao diện giỏ hàng
 */
function updateCartUI() {
    console.log('updateCartUI called, cart length:', cart.length);

    // Cập nhật số lượng trên icon giỏ hàng
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    } else {
        console.warn('cartCount element not found');
    }

    // Cập nhật danh sách sản phẩm trong giỏ
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');

    if (!cartItemsContainer) {
        console.warn('cartItems element not found');
        return;
    }

    if (cart.length === 0) {
        // Nếu giỏ trống, hiển thị thông báo
        cartItemsContainer.innerHTML = `
            <div class="cart-empty" id="cartEmpty">
                <span class="cart-empty-icon">🛒</span>
                <p>Giỏ hàng của bạn đang trống</p>
            </div>
        `;
    } else {
        // Nếu có sản phẩm, hiển thị danh sách
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <button class="cart-quantity-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                        <input type="text" class="cart-quantity" value="${item.quantity}" readonly>
                        <button class="cart-quantity-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Cập nhật tổng tiền
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.textContent = formatPrice(calculateTotal());
    } else {
        console.warn('cartTotal element not found');
    }
}

/**
 * Đóng/Mở giỏ hàng (Sidebar)
 */
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    // Cập nhật giao diện khi mở giỏ
    if (sidebar.classList.contains('active')) {
        updateCartUI();
    }
}

/**
 * Chuyển đến trang thanh toán
 */
function checkout() {
    if (cart.length === 0) {
        showToast('Giỏ hàng của bạn đang trống!');
        return;
    }

    // Tính tổng tiền
    const totalAmount = calculateTotal();

    // Nội dung chuyển khoản CỐ ĐỊNH
    const addInfo = "Quy/Gia/Han/May/Chu/Tu/Nguyen";

    // Tạo URL QR code với tổng số tiền và nội dung chuyển khoản cố định
    const qrUrl = `https://img.vietqr.io/image/vietcombank-1051357963-compact2.jpg?amount=${totalAmount}&addInfo=${encodeURIComponent(addInfo)}&accountName=Quy%20Gia%20Han%20Save`;

    // Mở QR code trong tab mới
    window.open(qrUrl, '_blank');

    // Hiển thị thông báo chi tiết
    const itemsSummary = cart.map(item => `- ${item.name} x${item.quantity}: ${formatPrice(item.price * item.quantity)}`).join('\n');

    alert(`ĐƠN HÀNG CỦA BẠN:\n\n${itemsSummary}\n\nTỔNG TIỀN: ${formatPrice(totalAmount)}\n\nĐã mở mã QR thanh toán!\n\nVui lòng quét mã QR bằng app ngân hàng để thanh toán.\nNội dung chuyển khoản: ${addInfo}\n\nSau khi thanh toán, hệ thống sẽ xử lý trong 5-10 phút.`);

    // Đóng giỏ hàng
    toggleCart();
}

/**
 * Hiển thị thông báo Toast
 * @param {string} message - Nội dung thông báo
 */
function showToast(message) {
    console.log('showToast called with:', message);

    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastMessage) {
        console.warn('Toast elements not found');
        alert(message); // Fallback
        return;
    }

    toastMessage.textContent = message;
    toast.classList.add('active');

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

/**
 * Định dạng giá tiền sang dạng VNĐ
 * @param {number} price - Giá tiền
 * @returns {string} Giá đã định dạng
 */
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

/**
 * Xóa toàn bộ giỏ hàng
 */
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
    showToast('Đã xóa toàn bộ giỏ hàng');
}

// ==================== KHỞI TẠO ====================

// Khi trang tải xong, cập nhật giao diện giỏ hàng
document.addEventListener('DOMContentLoaded', function() {
    console.log('cart.js loaded, updating cart UI');
    updateCartUI();
});

// Export các hàm ra window scope để có thể gọi từ các trang khác
window.addToCart = addToCart;
window.updateCartUI = updateCartUI;
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;
window.calculateTotal = calculateTotal;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.showToast = showToast;
window.formatPrice = formatPrice;
window.clearCart = clearCart;
window.addToCartPackage = addToCartPackage;

console.log('Cart functions exported to window scope');

// ==================== HÀM KẾT NỐI VỚI CÁC TRANG KHÁC ====================

/**
 * Hàm để tích hợp vào các trang gói (cac-goi.html)
 * Sử dụng: onclick="addToCartPackage()"
 */
function addToCartPackage(packageData) {
    if (!packageData) return;

    const cartProduct = {
        id: packageData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        name: packageData.name,
        price: packageData.realPrice || parseInt(packageData.price.replace(/[^0-9]/g, '')),
        image: packageData.image,
        description: packageData.description
    };

    addToCart(cartProduct);
}