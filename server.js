const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 配置跨域
app.use(cors());

// 配置文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 静态文件服务，用于访问上传的文件
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// 根路径返回index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 上传接口
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    downloadUrl: `http://localhost:${PORT}/files/${req.file.filename}`
  });
});

// 获取文件列表接口
app.get('/files', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    return res.json([]);
  }
  const files = fs.readdirSync(uploadDir).map(file => ({
    name: file,
    downloadUrl: `http://localhost:${PORT}/files/${file}`
  }));
  res.json(files);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});