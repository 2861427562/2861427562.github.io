// 个人信息编辑功能
function editField(field) {
    const display = document.getElementById(`${field}Display`);
    const currentText = display.textContent;
    const input = document.createElement('input');
    
    if (field === 'bio') {
        input.type = 'textarea';
    } else {
        input.type = 'text';
    }
    
    input.value = currentText;
    input.className = 'edit-input';
    
    input.onblur = function() {
        display.textContent = this.value;
        localStorage.setItem(field, this.value);
        display.style.display = 'inline';
        this.remove();
    };
    
    display.style.display = 'none';
    display.parentNode.insertBefore(input, display);
    input.focus();
}

// 头像上传功能
document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatar').src = e.target.result;
            localStorage.setItem('avatar', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// 头像上传预览
document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarPreview').src = e.target.result;
            document.getElementById('avatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// 保存设置
function saveSettings() {
    const name = document.getElementById('nameInput').value;
    const bio = document.getElementById('bioInput').value;
    const avatar = document.getElementById('avatarPreview').src;

    if (!name || !bio) {
        alert('请填写名字和个人简介！');
        return;
    }

    // 创建个人信息对象
    const profile = {
        name,
        bio,
        avatar,
        timestamp: new Date().toLocaleString()
    };

    // 保存到 localStorage
    localStorage.setItem('profile', JSON.stringify(profile));

    // 更新显示
    displayProfile();
    alert('设置保存成功！');
}

function displayWorks() {
    const worksGrid = document.getElementById('worksGrid');
    const works = JSON.parse(localStorage.getItem('works') || '[]');
    
    worksGrid.innerHTML = works.map((work, index) => `
        <div class="work-item">
            <div class="work-slideshow" data-index="0">
                ${work.images.map((img, imgIndex) => `
                    <img src="${img}" alt="${work.title}" class="slide ${imgIndex === 0 ? 'active' : ''}">
                `).join('')}
                ${work.images.length > 1 ? `
                    <div class="slide-nav">
                        <button onclick="prevSlide(${index})"><i class="fas fa-chevron-left"></i></button>
                        <button onclick="nextSlide(${index})"><i class="fas fa-chevron-right"></i></button>
                    </div>
                ` : ''}
            </div>
            <div class="work-info">
                <h3>${work.title}</h3>
                <p>${work.description}</p>
                <small>${work.date}</small>
            </div>
            <button class="delete-btn" onclick="deleteWork(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function deleteWork(index) {
    if (confirm('确定要删除这个作品吗？')) {
        const works = JSON.parse(localStorage.getItem('works') || '[]');
        works.splice(index, 1);
        localStorage.setItem('works', JSON.stringify(works));
        displayWorks();
    }
}

function nextSlide(workIndex) {
    const slideshow = document.querySelectorAll('.work-slideshow')[workIndex];
    const slides = slideshow.getElementsByClassName('slide');
    let currentIndex = parseInt(slideshow.dataset.index);
    
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
    slideshow.dataset.index = currentIndex;
}

function prevSlide(workIndex) {
    const slideshow = document.querySelectorAll('.work-slideshow')[workIndex];
    const slides = slideshow.getElementsByClassName('slide');
    let currentIndex = parseInt(slideshow.dataset.index);
    
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    slideshow.dataset.index = currentIndex;
}

// 回到顶部按钮
const backToTopButton = document.getElementById('backToTop');

window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
};

backToTopButton.onclick = function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

// 切换设置面板的显示/隐藏
function toggleSettings() {
    const container = document.querySelector('.settings-container');
    const toggle = document.querySelector('.settings-toggle');
    container.classList.toggle('collapsed');
    toggle.classList.toggle('active');
}

// 页面加载时初始化数据
window.onload = function() {
    // 加载个人信息
    displayProfile();
    
    // 加载设置表单
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    if (profile.name) document.getElementById('nameInput').value = profile.name;
    if (profile.bio) document.getElementById('bioInput').value = profile.bio;
    if (profile.avatar) document.getElementById('avatarPreview').src = profile.avatar;
    
    // 显示作品
    displayWorks();
    
    // 显示收藏夹
    displayBookmarks();
    
    // 默认收起设置面板
    document.querySelector('.settings-container').classList.add('collapsed');
};

// 显示个人信息
function displayProfile() {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    
    // 更新主页面的个人信息
    document.getElementById('nameDisplay').textContent = profile.name || '你的名字';
    document.getElementById('bioDisplay').textContent = profile.bio || '这里写一段个人简介...';
    document.getElementById('avatar').src = profile.avatar || 'default-avatar.png';
    
    // 更新侧边栏的个人信息
    document.getElementById('sidebarName').textContent = profile.name || '你的名字';
    document.getElementById('sidebarBio').textContent = profile.bio || '这里写一段个人简介...';
    document.getElementById('sidebarAvatar').src = profile.avatar || 'default-avatar.png';
    document.getElementById('lastUpdate').textContent = profile.timestamp || '暂无更新';
}

// 监听 localStorage 的变化
window.addEventListener('storage', function(e) {
    if (e.key === 'profile') {
        displayProfile();
    }
});

// 显示收藏列表
function displayBookmarks() {
    const bookmarksList = document.getElementById('bookmarksList');
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    // 只显示最新的6个收藏
    bookmarks = bookmarks.slice(0, 6);

    bookmarksList.innerHTML = bookmarks.map((bookmark, index) => `
        <div class="bookmark-card">
            <img src="${bookmark.preview || 'default-preview.png'}" alt="${bookmark.title}" class="bookmark-image">
            <div class="bookmark-content">
                <h3 class="bookmark-title">
                    <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
                </h3>
                <p class="bookmark-desc">${bookmark.desc}</p>
                <div class="bookmark-actions">
                    <span class="bookmark-date">${bookmark.timestamp}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 监听 localStorage 的变化，更新收藏夹显示
window.addEventListener('storage', function(e) {
    if (e.key === 'bookmarks') {
        displayBookmarks();
    }
}); 