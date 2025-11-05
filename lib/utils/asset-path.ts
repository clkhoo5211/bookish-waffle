/**
 * Get the correct asset path with basePath prefix for GitHub Pages deployment
 * 
 * Local dev: /logos/bnb.png
 * GitHub Pages: /bookish-waffle/logos/bnb.png
 */
export function getAssetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Return with basePath prefix
  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
}

/**
 * Get the base path for the application
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

