/**
 * Convert a file path to a full URL
 * @param {string} filePath - The file path (e.g., "uploads/filename.jpg")
 * @param {Object} req - Express request object
 * @returns {string} Full URL to the image
 */
const convertToImageUrl = (filePath, req) => {
  if (!filePath) return null;

  // If it's already a full URL, return as is
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  // Convert file path to URL
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const normalizedPath = filePath.replace(/\\/g, "/");
  return `${baseUrl}/${normalizedPath}`;
};

/**
 * Convert a file path to a full URL without request object
 * @param {string} filePath - The file path (e.g., "uploads/filename.jpg")
 * @param {string} baseUrl - Base URL (e.g., "http://localhost:8080")
 * @returns {string} Full URL to the image
 */
const convertToImageUrlStatic = (
  filePath,
  baseUrl = "http://localhost:8080"
) => {
  if (!filePath) return null;

  // If it's already a full URL, return as is
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  // Convert file path to URL
  const normalizedPath = filePath.replace(/\\/g, "/");
  return `${baseUrl}/${normalizedPath}`;
};

module.exports = {
  convertToImageUrl,
  convertToImageUrlStatic,
};
