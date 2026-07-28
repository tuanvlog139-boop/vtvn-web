// ==================== HỆ THỐNG ĐĂNG NHẬP CHUNG ====================

// Lấy user đang đăng nhập
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Lưu user đang đăng nhập
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Lấy danh sách users từ localStorage
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Lưu danh sách users vào localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Cập nhật navigation dựa trên trạng thái đăng nhập
function updateNavigation() {
    const currentUser = getCurrentUser();
    const profileLink = document.getElementById('profileLink');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const userInfo = document.getElementById('userInfo');

    if (currentUser) {
        if (profileLink) profileLink.style.display = 'inline';
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline';
        if (userInfo) {
            userInfo.style.display = 'inline';
            userInfo.innerHTML = `👤 ${currentUser.username}`;
        }
    } else {
        if (profileLink) profileLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'inline';
        if (registerLink) registerLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Đăng xuất
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // Thêm sự kiện logout nếu có nút
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});
