/**
 * Utility to format Base64 image data with the correct MIME type.
 * @param {string} data - The Base64 encoded image data.
 * @returns {string|null} - The formatted Data URL or null if invalid.
 */
export const formatBase64 = (data) => {
  if (!data || data.length < 10) return null;
  if (data.startsWith('data:')) return data;
  
  // Detect mime type from Base64 header
  let mime = "image/jpeg"; // Default
  if (data.startsWith('iVBORw')) mime = "image/png";
  else if (data.startsWith('PHN2Zw')) mime = "image/svg+xml";
  else if (data.startsWith('R0lGOD')) mime = "image/gif";
  
  return `data:${mime};base64,${data}`;
};

/**
 * Resolves the best available logo source for a hackathon or organizer.
 * @param {object} hackathon - The hackathon object.
 * @returns {string} - The resolved image URL.
 */
export const getLogoSrc = (hackathon) => {
  if (!hackathon) return "";

  const imageData = hackathon.imageData || hackathon.ImageData;
  const hostLogo = hackathon.hostLogo || hackathon.HostLogo;
  const companyName = hackathon.organizationName || hackathon.hostName || "Host";
  const websiteLink = hackathon.websiteLink;

  // 1. Try Hackathon specific image/logo (Base64)
  const formattedImageData = formatBase64(imageData);
  if (formattedImageData) return formattedImageData;

  // 2. Try Host's profile logo (Base64)
  const formattedHostLogo = formatBase64(hostLogo);
  if (formattedHostLogo) return formattedHostLogo;

  // 3. Try Clearbit API if website link exists
  if (websiteLink) {
    try {
      const domain = new URL(websiteLink).hostname;
      if (domain) return `https://logo.clearbit.com/${domain}`;
    } catch (e) {
        const domain = websiteLink.replace(/^https?:\/\//i,'').split('/')[0];
        if (domain) return `https://logo.clearbit.com/${domain}`;
    }
  }

  // 4. Fallback to Dicebear shapes
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(companyName)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
};
