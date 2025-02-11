// 保存收藏
function saveBookmark() {
    const url = document.getElementById('bookmarkUrl').value;
    const title = document.getElementById('bookmarkTitle').value;
    const desc = document.getElementById('bookmarkDesc').value;
    const preview = document.getElementById('previewImage').src;

    if (!url || !title) {
        alert('请填写网址和标题！');
        return;
    }

    const bookmark = {
        url,
        title,
        desc,
        preview,
        date: new Date().toISOString(),
        timestamp: new Date().toLocaleString()
    };

    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    bookmarks.unshift(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    clearBookmarkForm();
    displayBookmarks();
}

// 显示收藏列表
function displayBookmarks() {
    const bookmarksList = document.getElementById('bookmarksList');
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    // 应用排序
    const sortType = document.getElementById('sortSelect').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    bookmarks = bookmarks.filter(bookmark => 
        bookmark.title.toLowerCase().includes(searchText) ||
        bookmark.desc.toLowerCase().includes(searchText)
    );

    switch(sortType) {
        case 'oldest':
            bookmarks.reverse();
            break;
        case 'title':
            bookmarks.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }

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
                    <button onclick="deleteBookmark(${index})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 删除收藏
function deleteBookmark(index) {
    if (confirm('确定要删除这个收藏吗？')) {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        bookmarks.splice(index, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        displayBookmarks();
    }
}

// 清空表单
function clearBookmarkForm() {
    document.getElementById('bookmarkUrl').value = '';
    document.getElementById('bookmarkTitle').value = '';
    document.getElementById('bookmarkDesc').value = '';
    document.getElementById('previewImage').src = '';
    document.getElementById('previewImage').classList.add('hidden');
}

// 预览图片上传
document.getElementById('customPreview').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// 过滤收藏
function filterBookmarks() {
    displayBookmarks();
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

// 页面加载时显示收藏
window.onload = function() {
    displayBookmarks();
}; 