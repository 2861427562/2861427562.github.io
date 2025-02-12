document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    // 切换表单显示
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    // 处理登录
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                
                // 获取用户信息
                const userResponse = await fetch('http://localhost:3000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${data.token}`
                    }
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    localStorage.setItem('userSettings', JSON.stringify(userData.profile));
                }
                
                window.location.href = 'index.html';
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('登录失败，请稍后重试');
        }
    });

    // 处理注册
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!username || !password) {
            alert('用户名和密码不能为空');
            return;
        }

        if (password.length < 6) {
            alert('密码长度至少为6位');
            return;
        }

        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('注册成功，请登录');
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            } else {
                alert(data.message || '注册失败，请稍后重试');
            }
        } catch (error) {
            console.error('注册错误:', error);
            alert('注册失败，请稍后重试');
        }
    });
}); 