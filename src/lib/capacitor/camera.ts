import { Camera, CameraResultType } from '@capacitor/camera';

export async function takePhoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    if (image.base64String) {
      return `data:image/${image.format};base64,${image.base64String}`;
    }
  } catch (err) {
    console.error('Camera error:', err);
  }
  return null;
}
