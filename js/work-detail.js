document.addEventListener('DOMContentLoaded', () => {
    loadWorkDetail();
});

function loadWorkDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const workId = urlParams.get('id');
    
    if (!workId) {
        alert('未找到作品');
        window.location.href = 'works.html';
        return;
    }
    
    const works = JSON.parse(localStorage.getItem('works') || '[]');
    const work = works.find(w => w.id === workId);
    
    if (!work) {
        alert('未找到作品');
        window.location.href = 'works.html';
        return;
    }
    
    // 更新页面标题
    document.title = `${work.title} - 作品详情`;
    
    // 填充作品信息
    document.getElementById('workTitle').textContent = work.title;
    document.getElementById('workDate').textContent = new Date(work.date).toLocaleString();
    document.getElementById('workDesc').textContent = work.description || '暂无说明';
    
    // 显示所有图片
    const imagesContainer = document.getElementById('workImages');
    work.images.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = work.title;
        imagesContainer.appendChild(img);
    });
} 