// 收藏数据
let bookmarks = [];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 加载用户设置
    loadSettings();
    
    // 加载收藏列表
    loadBookmarks();
    
    // 监听保存按钮点击
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', addBookmark);
    }
    
    // 监听收藏表单提交
    const bookmarkForm = document.querySelector('.bookmark-form');
    bookmarkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBookmark();
    });
    
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

    // 添加URL输入监听
    const urlInput = document.getElementById('bookmarkUrl');
    if (urlInput) {
        urlInput.addEventListener('blur', fetchWebsitePreview);
        urlInput.addEventListener('paste', (e) => {
            setTimeout(fetchWebsitePreview, 100);
        });
    }

    // 添加预览图片上传监听
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }
});

// 添加收藏
async function addBookmark() {
    const url = document.getElementById('bookmarkUrl').value;
    if (!url) {
        alert('请输入网址');
        return;
    }

    const title = document.getElementById('bookmarkTitle').value;
    const desc = document.getElementById('bookmarkDesc').value;
    const previewImage = document.getElementById('previewImage');
    
    const bookmark = {
        url: url,
        title: title || url,
        description: desc,
        image: previewImage && previewImage.style.display !== 'none' ? previewImage.src : null,
        date: new Date().toISOString()
    };
    
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    bookmarks.unshift(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    
    // 重置表单
    document.getElementById('bookmarkUrl').value = '';
    document.getElementById('bookmarkTitle').value = '';
    document.getElementById('bookmarkDesc').value = '';
    clearPreview();  // 清除预览图片
    
    // 重新加载收藏列表
    loadBookmarks();
    
    alert('收藏已添加');
}

// 加载收藏列表
function loadBookmarks() {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        const bookmarksList = document.getElementById('bookmarksList');
        bookmarksList.innerHTML = '';
        
        bookmarks.forEach((bookmark, index) => {
            const bookmarkElement = document.createElement('div');
            bookmarkElement.className = 'bookmark-card';
            bookmarkElement.innerHTML = `
                ${bookmark.image ? `<img src="${bookmark.image}" class="bookmark-image" alt="${bookmark.title}">` : ''}
                <div class="bookmark-content">
                    <h3 class="bookmark-title">${bookmark.title}</h3>
                    <p class="bookmark-desc">${bookmark.description || ''}</p>
                    <div class="bookmark-actions">
                        <span class="bookmark-date">${new Date(bookmark.date).toLocaleDateString()}</span>
                        <div class="bookmark-buttons">
                            <a href="${bookmark.url}" target="_blank" class="visit-btn">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                            <button onclick="deleteBookmark(${index})" class="delete-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            bookmarksList.appendChild(bookmarkElement);
        });
    }
}

// 删除收藏
function deleteBookmark(index) {
    if (confirm('确定要删除这个收藏吗？')) {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        bookmarks.splice(index, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        loadBookmarks();
    }
}

// 加载用户设置
function loadSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('sidebarName').textContent = settings.name;
        document.getElementById('sidebarBio').textContent = settings.bio;
        document.getElementById('sidebarAvatar').src = settings.avatar;
        document.getElementById('lastUpdate').textContent = new Date(settings.lastUpdate).toLocaleString();
    }
}

// 获取网站预览图片
async function fetchWebsitePreview() {
    const url = document.getElementById('bookmarkUrl').value;
    if (!url) return;
    
    const previewImage = document.getElementById('previewImage');
    const previewContainer = document.querySelector('.preview-container');
    
    try {
        // 显示加载状态
        previewContainer.innerHTML = `
            <div class="loading-preview">
                <i class="fas fa-spinner fa-spin"></i>
                <span>正在获取预览...</span>
            </div>
        `;

        // 使用 Google Favicon API 获取网站图标
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=128`;
        
        // 创建新的预览图片
        const img = new Image();
        img.id = 'previewImage';
        img.onload = () => {
            previewContainer.innerHTML = '';
            previewContainer.appendChild(img);
            img.style.display = 'block';
        };
        img.onerror = () => {
            previewContainer.innerHTML = `
                <div class="preview-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>无法加载预览图片</span>
                </div>
            `;
        };
        img.src = faviconUrl;

        // 尝试获取网站标题
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const title = doc.querySelector('title')?.textContent || url;
            document.getElementById('bookmarkTitle').value = title;
        } catch (error) {
            console.log('无法获取网站标题');
        }
    } catch (error) {
        console.error('获取网站预览失败:', error);
        previewContainer.innerHTML = `
            <div class="preview-error">
                <i class="fas fa-exclamation-circle"></i>
                <span>获取预览失败</span>
            </div>
        `;
    }
}

// 处理图片上传
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }
    
    const reader = new FileReader();
    const previewContainer = document.querySelector('.preview-container');
    
    // 显示加载状态
    previewContainer.innerHTML = `
        <div class="loading-preview">
            <i class="fas fa-spinner fa-spin"></i>
            <span>正在加载预览...</span>
        </div>
    `;
    
    reader.onload = function(e) {
        const img = new Image();
        img.id = 'previewImage';
        img.onload = () => {
            previewContainer.innerHTML = '';
            previewContainer.appendChild(img);
            img.style.display = 'block';
            
            // 添加删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'preview-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.onclick = clearPreview;
            previewContainer.appendChild(deleteBtn);
        };
        img.src = e.target.result;
    };
    
    reader.onerror = function() {
        previewContainer.innerHTML = `
            <div class="preview-error">
                <i class="fas fa-exclamation-circle"></i>
                <span>图片加载失败</span>
            </div>
        `;
    };
    
    reader.readAsDataURL(file);
}

// 清除预览
function clearPreview(event) {
    if (event) {
        event.stopPropagation();  // 阻止事件冒泡
    }
    const previewContainer = document.querySelector('.preview-container');
    const imageInput = document.getElementById('imageInput');
    
    previewContainer.innerHTML = `
        <div class="upload-hint">
            <i class="fas fa-image"></i>
            <span>点击或拖拽图片到此处</span>
        </div>
    `;
    imageInput.value = '';
} 