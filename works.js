// 作品上传功能
let uploadedImages = []; // 添加一个数组来存储上传的图片

document.getElementById('workInput').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    const previewImages = document.getElementById('previewImages');
    previewImages.innerHTML = '';
    uploadedImages = []; // 清空之前的图片
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImages.push(e.target.result); // 保存图片数据
            const img = document.createElement('img');
            img.src = e.target.result;
            previewImages.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

function saveWork() {
    const title = document.getElementById('workTitle').value;
    const description = document.getElementById('workDescription').value;
    
    if (!title || uploadedImages.length === 0) {
        alert('请填写标题并上传至少一张图片！');
        return;
    }

    const work = {
        title,
        description,
        images: uploadedImages, // 使用存储的图片数组
        date: new Date().toLocaleString()
    };

    let works = JSON.parse(localStorage.getItem('works') || '[]');
    works.unshift(work);
    localStorage.setItem('works', JSON.stringify(works));

    clearWorkForm();
    alert('作品保存成功！');
    // 保存成功后跳转到首页
    window.location.href = 'index.html';
}

function clearWorkForm() {
    document.getElementById('workTitle').value = '';
    document.getElementById('workDescription').value = '';
    document.getElementById('previewImages').innerHTML = '';
    uploadedImages = []; // 清空图片数组
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
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}; 