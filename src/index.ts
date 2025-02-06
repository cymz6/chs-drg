// 根据文件路径获取对应的内容类型（MIME 类型）
const getContentType = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase() || ''; // 获取文件扩展名
  const types: Record<string, string> = { // 定义扩展名与 MIME 类型的映射
    'js': 'application/javascript',
    'css': 'text/css',
    'html': 'text/html',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif'
  };
  return types[ext] || 'text/plain'; // 如果未找到匹配，则返回默认类型 'text/plain'
};

// 处理静态文件请求
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url); // 解析请求 URL
  console.log('Request URL:', req.url);

  try {
    let filePath = url.pathname; // 获取请求路径
    if (filePath === '/' || filePath === '/index.html') { // 如果请求路径为根路径或 index.html
      filePath = '/index.html'; // 将文件路径设置为 index.html
    }

    const fullPath = `${Deno.cwd()}/src/static${filePath}`; // 构造完整的文件路径

    const file = await Deno.readFile(fullPath); // 读取文件内容
    const contentType = getContentType(filePath); // 获取文件的 MIME 类型

    return new Response(file, {
      headers: {
        'content-type': `${contentType};charset=UTF-8`, // 设置响应头的内容类型
      },
    });
  } catch (e) {
    console.error('Error details:', e); // 捕获并打印错误
    return new Response('Not Found', { 
      status: 404, // 如果文件未找到，返回 404 状态码
      headers: {
        'content-type': 'text/plain;charset=UTF-8', // 设置响应头的内容类型为纯文本
      }
    });
  }
}

// 启动 HTTP 服务器
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request)); // 将请求交给 handleRequest 处理
});
