// 头像上传预览
document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarPreview').src = e.target.result;
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

    alert('设置保存成功！即将返回首页...');
    window.location.href = 'index.html';
}

// 页面加载时加载现有设置
window.onload = function() {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');

    // 更新表单
    if (profile.name) document.getElementById('nameInput').value = profile.name;
    if (profile.bio) document.getElementById('bioInput').value = profile.bio;
    if (profile.avatar) document.getElementById('avatarPreview').src = profile.avatar;
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