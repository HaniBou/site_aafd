import { compressImage } from './imageCompression';

export type UploadProgressCallback = (
  phase: 'compressing' | 'uploading',
  percent: number,
) => void;

export async function uploadImage(
  file: File,
  onProgress?: UploadProgressCallback,
): Promise<string> {
  onProgress?.('compressing', 0);
  const compressed = await compressImage(file);
  onProgress?.('compressing', 100);

  return new Promise((resolve, reject) => {
    onProgress?.('uploading', 0);
    const formData = new FormData();
    formData.append('file', compressed, 'image.webp');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload');

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress?.('uploading', Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as { url: string };
          resolve(data.url);
        } catch {
          reject(new Error('Réponse invalide du serveur'));
        }
      } else {
        try {
          const body = JSON.parse(xhr.responseText) as { error?: string };
          reject(new Error(body.error ?? "Erreur lors de l'upload"));
        } catch {
          reject(new Error("Erreur lors de l'upload"));
        }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Erreur réseau')));
    xhr.addEventListener('abort', () => reject(new Error('Upload annulé')));
    xhr.send(formData);
  });
}
