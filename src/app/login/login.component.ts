import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { LoaderService } from '@app/_services/loader.service';
import { User, Role } from '../_models';
import { AppComponent } from '../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    Router,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    ActivatedRoute,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router';
declare var google: any

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit, AfterViewInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    hide = true;
    dataLoaded: boolean = false;
    isIE: boolean = false;
    loginPageDisplay: boolean = true;

    currentUser: User;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar,
        private authenticationService: AuthenticationService,
        private loaderService: LoaderService,
        private appComponent: AppComponent,
    ) {
        if (/msie\s|trident\//i.test(window.navigator.userAgent)) {
            this.isIE = true;
        }
        // redirect to home if already logged in
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);



    }

    ngOnInit() {
        let emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }


    ngAfterViewInit() {
        this.dataLoaded = true;
        if (this.authenticationService.currentUserValue) {
            this.appComponent.fnCheckLoginStatus();
            this.loginPageDisplay = false;
            this.dataLoaded = false;
        } else {
            this.appComponent.fnCheckAuthState();
            this.dataLoaded = false;
        }
    }

    navigationInterceptor(event: RouterEvent): void {

        if (event instanceof NavigationStart) {
            this.dataLoaded = true;
            console.log('1')
            console.log(event);
            console.log(this.dataLoaded)
        }
        if (event instanceof NavigationEnd) {
            this.dataLoaded = true;
            console.log('2')
            console.log(event);
            console.log(this.dataLoaded)
        }

        // Set loading state to false in both of the below events to hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            console.log(event);
            console.log('3')
            console.log(event);
            console.log(this.dataLoaded)
        }
        if (event instanceof NavigationError) {
            console.log('4')
            console.log(event);
            console.log(this.dataLoaded)
        }
    }

    onSubmit() {
        this.dataLoaded = true;
        if (this.loginForm.invalid) {
            this.loginForm.get('email').markAsTouched();
            this.loginForm.get('password').markAsTouched();

            return false;
        }

        this.authenticationService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
            .pipe(first()).subscribe(data => {
                if (data.data == true) {
                    // this.router.events.subscribe((e : RouterEvent) => {
                    //     this.navigationInterceptor(e);
                    //   })
                    console.log(data)
                    this.loginPageDisplay = false;
                    if (data.response.user_type == "A") {
                        console.log(data.response.user_type)
                        this.router.navigate(["admin"]);
                    } else if (data.response.user_type == "SM") {
                        localStorage.setItem('internal_staff', 'N');
                        this.router.navigate(["staff"]);
                    }
                } else if (data.data == false) {
                    this._snackBar.open(data.response, "X", {
                        duration: 2000,
                        verticalPosition: 'top',
                        panelClass: ['red-snackbar']
                    });
                    this.error = data.response;
                    this.dataLoaded = false;
                } else {
                    this.error = "Database Connection Error.";
                }
                setTimeout(() => {
                    // this.dataLoaded = false;  
                }, 3000)
                // this.dataLoaded = false;  

            },
                error => {
                    this.error = "Database Connection Error.";
                    // this.dataLoaded = false;  
                });
    }
    forgotPassword() {
        this.router.navigate(['/forgot-password']);
    }

    signUp(event) {
        this.router.navigate(["/sign-up"]);
    }

    signInWithGoogle(): void {
        this.appComponent.signInWithGoogle(this.loginForm);
    }
    signInWithFB(): void {
        this.appComponent.signInWithFB(this.loginForm);
    }
}
