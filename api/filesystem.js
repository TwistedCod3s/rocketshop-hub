
// Filesystem API endpoint for handling file operations in Vercel
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if filesystem API is enabled
  if (process.env.VERCEL_FILESYSTEM_API_ENABLED !== 'true') {
    return res.status(500).json({
      error: 'Filesystem API is not enabled. Set VERCEL_FILESYSTEM_API_ENABLED=true in your environment variables.'
    });
  }

  try {
    // Handle GET request - Read file
    if (req.method === 'GET') {
      const filePath = req.query.path;
      
      if (!filePath) {
        return res.status(400).json({ error: 'No file path specified' });
      }

      // Resolve the absolute path
      const absolutePath = path.resolve(process.cwd(), 'src', filePath);
      
      // For security, ensure the path is within the src directory
      if (!absolutePath.startsWith(path.resolve(process.cwd(), 'src'))) {
        return res.status(403).json({ error: 'Access denied: Path outside of allowed directories' });
      }

      try {
        const fileData = await fs.readFile(absolutePath, 'utf8');
        
        // Try to parse if JSON
        if (filePath.endsWith('.json')) {
          const jsonData = JSON.parse(fileData);
          return res.status(200).json(jsonData);
        }
        
        // Return as string for other file types
        return res.status(200).json({ content: fileData });
      } catch (error) {
        console.error(`Error reading file ${absolutePath}:`, error);
        return res.status(404).json({ error: `File not found or cannot be read: ${error.message}` });
      }
    }
    
    // Handle POST request - Write file
    if (req.method === 'POST') {
      const { path: filePath, data } = req.body;
      
      if (!filePath || !data) {
        return res.status(400).json({ error: 'File path and data are required' });
      }

      // Resolve the absolute path
      const absolutePath = path.resolve(process.cwd(), 'src', filePath);
      
      // For security, ensure the path is within the src directory
      if (!absolutePath.startsWith(path.resolve(process.cwd(), 'src'))) {
        return res.status(403).json({ error: 'Access denied: Path outside of allowed directories' });
      }
      
      // Ensure the directory exists
      const directory = path.dirname(absolutePath);
      await fs.mkdir(directory, { recursive: true });
      
      // Write the file
      await fs.writeFile(absolutePath, data, 'utf8');
      console.log(`Successfully wrote file: ${absolutePath}`);
      
      return res.status(200).json({ success: true, path: absolutePath });
    }
    
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('Filesystem API error:', error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
