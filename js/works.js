// 作品数据
let works = [];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 加载用户设置
    loadSettings();
    
    // 加载作品列表
    loadWorks();
    
    // 预览图片上传
    const workImages = document.getElementById('workImages');
    workImages.addEventListener('change', handleWorkImages);
    
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

// 处理作品图片上传
function handleWorkImages(event) {
    const files = event.target.files;
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    if (files.length > 5) {
        alert('最多只能上传5张图片');
        event.target.value = '';
        return;
    }
    
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            alert('请只上传图片文件');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('preview-image');
            img.addEventListener('click', () => {
                if (confirm('要删除这张图片吗？')) {
                    img.remove();
                }
            });
            preview.appendChild(img);
        }
        reader.readAsDataURL(file);
    });
}

// 保存作品
function uploadWork() {
    const preview = document.getElementById('imagePreview');
    const images = Array.from(preview.getElementsByTagName('img')).map(img => img.src);
    
    if (images.length === 0) {
        alert('请至少上传一张图片');
        return;
    }
    
    const work = {
        images: images,
        date: new Date().toISOString()
    };
    
    let works = JSON.parse(localStorage.getItem('works') || '[]');
    works.unshift(work);
    localStorage.setItem('works', JSON.stringify(works));
    
    // 触发作品更新事件
    const event = new CustomEvent('worksUpdated');
    window.dispatchEvent(event);
    
    // 清空预览
    preview.innerHTML = '';
    document.getElementById('workImages').value = '';
    
    alert('作品已保存');
    loadWorks();
}

// 取消上传
function cancelUpload() {
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('workImages').value = '';
}

// 加载作品列表
function loadWorks() {
    const savedWorks = localStorage.getItem('works');
    if (savedWorks) {
        const works = JSON.parse(savedWorks);
        const worksGrid = document.getElementById('worksGrid');
        worksGrid.innerHTML = '';
        
        works.forEach((work, index) => {
            const workElement = document.createElement('div');
            workElement.className = 'work-item';
            workElement.innerHTML = `
                <img src="${work.images[0]}" alt="作品图片">
                <button onclick="deleteWork(${index})" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            worksGrid.appendChild(workElement);
        });
    }
}

// 删除作品
function deleteWork(index) {
    if (confirm('确定要删除这个作品吗？')) {
        let works = JSON.parse(localStorage.getItem('works') || '[]');
        works.splice(index, 1);
        localStorage.setItem('works', JSON.stringify(works));
        
        // 触发作品更新事件
        const event = new CustomEvent('worksUpdated');
        window.dispatchEvent(event);
        
        loadWorks();
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