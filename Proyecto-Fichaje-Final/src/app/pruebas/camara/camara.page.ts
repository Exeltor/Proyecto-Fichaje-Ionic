import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Plugins, CameraResultType } from "@capacitor/core";
import { ActionSheetController } from "@ionic/angular";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

const { Camera } = Plugins;

@Component({
  selector: "app-camara",
  templateUrl: "./camara.page.html",
  styleUrls: ["./camara.page.scss"]
})
export class CamaraPage implements OnInit {
  @ViewChild("fileInput") inputRef: ElementRef;

  path: any;
  storedImageEvent:any;
  constructor(
    private platform: Platform,
    public actionSheetController: ActionSheetController,
    private sanitizer: DomSanitizer
  ) {
    this.path = "assets/res/avatar.svg";
  }

  ngOnInit() {}
  getImgContent(url): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      width: 300
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = `data:image/${image.format};base64,${image.base64String}`;
    console.log(image);
    // Can be set to the src of an image now
    this.path = this.getImgContent(image.webPath);
  }

  public addFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.storedImageEvent = event;
      console.log("addfile");
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.path = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
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
}
