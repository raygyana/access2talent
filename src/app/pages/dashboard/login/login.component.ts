import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../../services/authentication.service';
import { AlertService } from '../../../../services/alert.service';
import { UserService } from '../../../../services';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  loading1 = false;
  registerForm: FormGroup;
  loginPage = true;
  submitted = false;
  submitted1 = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      loginType: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    // reset login status
    this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.returnUrl = 'setup';
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  get f1() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('data', data);
          if (data.loginType === 'Administrator') {
            this.router.navigate(["setup"]);
            // this.router.navigate(['questionBank']);
          } else {
            this.router.navigate(['setup']);
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  onSubmitReg() {
    this.submitted1 = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          // this.router.navigate(['/login']);
          this.loginPage = true;
          this.loading1 = true;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  registerClick() {
    console.log('hi');
    this.loginPage = false;
  }

}
