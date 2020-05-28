import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-newpass",
  templateUrl: "./newpass.page.html",
  styleUrls: ["./newpass.page.scss"],
})
export class NewpassPage implements OnInit {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}
  private oobCode;
  ngOnInit() {
    this.oobCode = this.route.snapshot.queryParams["oobCode"];
  }

  onSubmit(form: NgForm) {
    this.authService.newpass(
      this.oobCode,
      form.value.newpassword,
      form.value.repeatpassword
    );
  }
}
