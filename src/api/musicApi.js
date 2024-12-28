// api/musicApi.js
import axios from "axios";
import { saveAs } from "file-saver";
// 后端接口URL
const API_URL = "http://localhost:8084";

// 上传txt文件到后端
export const uploadTxtFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log("展示内容");
    console.log(file);
    console.log(formData);
    const response = await axios.post(`${API_URL}/upload-txt`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("上传失败", error);
    throw error;
  }
};

// 下载 MP3 文件
export const downloadMp3File = async () => {
  try {
    // 请求 MP3 文件的后端接口，设置 responseType 为 'blob'
    const response = await axios.get(`${API_URL}/download-mp3`, {
      responseType: "blob",
    });

    // 使用 FileSaver.js 将文件保存到本地
    const fileName = "song.mp3"; // 你可以根据实际情况动态设置文件名
    saveAs(response.data, fileName);

    return "MP3 文件下载成功！";
  } catch (error) {
    console.error("下载失败", error);
    throw new Error("下载失败，请重试");
  }
};
