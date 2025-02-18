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
async function handleWorkImages(event) {
    const files = event.target.files;
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    if (files.length > 5) {
        alert('最多只能上传5张图片');
        event.target.value = '';
        return;
    }
    
    for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
            alert('请只上传图片文件');
            continue;
        }
        
        const reader = new FileReader();
        reader.onload = async function(e) {
            // 压缩图片
            const compressedImage = await compressImage(e.target.result);
            
            // 创建图片容器
            const imgContainer = document.createElement('div');
            imgContainer.className = 'preview-image-container';
            
            // 创建图片元素
            const img = document.createElement('img');
            img.src = compressedImage;
            img.className = 'preview-image';
            
            // 创建删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'preview-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.onclick = function(e) {
                e.stopPropagation();
                if (confirm('确定要删除这张图片吗？')) {
                    imgContainer.remove();
                }
            };
            
            // 组装预览元素
            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteBtn);
            preview.appendChild(imgContainer);
        };
        reader.readAsDataURL(file);
    }
}

// 保存作品
function uploadWork() {
    const preview = document.getElementById('imagePreview');
    const images = Array.from(preview.getElementsByClassName('preview-image')).map(img => img.src);
    const title = document.getElementById('workTitle').value.trim();
    const description = document.getElementById('workDescription').value.trim();
    
    if (images.length === 0) {
        alert('请至少上传一张图片');
        return;
    }
    
    if (!title) {
        alert('请输入作品标题');
        return;
    }
    
    // 添加图片大小检查
    const totalSize = images.reduce((size, imgSrc) => size + imgSrc.length, 0);
    if (totalSize > 5242880) {
        alert('图片总大小不能超过5MB，请压缩后重试');
        return;
    }
    
    try {
        const work = {
            id: Date.now().toString(), // 添加唯一ID
            title: title,
            description: description,
            images: images,
            date: new Date().toISOString()
        };
        
        let works = JSON.parse(localStorage.getItem('works') || '[]');
        if (works.length >= 20) {
            works = works.slice(0, 19);
        }
        works.unshift(work);
        
        try {
            localStorage.setItem('works', JSON.stringify(works));
            
            // 清空表单
            preview.innerHTML = '';
            document.getElementById('workImages').value = '';
            document.getElementById('workTitle').value = '';
            document.getElementById('workDescription').value = '';
            
            alert('作品已保存');
            loadWorks();
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('存储空间已满，请删除一些旧作品后重试');
            } else {
                throw e;
            }
        }
    } catch (error) {
        console.error('保存作品失败:', error);
        alert('保存失败，请重试');
    }
}

// 添加图片压缩功能
async function compressImage(imgSrc) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 计算压缩后的尺寸
            let width = img.width;
            let height = img.height;
            const maxSize = 1200;
            
            if (width > height && width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
            } else if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = imgSrc;
    });
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
                <a href="work-detail.html?id=${work.id}" class="work-link">
                    <img src="${work.images[0]}" alt="${work.title}">
                    <div class="work-info">
                        <h3>${work.title}</h3>
                        <p>${new Date(work.date).toLocaleDateString()}</p>
                    </div>
                </a>
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