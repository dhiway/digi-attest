import { Camera, CameraResultType } from '@capacitor/camera';

export async function takePhoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      height: 1124,
    });
    if (image.format && image.base64String)
      return {
        base64: image.base64String,
        dataUrl: `data:image/${image.format};base64,${image.base64String}`,
      };
  } catch (err) {
    console.warn('Camera error:', err);
  }
  return null;
}
