exports.handler = async (event, context) => {
  try {
    // 在Netlify上返回空数组，因为Netlify的临时文件系统是只读的
    // 实际项目中应该使用云存储服务
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([])
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