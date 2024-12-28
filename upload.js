const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // 引入 fs 模块
const cors = require("cors"); // 引入 cors

const app = express();
const port = 8084;

// 使用 cors 允许跨域请求
app.use(
  cors({
    origin: "http://localhost:8080", // 允许来自 http://localhost:8080 的请求
    methods: ["GET", "POST"], // 允许 GET 和 POST 方法
  })
);

// 配置 multer 进行文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // 文件保存目录
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 文件命名规则
  },
});
const upload = multer({ storage: storage });

// 处理上传 txt 文件的 API
app.post("/upload-txt", upload.single("file"), (req, res) => {
  if (req.file) {
    console.log("文件上传成功:", req.file);

    // 读取文件内容
    const filePath = path.join(__dirname, "uploads", req.file.filename);
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件失败:", err);
        return res.status(500).json({ message: "读取文件失败" });
      }

      // 打印文件内容
      console.log("文件内容：", data);

      // 返回文件上传成功的响应
      res
        .status(200)
        .json({ message: "文件上传成功", file: req.file, content: data });
    });
  } else {
    res.status(400).json({ message: "未选择文件" });
  }
});

// 假设 MP3 文件存储在 'music/' 目录下
const mp3Directory = path.join(__dirname, "music");
// 提供 MP3 文件下载
app.get("/download-mp3", (req, res) => {
  const fileName = "song.mp3"; // 可以根据请求传递的参数动态确定文件名
  console.log(mp3Directory);
  const filePath = path.join(mp3Directory, fileName);

  // 检查文件是否存在
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).send("文件下载失败");
    }
  });
});
// 启动服务器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
