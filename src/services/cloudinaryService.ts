/**
 * Servicio para subir fotos de perfil a Cloudinary de manera transparente.
 * Utiliza el Cloud Name y Upload Preset configurados ('uelrhbi7') en la carpeta 'fotos_perfil'.
 */

const DEFAULT_CLOUD_NAME = 'uelrhbi7';
const DEFAULT_PRESET = 'uelrhbi7';

/**
 * Sube una imagen a Cloudinary en la carpeta fotos_perfil nombrada con el ID_Cliente.
 * Si la subida a Cloudinary falla por cualquier motivo (ej. preset aún no marcado como unsigned),
 * retorna el base64 comprimido para no bloquear al usuario ni interrumpir su flujo.
 */
export async function subirFotoACloudinary(
  fileOrBase64: File | string,
  idCliente: string
): Promise<string> {
  const cloudName = (localStorage.getItem('oneday_cloudinary_cloud_name') || DEFAULT_CLOUD_NAME).trim();
  const uploadPreset = (localStorage.getItem('oneday_cloudinary_preset') || DEFAULT_PRESET).trim();

  try {
    const formData = new FormData();
    formData.append('file', fileOrBase64);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'fotos_perfil');
    if (idCliente) {
      formData.append('public_id', idCliente);
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.secure_url || data.url) {
        return data.secure_url || data.url;
      }
    } else {
      const errResponse = await res.json().catch(() => ({}));
      console.warn('Advertencia Cloudinary:', errResponse);
    }
  } catch (err) {
    console.warn('No se pudo conectar a Cloudinary, usando almacenamiento directo:', err);
  }

  // Fallback seguro: devolver base64 data URL
  if (typeof fileOrBase64 === 'string') {
    return fileOrBase64;
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(fileOrBase64);
  });
}
