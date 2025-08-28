const net = require("net");
/**
 * 检测端口是否可用
 * @param {number} port 要检测的端口号
 * @param {string} host 主机地址
 * @returns {Promise<boolean>} 端口是否可用
 */
function checkPortAvailable(port, host = "localhost") {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 3000;

    socket.setTimeout(timeout);
    socket.on("connect", () => {
      socket.destroy();
      resolve(false); // 端口被占用
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(true); // 端口可用
    });

    socket.on("error", (err) => {
      socket.destroy();
      if (err.code === "ECONNREFUSED") {
        resolve(true); // 端口可用
      } else {
        resolve(false); // 其他错误，假设不可用
      }
    });

    socket.connect(port, host);
  });
}
/**
 * 查找可用端口，如果指定端口被占用则自动递增
 * @param {number} startPort 起始端口号
 * @param {string} host 主机地址
 * @param {number} maxAttempts 最大尝试次数，默认100
 * @returns {Promise<number>} 可用的端口号
 */
async function findAvailablePort(
  startPort,
  host = "0.0.0.0",
  maxAttempts = 100
) {
  let currentPort = startPort;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const isAvailable = await checkPortAvailable(currentPort, host);
    if (isAvailable) {
      return currentPort;
    }

    console.log(
      `Port ${currentPort} is occupied, trying port ${currentPort + 1}`
    );
    currentPort++;
    attempts++;
  }

  throw new Error(
    `No available port found, tried from ${startPort} to ${
      startPort + maxAttempts - 1
    }`
  );
}

module.exports = {
  checkPortAvailable,
  findAvailablePort,
};
