import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-newpass',
  templateUrl: './newpass.page.html',
  styleUrls: ['./newpass.page.scss'],
})
export class NewpassPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }
  private urlParameters: Array<any> = [];
  ngOnInit() {
    console.log("hola mundo");
    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let actionCode = "";
      let code = document.getElementById('code');
      let i: any;
      for (i in splitParams){
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == "oobCode"){
          //DO SOMETHING
          console.log("El parametro oobCode es: " + singleURLParam[1]),
          actionCode = singleURLParam[1],
          code.classList.value = actionCode;
          console.log(code)
          console.log(code.classList.value)
        }
        if (singleURLParam[0] == "apiKey"){
          console.log("El parametro apiKey es: " + singleURLParam[1])
        }
        let urlParameter = {
        'name': singleURLParam[0],
        'value': singleURLParam[1]
      };
      this.urlParameters.push(urlParameter);
      
      }
    }
  }

  onSubmit(form: NgForm) {
    console.log(form.value.actionCode);
    console.log(form.value.newpassword);
    console.log(form.value.repeatpassword);
    this.authService.newpass(form.value.code, form.value.newpassword, form.value.repeatpassword);
    
  }
}
