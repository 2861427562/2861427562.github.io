// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 加载用户设置
    loadSettings();
    
    // 加载最新作品预览
    loadLatestWorks();
    
    // 加载最新收藏预览
    loadLatestBookmarks();
    
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

    // 监听作品更新事件
    window.addEventListener('worksUpdated', (event) => {
        loadLatestWorks();  // 重新加载最新作品
    });

    // 监听设置更新事件
    window.addEventListener('settingsUpdated', (event) => {
        const settings = event.detail.settings;
        
        // 更新首页的个人信息
        document.getElementById('nameDisplay').textContent = settings.name;
        document.getElementById('bioDisplay').textContent = settings.bio;
        document.getElementById('avatar').src = settings.avatar;
        
        // 更新侧边栏
        document.getElementById('sidebarName').textContent = settings.name;
        document.getElementById('sidebarBio').textContent = settings.bio;
        document.getElementById('sidebarAvatar').src = settings.avatar;
        document.getElementById('lastUpdate').textContent = new Date(settings.lastUpdate).toLocaleString();
    });

    // 初始化时折叠设置面板
    const container = document.querySelector('.settings-container');
    container.classList.add('collapsed');
    container.classList.remove('expanded');

    // 初始化时添加头像上传事件监听
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
});

// 获取DOM元素
const avatar = document.getElementById('avatar');
const nameDisplay = document.getElementById('nameDisplay');
const bioDisplay = document.getElementById('bioDisplay');
const sidebarAvatar = document.getElementById('sidebarAvatar');
const sidebarName = document.getElementById('sidebarName');
const sidebarBio = document.getElementById('sidebarBio');
const lastUpdate = document.getElementById('lastUpdate');

// 加载保存的设置
function loadSettings() {
    const savedName = localStorage.getItem('userName');
    const savedBio = localStorage.getItem('userBio');
    const savedAvatar = localStorage.getItem('userAvatar');
    const savedLastUpdate = localStorage.getItem('lastUpdate');

    if (savedName) {
        nameDisplay.textContent = savedName;
        sidebarName.textContent = savedName;
    }
    if (savedBio) {
        bioDisplay.textContent = savedBio;
        sidebarBio.textContent = savedBio;
    }
    if (savedAvatar) {
        avatar.src = savedAvatar;
        sidebarAvatar.src = savedAvatar;
    }
    if (savedLastUpdate) {
        lastUpdate.textContent = savedLastUpdate;
    }
}

// 加载最新作品预览
function loadLatestWorks() {
    const savedWorks = localStorage.getItem('works');
    if (savedWorks) {
        const works = JSON.parse(savedWorks);
        const worksGrid = document.getElementById('worksGrid');
        worksGrid.innerHTML = ''; // 清空现有内容
        
        // 只显示最新的3个作品
        works.slice(0, 3).forEach(work => {
            const workElement = document.createElement('div');
            workElement.className = 'work-item';
            workElement.innerHTML = `
                <a href="pages/works.html" class="work-link">
                    <img src="${work.images[0]}" alt="作品图片">
                    <div class="work-overlay">
                        <span>查看更多</span>
                    </div>
                </a>
            `;
            worksGrid.appendChild(workElement);
        });
    }
}

// 加载最新收藏预览
function loadLatestBookmarks() {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        const bookmarksList = document.getElementById('bookmarksList');
        bookmarksList.innerHTML = ''; // 清空现有内容
        
        // 只显示最新的6个收藏
        bookmarks.slice(0, 6).forEach(bookmark => {
            const bookmarkElement = document.createElement('div');
            bookmarkElement.className = 'bookmark-card';
            bookmarkElement.innerHTML = `
                ${bookmark.image ? `<img src="${bookmark.image}" class="bookmark-image" alt="${bookmark.title}">` : ''}
                <div class="bookmark-content">
                    <h3 class="bookmark-title">${bookmark.title}</h3>
                    <p class="bookmark-desc">${bookmark.description || ''}</p>
                    <div class="bookmark-actions">
                        <span class="bookmark-date">${new Date(bookmark.date).toLocaleDateString()}</span>
                        <a href="${bookmark.url}" target="_blank" class="visit-btn">
                            <i class="fas fa-external-link-alt"></i>
                            访问
                        </a>
                    </div>
                </div>
            `;
            bookmarksList.appendChild(bookmarkElement);
        });
    }
}

// 切换设置面板
function toggleSettings() {
    const container = document.querySelector('.settings-container');
    const toggle = document.querySelector('.settings-toggle');
    
    if (container.classList.contains('collapsed')) {
        container.classList.remove('collapsed');
        container.classList.add('expanded');
        toggle.classList.add('active');
    } else {
        container.classList.remove('expanded');
        container.classList.add('collapsed');
        toggle.classList.remove('active');
    }
}

// 处理头像上传
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('avatarPreview').src = e.target.result;
        document.getElementById('avatar').src = e.target.result;
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
    
    // 更新显示
    document.getElementById('nameDisplay').textContent = name;
    document.getElementById('bioDisplay').textContent = bio;
    document.getElementById('avatar').src = avatar;
    
    // 更新侧边栏
    document.getElementById('sidebarName').textContent = name;
    document.getElementById('sidebarBio').textContent = bio;
    document.getElementById('sidebarAvatar').src = avatar;
    document.getElementById('lastUpdate').textContent = new Date(settings.lastUpdate).toLocaleString();
    
    alert('设置已保存');
} 