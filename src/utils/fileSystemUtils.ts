
/**
 * File System Utilities for writing admin changes directly to codebase
 */

// Function to write data to a file in the codebase
export const writeDataToFile = async (
  path: string, 
  data: any
): Promise<boolean> => {
  try {
    console.log(`Writing data to file: ${path}`);
    
    // Convert data to JSON string
    const jsonData = JSON.stringify(data, null, 2);
    
    // Create a POST request to a special endpoint that can write to the filesystem
    // This endpoint would need to be set up on your backend/server
    const response = await fetch('/api/admin/filesystem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        data: jsonData,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to write file: ${response.statusText}`);
    }
    
    console.log(`Successfully wrote data to ${path}`);
    return true;
  } catch (error) {
    console.error(`Error writing to file ${path}:`, error);
    return false;
  }
};

// Function to read data from a file in the codebase
export const readDataFromFile = async <T>(path: string): Promise<T | null> => {
  try {
    console.log(`Reading data from file: ${path}`);
    
    // Create a GET request to read from the filesystem
    const response = await fetch(`/api/admin/filesystem?path=${encodeURIComponent(path)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to read file: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error reading from file ${path}:`, error);
    return null;
  }
};
