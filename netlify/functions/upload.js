const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');

exports.handler = async (event, context) => {
  try {
    // 解析multipart/form-data
    const result = await new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: event.headers
      });
      
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      let fileName;
      let fileData = [];
      
      busboy.on('file', (fieldname, file, info) => {
        fileName = Date.now() + '-' + info.filename;
        const filePath = path.join(uploadDir, fileName);
        const writeStream = fs.createWriteStream(filePath);
        
        file.on('data', (data) => {
          writeStream.write(data);
        });
        
        file.on('end', () => {
          writeStream.end();
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