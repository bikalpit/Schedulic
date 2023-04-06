import { Component, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { AuthenticationService } from './_services';
import { User, Role } from './_models';
import { CommonService } from './_services'
import { DatePipe } from '@angular/common';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md'

//import { slideInAnimation } from './maturity/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';
import { MdePopoverTrigger } from '@material-extended/mde';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { first } from 'rxjs/operators';
import { BnNgIdleService } from 'bn-ng-idle';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { eventNames } from 'process';
import { SharedService } from './_services/shared.service';
import {
  Router,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';



export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  //animations: [slideInAnimation]
})

export class AppComponent implements AfterViewInit {

  @ViewChild('carousel', { static: false }) carousel: any;
  showSuccess: any;
  animal: any;
  selectedBusinessName: any;
  adminSettings: any = "notsettings";
  currentUrl: string;
  loginUserData: any;
  postUrl: any; userType: any;
  userId: any;
  token: any;
  notificationData: any = [];
  staffStatus: any;
  internal_staff: any;
  businessId: any;
  isLoaderAdmin: boolean = false;
  user: SocialUser;
  loggedIn: boolean;
  isAllowed: boolean = true;
  businessComponent: boolean = false;
  POSComponent: boolean = false;
  isSignOut: boolean = true;
  activeSettingMenu: any;
  notificationCount: any = 0;
  businessSetup: any;
  gettingStartedWindowOpen: boolean = false;
  @ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;

  closePopover() {
    this.trigger.togglePopover();
  }

  onSubmit() {
    this.closePopover();
  }


  public company_info: string;

  ngAfterViewInit() {
    // this.fnCheckLoginStatus();
  }

  pageHeading: string;
  // myRoute: string;
  currentUser: User;
  selectedSessionId: any;
  selectedSessionName: any;
  timer: any = 0;
  settingsArr: any;
  appearenceColor: any = [];
  loginForm: FormGroup;
  staffAvailable: boolean = true;

  constructor(
    private http: HttpClient,
    public router: Router,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private CommonService: CommonService,
    public dialogRef2: MatDialog,
    private authService: AuthService,
    private bnIdle: BnNgIdleService,
    public sharedService: SharedService
  ) {

    this.isLoaderAdmin = true
    if (this.authenticationService.currentUser) {
      this.loadLocalStorage();
      //this.checkAuthentication();
    }

    this.router.events.subscribe((e: RouterEvent) => {
      // this.navigationInterceptor(e);
      this.handleRoute(e);
    })
    console.log(localStorage.getItem('internal_staff'))

    if (localStorage.getItem('internal_staff') == '' || localStorage.getItem('internal_staff') == null) {
      this.staffAvailable = true;
      localStorage.setItem('internal_staff', 'N');
    } else if (localStorage.getItem('internal_staff') == 'N') {
      console.log('enable');
      
      this.staffAvailable = true;
    } else {
      console.log('disable');
      this.staffAvailable = false;
    }

    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
      this.getNotificationCount(this.businessId);
      this.getBusinessSetup(this.businessId);
    }
    if (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.user_type == 'SM') {
      this.getNotificationCount(null)
    }
    else if (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.user_type == 'C') {
      this.getNotificationCount(null)
    }

    this.bnIdle.startWatching(6600).subscribe((res) => {
      if (res) {
        if (this.authenticationService.currentUserValue) {
          if (this.authenticationService.currentUserValue.google_id || this.authenticationService.currentUserValue.facebook_id) {
            this.logout2(true);
          } else {
            this.logout();
          }
        }
      }
    })
    this.isAdminUser();
  }
  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }



  loadLocalStorage() {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    // this.router.events.subscribe(event => {
    //   if (event instanceof RouterEvent) this.handleRoute(event);
    // });
    //this.setcompanycolours();

    var is_logout = this.authenticationService.logoutTime();
    console.log('is_logout----',is_logout)
    if (is_logout == true) {
      this.router.navigate(['/login']);
      return false;
    }
    if (localStorage.getItem('currentUser') && localStorage.getItem('isBusiness') && localStorage.getItem('isBusiness') == "true") {
    }
  }



  dynamicSort(property: string) {
    let sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return (a, b) => {
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }

  isSettingsModule(url?: string) {


    const mod = this.cleanUrl(url || this.currentUrl);
    this.pageHeading = this.authenticationService.pageName(mod, this.currentUser ? this.currentUser.user_type : null);
    if (mod == "settings") {
      this.adminSettings = "settings";
    } else {
      this.adminSettings = "notsettings";
    }
  }

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    if (this.urlIsNew(url)) {
      this.currentUrl = url;
      if (this.currentUrl == "/admin/settings-resource/services") {
        this.activeSettingMenu = "services";
      }
      if (this.currentUrl == "/admin/settings-resource/staff") {
        this.activeSettingMenu = "staff";
      }
      if (this.currentUrl == "/admin/settings-resource/business-hours") {
        this.activeSettingMenu = "bussiness-hours";
      }
      if (this.currentUrl == "/admin/settings-resource/postalcode") {
        this.activeSettingMenu = "postal-code";
      }
      if (this.currentUrl == "/admin/settings-account/company-details") {
        this.activeSettingMenu = "company-details";
      }
      if (this.currentUrl == "/admin/settings-payment/payment-gateway") {
        this.activeSettingMenu = "payment-gateway";
      }
      if (this.currentUrl == "/admin/settings-payment/payment-rules") {
        this.activeSettingMenu = "payment-rules";
      }
      if (this.currentUrl == "/admin/settings-general/appearance") {
        this.activeSettingMenu = "appearance";
      }
      if (this.currentUrl == "/admin/settings-general/booking-rules") {
        this.activeSettingMenu = "booking-rules";
      }
      if (this.currentUrl == "/admin/settings-general/alert-settings") {
        this.activeSettingMenu = "alert-rules";
      }
      if (this.currentUrl == "/admin/settings-payment/billing") {
        this.activeSettingMenu = "billing";
      }
      this.isSettingsModule(url);
    }
  }

  private getUrl(event: any) {
    if (event) {
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private cleanUrl(url: string) {
    if (url) {
      let cleanUrl = url.substr(1);
      const slashIndex = cleanUrl.indexOf("/");
      if (slashIndex >= 0) {
        cleanUrl = cleanUrl.substr(slashIndex + 1, 8);
        if (this.currentUser.user_type != 'SM') {
          this.pageHeading = this.authenticationService.pageName(cleanUrl, this.currentUser ? this.currentUser.user_type : null);
        }
        return cleanUrl;
      } else {
        return null;
      }
    } else return null;
  }

  fnPostUrl(menuItem) {
    this.postUrl = menuItem;
  }


  private urlIsNew(url: string) {
    return !!url && url.length > 0 && url !== this.currentUrl;
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  isManagerUser() {
    return this.currentUser && (this.currentUser.role === Role.Staff);
  }

  isAdminUser() {
    this.isLoaderAdmin = true;
    if (this.currentUser && this.currentUser.user_type === Role.Admin && !this.isBusiness() && !this.isPOS()) {
      this.sharedService.updateSideMenuState(true);
    }
    if (this.currentUser && this.currentUser.user_type === Role.Admin) {
      this.isLoaderAdmin = false;
      return this.currentUser && this.currentUser.user_type === Role.Admin;
    } else {
      this.isLoaderAdmin = false;
    }
  }
  isSuperAdmin() {
    return this.currentUser && this.currentUser.user_type === Role.SuperAdmin;
  }

  isStaffUser() {
    return this.currentUser && this.currentUser.user_type === Role.Staff;
  }

  isLogin() {
    if (localStorage.getItem('currentUser')) {
      return true;

    } else {
      return false;
    }
  }

  isBusiness() {
    if (localStorage.getItem('isBusiness') && localStorage.getItem('isBusiness') == "true") {
      this.businessComponent = false;
      return true;
    } else {
      this.businessComponent = true;
      return false;
    }
  }
  isPOS() {
    if (localStorage.getItem('isPOS') && localStorage.getItem('isPOS') == "true") {
      this.POSComponent = false;
      return true;
    } else {
      this.POSComponent = true;
      return false;
    }
  }
  isBusinessSelected() {
    if (localStorage.getItem('business_id') && localStorage.getItem('business_id') != "") {
      this.selectedBusinessName = localStorage.getItem('business_name');
      return true;
    } else {
      return false;
    }
  }

  /*Add New Navigation */
  addNewAppointNav() {

    this.router.navigate(['/admin/my-appointment'], { queryParams: { appointment: 'new' } });
  }
  addNewCategoryNav() {
    this.router.navigate(['/admin/settings-resource/'], { queryParams: { category: 'new' } });
  }
  addNewStaffNav() {
    this.router.navigate(['/admin/settings-resource/staff'], { queryParams: { staff: 'new' } });
  }
  addNewCustomerNav() {
    this.router.navigate(['/admin/my-customer'], { queryParams: { customer: 'new' } });
  }
  addNewPostalCodeNav() {
    this.router.navigate(['/admin/settings-resource/postalcode'], { queryParams: { postalcode: 'new' } });
  }
  addNewDiscountCouponNav() {
    this.router.navigate(['/admin/my-discountcoupon'], { queryParams: { coupon: 'new' } });
  }

  // Super Admin Navigation

  myAdminsNav() {
    this.router.navigate(['./super-admin/']);
  }
  mySubscriptionsNav() {
    this.router.navigate(['./super-admin/my-subscriptions']);
  }
  myTransactionsNav() {
    this.router.navigate(['./super-admin/my-transactions']);
  }
  MySuperAdinProfileNav() {
    this.router.navigate(['./super-admin/my-profile']);
  }

  /*Admin Dashboard Navigation*/
  myWorkSpaceNav() {
    this.router.navigate(['/admin/my-workspace']);
  }
  MyBusinessNav() {
    // localStorage.removeItem('business_id');
    // localStorage.removeItem('business_name');
    this.router.navigate(['/admin/my-business']);
  }
  MyCustomerNav() {
    this.router.navigate(['/admin/my-customer']);
  }
  MyAppointmentNav() {
    this.router.navigate(['/admin/my-appointment']);
  }
  MyReportsNav() {
    this.router.navigate(['/admin/my-reports']);
  }
  MyDiscountCouponNav() {
    this.router.navigate(['/admin/my-discountcoupon']);
  }
  MyLiveAppointmentNav() {
    this.sharedService.updateSideMenuState(false);
    this.router.navigate(['/admin/my-appointment-live']);
  }
  MyProfileNav() {
    this.router.navigate(['/admin/my-profile']);
  }
  // Setting Menus
  MySettingsNav() {
    this.activeSettingMenu = "services";
    this.router.navigate(['/admin/settings-resource']);
  }
  MySettingsStaffNav() {
    this.activeSettingMenu = "staff";
    this.router.navigate(['/admin/settings-resource/staff']);
  }
  MySettingsServicesNav() {
    this.activeSettingMenu = "services";
    this.router.navigate(['/admin/settings-resource/services']);
  }
  MySettingsBusinessHoursNav() {
    this.activeSettingMenu = "bussiness-hours";
    this.router.navigate(['/admin/settings-resource/business-hours']);
  }
  MySettingsProfileNav() {
    this.activeSettingMenu = "services";
    this.router.navigate(['/admin/setting-my-profile']);
  }
  MySettingsCompanyDetailsNav() {
    this.activeSettingMenu = "company-details";
    this.router.navigate(['/admin/settings-account/company-details']);
  }
  MySettingsPaymentGatewayNav() {
    this.activeSettingMenu = "payment-gateway";
    this.router.navigate(['/admin/settings-payment/payment-gateway']);
  }
  MySettingsPaymentRulesNav() {
    this.activeSettingMenu = "payment-rules";
    this.router.navigate(['/admin/settings-payment/payment-rules']);
  }
  MySettingsBookingRulesNav() {
    this.activeSettingMenu = "booking-rules";
    this.router.navigate(['/admin/settings-general/booking-rules']);
  }
  MySettingAlertsNav() {
    this.activeSettingMenu = "alert-rules";
    this.router.navigate(['/admin/settings-general/alert-settings']);
  }
  MySettingsApperenceNav() {
    this.activeSettingMenu = "appearance";
    this.router.navigate(['/admin/settings-general/appearance']);
  }
  MySettingsPostalCodesNav() {
    this.activeSettingMenu = "postal-code";
    this.router.navigate(['/admin/settings-resource/postalcode']);
  }


  /*StaffDashboard Navigation*/
  StaffProfile(pageHead) {
    this.pageHeading = pageHead;
    this.router.navigate(['/staff/my-profile']);
  }

  StaffAppointment(pageHead) {
    // this.pageHeading = pageHead;
    this.router.navigate(['/staff/my-bookings']);
  }


  WorkProfile(pageHead) {
    // this.pageHeading = pageHead;
    this.router.navigate(['/staff/work-profile']);
  }

  WorkSpace(pageHead) {
    // this.pageHeading = pageHead;
    this.router.navigate(['/staff']);
  }

  logout() {
    this.isLoaderAdmin = true;
    this.dialogRef2.closeAll();
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.isLoaderAdmin = true;
  }


  logout2(callGoogleSignOut) {
    this.dialogRef2.closeAll();
    this.isSignOut = false;
    if (callGoogleSignOut && this.authenticationService.currentUserValue && (this.authenticationService.currentUserValue.google_id || this.authenticationService.currentUserValue.facebook_id)) {
      this.authService.signOut();
    }
    setTimeout(() => {
      this.fnTemp();
    }, 3000)
  }

  fnTemp() {
    this.authenticationService.logout();
    this.isAllowed = true;
    this.router.navigate(['/login']);
    window.location.reload();
  }

  fnCheckLoginStatus() {
    this.isLoaderAdmin = true;
    if (this.authenticationService.currentUserValue.google_id) {
      this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);
        if (this.authenticationService.currentUserValue) {
          if (this.user && this.user.provider == "GOOGLE" && this.user.id == this.authenticationService.currentUserValue.google_id) {
            if (this.authenticationService.currentUserValue.user_type == Role.Admin) {
              this.router.navigate(["admin"]);
            } else if (this.authenticationService.currentUserValue.user_type == Role.Staff) {
              this.router.navigate(["staff"]);
            }
          } else {
            if (this.isSignOut) {
              this.logout2(false);
            }
            return false;
          }
        }
      });
      // this.isLoaderAdmin = false;
    }
    if (this.authenticationService.currentUserValue.facebook_id) {
      this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);
        if (this.user && this.user.provider == "FACEBOOK" && this.user.id == this.authenticationService.currentUserValue.facebook_id) {
          if (this.authenticationService.currentUserValue.user_type == Role.Admin) {
            this.router.navigate(["admin"]);
          } else if (this.authenticationService.currentUserValue.user_type == Role.Staff) {
            this.router.navigate(["staff"]);
          }
        } else {
          if (this.isSignOut) {
            this.logout2(false);
          }
          return false;
        }
      });
      // this.isLoaderAdmin = false;
    }
    if (!this.authenticationService.currentUserValue.google_id && !this.authenticationService.currentUserValue.facebook_id) {
      if (this.authenticationService.currentUserValue.user_type == Role.Admin) {
        this.router.navigate(["admin"]);
        // this.isLoaderAdmin = false;
      } else if (this.authenticationService.currentUserValue.user_type == Role.Staff) {
        this.router.navigate(["staff"]);
        // this.isLoaderAdmin = false;
      }
    }
  }

  initiateTimeout() {
    let that = this
    that.timer = setTimeout(function () {
      if (that.authenticationService.currentUserValue && (that.authenticationService.currentUserValue.google_id || that.authenticationService.currentUserValue.facebook_id)) {
        that.logout2(true);
      } else {
        that.logout();
      }
    }, 1080000);
  }

  fnClickLogo(userType) {
    if (userType == 'staff') {
      this.router.navigate(['/staff']);
    }
    else if (userType == 'admin') {
      this.router.navigate(['/admin/my-workspace']);
    }
    else if (userType == 'superAdmin') {
      this.router.navigate(['/super-admin']);
    }
  }


  signInWithGoogle(loginForm): void {
    this.loginForm = loginForm;
    console.log(this.loginForm);
    
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
      console.log(res);
      
      this.fnLoginWithGoogleFacebook(res);
    });

  }

  signInWithFB(loginForm): void {
    this.loginForm = loginForm;
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      this.fnLoginWithGoogleFacebook(res);

    });
  }

  fnCheckAuthState() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.user) {
        // if(this.isAllowed){
        //   this.fnLoginWithGoogleFacebook(this.user);
        // }
      } else {
      }
    });
  }

  fnLoginWithGoogleFacebook(user) {
    console.log(user);
    
    this.isAllowed = false;
    if (user.email == '') {
      this._snackBar.open('Please add email id in your facebook account.', "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
      });
      return false;
    }
    this.authenticationService.loginWithGoogleFacebook(user.id, user.email, user.provider).pipe(first()).subscribe(data => {
      if (data.idExists == true) {
        if (data.userData.user_type == "A") {
          this.router.navigate(["admin"]);
        } else if (data.userData.user_type == "SM") {
          this.router.navigate(["staff"]);
        } else {
          this.router.navigate(["user"]);
        }

        // this.initiateTimeout();

      } else if (data.idExists == false && data.emailExists == true) {
        this.signOut();
        this.isAllowed = true;
        this._snackBar.open("It seems that you already have account with Schedulic", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        //this.error = "It seems that you already have account with Schedulic";
        this.loginForm.controls['email'].setValue(data.userData.email);
        //this.dataLoaded = true;
      } else if (data.idExists == false && data.emailExists == false) {
        this.fnSignup(user);
      }
    },
      error => {
        this._snackBar.open("Database Connection Error", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        // this.error = "Database Connection Error";
        // this.dataLoaded = true;
      });
  }

  fnSignup(user_data) {
    let signUpUserObj = {
      "password": "",
      "firstname": user_data.firstName,
      "lastname": user_data.lastName,
      "phone": "",
      "email": user_data.email,
      "address": "",
      "zip": "",
      "state": "",
      "city": "",
      "country": "",
      "google_id": user_data.provider == "GOOGLE" ? user_data.id : null,
      "facebook_id": user_data.provider == "FACEBOOK" ? user_data.id : null
    }
    // .subscribe((response: any) =>
    this.authenticationService.signup(signUpUserObj).pipe(first()).subscribe(data => {
      if (data.data == true) {
        this.fnLoginWithGoogleFacebook(user_data);
      } else {
        this._snackBar.open("Unable to signin with " + user_data.provider, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        // this.error = "Unable to signin with "+user_data.provider;
        // this.dataLoaded = true;
      }
    },
      error => {
        this._snackBar.open("Database Connection Error", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        // this.error = "Database Connection Error";
        // this.dataLoaded = true;
      });
  }

  signOut(): void {
    this.authService.signOut();
  }

  /*For notification Dialog*/
  getNotificationCount(business_id) {
    let headers;
    let userId;
    if (this.currentUser) {
      if (business_id != null) {
        if (this.currentUser.user_type == "A") {
          this.userType = "admin";
          userId = business_id;
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': JSON.stringify(this.currentUser.user_id),
            "api-token": this.currentUser.token
          });
        } else if (this.currentUser.user_type == "SM") {
          this.userType = "staff";
          userId = JSON.stringify(this.currentUser.user_id);
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'staff-id': JSON.stringify(this.currentUser.user_id),
            "api-token": this.currentUser.token
          });
        } else if (this.currentUser.user_type == "C") {
          this.userType = "customer";
          userId = JSON.stringify(this.currentUser.user_id);
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'customer-id': JSON.stringify(this.currentUser.user_id),
            "api-token": this.currentUser.token
          });
        }
      } else {
        if (this.currentUser.user_type == "A") {
          this.userType = "admin";
          userId = business_id;
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': JSON.stringify(this.currentUser.user_id),
            "api-token": this.currentUser.token
          });
        } else if (this.currentUser.user_type == "SM") {
          this.userType = "staff";
          userId = JSON.stringify(this.currentUser.user_id);
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'staff-id': JSON.stringify(this.currentUser.user_id),
            "api-token": this.currentUser.token
          });
        } else if (this.currentUser.user_type == "C") {
          this.userType = "customer";
          userId = JSON.stringify(this.currentUser.user_id);
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'customer-id': JSON.stringify(this.currentUser.user_id),
            "api-token": this.currentUser.token
          });
        }
      }


      let requestObject = {
        "user_id": userId,
        "user_type": this.userType
      };
      this.CommonService.openNotificationDialog(requestObject, headers).subscribe((response: any) => {
        if (response.data == true) {
          this.notificationData = response.response
          this.notificationCount = this.notificationData.length;
        } else if (response.data == false) {
          this.notificationCount = 0
        }

        this.isLoaderAdmin = false;
      })
    } else {
      this.logout();
      this.router.navigate(['/login']);
    }
  }


  /*For Business Setup*/
  getBusinessSetup(business_id) {
    this.isLoaderAdmin = true;
    let headers;
    if (this.currentUser) {
      if (business_id != null) {
        if (this.currentUser.user_type == "A") {
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': JSON.stringify(this.currentUser.user_id),
            "api-token": this.currentUser.token
          });
        }
      }
      let requestObject = {
        "business_id": business_id,
      };
      this.CommonService.getBusinessSetup(requestObject, headers).subscribe((response: any) => {
        if (response.data == true) {
          this.businessSetup = response.response
        } else if (response.data == false) {

        }
        this.isLoaderAdmin = false;
      })
    }
  }

  openNotificationDialog() {
    this.isLoaderAdmin = true;
    let headers;
    let userId;
    if (this.currentUser.user_type == "A") {
      this.userType = "admin";
      userId = this.businessId;
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'admin-id': JSON.stringify(this.currentUser.user_id),
        "api-token": this.currentUser.token
      });
    } else if (this.currentUser.user_type == "SM") {
      this.userType = "staff";
      userId = JSON.stringify(this.currentUser.user_id);
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id': JSON.stringify(this.currentUser.user_id),
        "api-token": this.currentUser.token
      });
    } else if (this.currentUser.user_type == "C") {
      this.userType = "customer";
      userId = JSON.stringify(this.currentUser.user_id);
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'customer-id': JSON.stringify(this.currentUser.user_id),
        "api-token": this.currentUser.token
      });
    }
    let requestObject = {
      "user_id": userId,
      "user_type": this.userType
    };
    this.CommonService.openNotificationDialog(requestObject, headers).subscribe((response: any) => {
      if (response.data == true) {
        this.notificationData = response.response
        const dialogRef = this.dialog.open(DialogNotification, {
          height: '500px',
          data: { fulldata: this.notificationData }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.animal = result;
          this.getNotificationCount(this.businessId)
        });
        this.isLoaderAdmin = false;
      } else {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        this.isLoaderAdmin = false;
      }

    })

  }
  staffAvaibility(event) {
    if (event == true) {
      this.staffStatus = "N"
      localStorage.setItem('internal_staff', 'N');
    } else {
      localStorage.setItem('internal_staff', 'Y');
      this.staffStatus = "Y"
    }
    let requestObject = {
      "status": this.staffStatus,
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'staff-id': JSON.stringify(this.currentUser.user_id),
      "api-token": this.currentUser.token
    });
    this.CommonService.staffAvaibility(requestObject, headers).subscribe((response: any) => {
      if (response.data == true) {
        var currentuser = JSON.parse(localStorage.getItem("currentUser"));
        currentuser.internal_staff = this.staffStatus;
        localStorage.setItem('currentUser', JSON.stringify(currentuser));

        this.currentUser.internal_staff = this.staffStatus;
        // this.authenticationService.currentUserSubject.next(this.currentUser);
        this._snackBar.open("Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
      }
    })

  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  setcompanycolours(businessId) {
    let requestObject = {
      "business_id": businessId
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/get-front-setting`, requestObject, { headers: headers }).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response: any) => {
      if (response.data == true) {
        this.settingsArr = response.response;
        // this.appearenceColor = JSON.parse(this.settingsArr.appearance)

        if (!this.settingsArr.appearance) {
          localStorage.companycolours = '{"pri_color":"#287de9","pri_gradient1":"#4b96f5","pri_gradient2":"#1e79ed","text_color":"#000000","text_bgcolor":"#ffffff","font":"Poppins, sans-serif"}';
          this.update_SCSS_var();
        } else {
          localStorage.companycolours = this.settingsArr.appearance;
          this.update_SCSS_var();
        }
      }
    }, (err) => {
    })
  }

  update_SCSS_var() {
    const data = JSON.parse(localStorage.companycolours);
    for (const [key, value] of Object.entries(data)) {
      this.setPropertyOfSCSS('--' + key, value);
      // document.documentElement.style.setProperty('--' + key, value);
    }
  }

  setPropertyOfSCSS(key, value) {
    if (key[0] != '-') {
      key = '--' + key;
    }
    if (value) {
      document.documentElement.style.setProperty(key, value);
    }
    return getComputedStyle(document.documentElement).getPropertyValue(key);
  }


  logoutAlert() {
    const dialogRef = this.dialog.open(DialogLogoutAppointment, {
      width: '500px',

    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  gotToDestinationPage(link) {
    this.gettingStartedWindowOpen = false;
    this.router.navigate([link]);
  }

  gotToDestinationPageAppearance(param) {
    this.gettingStartedWindowOpen = false;
    this.router.navigate(['/admin/settings-general/appearance'], { queryParams: { goto: param } });
  }

  openGettingStartedDialog() {
    this.gettingStartedWindowOpen = true;
  }

  gotToDestinationPageStaff(param) {
    this.gettingStartedWindowOpen = false;
    this.router.navigate(['/admin/settings-resource/staff'], { queryParams: { goto: param } });
  }

  skipFrom() {
    this.gettingStartedWindowOpen = false;
    this.router.navigate(['/admin/my-workspace']);
  }
  goToNextSlide() {
    this.carousel.nextSlide();
  }

}

/*For notification Dialog*/

@Component({
  selector: 'dialog-notification',
  templateUrl: './_dialogs/dialog-notification.html',
  providers: [DatePipe]
})
export class DialogNotification {
  notifications: any;
  currentUser: User;
  businessId: any;
  userId: any;
  userType: any;
  animal: any;
  token: any;
  isLoaderAdmin: boolean = false;
  order_item_id: any = [];

  constructor(
    public dialogRef: MatDialogRef<DialogNotification>,
    private datePipe: DatePipe,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private CommonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }
    this.notifications = this.data.fulldata
    // this.notifications = this.notifications.sort(this.dynamicSort("booking_date"))
    this.notifications.forEach((element) => {
      var todayDateTime = new Date();
      //element.booking_date_time=new Date(element.booking_date+" "+element.booking_time);
      var dateTemp = new Date(this.datePipe.transform(element.updated_at, "yyyy/MM/dd HH:mm"));
      dateTemp.setMinutes(dateTemp.getMinutes() + parseInt(element.service_time));
      var temp = todayDateTime.getTime() - dateTemp.getTime();
      element.timeToService = (temp / 3600000).toFixed();

      element.booking_date = this.datePipe.transform(new Date(element.booking_date), "yyyy/MM/dd");
      element.booking_time = this.datePipe.transform(new Date(element.booking_date + " " + element.booking_time), "HH:mm");
    });
  }

  fnViewNotification(index, orderId) {
    this.order_item_id.push(orderId);
    let headers;
    if (this.currentUser.user_type == "A") {
      this.userType = "admin";
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'admin-id': JSON.stringify(this.currentUser.user_id),
        "api-token": this.currentUser.token
      });
    } else if (this.currentUser.user_type == "SM") {
      this.userType = "staff";
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'staff-id': JSON.stringify(this.currentUser.user_id),
        "api-token": this.currentUser.token
      });
    } else if (this.currentUser.user_type == "C") {
      this.userType = "customer";
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'customer-id': JSON.stringify(this.currentUser.user_id),
        "api-token": this.currentUser.token
      });
    }
    let requestObject = {
      "order_item_id": this.order_item_id,
    };
    this.CommonService.fnViewNotification(requestObject, headers).subscribe((response: any) => {
      if (response.data == true) {
        this.notificationAppointment(index);
      }
    })
  }

  notificationAppointment(index) {
    const dialogRef = this.dialog.open(DialogNotificationAppointment, {
      width: '500px',
      data: { fulldata: this.notifications[index] }

    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

}

@Component({
  selector: 'Notification-Appointment',
  templateUrl: './_dialogs/dialog-notification-appointment.html',
  providers: [DatePipe]
})
export class DialogNotificationAppointment {
  myAppoDetailData: any;
  bookingDateTime: any;
  booking_timeForLabel: any;
  created_atForLabel: any;
  booking_dateForLabel: any;
  booking_time_to: any;

  constructor(
    public dialogRef: MatDialogRef<DialogNotificationAppointment>,
    public router: Router,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.myAppoDetailData = this.data.fulldata
    this.bookingDateTime = new Date(this.myAppoDetailData.booking_date + " " + this.myAppoDetailData.booking_time);
    this.booking_timeForLabel = this.datePipe.transform(this.bookingDateTime, "HH:mm");
    this.booking_dateForLabel = this.datePipe.transform(new Date(this.myAppoDetailData.booking_date), "yyyy/MM/dd");
    this.created_atForLabel = this.datePipe.transform(new Date(this.myAppoDetailData.created_at), "yyyy/MM/dd @ HH:mm");

    var dateTemp = new Date(this.datePipe.transform(this.bookingDateTime, "yyyy/MM/dd HH:mm"));
    dateTemp.setMinutes(dateTemp.getMinutes() + parseInt(this.myAppoDetailData.service_time));
    this.booking_time_to = this.datePipe.transform(new Date(dateTemp), "HH:mm")

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}


@Component({
  selector: 'logout-alert',
  templateUrl: './_dialogs/logout-dialog.html',
})
export class DialogLogoutAppointment {

  timer: any = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogLogoutAppointment>,
    public router: Router,
    private authenticationService: AuthenticationService,
    private authService: AuthService,
    public dialogRef2: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  logout() {
    //this.authService.signOut();

    this.dialogRef2.closeAll();
    this.dialogRef.close();
    setTimeout(() => {
      this.fnTemp();
    }, 3000)
  }


  fnTemp() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


  closePopup() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 're-authentication-popup',
  templateUrl: './_dialogs/re-authentication-password.html',
})
export class DialogReAuthentication {

  currentUser: any;
  reAuthenticationForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<DialogReAuthentication>,
    private authenticationService: AuthenticationService,
    public dialogRef2: MatDialog,
    private _formBuilder: FormBuilder,
    public router: Router,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.reAuthenticationForm = this._formBuilder.group({
      user_password: ['', [Validators.required]],
    });
  }
  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }
  fnEnterKeyPress(event) {
    if (event.keyCode === 13) {
      this.submit();
    }
    else {
    }
  }

  submit() {
    if (this.reAuthenticationForm.valid) {
      let requestObject = {
        "user_type": this.currentUser.user_type,
        "user_id": this.currentUser.user_id,
        "password": this.reAuthenticationForm.get('user_password').value
      };
      this.http.post(`${environment.apiUrl}/user-re-login`, requestObject).pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      ).subscribe((response: any) => {
        if (response.data == true) {
          this.authenticationService.currentUser = response.response
          localStorage.setItem('currentUser', JSON.stringify(response.response));
          this.dialogRef.close(response.response);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
        else if (response.data == false) {
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });

          this.reAuthenticationForm.get('user_password').markAsTouched();
        }
      }, (err) => {
      });
    } else {
      this.reAuthenticationForm.get('user_password').markAsTouched();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  closePopup() {
    this.dialogRef.close();
  }
}

