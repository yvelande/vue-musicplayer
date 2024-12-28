export const uploadFiles = async () => {
  const songs = [];
  const musicsFilter = ["mp3", "flac", "aac", "ape"];
  // 使用 File System Access API 让用户选择一个目录
  const dirHandle = await window.showDirectoryPicker();
  // 遍历目录中的所有条目（文件或文件夹）
  for await (const entry of dirHandle.values()) {
    // 获取文件的扩展名（例如 'mp3'，'flac'）
    const extensionName = entry.name.split(".")[1];
    // 检查条目是否为文件，并且扩展名是否符合条件
    if (entry.kind === "file" && musicsFilter.includes(extensionName)) {
      let url = "";
      const file = await entry.getFile();
      // 根据浏览器类型创建一个文件的URL
      if (window.createObjectURL != undefined) {
        // 适用于基本浏览器
        // basic
        url = window.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // 适用于 WebKit 或 Chrome 浏览器
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      } else if (window.URL != undefined) {
        // 适用于 Firefox 浏览器
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      }
      // 将文件的名称和音频对象添加到 songs 数组
      songs.push({ name: entry.name, audio: new Audio(url) });
      //   通过这些方法可以将文件对象转换成一个可以在网页中使用的 URL，以便播放音频。
    }
  }
  return songs;
};
