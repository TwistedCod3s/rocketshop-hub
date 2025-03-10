
// Vercel serverless function for filesystem operations
const fs = require('fs');
const path = require('path');

// Safely resolve paths to prevent directory traversal attacks
const resolveSafePath = (filePath) => {
  // Define the root directory for data files
  const DATA_DIR = path.resolve(process.cwd(), 'src', 'data');
  
  // Normalize and join the path
  const fullPath = path.normalize(path.join(DATA_DIR, filePath));
  
  // Ensure the path is within the data directory
  if (!fullPath.startsWith(DATA_DIR)) {
    throw new Error('Access denied: Attempted to access a file outside the data directory');
  }
  
  return fullPath;
};

// Ensure the directory exists
const ensureDirectoryExists = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

// API handler function
module.exports = async (req, res) => {
  // Set appropriate CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Handle POST request (write file)
    if (req.method === 'POST') {
      const { path: filePath, data } = req.body;
      
      if (!filePath || data === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: 'Path and data are required' 
        });
      }
      
      const safePath = resolveSafePath(filePath);
      ensureDirectoryExists(safePath);
      
      await fs.promises.writeFile(safePath, data, 'utf-8');
      console.log(`File written successfully: ${safePath}`);
      
      return res.status(200).json({ 
        success: true,
        message: `File ${filePath} written successfully`
      });
    }
    
    // Handle GET request (read file)
    if (req.method === 'GET') {
      const { path: filePath } = req.query;
      
      if (!filePath || Array.isArray(filePath)) {
        return res.status(400).json({ 
          success: false, 
          error: 'A single path parameter is required' 
        });
      }
      
      const safePath = resolveSafePath(filePath);
      const data = await fs.promises.readFile(safePath, 'utf-8');
      
      // Try to parse as JSON before returning
      try {
        const jsonData = JSON.parse(data);
        return res.status(200).json(jsonData);
      } catch (e) {
        // If it's not valid JSON, return as text
        return res.status(200).json({ 
          success: true, 
          data 
        });
      }
    }
    
    // Handle unsupported methods
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  } catch (error) {
    console.error('Error handling filesystem request:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
};
