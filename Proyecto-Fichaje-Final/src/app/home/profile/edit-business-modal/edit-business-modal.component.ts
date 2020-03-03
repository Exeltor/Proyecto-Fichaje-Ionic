import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-edit-business-modal',
  templateUrl: './edit-business-modal.component.html',
  styleUrls: ['./edit-business-modal.component.scss'],
})
export class EditBusinessModalComponent implements OnInit {

  @Input() Nombre: string;
  @Input() loc: [string, string]
  editingForm: FormGroup;

  constructor(private modalController: ModalController, private fb: FormBuilder, public authService: AuthService) { }

  ngOnInit() {
    this.editingForm = this.fb.group({
      nombre: [this.Nombre],
      loc: [this.loc[0], this.loc[1]],
       
    })

  }

  onSubmit() {
    this.authService.updateProfile(this.editingForm.value);
  }

}


