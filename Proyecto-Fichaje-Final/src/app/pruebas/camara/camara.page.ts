import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Plugins, CameraResultType } from "@capacitor/core";
import { ActionSheetController } from "@ionic/angular";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { UploadService } from 'src/app/uploads/shared/upload.service';
import { AuthService } from 'src/app/auth/auth.service';

const { Camera } = Plugins;

@Component({
  selector: "app-camara",
  templateUrl: "./camara.page.html",
  styleUrls: ["./camara.page.scss"]
})
export class CamaraPage implements OnInit {
  @ViewChild("fileInput") inputRef: ElementRef;
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  myImage = null;
  myFinalImage = null;
  constructor(
    private platform: Platform,
    public actionSheetController: ActionSheetController,
    private uploadservice: UploadService,
    public authService: AuthService
  ) {
    this.myImage = "assets/res/avatar.svg";
  }

  ngOnInit() {}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      width: 300
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    console.log(image);
    // Can be set to the src of an image now
    this.myImage = image.dataUrl;
    
    
    //this.path = this.getImgContent(image.webPath);
  }

  public addFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.storedImageEvent = event;
      console.log("addfile");
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.myImage = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  imageCropped(event){
    this.myFinalImage = event.base64;
  }

  getCordovaAvailable() {
    if (this.platform.is("cordova")) {
      this.takePicture();
    } else {
      this.presentActionSheet();
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Albums",
      buttons: [
        {
          text: "Abrir Cámara",
          icon: "camera",
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: "Escoger de la galeria",
          icon: "images",
          handler: () => {
            this.inputRef.nativeElement.click();
          }
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    await actionSheet.present();
  }

  submit(){
    this.imageCropper.crop();
    this.uploadservice.uploadFile(this.myFinalImage, 'profile', this.authService.userUid);
  }
}
