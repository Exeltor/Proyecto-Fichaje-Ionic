import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UploadService } from 'src/app/uploads/shared/upload.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropping-modal',
  templateUrl: './cropping-modal.component.html',
  styleUrls: ['./cropping-modal.component.scss'],
})
export class CroppingModalComponent implements OnInit {

  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  @Input() myImage;
  myFinalImage = null;
  constructor(
    public actionSheetController: ActionSheetController,
    private uploadservice: UploadService,
    public authService: AuthService
  ) {
    
  }

  ngOnInit() {
    console.log(this.myImage)
    if(this.imageCropper.loadImageFailed){
      this.imageCropper.imageURL = this.myImage;
    }
    
  }

  imageCropped(event){
    this.myFinalImage = event.base64;
  }

  submit(){
    this.imageCropper.crop();
    this.uploadservice.uploadFile(this.myFinalImage, 'profile', this.authService.userUid);
  }

}
