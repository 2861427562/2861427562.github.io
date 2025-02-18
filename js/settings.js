// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 加载保存的设置
    loadSettings();
    
    // 头像上传预览
    const avatarInput = document.getElementById('avatarInput');
    avatarInput.addEventListener('change', handleAvatarUpload);
    
    // 回到顶部按钮
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// 获取DOM元素
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');
const nameInput = document.getElementById('nameInput');
const bioInput = document.getElementById('bioInput');
const sidebarAvatar = document.getElementById('sidebarAvatar');
const sidebarName = document.getElementById('sidebarName');
const sidebarBio = document.getElementById('sidebarBio');

// 加载保存的设置
function loadSettings() {
    const savedName = localStorage.getItem('userName');
    const savedBio = localStorage.getItem('userBio');
    const savedAvatar = localStorage.getItem('userAvatar');

    if (savedName) {
        nameInput.value = savedName;
        sidebarName.textContent = savedName;
    }
    if (savedBio) {
        bioInput.value = savedBio;
        sidebarBio.textContent = savedBio;
    }
    if (savedAvatar) {
        avatarPreview.src = savedAvatar;
        sidebarAvatar.src = savedAvatar;
    }
}

// 保存设置
function saveSettings() {
    const name = nameInput.value;
    const bio = bioInput.value;

    localStorage.setItem('userName', name);
    localStorage.setItem('userBio', bio);
    
    // 更新侧边栏信息
    loadSidebarInfo();
    
    // 更新最后更新时间
    const now = new Date();
    const lastUpdateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    localStorage.setItem('lastUpdate', lastUpdateStr);
    document.getElementById('lastUpdate').textContent = lastUpdateStr;

    alert('设置已保存！');
}

// 处理头像上传
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            avatarPreview.src = imageData;
            sidebarAvatar.src = imageData;
            localStorage.setItem('userAvatar', imageData);
        };
        reader.readAsDataURL(file);
    }
} 