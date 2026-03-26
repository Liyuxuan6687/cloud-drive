const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([])
      };
    }
    
    const files = fs.readdirSync(uploadDir).map(file => ({
      name: file,
      downloadUrl: `${process.env.URL}/files/${file}`
    }));
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(files)
    };
  } catch (error) {
    console.error('Files error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to get files' })
    };
  }
};