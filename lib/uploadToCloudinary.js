/**
 * Upload une image vers Cloudinary
 * @param {File} file - Le fichier image à uploader
 * @returns {Promise<string>} - L'URL de l'image uploadée
 */
export default async function uploadToCloudinary(file) {
  if (!file) {
    throw new Error("Aucun fichier fourni");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
      throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME non configuré");
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erreur lors de l'upload");
    }

    const data = await response.json();
    console.log("Image uploadée avec succès :", data.secure_url);
    return data.secure_url; // Retourne l'URL sécurisée de l'image
  } catch (error) {
    console.error("Erreur lors de l'upload vers Cloudinary :", error);
    throw error;
  }
}
