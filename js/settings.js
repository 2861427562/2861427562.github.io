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

// 处理头像上传
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('avatarPreview').src = e.target.result;
    }
    reader.readAsDataURL(file);
}

// 保存设置
function saveSettings() {
    const name = document.getElementById('nameInput').value;
    const bio = document.getElementById('bioInput').value;
    const avatar = document.getElementById('avatarPreview').src;
    
    const settings = {
        name: name,
        bio: bio,
        avatar: avatar,
        lastUpdate: new Date().toISOString()
    };
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // 触发设置更新事件
    const event = new CustomEvent('settingsUpdated', {
        detail: { settings: settings }
    });
    window.dispatchEvent(event);
    
    alert('设置已保存');
}

// 加载设置
function loadSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // 填充表单
        document.getElementById('nameInput').value = settings.name;
        document.getElementById('bioInput').value = settings.bio;
        document.getElementById('avatarPreview').src = settings.avatar;
        
        // 更新侧边栏
        document.getElementById('sidebarName').textContent = settings.name;
        document.getElementById('sidebarBio').textContent = settings.bio;
        document.getElementById('sidebarAvatar').src = settings.avatar;
        document.getElementById('lastUpdate').textContent = new Date(settings.lastUpdate).toLocaleString();
    }
} 