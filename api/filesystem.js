
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Check if Vercel Filesystem API is enabled
    if (process.env.VERCEL_FILESYSTEM_API_ENABLED !== 'true') {
      console.error('Filesystem API is not enabled. Set VERCEL_FILESYSTEM_API_ENABLED=true in your environment variables.');
      return res.status(500).json({ 
        error: 'Filesystem API is not enabled. Please configure your Vercel project correctly.' 
      });
    }
    
    console.log(`Received ${req.method} request for path: ${req.query.path || 'N/A'}`);
    
    // Handle GET request - read file
    if (req.method === 'GET') {
      const filePath = req.query.path;
      
      if (!filePath) {
        return res.status(400).json({ error: 'Missing path parameter' });
      }
      
      const resolvedPath = path.join(process.cwd(), filePath);
      console.log(`Reading file from: ${resolvedPath}`);
      
      try {
        const data = fs.readFileSync(resolvedPath, 'utf8');
        
        // Try to parse as JSON if it looks like JSON
        if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
          try {
            const jsonData = JSON.parse(data);
            return res.status(200).json(jsonData);
          } catch (parseError) {
            console.warn(`File is not valid JSON: ${parseError.message}`);
            // If it fails to parse, just return as text
            return res.status(200).json({ content: data });
          }
        } else {
          return res.status(200).json({ content: data });
        }
      } catch (readError) {
        console.error(`Error reading file: ${readError.message}`);
        
        // Check if file doesn't exist
        if (readError.code === 'ENOENT') {
          return res.status(404).json({ error: `File not found: ${filePath}` });
        }
        
        return res.status(500).json({ error: `Failed to read file: ${readError.message}` });
      }
    }
    
    // Handle POST request - write file
    if (req.method === 'POST') {
      const { path: filePath, data } = req.body;
      
      if (!filePath || data === undefined) {
        return res.status(400).json({ error: 'Missing path or data parameter' });
      }
      
      const resolvedPath = path.join(process.cwd(), filePath);
      console.log(`Writing file to: ${resolvedPath}`);
      
      // Ensure directory exists
      const dirPath = path.dirname(resolvedPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
      }
      
      try {
        fs.writeFileSync(resolvedPath, data, 'utf8');
        console.log(`Successfully wrote data to: ${resolvedPath}`);
        return res.status(200).json({ success: true, path: filePath });
      } catch (writeError) {
        console.error(`Error writing file: ${writeError.message}`);
        return res.status(500).json({ error: `Failed to write file: ${writeError.message}` });
      }
    }
    
    // If method is not supported
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error(`Unhandled error: ${error.message}`);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
