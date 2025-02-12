const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('正在连接到数据库...');
        console.log('MongoDB URI:', process.env.MONGO_URI);
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`MongoDB 连接成功: ${conn.connection.host}`);
        
        // 测试数据库连接
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('可用的集合:', collections.map(c => c.name));
        
    } catch (error) {
        console.error('MongoDB 连接错误:', error);
        process.exit(1);
    }
};

module.exports = connectDB; 