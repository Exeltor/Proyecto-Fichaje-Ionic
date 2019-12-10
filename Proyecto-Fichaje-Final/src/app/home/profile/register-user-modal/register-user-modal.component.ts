import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-register-user-modal",
  templateUrl: "./register-user-modal.component.html",
  styleUrls: ["./register-user-modal.component.scss"]
})
export class RegisterUserModalComponent implements OnInit {
  admin = true;

  constructor(
    private modalController: ModalController,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  modalDismiss() {
    this.modalController.dismiss();
  }

  onSubmit(form: NgForm) {
    const formData = form.value;

    this.authService.registerUser(
      formData.email,
      formData.password,
      formData.nameSurname,
      formData.dni,
      formData.tel,
      formData.hours
    );

    this.modalController.dismiss();
  }
}
