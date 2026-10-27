// ==================== HỆ THỐNG ĐĂNG NHẬP CHUNG ====================

function safeParseJSON(value, fallback = []) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.warn('Invalid localStorage JSON detected:', error);
        return fallback;
    }
}

function ensureDemoUsers() {
    const existingUsers = getUsers();
    if (existingUsers.length > 0) return;

    const demoUsers = [
        {
            username: 'admin',
            email: 'admin@svvtvn.com',
            password: 'admin123',
            balance: 9999999,
            role: 'admin',
            createdAt: Date.now()
        },
        {
            username: 'demo',
            email: 'demo@svvtvn.com',
            password: 'demo123',
            balance: 500000,
            role: 'user',
            createdAt: Date.now()
        }
    ];

    saveUsers(demoUsers);
}

// Lấy user đang đăng nhập
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? safeParseJSON(user, null) : null;
}

// Lưu user đang đăng nhập
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Lấy danh sách users từ localStorage
function getUsers() {
    const users = localStorage.getItem('users');
    return safeParseJSON(users, []);
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
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const adminLink = document.getElementById('adminLink');
    
    // Gaming header elements
    const userInfoPanel = document.getElementById('userInfoPanel');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userBalance = document.getElementById('userBalance');

    if (currentUser) {
        if (profileLink) profileLink.style.display = 'inline';
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline';
        if (userInfo) {
            userInfo.style.display = 'inline';
            userInfo.innerHTML = `👤 ${currentUser.username}`;
        }
        if (adminLink) {
            adminLink.style.display = currentUser.role === 'admin' ? 'inline' : 'none';
        }
        
        if (userInfoPanel) {
            userInfoPanel.style.display = 'flex';
            if (userAvatar) userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
            if (userName) userName.textContent = currentUser.username;
            if (userBalance) userBalance.textContent = `${currentUser.balance || 0} VNĐ`;
        }
        
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        if (profileLink) profileLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'inline';
        if (registerLink) registerLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        
        if (userInfoPanel) userInfoPanel.style.display = 'none';
        if (loginLink) loginLink.style.display = 'inline-block';
        if (registerLink) registerLink.style.display = 'inline-block';
        if (profileLink) profileLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// Đăng xuất
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'index.html';
        }
    }
}

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', function() {
    ensureDemoUsers();
    updateNavigation();
    
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
