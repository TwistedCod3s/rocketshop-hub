
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
    
    // Convert data to JSON string if it's not already a string
    const jsonData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    
    // Create a POST request to our API endpoint that handles filesystem operations
    const response = await fetch('/api/filesystem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        data: jsonData,
      }),
    });
    
    // Check if the request was successful
    if (!response.ok) {
      let errorMessage = 'Failed to write file';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || response.statusText;
      } catch (e) {
        // Fallback if we can't parse the error response
        errorMessage = response.statusText;
      }
      
      console.error(`Error writing file ${path}: ${errorMessage}`);
      throw new Error(`Failed to write file: ${errorMessage}`);
    }
    
    const result = await response.json();
    console.log(`Successfully wrote data to ${path}`, result);
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
    const response = await fetch(`/api/filesystem?path=${encodeURIComponent(path)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Check if the request was successful
    if (!response.ok) {
      let errorMessage = 'Failed to read file';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || response.statusText;
      } catch (e) {
        // Fallback if we can't parse the error response
        errorMessage = response.statusText;
      }
      
      console.error(`Error reading file ${path}: ${errorMessage}`);
      throw new Error(`Failed to read file: ${errorMessage}`);
    }
    
    const data = await response.json();
    console.log(`Successfully read data from ${path}`, data);
    return data as T;
  } catch (error) {
    console.error(`Error reading from file ${path}:`, error);
    return null;
  }
};
