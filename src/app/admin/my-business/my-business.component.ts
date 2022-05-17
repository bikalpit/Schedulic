import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterEvent } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { AdminService } from '../_services/admin-main.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '@app/app.component';
import { AuthenticationService } from '@app/_services';
import { take, takeUntil } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../_components/confirmation-dialog/confirmation-dialog.component';
import { SharedService } from '@app/_services/shared.service';
export interface DialogData {
  animal: string;
  name: string;
}

export interface ListTimeZoneListArry {
  id: string;
  name: string;
}

export interface countryArry {
  id: string;
  name: string;
}

export interface StateArry {
  id: string;
  name: string;
}

export interface CityArry {
  id: string;
  name: string;
}

@Component({
  selector: 'app-my-business',
  templateUrl: './my-business.component.html',
  styleUrls: ['./my-business.component.scss']
})

export class MyBusinessComponent implements OnInit {
  animal: any;
  allBusiness: any = [];
  adminSettings: boolean = false;
  isLoaderAdmin: boolean = true;
  currentUser: any;
  adminId: any;
  token: any;
  getIpAddress: any;
  pageSlug: any;
  firstBusiness: boolean = false;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public router: Router,
    private AdminService: AdminService,
    private appComponent: AppComponent,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private sharedService: SharedService) {

    this.isLoaderAdmin = true;
    setTimeout(() => {
      this.isLoaderAdmin = false;
    }, 2000)
    localStorage.setItem('isBusiness', 'true');
    this.router.events.subscribe(event => {
      if (event instanceof RouterEvent) this.handleRoute(event);
      const url = this.getUrl(event);
    });
    this.currentUser = this.authenticationService.currentUserValue;
    this.adminId = this.currentUser.user_id;
    this.token = this.currentUser.token;
  }

  ngOnInit() {
    this.getAllBusiness();
    this.fnGetIpAddress();

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoaderAdmin = false;
    }, 4000);
  }

  fnGetIpAddress() {
    this.authenticationService.getIPAddress().subscribe((res: any) => {
      if (res.data == true) {
        this.getIpAddress = res.response
      }
    });
  }

  getAllBusiness() {
    this.isLoaderAdmin = true;
    this.sharedService.updateSideMenuState(false);
    this.AdminService.getAllBusiness().subscribe((response: any) => {
      if (response.data == true) {
        this.allBusiness = response.response
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this.firstBusiness = true;
        this.creatNewBusiness();
        this.allBusiness = [];
      }
      this.isLoaderAdmin = false;
    })
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoaderAdmin = true;
        this.AdminService.deleteBusiness(id).subscribe((response: any) => {
          if (response.data == true) {
            this._snackBar.open("Bussiness Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['green-snackbar']
            });
            this.getAllBusiness();
            this.isLoaderAdmin = false;
          } else if (response.data == false && response.response !== 'api token or userid invaild') {
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
            });
            this.isLoaderAdmin = false;
          }
        });
      }
    });
  }

  duplicate(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to create duplicate?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoaderAdmin = true;
        this.AdminService.duplicateBusiness(id).subscribe((response: any) => {
          if (response.data == true) {
            this._snackBar.open("Duplicate Bussiness Created.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['green-snackbar']
            });
            this.getAllBusiness();
            this.isLoaderAdmin = false;
          } else if (response.data == false && response.response !== 'api token or userid invaild') {
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
            });
            this.isLoaderAdmin = false;
          }
        });
      }
    });
  }

  fnSelectBusiness(business_id, busisness_name) {
    localStorage.setItem('business_id', business_id);
    localStorage.setItem('business_name', busisness_name);
    this.router.navigate(['/admin/my-workspace']);
    this.appComponent.getNotificationCount(business_id);
    this.appComponent.getBusinessSetup(business_id);
  }

  creatNewBusiness() {
    const dialogRef = this.dialog.open(myCreateNewBusinessDialog, {
      width: '1000px',
      data: { firstBusiness: this.firstBusiness }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result != 'success') {
        if (result.type == 'redirect' && result.link == 'appearance') {
          this.router.navigate(['/admin/settings-general/appearance'], { queryParams: { goto: result.param } });
        } else if (result.type == 'redirect' && result.link == 'staff') {
          this.router.navigate(['/admin/settings-resource/staff'], { queryParams: { goto: result.param } });
        } else {
          this.router.navigate([result.link]);
        }

      } else if (result && result == 'success') {
        this.router.navigate(['/admin/my-workspace']);
        this.appComponent.getNotificationCount(localStorage.getItem('business_id'));
        this.appComponent.getBusinessSetup(localStorage.getItem('business_id'));
      } else {
        this.getAllBusiness();
      }
    });
  }



  // page url conditions
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
  private getUrl(event: any) {
    if (event && event.url) {
      this.pageSlug = event.url.split('/', 2)
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    let devidedUrl = url.split('/', 4);
    if ((devidedUrl[1] == 'admin' && devidedUrl.length == 2) || devidedUrl[2] == 'my-business') {
      // this.AppComponent
      localStorage.setItem('isBusiness', 'true');
    } else {
      localStorage.setItem('isBusiness', 'false');
      this.sharedService.updateSideMenuState(true);
    }
  }

}


@Component({
  selector: 'Create-New-Business',
  templateUrl: '../_dialogs/create-new-business-dialog.html',
})


export class myCreateNewBusinessDialog {
  allCountry: any;
  allStates: any;
  allCities: any;
  businessCategories: any = [];
  newBusinessData: any;
  createBusiness: FormGroup;
  isLoaderAdmin: boolean = false;
  currentStep: number = 1;
  presentPhoneAddress: any = 'N';
  selectedCategoryList: any = [];
  needsUpdate: boolean = false;
  firstBusiness: boolean = false;
  needs: any = {
    'clients': false,
    'scheduling': false,
    'marketing  ': false,
    'invoice': false,
    'reminder': false,
    'payment': false,
  }
  categorySearch: any = "";
  businessSetup: any;
  protected listTimeZoneListArry: ListTimeZoneListArry[];
  public timeZoneFilterCtrl: FormControl = new FormControl();
  public listTimeZoneList: ReplaySubject<ListTimeZoneListArry[]> = new ReplaySubject<ListTimeZoneListArry[]>(1);
  protected countryArry: countryArry[];
  public countryFilterCtrl: FormControl = new FormControl();
  public countryList: ReplaySubject<countryArry[]> = new ReplaySubject<countryArry[]>(1);
  protected StateArry: StateArry[];
  public StateFilterCtrl: FormControl = new FormControl();
  public StateList: ReplaySubject<StateArry[]> = new ReplaySubject<StateArry[]>(1);

  // CityFilterCtrl
  protected CityArry: CityArry[];
  public CityFilterCtrl: FormControl = new FormControl();
  public CityList: ReplaySubject<StateArry[]> = new ReplaySubject<StateArry[]>(1);
  protected _onDestroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<myCreateNewBusinessDialog>,
    private http: HttpClient,
    public router: Router,
    private AdminService: AdminService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.firstBusiness = this.data.firstBusiness;
  }

  onNoClick(): void {
    this.dialogRef.close('success');
  }

  ngAfterViewInit() {
    this.setInitialValueTimeZone();
    this.setInitialValueCountry();
  }

  ngOnInit() {
    this.gelAllCountry();
    this.getTimeZone();
    this.getBusinessCategory();
    this.createBusiness = this._formBuilder.group({
      business_name: ['', [Validators.required]],
      business_phone: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      business_size: ['', [Validators.required]],
      business_website: ['', [Validators.required]],
      business_address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      How_customers_will_Find_you: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      business_country: ['', Validators.required],
      business_state: ['', Validators.required],
      business_timezone: ['', Validators.required],
      business_city: ['', Validators.required],
      business_zip: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(7)]]
    });
  }

  gelAllCountry() {
    this.isLoaderAdmin = true;
    this.AdminService.gelAllCountry().subscribe((response: any) => {
      if (response.data == true) {
        // this.allCountry = response.response
        this.countryArry = response.response
        this.countryList.next(this.countryArry.slice());
        this.countryFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCountries();
          });
        this.isLoaderAdmin = false;
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this.allCountry = ''
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        this.isLoaderAdmin = false;
      }
    })
  }

  selectCountry(country_id) {
    this.isLoaderAdmin = true;
    this.AdminService.gelAllState(country_id).subscribe((response: any) => {
      if (response.data == true) {
        this.allStates = response.response
        this.createBusiness.controls['business_state'].setValue('');
        this.StateArry = response.response
        this.StateList.next(this.StateArry.slice());
        this.StateFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterState();
          });
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this.allStates = ''
        this.createBusiness.controls['business_state'].setValue('');
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  selectStates(state_id) {
    this.isLoaderAdmin = true;
    this.AdminService.gelAllCities(state_id).subscribe((response: any) => {
      if (response.data == true) {
        this.createBusiness.controls['business_city'].setValue('');
        // this.allCities = response.response
        this.CityArry = response.response
        this.CityList.next(this.CityArry.slice());
        this.CityFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCity();
          });
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this.allCities = [];
        this.createBusiness.controls['business_city'].setValue('');
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  getBusinessCategory() {
    this.isLoaderAdmin = true;
    let requestObject = {
      'search': this.categorySearch
    }
    this.AdminService.getBusinessCategory(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.businessCategories = response.response
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this.businessCategories = [];
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  getTimeZone() {
    this.isLoaderAdmin = true;
    this.AdminService.getTimeZone().subscribe((response: any) => {
      if (response.data == true) {
        this.listTimeZoneListArry = response.response
        this.listTimeZoneList.next(this.listTimeZoneListArry.slice());
        this.timeZoneFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterTimezones();
          });
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this.listTimeZoneListArry = []
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  onChangePresence(event) {
    if (event.checked) {
      this.presentPhoneAddress = 'Y';
    } else {
      this.presentPhoneAddress = 'N';
    }
  }

  onCateChange(event, id) {
    if (event.checked) {
      this.selectedCategoryList.push(id)
    } else {
      const index = this.businessCategories.indexOf(id, 0);
      if (index > -1) {
        this.selectedCategoryList.splice(index, 1);
      }
    }
  }

  onChangeNeeds(event, needType) {
    this.needsUpdate = true;
    if (event.checked) {
      this.needs[needType] = true;
    } else {
      this.needs[needType] = false;
    }
    console.log(this.needs)
  }

  fnCreateBusiness() {
    if (this.createBusiness.valid) {
      this.newBusinessData = {
        "business_name": this.createBusiness.get('business_name').value,
        "address": this.createBusiness.get('business_address').value,
        "howcustomers": this.createBusiness.get('How_customers_will_Find_you').value,
        "business_size": this.createBusiness.get('business_size').value,
        "present_phone_address": this.presentPhoneAddress,
        "business_categories": this.selectedCategoryList,
        "business_needs": this.needsUpdate ? this.needs : null,
        "phone": this.createBusiness.get('business_phone').value,
        "country": this.createBusiness.get('business_country').value,
        "state": this.createBusiness.get('business_state').value,
        "city": this.createBusiness.get('business_city').value,
        "time_zone": this.createBusiness.get('business_timezone').value,
        "website": this.createBusiness.get('business_website').value,
        "zipcode": this.createBusiness.get('business_zip').value,
      }
      this.createNewBusiness(this.newBusinessData);
    } else {
      this.createBusiness.get('business_name').markAsTouched();
      this.createBusiness.get('business_address').markAsTouched();
      this.createBusiness.get('How_customers_will_Find_you').markAsTouched();
      this.createBusiness.get('business_country').markAsTouched();
      this.createBusiness.get('business_state').markAsTouched();
      this.createBusiness.get('business_city').markAsTouched();
      this.createBusiness.get('business_timezone').markAsTouched();
      this.createBusiness.get('business_zip').markAsTouched();
      this.createBusiness.get('business_size').markAsTouched();
      this.createBusiness.get('business_phone').markAsTouched();
      this.createBusiness.get('business_website').markAsTouched();
    }
  }
  createNewBusiness(newBusinessData) {
    this.AdminService.createNewBusiness(newBusinessData).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Business Created.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        if (this.firstBusiness) {
          this.currentStep = 5;
          localStorage.setItem('business_id', response.response.id);
          localStorage.setItem('business_name', response.response.business_name);
          this.getBusinessSetup(response.response.id);
        } else {
          localStorage.setItem('business_id', response.response.id);
          localStorage.setItem('business_name', response.response.business_name);
          this.dialogRef.close('success');
        }
        console.log(response.response)
        // this.dialogRef.close(response.response);
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
  }


  /*For Business Setup*/
  getBusinessSetup(business_id) {
    this.isLoaderAdmin = true;
    let requestObject = {
      "business_id": business_id,
    };
    this.AdminService.getBusinessSetup(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.businessSetup = response.response
      } else if (response.data == false) {

      }
      this.isLoaderAdmin = false;
    })
  }


  gotToDestinationPage(link) {
    let dialogResponse = {
      'type': 'redirect',
      'link': link,
    }
    this.dialogRef.close(dialogResponse);
    this.router.navigate([link]);
  }

  gotToDestinationPageAppearance(param) {
    let dialogResponse = {
      'type': 'redirect',
      'link': 'appearance',
      'param': param,
    }
    this.dialogRef.close(dialogResponse);
    // this.router.navigate(['/admin/settings-general/appearance'], { queryParams: { goto: param } });
  }


  gotToDestinationPageStaff(param) {
    let dialogResponse = {
      'type': 'redirect',
      'link': 'staff',
      'param': param,
    }
    this.dialogRef.close(dialogResponse);
    this.router.navigate(['/admin/settings-resource/staff'], { queryParams: { goto: param } });
  }

  skipFrom(step) {
    if (step == 10) {
      this.dialogRef.close('success');
      return false;
    }
    this.currentStep = step;
  }

  goToNextStep(step) {
    if (step == 2) {
      if (this.createBusiness.invalid) {
        this.createBusiness.get('business_name').markAsTouched();
        this.createBusiness.get('business_address').markAsTouched();
        this.createBusiness.get('How_customers_will_Find_you').markAsTouched();
        this.createBusiness.get('business_country').markAsTouched();
        this.createBusiness.get('business_state').markAsTouched();
        this.createBusiness.get('business_city').markAsTouched();
        this.createBusiness.get('business_timezone').markAsTouched();
        this.createBusiness.get('business_zip').markAsTouched();
        this.createBusiness.get('business_size').markAsTouched();
        this.createBusiness.get('business_phone').markAsTouched();
        this.createBusiness.get('business_website').markAsTouched();
      } else {
        this.currentStep = step;
      }
    } else {
      this.currentStep = step;
    }
  }

  onBackStep(step) {
    // if(step == 1){
    //   this.selectedCategoryList = [];
    // }
    this.currentStep = step;
  }

  /**
 * Sets the initial value after the filteredTimezones are loaded initially
 */
  protected setInitialValueTimeZone() {
    this.listTimeZoneList
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  protected filterTimezones() {
    if (!this.listTimeZoneListArry) {
      return;
    }
    // get the search keyword
    let search = this.timeZoneFilterCtrl.value;
    if (!search) {
      this.listTimeZoneList.next(this.listTimeZoneListArry.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.listTimeZoneList.next(
      this.listTimeZoneListArry.filter(listTimeZoneListArry => listTimeZoneListArry.name.toLowerCase().indexOf(search) > -1)
    );
  }

  /**
 * Sets the initial value after the filteredCountry are loaded initially
 */
  protected setInitialValueCountry() {
    this.listTimeZoneList
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  protected filterCountries() {
    if (!this.countryArry) {
      return;
    }
    // get the search keyword
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.countryList.next(this.countryArry.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.countryList.next(
      this.countryArry.filter(countryArry => countryArry.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterState() {
    if (!this.StateArry) {
      return;
    }
    // get the search keyword
    let search = this.StateFilterCtrl.value;
    if (!search) {
      this.StateList.next(this.StateArry.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.StateList.next(
      this.StateArry.filter(StateArry => StateArry.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterCity() {
    if (!this.CityArry) {
      return;
    }
    // get the search keyword
    let search = this.CityFilterCtrl.value;
    if (!search) {
      this.CityList.next(this.CityArry.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.CityList.next(
      this.CityArry.filter(CityArry => CityArry.name.toLowerCase().indexOf(search) > -1)
    );
  }


}
