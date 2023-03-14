import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AdminService } from '../_services/admin-main.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, ReplaySubject, Subject } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AppComponent } from '@app/app.component';
import { ExportToCsv } from 'export-to-csv';
import * as domtoimage from 'dom-to-image';
import * as jspdf from 'jspdf';
import { ConfirmationDialogComponent } from '../../_components/confirmation-dialog/confirmation-dialog.component';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@app/my-date-formats';

export interface DialogData {
  fulldata: any;
  animal: string;
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
export interface Tag {
  
}
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    DatePipe
  ]
})
export class CustomersComponent implements OnInit {

  adminSettings : boolean = false;
  dtOptions: any = {};
  animal: any;
  allCustomers: any =[];
  customersDetails: any;
  customerLastbooking:any;
  customerPersonalDetails: any;
  customerAppoint: any;
  reviewOrderData : any;
  customerNotes: any;
  customerReviews: any;
  customerPayments: any;
  newCustomer: boolean = false;
  fullDetailsOfCustomer: boolean = true;
  isLoaderAdmin : boolean = false;
  createNewCustomer: FormGroup;
  createNewNote: FormGroup;
  newCustomerData: any;
  existingCustomerData: any;
  existingUserId: any;
  selectedCustomerId: any = [];
  selectedCustomerArr: any;
  businessId: any;
  tagsnew: any=[];
  customerImageUrl:any = '';
  actionValue:any;
  search = {
    keyword: ""
  };
  paymentMethod : any = "Cash";

  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  onlynumericAmount = /^(\d*\.)?\d+$/
  onlynumericWithCountry = /^\+(?:[0-9] ?){6,14}[0-9]$/
  onlyString = /^[a-zA-Z]+$/
  exportType :any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag[] = [];
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;

  formPayment: FormGroup;
  actionForm: FormGroup;
  showPaymentTable:boolean=true;
  showPaymentForm:boolean=false;

  taxType:any='P';
  taxArr:any=[];
  taxAmountArr:any=[];
  serviceMainArr={
    order_item_id:'',
    customer_id:'',
    bookingDateForLabel:'',
    bookingTimeForLabel:'',
    bookingTimeTo:'',
    created_at:'',
    service_time:'',
    service_name:'',
    category_title:'',
    order_by:'',
    order_status:'',
    staff_name:'',
    service_cost:0,
    service_qty:0,
    subtotal:0,
    discount_type:null,
    discount_value:null,
    discount:0,
    netCost:0,
    order_id:'',
    order_subtotal:0,
    order_discount_type:null,
    order_discount_value:null,
    order_discount:0,
    order_netCost:0,
    payment_type:'',
    paymentId:'',
    customer_email:'',
  }
  order_taxAmountArr=[];
  customerPaymentIndex:number;
  customerDetailId : any;
  customerSideMenuToggle:boolean=false;
  emailCheckRequestObject:any;
  phoneCheckRequestObject:any;
  allcustomerIds :any=[];
  tagName:any;
  tabIndex:number=0;
  noCustomer:boolean=false;

  allCountry: any;
  allStates: any;
  allCities: any;
  
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
    public dialog: MatDialog,
    private adminService: AdminService,
    private _formBuilder:FormBuilder,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private datePipe: DatePipe,
    //private excelExportService: IgxExcelExporterService,
    private appComponent : AppComponent,
    ) { 
      localStorage.setItem('isBusiness', 'false');
      if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
      }
      this.gelAllCountry();
    }
    private handleError(error: HttpErrorResponse) {
      console.log(error);
      return throwError('Error! something went wrong.');
  }
    add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
      
      // Add our fruit
      if ((value || '').trim()) {
      
        this.tags.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
      
    }

    saveTag(event, customerId){
      if(event.keyCode == 13){
        if ((this.tagName || '').trim()) {
          this.tags.push(this.tagName.trim());
        }
        if(!this.tagName){
          return false;
        }
        this.adminService.fnSaveTags(customerId,this.tags).subscribe((response:any) => {
          if(response.data == true){
            this.tagName= null;
            this.fnSelectCustomer(customerId,'not-new');
          }
          else if(response.data == false && response.response !== 'api token or userid invaild'){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
        })
      }
    }

    remove(tg: Tag, customerId): void {
      const index = this.tags.indexOf(tg);

      if (index >= 0) {
        this.tags.splice(index, 1);
      }
      this.adminService.fnSaveTags(customerId,this.tags).subscribe((response:any) => {
        if(response.data == true){
          this.tagName= null;
          this.fnSelectCustomer(customerId,'not-new');
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      })
    }

  ngOnInit() {
    this.fnGetSettings();
    this.getAllCustomers();
    
    this.createNewCustomer = this._formBuilder.group({
      cus_fullname : ['', Validators.required,Validators.pattern('[a-zA-Z ]*')],
      cus_email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isCustomerEmailUnique.bind(this)],
      cus_phone : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumericWithCountry)],this.isCustomerPhoneUnique.bind(this)],
      cus_officenumber : ['', [Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      cus_homenumber : ['', [Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      cus_address : ['', Validators.required],
      cus_state : ['', Validators.required],
      cus_city : ['', Validators.required],
      cus_country : ['', Validators.required],
      cus_zip : ['',[Validators.required,Validators.minLength(5),Validators.maxLength(7)]],
      customer_id : ['']
    });
    this.actionForm = this._formBuilder.group({
      action : [''],
    });
    
    let addNewAction = window.location.search.split("?customer")
    if(addNewAction.length > 1){
      // this.addNewEvents = false; 
      this.fnAddNewCustomer();
    }
  }

  fnGetSettings(){

    let requestObject = {
      "business_id" : this.businessId
    };

    this.adminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){

        this.settingsArr = response.response;
        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;

      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      },
      (err) =>{
        console.log(err)
      })
  }

  getAllCustomers(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'business_id': this.businessId,
    };
    this.adminService.getAllCustomers(requestObject).subscribe((response:any) => {
      if(response.data == true && response.response != 'Customer not created.'){
        this.allCustomers = response.response;
        this.allCustomers.forEach( (element) => {
          this.allcustomerIds.push(element.id)
          var splitted = element.fullname.split(" ",2);
          element.initials='';
          splitted.forEach( (element2) => {
            element.initials=element.initials+element2.charAt(0);
          });
        });
        var action = '';
        let addNewAction = window.location.search.split("?customer")
        if(addNewAction.length > 1){
          // this.addNewEvents = false; 
          this.fnAddNewCustomer();
          action = 'new'
        }else{
          action = 'not-new'
        }
        this.fnSelectCustomer(this.allCustomers[0].id,action);
        this.customerDetailId = this.allCustomers[0].id
        this.noCustomer = false;
        // this.isLoaderAdmin = false;
        setTimeout(() => {
            this.isLoaderAdmin = false;
        },2000)
      }
      else if(response.response == 'Customer not created.'){
        this.allCustomers = [];
        this.noCustomer = true;
        this.isLoaderAdmin = false;
        
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.allCustomers = [];
        this.isLoaderAdmin = false;
      }
    })
  }
  getAllCustomersAfterNew(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'business_id': this.businessId,
    };
    this.adminService.getAllCustomers(requestObject).subscribe((response:any) => {
      if(response.data == true && response.response != 'Customer not created.'){
        this.allCustomers = response.response;
        this.allCustomers.forEach( (element) => {
          var splitted = element.fullname.split(" ",2);
          element.initials='';
          splitted.forEach( (element2) => {
            element.initials=element.initials+element2.charAt(0);
          });
        });
        
        this.fnSelectCustomer(this.allCustomers[this.allCustomers.length-1].id, 'not-new');
        this.customerDetailId = this.allCustomers[this.allCustomers.length-1].id
        this.isLoaderAdmin = false;
      }
      else if(response.response == 'Customer not created.'){
        this.allCustomers = [];
        this.isLoaderAdmin = false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.allCustomers = [];
        this.isLoaderAdmin = false;
      }
    })
  }

  fnUploadImage(){
    this.customerImage();
  }

  fnRemoveImage(){
    let requestObject = {
      'user_type': 'C',
      'user_id': this.existingUserId
    }
    this.isLoaderAdmin = true;
    this.adminService.removeImage(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.getAllCustomersAfterNew();
        this.createNewCustomer.reset();
        this.fnCancelNewCustomer();
        // this.customerImageUrl = '';
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        // this.allCustomers = ''
      }
      this.isLoaderAdmin = false;
    })
  }

  fnCreateCustomerSubmit(){
    console.log(this.createNewCustomer)
    if(this.createNewCustomer.get('customer_id').value != null){
      this.existingUserId = this.createNewCustomer.get('customer_id').value;
      if(this.createNewCustomer.valid){
        if(this.customerImageUrl != ''){
          this.existingCustomerData ={
            "customer_id" :  this.existingUserId,
            "business_id" : this.businessId,
            "fullname" : this.createNewCustomer.get('cus_fullname').value,
            "email" : this.createNewCustomer.get('cus_email').value,
            "phone" : this.createNewCustomer.get('cus_phone').value,
            "office_phone" : this.createNewCustomer.get('cus_officenumber').value,
            "home_phone" : this.createNewCustomer.get('cus_homenumber').value,
            "address" : this.createNewCustomer.get('cus_address').value,
            "state" : this.createNewCustomer.get('cus_state').value,
            "city" : this.createNewCustomer.get('cus_city').value,
            "country" : this.createNewCustomer.get('cus_country').value,
            "zip" : this.createNewCustomer.get('cus_zip').value,
            'image': this.customerImageUrl
          }
        }else if(this.customerImageUrl == ''){
          this.existingCustomerData ={
            "customer_id" :  this.existingUserId,
            "business_id" : this.businessId,
            "fullname" : this.createNewCustomer.get('cus_fullname').value,
            "email" : this.createNewCustomer.get('cus_email').value,
            "phone" : this.createNewCustomer.get('cus_phone').value,
            "office_phone" : this.createNewCustomer.get('cus_officenumber').value,
            "home_phone" : this.createNewCustomer.get('cus_homenumber').value,
            "address" : this.createNewCustomer.get('cus_address').value,
            "state" : this.createNewCustomer.get('cus_state').value,
            "city" : this.createNewCustomer.get('cus_city').value,
            "country" : this.createNewCustomer.get('cus_country').value,
            "zip" : this.createNewCustomer.get('cus_zip').value,
          }
        }
      this.customerUpdate(this.existingCustomerData);
      this.getAllCustomers();
      this.getAllCustomersAfterNew();
    } else{
        this.createNewCustomer.get('cus_fullname').markAsTouched();
        this.createNewCustomer.get('cus_email').markAsTouched();
        this.createNewCustomer.get('cus_phone').markAsTouched();
        this.createNewCustomer.get('cus_officenumber').markAsTouched();
        this.createNewCustomer.get('cus_homenumber').markAsTouched();
        this.createNewCustomer.get('cus_address').markAsTouched();
        this.createNewCustomer.get('cus_state').markAsTouched();
        this.createNewCustomer.get('cus_city').markAsTouched();
        this.createNewCustomer.get('cus_country').markAsTouched();
        this.createNewCustomer.get('cus_zip').markAsTouched();
    }
  }
  else{
    if(this.createNewCustomer.valid){
        this.newCustomerData ={
          "business_id" : this.businessId,
          "fullname" : this.createNewCustomer.get('cus_fullname').value,
          "email" : this.createNewCustomer.get('cus_email').value,
          "phone" : this.createNewCustomer.get('cus_phone').value,
          "office_phone" : this.createNewCustomer.get('cus_officenumber').value,
          "home_phone" : this.createNewCustomer.get('cus_homenumber').value,
          "address" : this.createNewCustomer.get('cus_address').value,
          "state" : this.createNewCustomer.get('cus_state').value,
          "city" : this.createNewCustomer.get('cus_city').value,
          "country" : this.createNewCustomer.get('cus_country').value,
          "zip" : this.createNewCustomer.get('cus_zip').value,
          'image': this.customerImageUrl
        }
      this.fnCreateNewCustomer(this.newCustomerData);
    }else{
        this.createNewCustomer.get('cus_fullname').markAsTouched();
        this.createNewCustomer.get('cus_email').markAsTouched();
        this.createNewCustomer.get('cus_phone').markAsTouched();
        this.createNewCustomer.get('cus_officenumber').markAsTouched();
        this.createNewCustomer.get('cus_homenumber').markAsTouched();
        this.createNewCustomer.get('cus_address').markAsTouched();
        this.createNewCustomer.get('cus_state').markAsTouched();
        this.createNewCustomer.get('cus_city').markAsTouched();
        this.createNewCustomer.get('cus_country').markAsTouched();
        this.createNewCustomer.get('cus_zip').markAsTouched();
    }
  }
}

fnCreateNewCustomer(newCustomerData){
  this.isLoaderAdmin = true;
  this.adminService.fnCreateNewCustomer(newCustomerData).subscribe((response:any) => {
    if(response.data == true){
      this._snackBar.open("Customer Created.", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['green-snackbar']
      });
      this.getAllCustomersAfterNew();
      this.createNewCustomer.reset();
      this.fnCancelNewCustomer();
      this.customerImageUrl = '';
      this.isLoaderAdmin = false;
      this.noCustomer = false;
    }
    else if(response.data == false && response.response !== 'api token or userid invaild'){
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['green-snackbar']
      });
      // this.allCustomers = ''
    this.isLoaderAdmin = false;
    }
  })
}


gelAllCountry(){
  this.isLoaderAdmin =true;
  this.adminService.gelAllCountry().subscribe((response:any) => {
    if(response.data == true){
      // this.allCountry = response.response
      this.countryArry = response.response
      this.countryList.next(this.countryArry.slice());
      this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
      this.filterCountries();
    });
      this.isLoaderAdmin =false;
    }
    else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.allCountry = ''
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      this.isLoaderAdmin =false;
    }
  })
}

selectCountry(country_id){
  this.isLoaderAdmin =true;
  this.adminService.gelAllState(country_id).subscribe((response:any) => {
    if(response.data == true){
      this.allStates = response.response
      this.createNewCustomer.controls['cus_state'].setValue('');
      this.StateArry = response.response
      this.StateList.next(this.StateArry.slice());
      this.StateFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterState();
        });
    }
    else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.allStates = ''
      this.createNewCustomer.controls['cus_state'].setValue('');
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
    }
      this.isLoaderAdmin =false;
  })
}

selectStates(state_id){
  this.isLoaderAdmin =true;
  this.adminService.gelAllCities(state_id).subscribe((response:any) => {
    if(response.data == true){
      this.createNewCustomer.controls['cus_city'].setValue('');
      // this.allCities = response.response
      this.CityArry = response.response
      this.CityList.next(this.CityArry.slice());
      this.CityFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCity();
        });
    }
    else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.allCities = [];
      this.createNewCustomer.controls['cus_city'].setValue('');
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
    }
      this.isLoaderAdmin =false;
  })
}


customerUpdate(existingCustomerData){
  this.isLoaderAdmin = true;
  this.adminService.customerUpdate(existingCustomerData).subscribe((response:any) => {
    if(response.data == true){
      this._snackBar.open("Customer Details Updated.", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['green-snackbar']
      });
      this.fnSelectCustomer(existingCustomerData.customer_id, 'not-new');
      this.existingUserId = undefined;
      this.fnCancelNewCustomer();
      this.customerImageUrl='';
      this.isLoaderAdmin = false;
    }
    else if(response.data == false && response.response !== 'api token or userid invaild'){
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      // this.allCustomers = ''
      this.customerImageUrl='';
    this.isLoaderAdmin = false;
    }
  })
}

  fnAddNewCustomer(){
    this.newCustomer = true;
    this.fullDetailsOfCustomer = false;
    this.customersDetails=null;
    this.customerPersonalDetails=null;
    this.existingUserId=null;
    this.createNewCustomer = this._formBuilder.group({
      cus_fullname : ['', Validators.required],
      cus_email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isCustomerEmailUnique.bind(this)],
      cus_phone : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumericWithCountry)],this.isCustomerPhoneUnique.bind(this)],
      cus_officenumber : ['', [Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      cus_homenumber : ['', [Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      cus_address : ['', Validators.required],
      cus_state : ['', Validators.required],
      cus_city : ['', Validators.required],
      cus_country : ['', Validators.required],
      cus_zip : ['',[Validators.required,Validators.minLength(5),Validators.maxLength(7)]],
      customer_id : ['']
    });
    this.createNewCustomer.controls['customer_id'].setValue(null);
    this.createNewCustomer.controls['cus_fullname'].setValue(null);
    this.createNewCustomer.controls['cus_email'].setValue(null);
    this.createNewCustomer.controls['cus_phone'].setValue(null);
    this.createNewCustomer.controls['cus_officenumber'].setValue(null);
    this.createNewCustomer.controls['cus_homenumber'].setValue(null);
    this.createNewCustomer.controls['cus_address'].setValue(null);
    this.createNewCustomer.controls['cus_state'].setValue(null);
    this.createNewCustomer.controls['cus_city'].setValue(null);
    this.createNewCustomer.controls['cus_zip'].setValue(null);
  }
  fnCancelNewCustomer(){
    this.newCustomer = false;
    this.fullDetailsOfCustomer = true;
    this.customerImageUrl = '';
    this.createNewCustomer.reset();
    this.fnSelectCustomer(this.allCustomers[0].id,'not-new');
  }

  
  fnSelectCustomer(customer_id, action){

    this.showPaymentForm=false;
    this.showPaymentTable = true;
    this.customerDetailId= customer_id;
    this.isLoaderAdmin = true;
    this.adminService.getCustomersDetails(customer_id).subscribe((response:any) => {
      if(response.data == true){
        this.customersDetails = response.response;
        if(this.customersDetails.lastBooking){
          this.customersDetails.lastBooking.booking_date=this.datePipe.transform(new Date(this.customersDetails.lastBooking.booking_date),"yyyy/MM/dd,")
          this.customersDetails.lastBooking.booking_time=this.datePipe.transform(new Date(this.customersDetails.lastBooking.booking_date+" "+this.customersDetails.lastBooking.booking_time),"HH:mm")
        }

        this.customerPersonalDetails = response.response.customer_details;
        // this.tags = [];
        this.customerPersonalDetails.created_at=this.datePipe.transform(new Date(this.customerPersonalDetails.created_at),"yyyy/MM/dd, HH:mm");
        if(this.customerPersonalDetails.tag_id != null){
          this.tags = this.customerPersonalDetails.tag_id;
        }else{
          // alert('null')
          this.tags = [];
        }


        this.customerAppoint = response.response.appointmets;
        this.customerAppoint.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"yyyy/MM/dd")   
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"HH:mm");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd @ HH:mm")
        });

        this.customerNotes = response.response.notes;
        this.customerNotes.forEach( (element) => { 
          element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd HH:mm");
          element.updated_at=this.datePipe.transform(new Date(element.updated_at),"yyyy/MM/dd HH:mm");
        });
        this.customerReviews = response.response.revirew;
        this.customerReviews.forEach( (element) => { 
          element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd HH:mm");
          element.updated_at=this.datePipe.transform(new Date(element.updated_at),"yyyy/MM/dd HH:mm");
        });

        this.customerPayments = response.response.payment;
        this.customerPayments.forEach( (element) => { 
          element.paymentDate=this.datePipe.transform(new Date(element.updated_at),"yyyy/MM/dd");
          element.paymentTime=this.datePipe.transform(new Date(element.updated_at),"HH:mm");
          if(element.orders){
            element.orders.bookingDateTime=new Date(element.orders.booking_date+" "+element.orders.booking_time);
            element.orders.created_at=this.datePipe.transform(new Date(element.orders.created_at),"yyyy/MM/dd @ HH:mm");
            if(element.orders.booking_date != null){
              element.orders.bookingDateForLabel=this.datePipe.transform(new Date(element.orders.booking_date),"yyyy/MM/dd");
            }
            element.orders.bookingTimeForLabel=this.datePipe.transform(element.orders.bookingDateTime,"HH:mm");
            var dateTemp = new Date(this.datePipe.transform(element.orders.bookingDateTime,"yyyy/MM/dd HH:mm"));
            dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.orders.service_time) );
            element.orders.bookingTimeTo=this.datePipe.transform(new Date(dateTemp),"HH:mm");
            let orderItemTempArr=[];
            element.orders.order_items.forEach( (element2) => { 
              if(element.orders.id!=element2.id){
                orderItemTempArr.push(element2);
              }
            });
            element.orders.order_items=orderItemTempArr;
          }
        });

        this.isLoaderAdmin = false;
        this.newCustomer = false;
        this.fullDetailsOfCustomer = true;
        this.customerImageUrl = '';
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.customersDetails = ''
        this.isLoaderAdmin = false;
      }
      let addNewAction = window.location.search.split("?customer")
      if(addNewAction.length > 1 && action != 'not-new'){
        // this.addNewEvents = false; 
        this.fnAddNewCustomer();
      }
    })

  }

  fnDeleteCustomer(customerId){

   
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result){
            this.isLoaderAdmin = true;
            this.adminService.fnDeleteCustomer(customerId).subscribe((response:any) => {
              if(response.data == true){
                this._snackBar.open("Customer Deleted.", "X", {
                  duration: 2000,
                  verticalPosition:'top',
                  panelClass :['green-snackbar']
                });
                this.getAllCustomers();
                this.isLoaderAdmin = false;
              } else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open(response.response, "X", {
                  duration: 2000,
                  verticalPosition: 'top',
                  panelClass : ['red-snackbar']
                });
                // this.allCustomers = ''
              this.isLoaderAdmin = false;
              }
            });
        }
    });

    

  }
  fnTabValue(tab){
    this.tabIndex = tab;
    this.showPaymentForm=false;
    this.showPaymentTable=true;
  }

  fnDeleteNote(noteId,index){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "are you sure to delete this notes?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.isLoaderAdmin = true;
        let requestObject = {
          "note_id" : noteId
        }
        this.adminService.fnDeleteNote(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this._snackBar.open("Note Deleted.", "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['green-snackbar']
            });
            this.customerNotes.splice(index, 1);
          } else if(response.data == false && response.response !== 'api token or userid invaild'){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['green-snackbar']
            });
          }
          this.isLoaderAdmin = false;
        });
      }
    });

  }
  
  editCustomer(customer_id){
    this.existingUserId = customer_id
    this.newCustomer = true;
    this.fullDetailsOfCustomer = false;
    this.isLoaderAdmin = true;
    this.createNewCustomer = this._formBuilder.group({
      cus_fullname : ['', Validators.required],
      cus_email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isCustomerEmailUnique.bind(this)],
      cus_phone : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumericWithCountry)],this.isCustomerPhoneUnique.bind(this)],
      cus_officenumber : ['', [Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      cus_homenumber : ['', [Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      cus_address : ['', Validators.required],
      cus_state : ['', Validators.required],
      cus_city : ['', Validators.required],
      cus_country : ['', Validators.required],
      cus_zip : ['',[Validators.required,Validators.minLength(5),Validators.maxLength(7)]],
      customer_id : ['']
    });
    this.createNewCustomer.controls['customer_id'].setValue(this.existingUserId);
    this.createNewCustomer.controls['cus_fullname'].setValue(this.customerPersonalDetails.fullname);
    this.createNewCustomer.controls['cus_email'].setValue(this.customerPersonalDetails.email);
    this.createNewCustomer.controls['cus_phone'].setValue(this.customerPersonalDetails.phone);
    this.createNewCustomer.controls['cus_officenumber'].setValue(this.customerPersonalDetails.phone_office);
    this.createNewCustomer.controls['cus_homenumber'].setValue(this.customerPersonalDetails.phone_home);
    this.createNewCustomer.controls['cus_address'].setValue(this.customerPersonalDetails.address);
    this.createNewCustomer.controls['cus_state'].setValue(this.customerPersonalDetails.state);
    this.createNewCustomer.controls['cus_city'].setValue(this.customerPersonalDetails.city);
    this.createNewCustomer.controls['cus_zip'].setValue(this.customerPersonalDetails.zip);
    this.isLoaderAdmin = false;
  }

  // email check
  // isEmailUnique(control: FormControl) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       let headers = new HttpHeaders({
  //         'Content-Type': 'application/json',
  //       });
  //       return this.http.post(`${environment.apiUrl}/verify-email`,{ emailid: control.value },{headers:headers}).pipe(map((response : any) =>{
  //         return response;
  //       }),
  //       catchError(this.handleError)).subscribe((res) => {
  //         if(res){
  //           if(res.data == false){
  //           resolve({ isEmailUnique: true });
  //           }else{
  //           resolve(null);
  //           }
  //         }
  //       });
  //     }, 500);
  //   });
  // }
  isCustomerEmailUnique(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          let emailCheckRequestObject = {
            'business_id':this.businessId,
            'email': control.value,
            'phone': null,
            'customer_id':this.existingUserId,
            'checkType':'email', 
          }
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/customer-check`, emailCheckRequestObject,{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isEmailUnique: true });
            }else{
            resolve(null);
            }
          }
        });
      }, 500);
    });
  }
  isCustomerPhoneUnique(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let phoneCheckRequestObject = {
          'business_id':this.businessId,
          'email': null,
          'customer_id':this.existingUserId,
          'phone': control.value,
          'checkType':'phone', 
        }
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/customer-check`, phoneCheckRequestObject,{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isPhoneUnique: true });
            }else{
            resolve(null);
            }
          }
        });
      }, 500);
    });
  }

  // isEmailUniqueForEdit(control: FormControl) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       let headers = new HttpHeaders({
  //         'Content-Type': 'application/json',
  //       });
  //       return this.http.post(`${environment.apiUrl}/check-emailid`,{ emailid: control.value,customer_id:this.existingUserId },{headers:headers}).pipe(map((response : any) =>{
  //         return response;
  //       }),
  //       catchError(this.handleError)).subscribe((res) => {
  //         if(res){
  //           if(res.data == false){
  //           resolve({ isEmailUniqueForEdit: true });
  //           }else{
  //           resolve(null);
  //           }
  //         }
  //       });
  //     }, 500);
  //   });
  // }

  newCustomerAppointment() {
    const dialogRef = this.dialog.open(DialogNewCustomerAppointment, {
      width: '750px',
      data: {customerDetails:this.customerPersonalDetails}
    });

     dialogRef.afterClosed().subscribe(result => {
      if(result && result.data){
        this.fnSelectCustomer(this.customerPersonalDetails.id,'not-new');
      }
     });
  }
  fnCustomerToggleSmall(){
    this.customerSideMenuToggle = true;
  }
  fnCustomerToggleLarge(){
    this.customerSideMenuToggle = false;
  }
  newAddNote(customer_id,index) {
    const dialogRef = this.dialog.open(DialogAddNewNote, {
      width: '500px',
      data:{customer_id : customer_id, fulldata : this.customerNotes[index]}
      
    });
     dialogRef.afterClosed().subscribe(result => {
      
      this.fnSelectCustomer(customer_id,'not-new');
      this.animal = result;
     });
  }

  newPaymentNote() {
    const dialogRef = this.dialog.open(DialogPaymentNote, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      
      this.animal = result;
     });
  }
  
  viewReviewDetail(index, OrderId){
    this.isLoaderAdmin = true;
    this.adminService.viewReviewDetail(OrderId).subscribe((response:any) => {
      if(response.data == true){
        this.reviewOrderData = response.response;
        this.reviewOrderData.forEach( (element) => { 
                  element.booking_date=this.datePipe.transform(new Date(element.booking_date),"yyyy/MM/dd")   
                  element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"HH:mm");
                  element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd @ HH:mm")
                });

         const dialogRef = this.dialog.open(DialogViewReview, {
          width: '500px',
          data :{fulldata : this.customerReviews[index], orderData : this.reviewOrderData, setting: this.settingsArr}
        });

        dialogRef.afterClosed().subscribe(result => {
          
          this.animal = result;
        });
        this.isLoaderAdmin = false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.isLoaderAdmin = false;
      }
    })
   
  }
  fnAddCustomerId(event, customerId){
    if(event == true){
      this.selectedCustomerId.push(customerId);
    }else if(event == false){
      const index = this.selectedCustomerId.indexOf(customerId, 0);
      if (index > -1) {
          this.selectedCustomerId.splice(index, 1);
      }
    }
  }

  fnExportCustomer(exportType){
    this.exportType = exportType
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: false,
      // title: 'Exported Customer Data',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    const csvExporter = new ExportToCsv(options);
    if(exportType == 'all'){
      this.isLoaderAdmin = true;
      this.adminService.fnExportCustomer(this.allcustomerIds).subscribe((response:any) => {
        if(response.data == true){
          this.selectedCustomerArr = response.response
          this.exportType = null;
          csvExporter.generateCsv(this.selectedCustomerArr);
          this.selectedCustomerId.length = 0;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        this.isLoaderAdmin = false;
      })
      this.exportType = null;
    }else if(exportType == 'selected'){
      this.isLoaderAdmin = true;
      this.adminService.fnExportCustomer(this.selectedCustomerId).subscribe((response:any) => {
        if(response.data == true){
          this.selectedCustomerArr = response.response
          this.exportType = null;
          csvExporter.generateCsv(this.selectedCustomerArr);
          this.selectedCustomerId.length = 0;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
          this.isLoaderAdmin = false;
      })
    }
  }
  fnMultiDeleteCustomer(action){

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width:'400px',
      data: 'Are you sure you want to delete?'
    })

    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        let requestObject = {
          "action" : action,
          "customer_id" : this.selectedCustomerId
        }
        this.adminService.fnMultiDeleteCustomer(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['green-snackbar']
            });
            this.selectedCustomerId.length = 0;
            this.getAllCustomers();
            this.isLoaderAdmin = false;
          }
          else if(response.data == false && response.response !== 'api token or userid invaild'){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['green-snackbar']
              
            });
            this.isLoaderAdmin = false;
          }
        });
        
      }
      this.actionForm.reset();
    })

   
  }

  customerImage() {
    const dialogRef = this.dialog.open(DialogCustomerImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.customerImageUrl = result;
           }
     });
  }

  ImportFileUpload() {
    const dialogRef = this.dialog.open(DialogImportFileUpload, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
       this.getAllCustomers();
     });
  }

  fnCustomerAppointmentDetails(index){

    const dialogRef = this.dialog.open(CustomerAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.customerAppoint[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.fnSelectCustomer(this.customerDetailId,'not-new');
     
      });

  }
  fnShowPaymentForm(index,amount,discount){
    this.customerPaymentIndex=index;
    this.serviceMainArr.order_item_id=this.customerPayments[index].orders.id;
    this.serviceMainArr.customer_id=this.customerPayments[index].customer_id;
    this.serviceMainArr.bookingDateForLabel=this.customerPayments[index].orders.bookingDateForLabel;
    this.serviceMainArr.bookingTimeForLabel=this.customerPayments[index].orders.bookingTimeForLabel;
    this.serviceMainArr.bookingTimeTo=this.customerPayments[index].orders.bookingTimeTo;
    this.serviceMainArr.created_at=this.customerPayments[index].orders.created_at;
    this.serviceMainArr.service_time=this.customerPayments[index].orders.service_time;
    this.serviceMainArr.service_name=this.customerPayments[index].service.service_name;
    this.serviceMainArr.category_title=this.customerPayments[index].service.category.category_title;
    this.serviceMainArr.order_by=this.customerPayments[index].orders.order_by;
    this.serviceMainArr.order_status=this.customerPayments[index].orders.order_status; 
    this.serviceMainArr.customer_email=this.customerPayments[index].get_customer.email; 
    if(this.customerPayments[index].orders.staff){
      this.serviceMainArr.staff_name=this.customerPayments[index].orders.staff.firstname+" "+this.customerPayments[index].orders.staff.lastname;
    }else{
      this.serviceMainArr.staff_name='';
    }
    
    this.serviceMainArr.service_cost=parseFloat(this.customerPayments[index].orders.service_cost);
    this.serviceMainArr.service_qty=parseFloat(this.customerPayments[index].orders.service_qty);
    this.serviceMainArr.subtotal=parseFloat(this.customerPayments[index].orders.subtotal);
    this.taxAmountArr.length=0;
    this.serviceMainArr.discount_type=this.customerPayments[index].orders.discount_type;
    if(this.customerPayments[index].orders.discount_value!=null && this.customerPayments[index].orders.discount_value !="null"){
      this.serviceMainArr.discount_value=parseFloat(this.customerPayments[index].orders.discount_value);
    }else{
      this.serviceMainArr.discount_value=this.customerPayments[index].orders.discount_value;
    }
    
    this.serviceMainArr.discount=parseFloat(this.customerPayments[index].orders.discount);
    this.taxAmountArr=JSON.parse(this.customerPayments[index].orders.tax);
    this.serviceMainArr.netCost=parseFloat(this.customerPayments[index].orders.total_cost);
    this.taxArr=JSON.parse(this.customerPayments[index].orders.tax);
    
    this.formPayment = this._formBuilder.group({
      paymentAmount : [null, [Validators.required,Validators.pattern(this.onlynumericAmount),Validators.min(this.serviceMainArr.subtotal)]],
      paymentDiscount : [null, [Validators.required,Validators.pattern(this.onlynumericAmount)]],
      paymentMode : ['Cash', [Validators.required]],
      paymentNote : ['', [Validators.required]],
    });
    this.formPayment.controls['paymentAmount'].setValue(this.serviceMainArr.netCost);
    this.formPayment.controls['paymentDiscount'].setValue(this.serviceMainArr.discount);
    this.serviceMainArr.order_id=this.customerPayments[index].orders.order_id;
    this.serviceMainArr.order_subtotal=parseFloat(this.customerPayments[index].orders.orders_info.sub_total);
    this.serviceMainArr.order_discount_type=this.customerPayments[index].orders.orders_info.discount_type;
    
    if(this.customerPayments[index].orders.orders_info.discount_value!=null && this.customerPayments[index].orders.orders_info.discount_value !="null"){
      this.serviceMainArr.order_discount_value=parseFloat(this.customerPayments[index].orders.orders_info.discount_value);
    }else{
      this.serviceMainArr.order_discount_value=this.customerPayments[index].orders.orders_info.discount_value;
    }

    this.serviceMainArr.order_discount=parseFloat(this.customerPayments[index].orders.orders_info.discount_amount);
    this.order_taxAmountArr=JSON.parse(this.customerPayments[index].orders.orders_info.tax)
    this.serviceMainArr.order_netCost=parseFloat(this.customerPayments[index].orders.orders_info.grand_total);
    this.serviceMainArr.paymentId=this.customerPayments[index].id;
    this.showPaymentForm=true;
    this.showPaymentTable=false;
  }

  fnOnChangeDiscount(event){
 
    this.serviceMainArr.subtotal=parseFloat(this.formPayment.get('paymentAmount').value);
    this.taxAmountArr.length=0;
    this.serviceMainArr.discount_type=this.serviceMainArr.discount_type;
    this.serviceMainArr.discount_value=this.serviceMainArr.discount_value;
    this.serviceMainArr.discount=parseFloat(event.target.value);

    if(this.serviceMainArr.subtotal < event.target.value || this.serviceMainArr.subtotal == event.target.value){
      return false;
    }

    var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
    var amountAfterTax=0;
    this.taxArr.forEach(element=>{
      let taxTemp={
        value:0,
        name:'',
        amount:0
      }
      if(this.taxType == "P"){
       taxTemp.value= element.value;
       taxTemp.name= element.name;
       taxTemp.amount= amountAfterDiscount * element.value/100;
        amountAfterTax=amountAfterTax+taxTemp.amount;
      }else{
        taxTemp.value= element.value;
        taxTemp.name= element.name;
        taxTemp.amount=  element.value;
        amountAfterTax=amountAfterTax+taxTemp.amount;
      }
      this.taxAmountArr.push(taxTemp);
    });
    this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
  }

  fnOnChangeAmount(event){
    this.serviceMainArr.subtotal=parseFloat(event.target.value);
    this.serviceMainArr.service_cost=parseFloat((this.serviceMainArr.subtotal/this.serviceMainArr.service_qty).toFixed(2)) ;
    this.taxAmountArr.length=0;
    this.serviceMainArr.discount_type=this.serviceMainArr.discount_type;
    this.serviceMainArr.discount_value=this.serviceMainArr.discount_value;
    this.serviceMainArr.discount=parseFloat(this.formPayment.get('paymentDiscount').value);

    var amountAfterDiscount=this.serviceMainArr.subtotal - this.serviceMainArr.discount;
    var amountAfterTax=0;
    this.taxArr.forEach(element=>{
      let taxTemp={
        value:0,
        name:'',
        amount:0
      }
      if(this.taxType == "P"){
       taxTemp.value= element.value;
       taxTemp.name= element.name;
       taxTemp.amount= amountAfterDiscount * element.value/100;
        amountAfterTax=amountAfterTax+taxTemp.amount;
      }else{
        taxTemp.value= element.value;
        taxTemp.name= element.name;
        taxTemp.amount=  element.value;
        amountAfterTax=amountAfterTax+taxTemp.amount;
      }
      this.taxAmountArr.push(taxTemp);
    });
    this.serviceMainArr.netCost=amountAfterDiscount+amountAfterTax;
  }

  fnShowPaymentTable(){
    this.showPaymentForm=false;
    this.showPaymentTable=true;
  }

  fnSubmitPaymentForm(){
    if(this.paymentMethod == "Cash"){
      setTimeout(() => this.fnPaymentFormSubmit() , 500);
    }else if (this.paymentMethod == "Stripe"){
      setTimeout(() => this.fnPaymentFormSubmitOnline() , 500);
    }
  }
  changePaymentMethod(paymentMethod){
    this.paymentMethod = paymentMethod
  }
  fnPaymentFormSubmit(){
    if(!this.formPayment.valid){
      this.formPayment.get('paymentAmount').markAsTouched();
      this.formPayment.get('paymentDiscount').markAsTouched();
      this.formPayment.get('paymentMode').markAsTouched();
      this.formPayment.get('paymentNote').markAsTouched();
      return;
    }

    if(this.serviceMainArr.discount!=parseFloat(this.customerPayments[this.customerPaymentIndex].orders.discount)){
      this.serviceMainArr.discount_type="C";
      this.serviceMainArr.order_discount_type="C";
    }
      let orderSubtotal=0;
      let orderDiscount=0;
      let orderTax=[];
      let orderTotalCost=0;
      
      orderSubtotal=this.serviceMainArr.subtotal;
      orderDiscount=this.serviceMainArr.discount;
      this.taxAmountArr.forEach(element=>{
        let taxTemp={
          value:0,
          name:'',
          amount:0
        }
         taxTemp.value= element.value;
         taxTemp.name= element.name;
         taxTemp.amount= element.amount;
        orderTax.push(taxTemp);
      });
      orderTotalCost=this.serviceMainArr.netCost;
      this.customerPayments[this.customerPaymentIndex].orders.order_items.forEach(element=>{
        orderSubtotal=orderSubtotal+parseFloat(element.subtotal)
        orderDiscount=orderDiscount+parseFloat(element.discount)
        let orderItemTaxArr=JSON.parse(element.tax);
        for(let i=0; i<orderItemTaxArr.length; i++){
          orderTax[i].amount=orderTax[i].amount + orderItemTaxArr[i].amount
        };
        orderTotalCost=orderTotalCost+parseFloat(element.total_cost)
      });
      this.serviceMainArr.order_subtotal=orderSubtotal;
      this.serviceMainArr.order_discount=orderDiscount;
      this.order_taxAmountArr=orderTax;
      this.serviceMainArr.order_netCost=orderTotalCost;
   
    let paymentArr=[{
      "id":this.serviceMainArr.paymentId,
      "payment_mode":this.formPayment.get('paymentMode').value,
      "payment_date":this.datePipe.transform(new Date(),"yyyy/MM/dd HH:mm"),
      "amount":this.serviceMainArr.netCost,
      "payment_status":"paid",
      "payment_notes":this.formPayment.get('paymentNote').value
    }]
    let orderArr=[{
      "id":this.serviceMainArr.order_id,
      "subtotal":this.serviceMainArr.order_subtotal,
      "discount_type":this.serviceMainArr.order_discount_type,
      "discount_value":this.serviceMainArr.order_discount_value,
      "discount":this.serviceMainArr.order_discount,
      "tax":this.order_taxAmountArr,
      "net_cost":this.serviceMainArr.order_netCost,
      "payment_type":this.formPayment.get('paymentMode').value
    }]
    let orderItemArr=[{
      "id":this.serviceMainArr.order_item_id,
      "service_cost":this.serviceMainArr.service_cost,
      "subtotal":this.serviceMainArr.subtotal,
      "discount_type":this.serviceMainArr.discount_type,
      "discount_value":this.serviceMainArr.discount_value,
      "discount":this.serviceMainArr.discount,
      "tax":this.taxAmountArr,
      "total_cost":this.serviceMainArr.netCost
    }]
    let requestObject={
      "payment":paymentArr,
      "order":orderArr,
      "orderItem":orderItemArr
    }
    this.adminService.updatePaymentInfoAndStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
       this._snackBar.open("Payment Info Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
       this.fnSelectCustomer(this.serviceMainArr.customer_id,'not-new');
       this.formPayment.reset();
       //this.formPayment.controls['paymentMode'].setValue('Cash');
       this.fnShowPaymentTable();
      }else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
      },
      (err) =>{
      })
  }
  fnPaymentFormSubmitOnline(){
    if(!this.formPayment.valid){
      this.formPayment.get('paymentAmount').markAsTouched();
      this.formPayment.get('paymentDiscount').markAsTouched();
      this.formPayment.get('paymentMode').markAsTouched();
      this.formPayment.get('paymentNote').markAsTouched();
      return;
    }

    if(this.serviceMainArr.discount!=parseFloat(this.customerPayments[this.customerPaymentIndex].orders.discount)){
      this.serviceMainArr.discount_type="C";
      this.serviceMainArr.order_discount_type="C";
    }
      let orderSubtotal=0;
      let orderDiscount=0;
      let orderTax=[];
      let orderTotalCost=0;
      
      orderSubtotal=this.serviceMainArr.subtotal;
      orderDiscount=this.serviceMainArr.discount;
      this.taxAmountArr.forEach(element=>{
        let taxTemp={
          value:0,
          name:'',
          amount:0
        }
         taxTemp.value= element.value;
         taxTemp.name= element.name;
         taxTemp.amount= element.amount;
        orderTax.push(taxTemp);
      });
      orderTotalCost=this.serviceMainArr.netCost;
      this.customerPayments[this.customerPaymentIndex].orders.order_items.forEach(element=>{
        orderSubtotal=orderSubtotal+parseFloat(element.subtotal)
        orderDiscount=orderDiscount+parseFloat(element.discount)
        let orderItemTaxArr=JSON.parse(element.tax);
        for(let i=0; i<orderItemTaxArr.length; i++){
          orderTax[i].amount=orderTax[i].amount + orderItemTaxArr[i].amount
        };
        orderTotalCost=orderTotalCost+parseFloat(element.total_cost)
      });
      this.serviceMainArr.order_subtotal=orderSubtotal;
      this.serviceMainArr.order_discount=orderDiscount;
      this.order_taxAmountArr=orderTax;
      this.serviceMainArr.order_netCost=orderTotalCost;
   
      let orders = [{
        "tax" : this.order_taxAmountArr,
        "discount_type":this.serviceMainArr.order_discount_type,
        "discount_value":this.serviceMainArr.order_discount_value,
        "discount" : this.serviceMainArr.order_discount,
        "nettotal" : this.serviceMainArr.order_netCost
      }]
      let orderItems  = [{
        "tax" : this.order_taxAmountArr,
        "discount_type":this.serviceMainArr.order_discount_type,
        "discount_value":this.serviceMainArr.order_discount_value,
        "discount" : this.serviceMainArr.order_discount,
        "nettotal" : this.serviceMainArr.order_netCost
      }]
      let payment  = [{
        "payment_datetime" : this.datePipe.transform(new Date(),"yyyy/MM/dd HH:mm"),
        "payment_mode" : this.paymentMethod,
        "amount" : this.serviceMainArr.order_netCost,
        "paymentnotes" : this.formPayment.get('paymentNote').value,
      }] 
    let requestObject={
      "payment":payment,
      "order_item_id": this.serviceMainArr.order_item_id,
      "orders":orders,
      "orderItem":orderItems,
      "email" : this.serviceMainArr.customer_email,
      //"email" : "bikalpitbhadani@gmail.com",
      "URL": environment.bookpageLink+'/online-payment?order-item='+this.serviceMainArr.order_item_id
    }
    this.adminService.onlinePayment(requestObject).subscribe((response:any) => {
      if(response.data == true){
       this._snackBar.open("Payment Link Sent.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
       this.fnSelectCustomer(this.serviceMainArr.customer_id, 'not-new');
       this.formPayment.reset();
       //this.formPayment.controls['paymentMode'].setValue('Cash');
       this.fnShowPaymentTable();
      }else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
      },
      (err) =>{
        console.log(err)
      })
  }

  invoice(index) {
    
    const dialogRef = this.dialog.open(DialogInvoiceDialog, {
      width: '1000px',
      height: 'auto',
      data: {fulldata: this.customerPayments[index],setting: this.settingsArr}

    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }
  
  customerSearch(event){
    this.isLoaderAdmin=true;
    if(this.search.keyword.length > 1){
      let requestObject = {
        "search":this.search.keyword,
        "business_id":this.businessId,
      }
      this.adminService.customerSearch(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this.allCustomers = response.response;
          this.allCustomers.forEach( (element) => {
            var splitted = element.fullname.split(" ",2);
            element.initials='';
            splitted.forEach( (element2) => {
              element.initials=element.initials+element2.charAt(0);
            });
          });
          this.fnSelectCustomer(this.allCustomers[0].id,'not-new');
          this.isLoaderAdmin=false;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
          this.allCustomers = [];
          this.isLoaderAdmin=false;
        }
      })
    }else{
      this.getAllCustomers();
      this.isLoaderAdmin=false;
    }
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

  protected filterState (){
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

  protected filterCity (){
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

@Component({
  selector: 'customer-appointment-details-dialog',
  templateUrl: '../_dialogs/admin-appointment-detail.html',
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    DatePipe
  ]
})
export class CustomerAppointmentDetailsDialog {
  detailsData: any;
  activityLog: any=[];
  businessId:any;
  settingsArr:any;
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  cancellationBufferTime:any;
  minReschedulingTime:any;
  formSettingPage:boolean = false;
  
  taxTotal : any = 0;
  singleBookingTax:any;
  initials:any;
  customerShortName:any;
  availableStaff: any=[];
  singlenote:any;
  currentUser : any;
  singleBookingNotes:any;
constructor(
  public dialog: MatDialog,
  public dialogRef: MatDialogRef<CustomerAppointmentDetailsDialog>,
  private adminService: AdminService,
  private _formBuilder:FormBuilder,
  private _snackBar: MatSnackBar,
  private http: HttpClient,
  private authenticationService : AuthenticationService,
  private datePipe: DatePipe,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.detailsData =  this.data.fulldata;
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.fnGetActivityLog(this.detailsData.id);
    this.fnGetBookingNotes(this.detailsData.id);
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
    this.fnGetSettingValue();

    this.fnGetStaff(this.detailsData.booking_date,this.detailsData.booking_time,this.detailsData.service_id,this.detailsData.postal_code);
    var todayDateTime = new Date();
    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var dateTemp = new Date(this.datePipe.transform(this.detailsData.booking_date_time,"yyyy/MM/dd HH:mm"));
    dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(this.detailsData.service_time) );
    var temp = dateTemp.getTime() - todayDateTime.getTime();
    this.detailsData.timeToService=(temp/3600000).toFixed();
    this.detailsData.booking_timeForLabel=this.datePipe.transform(this.detailsData.booking_date_time,"HH:mm")
    this.detailsData.booking_time_to=this.datePipe.transform(new Date(dateTemp),"HH:mm")
    this.detailsData.booking_dateForLabel=this.datePipe.transform(new Date(this.detailsData.booking_date),"yyyy/MM/dd")
    this.detailsData.created_atForLabel=this.datePipe.transform(new Date(this.detailsData.created_at),"yyyy/MM/dd @ HH:mm")
    if(this.detailsData.tax != null){
      this.singleBookingTax = JSON.parse(this.detailsData.tax)
      this.singleBookingTax.forEach( (element) => {
        this.taxTotal = this.taxTotal + element.amount;
      });
    }
    this.initials = this.detailsData.customer.fullname.split(" ",2);
    this.customerShortName = '';
    this.initials.forEach( (element2) => {
      this.customerShortName = this.customerShortName+element2.charAt(0);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fnGetBookingNotes(bookingId){
    let requestObject = {
      "order_item_id":bookingId
    };
    this.adminService.getBookingNotes(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.singleBookingNotes = response.response;
       
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition:'top',
        //   panelClass :['red-snackbar']
        // });
      }
    })
  }

  fnSaveBookingNotes(orderItemId){
      
    if(this.singlenote == undefined || this.singlenote == ""){
      return false;
    }
    let requestObject = {
      "order_item_id":orderItemId,
      "user_id": this.currentUser.user_id,
      "user_type": 'A',
      "note_type": 'normal',
      "notes":this.singlenote
    };
    this.adminService.saveBookingNotes(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Booking note added successfully.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.formSettingPage = false;
        this.singlenote = null;
        this.fnGetBookingNotes(this.detailsData.id);
      } else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    })
  }

  fnGetActivityLog(orderItemId){
  // this.appointmentDetails.bookingNotes = this.detailsData.booking_notes;

    let requestObject = {
      "order_item_id":orderItemId
    };
    this.adminService.getActivityLog(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.activityLog=response.response;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.activityLog=[];
      }
    })
  }

  fnGetSettingValue(){
    let requestObject = {
      "business_id":this.businessId
    };
    this.adminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true && response.response != ''){
        this.settingsArr=response.response;
        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;
        let cancellation_buffer_time=JSON.parse(this.settingsArr.cancellation_buffer_time);
        let min_rescheduling_time=JSON.parse(this.settingsArr.min_reseduling_time);
        this.cancellationBufferTime = new Date();
        this.cancellationBufferTime.setMinutes( this.cancellationBufferTime.getMinutes() + cancellation_buffer_time);
        this.minReschedulingTime = new Date();
        this.minReschedulingTime.setMinutes( this.minReschedulingTime.getMinutes() + min_rescheduling_time);
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnConfirmAppointment(){
    let requestObject = {
    "order_item_id":JSON.stringify(this.detailsData.id),
    "status":"CNF"
    };
    this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
          this.dialogRef.close();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
  }

  
  fnWorkStarting(){

    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"WS"
    };

    this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Started.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.dialogRef.close();
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    });

  }

  fnGetStaff(booking_date,booking_time,serviceId,postal_code){
    let requestObject = {
      "postal_code":postal_code,
      "business_id":this.detailsData.business_id,
      "customer_id":this.detailsData.customer.id,
      "service_id":JSON.stringify(serviceId),
      "book_date":this.datePipe.transform(new Date(booking_date),"yyyy-MM-dd"),
      "book_time":booking_time
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
    map((res) => {
      return res;
    }),
    //catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.availableStaff = response.response;
      }
      else{
        this.availableStaff.length=0;
      }
    },
    (err) =>{
      console.log(err)
    })
  }
  fnOnClickStaff(event){
    let requestObject = {
      "order_item_id":this.detailsData.id,
      "staff_id":event.value
      };
    this.adminService.assignStaffToOrder(requestObject).subscribe((response:any) => 
    {
      if(response.data == true){
          this._snackBar.open("Staff Assigned.", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
            });
          this.dialogRef.close();
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
    },
    (err) => {
      // this.error = err;
    })
  }

  fnCancelAppointment(){
    let requestObject = {
    "order_item_id":JSON.stringify(this.detailsData.id),
    "status":"C"
    };
    this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
          });
          this.dialogRef.close();
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
          });
      }
    })
  }
  
  fnRescheduleAppointment (){
    const dialogRef = this.dialog.open(InterruptedReschedulecustomer, {
      height: '700px',
      data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      //this.fnGetAllAppointmentsByCategoryAndStatus();
    });
  }

}




@Component({
  selector: 'interrupted-reschedule-dialog',
  templateUrl: '../_dialogs/reschedule-appointment-dialog.html',
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    DatePipe
  ]
})
export class InterruptedReschedulecustomer {
  formAppointmentRescheduleAdmin:FormGroup;
  detailsData:any;
  businessId:any;
  selectedDate:any;
  selectedTimeSlot:any;
  selectedStaff:any;
  minDate = new Date(2000, 0, 1);
  timeSlotArr:any= [];
  availableStaff:any= [];
  isLoaderAdmin:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<InterruptedReschedulecustomer>,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private adminService: AdminService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.businessId=localStorage.getItem('business_id');
      this.detailsData=this.data.appointmentDetails;
      this.formAppointmentRescheduleAdmin = this._formBuilder.group({
        rescheduleDate: ['', Validators.required],
        rescheduleTime: ['', Validators.required],
        rescheduleStaff: ['', Validators.required],
        rescheduleNote: ['', Validators.required],
      });
  }

  
  fnDateChange(event:MatDatepickerInputEvent<Date>) {
      let date = this.datePipe.transform(new Date(event.value),"yyyy/MM/dd")
      this.formAppointmentRescheduleAdmin.controls['rescheduleTime'].setValue(null);
      this.formAppointmentRescheduleAdmin.controls['rescheduleStaff'].setValue(null);
      this.timeSlotArr= [];
      this.availableStaff= [];
      this.selectedDate=date;
      this.fnGetTimeSlots(date);
    }

  fnGetTimeSlots(selectedDate){
    let requestObject = {
      "business_id":this.businessId,
      "selected_date":selectedDate,
      "service_id":JSON.stringify(this.detailsData.service_id),
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.isLoaderAdmin = true;
    this.http.post(`${environment.apiUrl}/list-availabel-timings`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
     // catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          this.timeSlotArr=response.response;
        }
        else{
        }
        this.isLoaderAdmin = false;
      },
      (err) =>{
        console.log(err)
      })
  }
   
  fnChangeTimeSlot(selectedTimeSlot){
    this.formAppointmentRescheduleAdmin.controls['rescheduleStaff'].setValue(null);
    this.selectedTimeSlot=selectedTimeSlot;
    this.fnGetStaff(selectedTimeSlot);
  }

  fnGetStaff(selectedTimeSlot){

    let requestObject = {
      "postal_code":this.detailsData.postal_code,
      "business_id":this.businessId,
      "customer_id":this.detailsData.customer.id,
      "service_id":JSON.stringify(this.detailsData.service_id),
      "book_date":this.selectedDate,
      "book_time":this.selectedTimeSlot
    };
  
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.isLoaderAdmin = true;
    this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
    ).subscribe((response:any) => {
      if(response.data == true){
          this.availableStaff = response.response;
      } else{
        this.availableStaff.length=0;
      }
      this.isLoaderAdmin = false;
    },(err) =>{
      console.log(err)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

formRescheduleSubmit(){
  if(this.formAppointmentRescheduleAdmin.valid){
    let requestObject = {
      "order_item_id":JSON.stringify(this.detailsData.id),
      "staff_id":this.formAppointmentRescheduleAdmin.get('rescheduleStaff').value,
      "book_date":this.datePipe.transform(new Date(this.formAppointmentRescheduleAdmin.get('rescheduleDate').value),"yyyy-MM-dd"),
      "book_time":this.formAppointmentRescheduleAdmin.get('rescheduleTime').value,
      "book_notes":this.formAppointmentRescheduleAdmin.get('rescheduleNote').value
     };
     this.isLoaderAdmin = true;
     this.adminService.rescheduleAppointment(requestObject).subscribe((response:any) =>{
       if(response.data == true){
         this._snackBar.open("Appointment Rescheduled.", "X", {
           duration: 2000,
           verticalPosition:'top',
           panelClass :['green-snackbar']
           });
           this.dialogRef.close();
      }
       else if(response.data == false && response.response !== 'api token or userid invaild'){
         this._snackBar.open(response.response, "X", {
           duration: 2000,
           verticalPosition:'top',
           panelClass :['red-snackbar']
           });
       }
       this.isLoaderAdmin = false;
     })
  }else{
    this.formAppointmentRescheduleAdmin.get('rescheduleStaff').markAllAsTouched();
    this.formAppointmentRescheduleAdmin.get('rescheduleDate').markAllAsTouched();
    this.formAppointmentRescheduleAdmin.get('rescheduleTime').markAllAsTouched();
    this.formAppointmentRescheduleAdmin.get('rescheduleNote').markAllAsTouched();
  }

  
}

}

@Component({
  selector: 'import-file-upload',
  templateUrl: '../_dialogs/import-file-upload.html',
})
export class DialogImportFileUpload {

fileToUpload:any;
isLoaderAdmin : boolean = false;

constructor(
  public dialogRef: MatDialogRef<DialogImportFileUpload>,
  public http: HttpClient,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }

  handleFileInput(files): void {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
    if(this.fileToUpload.type != "application/vnd.ms-excel" && this.fileToUpload.type != "text/csv"){
      this._snackBar.open("Please select CSV file", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
      return;
    }
    


  }

  fileupload(){
    console.log(this.fileToUpload);
    
    if(this.fileToUpload.type != "application/vnd.ms-excel" && this.fileToUpload.type != "text/csv"){

      this._snackBar.open("Please select CSV file", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
      return;

    }


    this.isLoaderAdmin = true;
    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload);
    formData.append('business_id',JSON.parse(localStorage.getItem('business_id')));

    this.http.post(`${environment.apiUrl}/customer-import`,formData ).pipe(map((response : any) =>{
      if(response.data  == true){
        this._snackBar.open("CSV file is uploaded", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.dialogRef.close();
      }else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
    }),catchError(this.handleError)).subscribe((res) => {
    });  

    this.isLoaderAdmin = false;
  }

}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/new-appointment.html',
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    DatePipe
  ]
})
export class DialogNewCustomerAppointment {
customerDetails:any=[];
formAddNewAppointmentStaffStep2:FormGroup;
secondStep:boolean = false;
adminId:any;
token:any;
bussinessId:any;
catdata :any= [];
subcatdata :any= [];
serviceData:any= [];
selectedCatId:any;
selectedSubCatId:any;
selectedServiceId:any;
currencySymbol:any;
currencySymbolPosition:any;
currencySymbolFormat:any;  
discount_amount:number= 0;
discount_type:any;
appointmentSubTotal:number= 0;
appointmentAmountAfterDiscount:number= 0;
minDate = new Date();
maxDate = new Date();
timeSlotArr:any= [];
timeSlotArrForLabel:any= [];
serviceCount:any= [];
selectedDate:any;
selectedTime:any;
selectedStaffId:any;
availableStaff:any=[];  
isStaffAvailable:boolean=false;
taxType:any="P";
taxValue:any;
netCost:any;
taxAmount:any;
taxArr:any=[];
taxAmountArr:any=[];
myFilter:any;
offDaysList:any=[];
workingHoursOffDaysList:any=[];
settingsArr:any=[];
minimumAdvanceBookingTime:any;
maximumAdvanceBookingTime:any;
minimumAdvanceBookingDateTimeObject:any;
maximumAdvanceBookingDateTimeObject:any;
appointmentData={
  business_id:'',
  order_item_id:'',
  order_id:'',
  customer_id:'',
  fullName:'',
  email:'',
  phone:'',
  address:'',
  city:'',
  state:'',
  zip:'',
  category_id:'',
  sub_category_id:'',
  service_id:'',
  booking_date:new Date(),
  booking_time:'',
  staff:'',
}
validationArr:any=[];
disablePostalCode:boolean=false;
disableCategory:boolean=false;
disableSubCategory:boolean=false;
disableService:boolean=false;
dialogTitle:any="New Appointment";
showSubCatDropDown=true;
valide_postal_code:boolean =false;
isLoaderAdmin:boolean =false;
selectedCustomerId :any;
Postalcode:any;

constructor(
  private _formBuilder: FormBuilder,
  public dialogRef: MatDialogRef<DialogNewCustomerAppointment>,
  private adminService: AdminService,
  private datePipe: DatePipe,
  private http: HttpClient,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
  this.customerDetails=this.data.customerDetails;

    this.formAddNewAppointmentStaffStep2 = this._formBuilder.group({
        customerPostalCode: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(7)],this.isPostalcodeValid.bind(this)],
        customerCategory: ['', Validators.required],
        customerSubCategory: ['', [Validators.required]],
        customerService: ['', [Validators.required]],
        customerCouponCode: [''],
        customerDate: ['', Validators.required],
        customerTime: ['', Validators.required],
        customerStaff:['',Validators.required],
        customerAppoAddress: ['', Validators.required],
        customerAppoState: ['', Validators.required],
        customerAppoCity: ['', Validators.required],
    });

    this.bussinessId=JSON.parse(localStorage.getItem('business_id'));
    this.adminId=(JSON.parse(localStorage.getItem('currentUser'))).user_id;
    this.token=(JSON.parse(localStorage.getItem('currentUser'))).token;

    this.fnIsPostalCodeAdded();
    this.fnGetSettingValue();
    this.fnGetTaxDetails();
    this.fnGetOffDays();
    this.fnGetCategories();
    this.getPostalCodeList();

    this.myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // const month = (d || new Date()).getMonth();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    let temp:any;
    let temp2:any;
    if(this.offDaysList.length>0 || this.workingHoursOffDaysList.length>0){
      for(var i=0; i<this.offDaysList.length; i++){
        var offDay = new Date(this.offDaysList[i]);
        if(i==0){
         temp=(d.getMonth()+1!==offDay.getMonth()+1 || d.getDate()!==offDay.getDate());
        }else{
          temp=temp && (d.getMonth()+1!==offDay.getMonth()+1 || d.getDate()!==offDay.getDate());
        }
      }
      for(var i=0; i<this.workingHoursOffDaysList.length; i++){
          // temp=temp && (d.getDay() !== this.workingHoursOffDaysList[i]);
          if(this.offDaysList.length>0){
            temp=temp && (d.getDay() !== this.workingHoursOffDaysList[i]);
          }else{
            temp=(d.getDay() !== this.workingHoursOffDaysList[i]);
          }
      }
      //return (d.getMonth()+1!==4 || d.getDate()!==30) && (d.getMonth()+1!==5 || d.getDate()!==15);
      return temp;
      }else{
      return true;
      }
    }
  }

  sameAddress(values:any){
    
    var customerAddress = this.customerDetails.address;
    var customerState = this.customerDetails.state;
    var customerCity = this.customerDetails.city;
    var customerPostalCode = this.customerDetails.zip;

    var is_checked = values.checked;

    this.formAddNewAppointmentStaffStep2.controls.customerAppoAddress.setValue(is_checked?customerAddress:'');
    this.formAddNewAppointmentStaffStep2.controls.customerAppoState.setValue(is_checked?customerState:'');
    this.formAddNewAppointmentStaffStep2.controls.customerAppoCity.setValue(is_checked?customerCity:'');
    this.formAddNewAppointmentStaffStep2.controls.customerPostalCode.setValue(is_checked?customerPostalCode:'');


  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
    //return error.error ? error.error : error.statusText;
  }

  isPostalcodeValid(control: FormControl) {
    return new Promise((resolve, reject) => {
      
      if(this.Postalcode.length==0){
        this.valide_postal_code = true;
        resolve(null);
        return true;
      }

      setTimeout(() => {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/postalcode-check`,{ business_id: this.bussinessId,postal_code:control.value },{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
              this._snackBar.open(res.response, "X", {
                duration: 2000,
                verticalPosition: 'top',
                panelClass : ['red-snackbar']
                });
                this.formAddNewAppointmentStaffStep2.get('customerPostalCode').markAsTouched();
              this.valide_postal_code = false;
            resolve({ isPostalcodeValid: true });
            }else{
              this.valide_postal_code = true;
              this._snackBar.open(res.response, "X", {
                duration: 2000,
                verticalPosition: 'top',
                panelClass : ['green-snackbar']
                });
              resolve(null);
            }
          }
        });
      }, 500);
    });
  }

  getPostalCodeList() {
    let requestObject = {
      'business_id': this.bussinessId,
    };
    this.adminService.getPostalCodeList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        let postal = response.response
        this.Postalcode = postal;
      } else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.Postalcode = [];
      }
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  fnIsPostalCodeAdded(){
    let requestObject = {
      "business_id" : this.bussinessId
      };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/postal-code-enable-check`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.formAddNewAppointmentStaffStep2 = this._formBuilder.group({
            customerPostalCode: ['', [Validators.required,Validators.minLength(5)],this.isPostalcodeValid.bind(this)],
            customerCategory: ['', Validators.required],
            customerSubCategory: ['', [Validators.required]],
            customerService: ['', [Validators.required]],
            customerCouponCode: [''],
            customerDate: ['', Validators.required],
            customerTime: ['', Validators.required],
            customerStaff:['',Validators.required],
            customerAppoAddress: ['', Validators.required],
            customerAppoState: ['', Validators.required],
            customerAppoCity: ['', Validators.required],
        });
      }else{
        this.formAddNewAppointmentStaffStep2 = this._formBuilder.group({
            customerPostalCode: ['', [Validators.required,Validators.minLength(5)],this.isPostalcodeValid.bind(this)],
            customerCategory: ['', Validators.required],
            customerSubCategory: ['', [Validators.required]],
            customerService: ['', [Validators.required]],
            customerCouponCode: [''],
            customerDate: ['', Validators.required],
            customerTime: ['', Validators.required],
            customerStaff:['',Validators.required],
            customerAppoAddress: ['', Validators.required],
            customerAppoState: ['', Validators.required],
            customerAppoCity: ['', Validators.required],
        });
      }
      },
      (err) =>{
        console.log(err)
      })
  }

  fnGetSettingValue(){
    let requestObject = {
      "business_id":this.bussinessId
    };
    this.adminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true && response.response){
        this.settingsArr=response.response;
        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;
        this.minimumAdvanceBookingTime=JSON.parse(this.settingsArr.min_advance_booking_time);
        this.maximumAdvanceBookingTime=JSON.parse(this.settingsArr.max_advance_booking_time);
        
        this.minimumAdvanceBookingDateTimeObject = new Date();
        this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
        this.minDate = this.minimumAdvanceBookingDateTimeObject;

        this.maximumAdvanceBookingDateTimeObject = new Date();
        this.maximumAdvanceBookingDateTimeObject.setMinutes( this.maximumAdvanceBookingDateTimeObject.getMinutes() + this.maximumAdvanceBookingTime );
        this.maxDate = this.maximumAdvanceBookingDateTimeObject;

      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnGetTaxDetails(){
    let requestObject = {
      'business_id': this.bussinessId,
    };
    this.adminService.getTaxDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        let tax = response.response
        this.taxArr=tax;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnGetOffDays(){
    let requestObject = {
      "business_id":this.bussinessId
    };
    this.adminService.getOffDays(requestObject).subscribe((response:any) => {
      if(response.data == true){
        if(response.response.holidays.length>0){
          this.offDaysList = response.response.holidays;
        }else{
          this.offDaysList=[];
        }
        if(response.response.offday.length>0){
          this.workingHoursOffDaysList = response.response.offday;
        }else{
          this.workingHoursOffDaysList=[];
        }
        this.myFilter = (d: Date | null): boolean => {
          let temp:any;
          let temp2:any;
          if(this.offDaysList.length>0 || this.workingHoursOffDaysList.length>0){
            for(var i=0; i<this.offDaysList.length; i++){
              var offDay = new Date(this.offDaysList[i]);
              if(i==0){
               temp=(d.getMonth()+1!==offDay.getMonth()+1 || d.getDate()!==offDay.getDate());
              }else{
                temp=temp && (d.getMonth()+1!==offDay.getMonth()+1 || d.getDate()!==offDay.getDate());
              }
            }
            for(var i=0; i<this.workingHoursOffDaysList.length; i++){
              if(this.offDaysList.length>0){
                temp=temp && (d.getDay() !== this.workingHoursOffDaysList[i]);
              }else{
                temp=(d.getDay() !== this.workingHoursOffDaysList[i]);
              }
            }
            //return (d.getMonth()+1!==4 || d.getDate()!==30) && (d.getMonth()+1!==5 || d.getDate()!==15);
            return temp;
          }else{
            return true;
          }
        }
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  onNoClick(): void {
    this.dialogRef.close({data:false});
  }

  fnGetCategories(){
    let requestObject = {
      "business_id":this.bussinessId,
      "status":"E"
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'customer-id' : '',
      'api-token' : '' 
    //  'mode': 'no-cors'
    });

    this.http.post(`${environment.apiUrl}/get-all-category`,requestObject,{headers:headers} )
    .pipe(
    map((res) => {
      return res;
    })
    ).subscribe((response:any) => {
      if(response.data == true){
        this.catdata = response.response;
      }else{
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnSelectCat(selected_cat_id){
    this.fnGetSubCategory(selected_cat_id);
    this.subcatdata.length = 0;
    this.serviceData.length = 0;
    this.serviceCount.length=0;
    this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].setValue(null);
    this.formAddNewAppointmentStaffStep2.controls['customerService'].setValue(null);
    this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
    this.selectedSubCatId=undefined;
    this.selectedServiceId=undefined;
    this.selectedStaffId=undefined;
  }
  // get Sub Category function
  fnGetSubCategory(selected_cat_id){
    let requestObject = {
      "category_id":selected_cat_id,
      "sub_category_status":"E"
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/get-sub-category`,requestObject,{headers:headers} ).pipe(
    map((res) => {
      return res;
    }),
    ).subscribe((response:any) => {
      if(response.data == true){
        this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].setValidators([Validators.required]);    
        this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].updateValueAndValidity();           
       this.showSubCatDropDown=true;
      this.subcatdata = response.response;
      }else{
        this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].clearValidators();
        this.formAddNewAppointmentStaffStep2.controls['customerSubCategory'].updateValueAndValidity();           
       this.showSubCatDropDown=false;
        this.fnGetAllServicesFromCategory();
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnSelectSubCat(selected_subcat_id){
    this.fnGetAllServices(selected_subcat_id);
    this.serviceData.length = 0;
    this.formAddNewAppointmentStaffStep2.controls['customerService'].setValue(null);
    this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
    this.selectedServiceId=undefined;
    this.selectedStaffId=undefined;
    this.serviceCount.length=0;
  }

  fnGetAllServices(selected_subcat_id){
    let requestObject = {
      "sub_category_id":selected_subcat_id,
      "status":"E"
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/get-services`,requestObject,{headers:headers} ).pipe(
    map((res) => {
      return res;
    }),
    ).subscribe((response:any) => {
      if(response.data == true){
        this.serviceData = response.response;
        for(let i=0; i<this.serviceData.length;i++){
          this.serviceData[i].count=0;

          this.serviceData[i].subtotal = this.serviceData[i].service_cost * this.serviceData[i].count;
          this.serviceData[i].discount_type=null;
          this.serviceData[i].discount_value=null;
          this.serviceData[i].discount=0;
          var serviceAmountAfterDiscount= this.serviceData[i].subtotal - this.serviceData[i].discount;
          var serviceTaxAmount=0;
          let taxMain=[];
          this.taxArr.forEach((element) => {
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
            if(this.taxType == "P"){
             taxTemp.value= element.value;
             taxTemp.name= element.name;
             taxTemp.amount= serviceAmountAfterDiscount * element.value/100;
              serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
            }else{
              taxTemp.value= element.value;
              taxTemp.name= element.name;
              taxTemp.amount=  element.value;
              serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
            }
            taxMain.push(taxTemp);
            this.serviceData[i].tax=taxMain;
          });

          // this.serviceData[i].tax=0;
          this.serviceData[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;

          // this.serviceData[i].totalCost=0;
          this.serviceData[i].appointmentDate='';
          this.serviceData[i].appointmentTimeSlot='';
          this.serviceData[i].assignedStaff=null;
          this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
        }
      }else{
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnGetAllServicesFromCategory(){
    let requestObject = {
      "business_id":this.bussinessId,
      "category_id":this.selectedCatId
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/get-cat-services`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
    ).subscribe((response:any) => {
      if(response.data == true){
        this.serviceData = response.response;
        for(let i=0; i<this.serviceData.length;i++){
          this.serviceData[i].count=0;

          this.serviceData[i].subtotal = this.serviceData[i].service_cost * this.serviceData[i].count;
          this.serviceData[i].discount_type=null;
          this.serviceData[i].discount_value=null;
          this.serviceData[i].discount=0;
          var serviceAmountAfterDiscount= this.serviceData[i].subtotal - this.serviceData[i].discount;
          var serviceTaxAmount=0;
          let taxMain=[];
          this.taxArr.forEach((element) => {
            let taxTemp={
              value:0,
              name:'',
              amount:0
            }
            if(this.taxType == "P"){
             taxTemp.value= element.value;
             taxTemp.name= element.name;
             taxTemp.amount= serviceAmountAfterDiscount * element.value/100;
              serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
            }else{
              taxTemp.value= element.value;
              taxTemp.name= element.name;
              taxTemp.amount=  element.value;
              serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
            }
            taxMain.push(taxTemp);
            this.serviceData[i].tax=taxMain;
          });

          this.serviceData[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
          
          this.serviceData[i].appointmentDate='';
          this.serviceData[i].appointmentTimeSlot='';
          this.serviceData[i].assignedStaff=null;
          this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
       
        }
      }else{
        this._snackBar.open("No Sub-Category or Service Available", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
        });
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnSelectService(selected_service_id){
    this.availableStaff=[];
    this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
    this.selectedStaffId=undefined;
    for(let i=0; i<this.serviceCount.length;i++){
      if(this.serviceCount[i] != null && this.serviceCount[i].id == selected_service_id){
        this.serviceCount[i].count=1;

        this.serviceCount[i].subtotal = this.serviceCount[i].service_cost * this.serviceCount[i].count;
        this.serviceCount[i].discount_type=null;
        this.serviceCount[i].discount_value=null;
        this.serviceCount[i].discount=0;
        
        var serviceAmountAfterDiscount= this.serviceCount[i].subtotal - this.serviceCount[i].discount;
        var serviceTaxAmount=0;
        let taxMain=[];
        this.taxArr.forEach((element) => {
          let taxTemp={
            value:0,
            name:'',
            amount:0
          }
          if(this.taxType == "P"){
           taxTemp.value= element.value;
           taxTemp.name= element.name;
           taxTemp.amount= serviceAmountAfterDiscount * element.value/100;
            serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
          }else{
            taxTemp.value= element.value;
            taxTemp.name= element.name;
            taxTemp.amount=  element.value;
            serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
          }
          taxMain.push(taxTemp);
          this.serviceCount[i].tax=taxMain;
        });

        this.serviceCount[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
        if(this.selectedDate){
          this.serviceCount[i].appointmentDate=this.selectedDate;
          this.fnGetTimeSlots(this.selectedDate);
        }else{
          this.serviceCount[i].appointmentDate='';
        }
        if(this.selectedTime){
          this.serviceCount[i].appointmentTimeSlot=this.selectedTime;
        }else{
          this.serviceCount[i].appointmentTimeSlot='';
        }
        this.serviceCount[i].assignedStaff=null;
      }else if(this.serviceCount[i] != null && this.serviceCount[i].id != selected_service_id){
        this.serviceCount[i].count=0;

        this.serviceCount[i].subtotal = this.serviceCount[i].service_cost * this.serviceCount[i].count;
        this.serviceCount[i].discount_type=null;
        this.serviceCount[i].discount_value=null;
        this.serviceCount[i].discount=0;
        
        var serviceAmountAfterDiscount= this.serviceCount[i].subtotal - this.serviceCount[i].discount;
        var serviceTaxAmount=0;
        let taxMain=[];
        this.taxArr.forEach((element) => {
          let taxTemp={
            value:0,
            name:'',
            amount:0
          }
          if(this.taxType == "P"){
           taxTemp.value= element.value;
           taxTemp.name= element.name;
           taxTemp.amount= serviceAmountAfterDiscount * element.value/100;
            serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
          }else{
            taxTemp.value= element.value;
            taxTemp.name= element.name;
            taxTemp.amount=  element.value;
            serviceTaxAmount=serviceTaxAmount+taxTemp.amount;
          }
          taxMain.push(taxTemp);
          this.serviceCount[i].tax=taxMain;
        });

        // this.serviceData[id].tax=0;
        this.serviceCount[i].totalCost=serviceAmountAfterDiscount+serviceTaxAmount;
        this.serviceCount[i].appointmentDate='';
        this.serviceCount[i].appointmentTimeSlot='';
        this.serviceCount[i].assignedStaff=null;
      }
    }
    if(this.bussinessId != undefined && this.selectedServiceId != undefined && this.selectedDate != undefined && this.selectedTime != undefined){
      this.fnGetStaff();
    }
  }

  fnDateChange(event: MatDatepickerInputEvent<Date>) {
    let date = this.datePipe.transform(new Date(event.value),"yyyy/MM/dd")
    this.formAddNewAppointmentStaffStep2.controls['customerTime'].setValue(null);
    this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
    this.selectedTime=undefined;
    this.selectedStaffId=undefined;
    this.timeSlotArr= [];
    this.timeSlotArrForLabel= [];
    this.availableStaff=[];
    if(this.selectedServiceId != undefined){
      this.serviceCount[this.selectedServiceId].appointmentDate=date
    }
    this.selectedDate=date;
    this.fnGetTimeSlots(date);
  }

  fnGetTimeSlots(date){
    let requestObject = {
      "business_id":this.bussinessId,
      "selected_date":date,
      "service_id":this.selectedServiceId,
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${environment.apiUrl}/list-availabel-timings`,requestObject,{headers:headers} ).pipe(
    map((res) => {
      return res;
    }),
      // catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
      this.timeSlotArr.length=0;
      this.timeSlotArrForLabel.length=0;
      this.minimumAdvanceBookingDateTimeObject = new Date();
      this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
      response.response.forEach(element => {
        if((new Date(date+" "+element+":00")).getTime() > (this.minimumAdvanceBookingDateTimeObject).getTime()){
          this.timeSlotArr.push(element);
        }
      });
      var i=0;
      this.timeSlotArr.forEach( (element) => {
        var dateTemp=this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element+":00";
         this.timeSlotArrForLabel[i]= this.datePipe.transform(new Date(dateTemp),"HH:mm");
         i++;
      });
      if(this.timeSlotArr.length==0){
        this.formAddNewAppointmentStaffStep2.controls['customerTime'].setValue(null);
    this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
      }
      }
      else{
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnSelectTime(timeSlot){
    this.availableStaff=[];
    if(this.selectedServiceId != undefined){
      this.serviceCount[this.selectedServiceId].appointmentTimeSlot =timeSlot;
    }
    this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
    this.selectedStaffId=undefined;
    this.selectedTime=timeSlot;
    if(this.bussinessId != undefined && this.selectedServiceId != undefined && this.selectedDate != undefined && this.selectedTime != undefined){
      this.fnGetStaff();
    }
  }

  fnGetStaff(){
    if(this.formAddNewAppointmentStaffStep2.get('customerPostalCode').hasError('required') || this.formAddNewAppointmentStaffStep2.get('customerPostalCode').hasError('minlength') || this.formAddNewAppointmentStaffStep2.get('customerPostalCode').hasError('isPostalcodeValid')){
     return false; 
    }
    let requestObject = {
      "business_id":this.bussinessId,
      "postal_code":this.formAddNewAppointmentStaffStep2.get('customerPostalCode').value,
      "service_id":this.selectedServiceId,
      "book_date" : this.datePipe.transform(new Date(this.selectedDate),"yyyy-MM-dd"),
      "book_time" : this.selectedTime, 
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
      map((res) => {
        return res;
      }),
      //catchError(this.handleError)
    ).subscribe((response:any) => {
      if(response.data == true){
        this.availableStaff = response.response;
        this.isStaffAvailable = true;
      }else{
        this.availableStaff=[];
        this.isStaffAvailable = false;
      }
    },
    (err) =>{
      this.isStaffAvailable = false;
      console.log(err);
    })
  }

  fnSelectStaff(selected_staff_id){
    this.selectedStaffId=selected_staff_id;
    if(this.selectedStaffId == 'null'){
      this.serviceCount[this.selectedServiceId].assignedStaff = null;
    }else if(this.selectedServiceId != undefined){
      this.serviceCount[this.selectedServiceId].assignedStaff =this.selectedStaffId;
    }
  }

  fnNewAppointmentStep2(){
    if(this.formAddNewAppointmentStaffStep2.invalid){
      this.formAddNewAppointmentStaffStep2.get('customerPostalCode').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerCategory').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerSubCategory').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerService').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerDate').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerTime').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerStaff').markAsTouched();
      
      this.formAddNewAppointmentStaffStep2.get('customerAppoAddress').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerAppoState').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerAppoCity').markAsTouched();
      
      return false;
    }

    if(this.valide_postal_code == false){
      this.formAddNewAppointmentStaffStep2.get('customerPostalCode').markAsTouched();
      return false;
    }

    
    this.fnBookAppointment();
  }

  applyCoupon(){
    let serviceCartArrTemp:any= [];
    for(let i=0; i<this.serviceCount.length;i++){
      if(this.serviceCount[i] != null && this.serviceCount[i].count > 0){
        serviceCartArrTemp.push(this.serviceCount[i]);
      }
    }
    if(this.formAddNewAppointmentStaffStep2.get('customerService').valid) {
      let couponRequestObject = {
        "coupon_code": this.formAddNewAppointmentStaffStep2.get('customerCouponCode').value,
        "service_id" : this.formAddNewAppointmentStaffStep2.get('customerService').value,
        "business_id": this.bussinessId,
      };
      this.discount_type = null;
      this.discount_amount = 0;
      this.adminService.getCoupon(couponRequestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Coupon Applied Successfully", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.formAddNewAppointmentStaffStep2.get('customerCouponCode').disable();
          this.discount_type = response.response['coupon_type'];
          this.discount_amount = response.response['coupon_value'];

          this.appointmentSubTotal = 0;
          this.appointmentSubTotal = serviceCartArrTemp[0].subtotal;

          if (this.discount_type == "F") {
            this.appointmentAmountAfterDiscount = (this.appointmentSubTotal > this.discount_amount) ? this.appointmentSubTotal - this.discount_amount : 0;
          } else if (this.discount_type == "P") {
            this.discount_amount = (this.appointmentSubTotal * this.discount_amount)/100;
            this.appointmentAmountAfterDiscount = this.appointmentSubTotal - this.discount_amount;
          } else {
            this.discount_amount = 0;
            this.appointmentAmountAfterDiscount = this.appointmentSubTotal;
          }
        } else {
          this._snackBar.open(response.response?response.response:'You can not apply Coupon', "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
      });
    } else {
      this._snackBar.open('Select service', "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
      });
      return false;
    }
  }

  fnBookAppointment(){
    let serviceCartArrTemp:any= [];
    for(let i=0; i<this.serviceCount.length;i++){
      if(this.serviceCount[i] != null && this.serviceCount[i].count > 0){
        serviceCartArrTemp.push(this.serviceCount[i]);
      }
    }
    if(this.appointmentAmountAfterDiscount == 0) {
      this.appointmentSubTotal = serviceCartArrTemp[0].subtotal;
      this.appointmentAmountAfterDiscount = this.appointmentSubTotal;
    }
    var amountAfterDiscount=this.appointmentAmountAfterDiscount;
    var amountAfterTax=0;
    this.taxAmountArr.length=0;
    if(amountAfterDiscount > 0){
      this.taxArr.forEach((element) => {
        let taxTemp={
          value:0,
          name:'',
          amount:0
        }
        if(this.taxType == "P"){
          taxTemp.value= element.value;
          taxTemp.name= element.name;
          taxTemp.amount= amountAfterDiscount * element.value/100;
          amountAfterTax=amountAfterTax+taxTemp.amount;
        }else{
          taxTemp.value= element.value;
          taxTemp.name= element.name;
          taxTemp.amount=  element.value;
          amountAfterTax=amountAfterTax+taxTemp.amount;
        }
        this.taxAmountArr.push(taxTemp);
      });
    }
    this.netCost=amountAfterDiscount+amountAfterTax;
    const currentDateTime = new Date();
    let requestObject = {
      "postal_code": this.formAddNewAppointmentStaffStep2.get('customerPostalCode').value,
      "business_id": this.bussinessId,
      "serviceInfo": serviceCartArrTemp,
      "customer_name": this.customerDetails.fullname,
      "customer_email": this.customerDetails.email,
      "customer_phone": this.customerDetails.phone,
      "appointment_address": this.customerDetails.address,
      "appointment_state": this.customerDetails.state,
      "appointment_city": this.customerDetails.city,
      "appointment_zipcode": this.customerDetails.zip,
      "customer_appointment_address": this.formAddNewAppointmentStaffStep2.get('customerAppoAddress').value,
      "customer_appointment_state": this.formAddNewAppointmentStaffStep2.get('customerAppoState').value,
      "customer_appointment_city": this.formAddNewAppointmentStaffStep2.get('customerAppoCity').value,
      "customer_appointment_zipcode": this.formAddNewAppointmentStaffStep2.get('customerPostalCode').value,
      "coupon_code": this.formAddNewAppointmentStaffStep2.get('customerCouponCode').value,
      "subtotal": serviceCartArrTemp[0].subtotal,
      "discount_type" : this.discount_type,
      "discount_value" : this.discount_amount,
      "discount": this.discount_amount,
      "tax": this.taxAmountArr,
      "nettotal": this.netCost,
      "created_by": "admin",
      "payment_method": "Cash",
      "order_date": this.datePipe.transform(currentDateTime,"yyyy/MM/dd HH:mm") 
    };
    this.isLoaderAdmin=true;
    this.adminService.customerNewAppointment(requestObject).subscribe((response:any) => {
    

      if(response.data == true){  
        this._snackBar.open("Appointment created", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
        });
        this.dialogRef.close({data:true});
        this.isLoaderAdmin=false;

      }else{

          this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['red-snackbar']
          });
          this.isLoaderAdmin=false;
      }
    },(err) =>{
      this.isLoaderAdmin=false;
    })
  }

}

@Component({
  selector: 'new-note',
  templateUrl: '../_dialogs/add-new-note-dialog.html',
})
export class DialogAddNewNote {
  createNewNote:FormGroup;
  createNewNoteData:any;
  editNoteData:any;
  customer_id : any;
  noteData : any;
  businessId : any;
  isLoaderAdmin : boolean = false;
  saveDisabled:boolean=false;

  constructor(
    public dialogRef: MatDialogRef<DialogAddNewNote>,
    private adminService: AdminService,
    private _formBuilder:FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.customer_id = this.data.customer_id
      this.noteData = this.data.fulldata

      if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.createNewNote = this._formBuilder.group({
      note_subject : ['', Validators.required],
      note_description : ['', Validators.required],
    });
    if(this.noteData != undefined){
      this.createNewNote.controls['note_subject'].setValue(this.noteData.note_subject);
      this.createNewNote.controls['note_description'].setValue(this.noteData.note_decreption);
    }
    
  }
  fnSubmit(){
    this.saveDisabled = true;
    this.isLoaderAdmin = true;
    if(this.noteData != undefined){
      if(this.createNewNote.valid){
        this.editNoteData ={
          
          "customer_note_id" : this.noteData.id,
          "subject" : this.createNewNote.get('note_subject').value,
          "description" : this.createNewNote.get('note_description').value,
        }
      }else{
          this.createNewNote.get('note_subject').markAsTouched();
          this.createNewNote.get('note_description').markAsTouched();
      }
      this.fnEditNote(this.editNoteData);
      this.isLoaderAdmin = false;
    }
    else{
      this.isLoaderAdmin = true;
      if(this.createNewNote.valid){
        this.createNewNoteData ={
          "business_id" : this.businessId,
          "customer_id" : this.customer_id,
          "subject" : this.createNewNote.get('note_subject').value,
          "description" : this.createNewNote.get('note_description').value,
        }
      }else{
          this.createNewNote.get('note_subject').markAsTouched();
          this.createNewNote.get('note_description').markAsTouched();
      }
      this.fncreateNewNote(this.createNewNoteData);
      this.isLoaderAdmin = false;
    }
  }
  fncreateNewNote(createNewNoteData){
    this.isLoaderAdmin = true;
    this.adminService.fncreateNewNote(createNewNoteData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        setTimeout(() => {
          this.saveDisabled = false
        }, 4000);
        this.dialogRef.close();
        this.isLoaderAdmin = false;
        
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
        setTimeout(() => {
          this.saveDisabled = false
        }, 4000);
      this.isLoaderAdmin = false;
      }
    })
  }
  fnEditNote(editNoteData){
    this.isLoaderAdmin = true;
    this.adminService.fnEditNote(editNoteData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Customer Note Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        setTimeout(() => {
          this.saveDisabled = false
        }, 4000);
        this.dialogRef.close();
        this.isLoaderAdmin = false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        setTimeout(() => {
          this.saveDisabled = false
        }, 4000);
        // this.allCustomers = ''
      this.isLoaderAdmin = false;
      }
    })
  }

}

@Component({
  selector: 'customer-image-upload',
  templateUrl: '../_dialogs/customer-upload-profile-image-dialog.html',
})
export class DialogCustomerImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogCustomerImageUpload>,
  private _formBuilder:FormBuilder,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
  
  var file_type = event.target.files[0].type;

  if(file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
      
      this._snackBar.open("Sorry, only JPG, JPEG, PNG & GIF files are allowed", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
      });
      return;
  }
 

  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
    for(var i = 0; i < event.target.files.length; i++) {
      if(event.target.files[i].type!="image/png" && event.target.files[i].type!="image/jpeg" && event.target.files[i].type!="image/jpg" && event.target.files[i].type!="image/gif"){
        this._snackBar.open("Select valid image file", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
        return false;
      }
    }
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadForm.patchValue({
              fileSource: reader.result
          });
      };
  }
}
uploadImage() {
  if(this.uploadForm.invalid){
    this.uploadForm.controls['profile'].markAsTouched();
    this._snackBar.open("Select Image", "X", {
      duration: 2000,
      verticalPosition:'top',
      panelClass :['red-snackbar']
    });
    return false;
  }
  this.profileImage = this.imageSrc
  this.dialogRef.close(this.profileImage);
}


}


@Component({
  selector: 'payment-note',
  templateUrl: '../_dialogs/payment-note-dialog.html',
})
export class DialogPaymentNote {

constructor(
  public dialogRef: MatDialogRef<DialogPaymentNote>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}

}

@Component({
  selector: 'view-review',
  templateUrl: '../_dialogs/view-review-dialog.html',
})
export class DialogViewReview {
detailsData: any;
orderDataFull:any;
initials:any;
customerShortName:any;
settingsArr:any=[];
currencySymbol:any;
currencySymbolPosition:any;
currencySymbolFormat:any;
constructor(
  public dialogRef: MatDialogRef<DialogViewReview>,
  private adminService: AdminService,
  @Inject(MAT_DIALOG_DATA) public data: any) {

     this.detailsData =  this.data.fulldata;
     this.orderDataFull =  this.data.orderData[0];
     this.settingsArr = this.data.setting;
     this.currencySymbol = this.settingsArr.currency;
     this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
     this.currencySymbolFormat = this.settingsArr.currency_format;
    this.initials = this.orderDataFull.staff.fullname.split(" ",2);
      this.customerShortName = '';
      this.initials.forEach( (element2) => {
        this.customerShortName = this.customerShortName+element2.charAt(0);
      });
  }

onNoClick(): void {
  this.dialogRef.close();
}

}

@Component({
    selector: 'dialog-invoice',
    templateUrl: '../_dialogs/dialog-invoice.html',
    providers:[DatePipe]
  })
  export class DialogInvoiceDialog {
    paymentData: any;
    paymentInfo={
      customer_name:'',
      customer_email:'',
      customer_address:'',
      customer_city:'',
      customer_state:'',
      customer_zip:'',
      invoice_date: '',
      service_name:'',
      service_qty:'',
      service_cost:'',
      service_subtotal:'',
      service_discount:'',
      service_netCost:'', 
      invoiceNumber:'', 
      order_item_id:'',
      phone:'',
      payment_notes:'',
    }
    serviceTaxArr:[];
    settingsArr:any=[];
    currencySymbol:any;
    currencySymbolPosition:any;
    currencySymbolFormat:any;
    bussinessId:any;
    businessData:any;
    adminId:any;
    businessId : any;
    isLoaderAdmin : boolean = false;
    token:any;
    businessImage:any;

    constructor(
      private http: HttpClient,
      public dialogRef: MatDialogRef<DialogInvoiceDialog>,
      private authenticationService: AuthenticationService,
      private adminService: AdminService,
      public datePipe: DatePipe,
      private _snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.settingsArr = this.data.setting;
        this.adminId=(JSON.parse(localStorage.getItem('currentUser'))).user_id;
        this.token=(JSON.parse(localStorage.getItem('currentUser'))).token;

        this.bussinessId=JSON.parse(localStorage.getItem('business_id'));
        this.getBusinessDetail();
        this.getBusinessImage();

        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;
        this.paymentInfo.invoice_date=this.datePipe.transform(new Date(), 'yyyy/MM/dd');
        this.paymentData = this.data.fulldata;
        this.paymentInfo.invoiceNumber = "2"+this.paymentData.id+this.datePipe.transform(this.paymentData.paymentDate,"yyyy/MM/dd");
        this.paymentInfo.customer_name=this.paymentData.get_customer.fullname;
        this.paymentInfo.customer_email=this.paymentData.get_customer.email;
        this.paymentInfo.customer_address=this.paymentData.get_customer.address;
        this.paymentInfo.phone=this.paymentData.get_customer.phone;
        this.paymentInfo.customer_city=this.paymentData.get_customer.city;
        this.paymentInfo.customer_state=this.paymentData.get_customer.state;
        this.paymentInfo.customer_zip=this.paymentData.get_customer.zip;
        this.paymentInfo.service_name=this.paymentData.service.service_name;
        this.paymentInfo.service_qty=this.paymentData.orders.service_qty;
        this.paymentInfo.service_cost=this.paymentData.orders.service_cost;
        this.paymentInfo.service_subtotal=this.paymentData.orders.subtotal;
        this.paymentInfo.service_discount=this.paymentData.orders.discount;
        this.paymentInfo.service_netCost=this.paymentData.orders.total_cost;
        this.paymentInfo.order_item_id=this.paymentData.order_item_id;
        this.paymentInfo.payment_notes=this.paymentData.payment_notes;

        this.serviceTaxArr=JSON.parse(this.paymentData.orders.tax);
      
      }

    onNoClick(): void {
      this.dialogRef.close();
    } 
    getBusinessDetail(){
      let requestObject = {
        "business_id":this.bussinessId
      };
     
      this.adminService.getBusinessDetail(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.businessData=response.response;
        }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        
        }
      })
    }

    getBusinessImage(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.adminService.getBusinessImage(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.businessImage=response.response;
        }
      })
    }

    fnPrint(){     
      let that = this;
      domtoimage.toPng(document.getElementById('printInvoice'))
        .then(function (blob) {
          const printContent = document.getElementById("printInvoice");
          const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
          WindowPrt.document.write('<img src='+blob+'>');         
          WindowPrt.focus();
          setTimeout(() => {
            WindowPrt.document.close();
            WindowPrt.print();  
            WindowPrt.close();
          }, 200);                                                  
        });
    }

    captureScreen() {

      let setLable = "invoice";
      if (!document.getElementById('printInvoice')) {
        return false;
      }

      let data = document.getElementById('printInvoice');
      let HTML_Width = document.getElementById('printInvoice').offsetWidth;
      let HTML_Height = document.getElementById('printInvoice').clientHeight;
      let top_left_margin = 35;
      let PDF_Width = HTML_Width + (top_left_margin * 2);
      let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      let canvas_image_width = HTML_Width;
      let canvas_image_height = HTML_Height;

      let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      let today = Date.now();
      let that = this;
      domtoimage.toPng(document.getElementById('printInvoice'))
        .then(function (blob) {
          var pdf = new jspdf('p', 'pt', [PDF_Width, PDF_Height]);
          pdf.addImage(blob, 'PNG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
          for (let i = 1; i <= totalPDFPages; i++) {
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(blob, 'PNG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
          }
          pdf.save("invoice_" + today + ".pdf");
        });
    }

    fnSendInvoiceEmail(){
          var formData = new FormData();
          formData.append('order_item_id', this.paymentInfo.order_item_id);
          formData.append('email',this.paymentInfo.customer_email);
          

          this.adminService.sendInvoiceEmail(formData).subscribe((response:any) => {
            if(response.data == true){  
              this._snackBar.open(response.response, "X", {
                duration: 2000,
                verticalPosition:'top',
                panelClass :['green-snackbar']
              });

            }else if(response.data == false && response.response !== 'api token or userid invaild'){
              
              this._snackBar.open(response.response, "X", {
                duration: 2000,
                verticalPosition:'top',
                panelClass :['red-snackbar']
              });
            }
          });
    }

  }
