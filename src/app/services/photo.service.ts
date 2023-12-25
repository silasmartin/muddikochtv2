import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor() {}

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Base64,
      height: 96,
      width: 96,
      saveToGallery: false,
      correctOrientation: true
    });
    return image;
  };
}
