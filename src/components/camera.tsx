import { useState } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";

function CameraLayout() {
  const [photo, setPhoto] = useState<string | null>(null);

  async function takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });

      if (image.base64String) {
        setPhoto(`data:image/${image.format};base64,${image.base64String}`);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  }

  return (
    <div className="w-screen flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Preview */}
      <div className="w-full max-w-sm aspect-square bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg shadow">
        {photo ? (
          <img
            src={photo}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">No photo yet</span>
        )}
      </div>

      {/* Camera button */}
      <button
        onClick={takePhoto}
        className="mt-6 p-4 w-6 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
      >
        {/* Simple camera SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 
            2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 
            012-2zm9 3a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
        Take Photo
      </button>
    </div>
  );
}

export default CameraLayout;
