// 加载侧边栏信息
function loadSidebarInfo() {
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarName = document.getElementById('sidebarName');
    const sidebarBio = document.getElementById('sidebarBio');
    const lastUpdate = document.getElementById('lastUpdate');

    // 从 localStorage 获取保存的信息
    const savedName = localStorage.getItem('userName');
    const savedBio = localStorage.getItem('userBio');
    const savedAvatar = localStorage.getItem('userAvatar');
    const savedLastUpdate = localStorage.getItem('lastUpdate');

    // 更新侧边栏信息
    if (savedName) {
        sidebarName.textContent = savedName;
    }
    if (savedBio) {
        sidebarBio.textContent = savedBio;
    }
    if (savedAvatar) {
        sidebarAvatar.src = savedAvatar;
    }
    if (savedLastUpdate) {
        lastUpdate.textContent = savedLastUpdate;
    }
}

// 添加侧边栏切换功能
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    // 点击按钮切换侧边栏
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // 点击侧边栏外部区域关闭侧边栏
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target) && 
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    loadSidebarInfo(); // 现有的加载侧边栏信息函数
    initSidebar(); // 新增的初始化侧边栏功能
}); 