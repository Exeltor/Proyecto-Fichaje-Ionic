import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-validate-business-modal',
  templateUrl: './validate-business-modal.component.html',
  styleUrls: ['./validate-business-modal.component.scss'],
})
export class ValidateBusinessModalComponent implements OnInit {
  CIF: string;
  DNI: string;
  registerForm: FormGroup;

  constructor(private modalController: ModalController, private fb: FormBuilder, public authService: AuthService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      CIF: [this.CIF, Validators.required],
      DNI: [this.DNI, Validators.required]
    });
  }


  modalDismiss() {
    this.modalController.dismiss();
  }

  onSubmit() {
   
     this.authService.validateBusiness(this.registerForm.value);
  }
}
