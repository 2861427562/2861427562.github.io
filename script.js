// 显示不同的部分
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// 保存记录
function saveNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    
    if (!title || !content) {
        alert('请填写标题和内容！');
        return;
    }

    const note = {
        title,
        content,
        date: new Date().toLocaleString()
    };

    let notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.unshift(note);
    localStorage.setItem('notes', JSON.stringify(notes));

    displayNotes();
    clearNoteForm();
}

// 显示所有记录
function displayNotes() {
    const notesList = document.getElementById('notesList');
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');

    notesList.innerHTML = notes.map((note, index) => `
        <div class="note-item">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>${note.date}</small>
            <button onclick="deleteNote(${index})">删除</button>
        </div>
    `).join('');
}

// 删除记录
function deleteNote(index) {
    if (confirm('确定要删除这条记录吗？')) {
        let notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    }
}

// 清空记录表单
function clearNoteForm() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
}

// 保存日记
function saveDiary() {
    const date = document.getElementById('diaryDate').value;
    const content = document.getElementById('diaryContent').value;
    
    if (!date || !content) {
        alert('请选择日期并填写内容！');
        return;
    }

    const diary = {
        date,
        content,
        timestamp: new Date().toLocaleString()
    };

    let diaries = JSON.parse(localStorage.getItem('diaries') || '[]');
    diaries.unshift(diary);
    localStorage.setItem('diaries', JSON.stringify(diaries));

    displayDiaries();
    clearDiaryForm();
}

// 显示所有日记
function displayDiaries() {
    const diaryList = document.getElementById('diaryList');
    const diaries = JSON.parse(localStorage.getItem('diaries') || '[]');

    diaryList.innerHTML = diaries.map((diary, index) => `
        <div class="diary-item">
            <h3>${diary.date}</h3>
            <p>${diary.content}</p>
            <small>记录于：${diary.timestamp}</small>
            <button onclick="deleteDiary(${index})">删除</button>
        </div>
    `).join('');
}

// 删除日记
function deleteDiary(index) {
    if (confirm('确定要删除这篇日记吗？')) {
        let diaries = JSON.parse(localStorage.getItem('diaries') || '[]');
        diaries.splice(index, 1);
        localStorage.setItem('diaries', JSON.stringify(diaries));
        displayDiaries();
    }
}

// 清空日记表单
function clearDiaryForm() {
    document.getElementById('diaryDate').value = '';
    document.getElementById('diaryContent').value = '';
}

// 页面加载时显示已有的记录和日记
window.onload = function() {
    displayNotes();
    displayDiaries();
    // 设置日记的默认日期为今天
    document.getElementById('diaryDate').valueAsDate = new Date();
}; 