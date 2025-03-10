
/**
 * API endpoint for filesystem operations
 * Note: This would need to be integrated with your server framework (Express, Next.js, etc.)
 */

import fs from 'fs';
import path from 'path';

// Safely resolve paths to prevent directory traversal attacks
const resolveSafePath = (filePath: string): string => {
  // Define the root directory for data files (adjust as needed)
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
const ensureDirectoryExists = (filePath: string): void => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

// Write data to a file
export const writeFile = async (filePath: string, data: string): Promise<void> => {
  try {
    const safePath = resolveSafePath(filePath);
    ensureDirectoryExists(safePath);
    await fs.promises.writeFile(safePath, data, 'utf-8');
    console.log(`File written successfully: ${safePath}`);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
    throw error;
  }
};

// Read data from a file
export const readFile = async (filePath: string): Promise<string> => {
  try {
    const safePath = resolveSafePath(filePath);
    return await fs.promises.readFile(safePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};

// API route handler (Express-style)
export const handleFilesystemRequest = async (req, res) => {
  try {
    // Handle POST request (write file)
    if (req.method === 'POST') {
      const { path, data } = req.body;
      
      if (!path || !data) {
        return res.status(400).json({ error: 'Path and data are required' });
      }
      
      await writeFile(path, data);
      return res.status(200).json({ success: true });
    }
    
    // Handle GET request (read file)
    if (req.method === 'GET') {
      const { path } = req.query;
      
      if (!path) {
        return res.status(400).json({ error: 'Path is required' });
      }
      
      const data = await readFile(path);
      return res.status(200).json(JSON.parse(data));
    }
    
    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling filesystem request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
