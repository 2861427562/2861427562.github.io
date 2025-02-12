const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const User = require('./models/User');
require('dotenv').config();

const app = express();

// 连接数据库
connectDB();

app.use(bodyParser.json());
app.use(express.static('public'));

// 注册接口
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    // 输入验证
    if (!username || !password) {
        console.log('注册失败：用户名或密码为空');
        return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    if (password.length < 6) {
        console.log('注册失败：密码长度不足');
        return res.status(400).json({ message: '密码长度至少为6位' });
    }

    try {
        console.log('尝试注册用户:', username);
        
        // 检查用户是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('用户名已存在:', username);
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('密码加密成功');

        // 创建新用户
        const user = new User({
            username,
            password: hashedPassword,
            profile: {
                name: username,
                bio: '',
                avatar: './images/default-avatar.jpg'
            }
        });

        // 保存用户
        await user.save();
        console.log('用户创建成功:', username);
        
        res.json({ 
            message: '注册成功',
            user: {
                username: user.username,
                profile: user.profile
            }
        });
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({ 
            message: '注册失败，请稍后重试',
            error: error.message 
        });
    }
});

// 登录接口
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 查找用户
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 验证密码
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 生成 token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 获取用户信息接口
app.get('/api/user', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: '未授权' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 更新用户信息接口
app.put('/api/user', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: '未授权' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }

        // 更新用户信息
        if (req.body.profile) {
            user.profile = { ...user.profile, ...req.body.profile };
        }

        await user.save();
        res.json({ message: '更新成功', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 