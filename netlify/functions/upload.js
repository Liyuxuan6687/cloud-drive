const Busboy = require('busboy');

exports.handler = async (event, context) => {
  try {
    // 解析multipart/form-data
    const result = await new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: event.headers
      });
      
      let fileName;
      
      busboy.on('file', (fieldname, file, info) => {
        fileName = Date.now() + '-' + info.filename;
        // 在Netlify上，我们不能写入文件系统
        // 实际项目中应该使用云存储服务
        file.on('data', (data) => {
          // 忽略文件数据
        });
      });
      
      busboy.on('finish', () => {
        resolve({ fileName });
      });
      
      busboy.on('error', (error) => {
        reject(error);
      });
      
      busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
      busboy.end();
    });
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'File uploaded successfully',
        filename: result.fileName,
        downloadUrl: `${process.env.URL}/files/${result.fileName}`
      })
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to upload file' })
    };
  }
};