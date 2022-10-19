import { Component, OnInit,Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService } from '../_services/admin-main.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, RouterEvent } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AuthenticationService } from '@app/_services';
import { CommonService } from '../../_services'
import { AppComponent } from '../../app.component';
import { AngularFireDatabase,AngularFireList }  from 'angularfire2/database';
import { SharedService } from '@app/_services/shared.service';
import { throwError } from 'rxjs';
import { ConfirmationDialogComponent } from '../../_components/confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  animal: string;
}
@Component({
  selector: 'app-appointment-live',
  templateUrl: './appointment-live.component.html',
  styleUrls: ['./appointment-live.component.scss'],
  providers: [DatePipe]
})
export class AppointmentLiveComponent implements OnInit {
  
  serach:any = '';
  panelOpenState: boolean = false;
  businessId: any;
  animal: string;
  isLoaderAdmin : boolean = false;
  pendingAppointments : any=[];
  notAssignedAppointments : any=[];
  onTheWayAppointments : any=[];
  workStartedAppointments : any=[];
  staffList:any;
  todayDate:any;
  todayTime:any;
  todayDays:any;
  todayPeriod:any;
  CategoryList :any = [];
  ServiceList :any = [];
  StaffList:any = [];
  staffListDisplay:boolean=false;
  existingCustomerId:any;
  booking_date:any;
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;

  pendingApiUrl:any =  `${environment.apiUrl}/get-pos-pending-booking`;
  
  current_page_pending:any;
  first_page_url_pending:any;
  last_page_pending:any;
  totalRecord_pending : any;
  fromRecord_pending : any;
  toRecord_pending : any;
  last_page_url_pending:any;
  next_page_url_pending:any;
  prev_page_url_pending:any;
  path_pending:any;
  notassignApiUrl:any =  `${environment.apiUrl}/get-notassign-live`;
  
  current_page_notassign:any;
  first_page_url_notassign:any;
  last_page_notassign:any;
  last_page_url_notassign:any;
  next_page_url_notassign:any;
  prev_page_url_notassign:any;
  path_notassign:any;
  onthewayApiUrl:any =  `${environment.apiUrl}/get-ontheway-live`;
  
  current_page_ontheway:any;
  first_page_url_ontheway:any;
  last_page_ontheway:any;
  last_page_url_ontheway:any;
  next_page_url_ontheway:any;
  prev_page_url_ontheway:any;
  path_ontheway:any;

  workstartApiUrl:any =  `${environment.apiUrl}/get-pos-workstart-booking`;
  
  current_page_workstart:any;
  first_page_url_workstart:any;
  last_page_workstart:any;
  totalRecord_workstart :any;
  fromRecord_workstart :any;
  toRecord_workstart :any;
  last_page_url_workstart:any;
  next_page_url_workstart:any;
  prev_page_url_workstart:any;
  path_workstart:any;
  
  current_page_pendingbilling:any;
  first_page_url_pendingbilling:any;
  last_page_pendingbilling:any;
  last_page_url_pendingbilling:any;
  next_page_url_pendingbilling:any;
  prev_page_url_pendingbilling:any;
  path_pendingbilling:any;


  inStoreTabName:any = 'service';
  newCustomer:FormGroup;
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  // onlynumeric = /^-?(0|[1-9]\d*)?$/
  onlynumeric = /^\+(?:[0-9] ?){6,14}[0-9]$/
  onlystring = /[a-zA-Z ]*/

  service_index:any;
  staff_id:any;
  cartArr:any = [];
  service_id:any;
  categoryServiceCheckServiceId = [];
  subTotalCost = 0;
  note_description='';
  paymentData:any;
  Watinglist:any = [];
  trackOrderList:any[];
  fireDB:AngularFireDatabase;
  // fireDB:AngularFireDatabase;
  selectedtab:any = 1;
  pendingBillTab: boolean = false
  currentUser: any;
  notificationCount: any = 0;
  userType:any;
  search ={
    pendingKeyword: '',
    workStartedKeyword: '',
  }

  notificationData:any;
  pendingBillingData:any = [];
  selectedBillCustomer:any=null;
  pendingBillingOrdeTotal = 0;
  selectedBillCustomerData:any=[];
  outdoorOrdersArr:any = [];
  textPercentage = 0;
  totalTax = 0;
  pageSlug:any;
  private geoCoder;
  address:any = [];
  deliveryBoyAddress:string;
  public lat = 40.094882;
  public lng = 20.214329;
  public dlat = 40.094882;
  public dlng = 20.214329;
  public ShowMap:boolean = false;
  taxArr:any= [];
  origin = { lat: 40.094882, lng: 20.214329 };
  destination = { lat: 40.095867, lng: 20.223556 };
  renderOptions = {
    suppressMarkers: true
  }
  inStoreSelectedCat = 'all';
  staff_filter = "all";
  clock=""
  liveDate:any="";
  liveTime:any="";
  clockHandle;
  posCouponApplied:boolean=false;
  appliedCouponDetail:any;
  appointmentAmountAfterDiscount:number = 0;
  discount_amount:number = 0; 
  pendingBillingTax:number=0;
  constructor(
    private adminService: AdminService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private CommonService: CommonService,
    private _formBuilder:FormBuilder,
    private appComponent : AppComponent,
    private http: HttpClient,
    public router: Router,
    private sharedService: SharedService,
    private _snackBar: MatSnackBar,
    private fireDb:AngularFireDatabase
  ) { 
    this.fireDB = fireDb;
    localStorage.setItem('isBusiness', 'true');    
    localStorage.setItem('isPOS', 'true');
      this.sharedService.updateSideMenuState(false);
    this.router.events.subscribe(event => {
      if (event instanceof RouterEvent) this.handleRoute(event);
        const url = this.getUrl(event);
    });

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.newCustomer = this._formBuilder.group({
      cus_name : ['', Validators.required],
      cus_email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)]],
      cus_mobile : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
    });
    this.fnWatinglist();
    this.fnOutdoorOrders(null, null);
    this.clockHandle = setInterval(()=>{
      this.clock = new Date().toLocaleString();
      this.liveDate = this.datePipe.transform(this.clock,'EEE, MMM d');
      this.liveTime = this.datePipe.transform(this.clock,'HH:mm');
    },1000);

  }
  
  ngOnInit() {
    if(localStorage.getItem('business_id')){
      this.businessId=localStorage.getItem('business_id');
    }
    this.fnGetSettings();
    // this.getPendingAppointments(this.search.pendingKeyword);
   // this.getNotAssignedAppointments();
   if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
      this.getNotificationCount(this.businessId)
    }

    this.fnGetCategory();
    this.fngetService();
    this.fnGetTaxDetails();
    setInterval(() => {
      this.countDown; 
      }, 100);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
    //return error.error ? error.error : error.statusText;
  }

  isCustomerEmailUnique(control: FormControl) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          let emailCheckRequestObject = {
            'business_id':this.businessId,
            'email': control.value,
            'phone': null,
            'customer_id':this.existingCustomerId,
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
          'customer_id':this.existingCustomerId,
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


  onTabChanged(event){
    let clickedIndex = event.index;
    if(clickedIndex == 0){
      this.router.navigate(['/admin/my-workspace']);
    }
    if(clickedIndex == 5){
      this.pendingBillTab  = true
     this.fnPendingBilling();
    }else if(clickedIndex == 3){
      this.fnOutdoorOrders(null,null);
      this.pendingBillTab  = false
    }else if(clickedIndex == 1){
      this.pendingBillTab  = false
    }else if(clickedIndex == 2){
      this.getPendingAppointments(this.search.pendingKeyword)
      this.pendingBillTab  = false
    }else if(clickedIndex == 4){
      this.getWorkStartedAppointments(this.search.workStartedKeyword);
      this.pendingBillTab  = false
    }
  }

  fnSearch(value){
    if(this.inStoreTabName=='service'){
      this.serach = value;
      this.fngetService();
    }else{
      this.serach = value;
      this.fnWatinglist();
    }
  }

  fnGetTaxDetails(){
    let requestObject = {
      'business_id': this.businessId,
    };
    this.adminService.getTaxDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        let tax = response.response
        this.taxArr=tax;

        this.taxArr.forEach((element) => {
          this.textPercentage = this.textPercentage + parseInt(element.value);
        });

      } else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    });
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
      },(err) =>{
        console.log(err)
      })
  }

  pendingAppointSearch(event){
    if(this.search.pendingKeyword.length > 1){
      this.getPendingAppointments(this.search.pendingKeyword)
    }else{
      this.getPendingAppointments('')
    }
  }

  getPendingAppointments(pendingKeyword){
    this.adminService.getPendingAppointments(pendingKeyword,this.pendingApiUrl).subscribe((response:any) => {
      if(response.data == true){
        this.pendingAppointments = response.response.data;
        
        this.current_page_pending = response.response.current_page;
        this.first_page_url_pending = response.response.first_page_url;
        this.last_page_pending = response.response.last_page;
        this.totalRecord_pending = response.response.total;
        this.fromRecord_pending = response.response.from;
        this.toRecord_pending= response.response.to;
        this.last_page_url_pending = response.response.last_page_url;
        this.next_page_url_pending = response.response.next_page_url;
        this.prev_page_url_pending = response.response.prev_page_url;
        this.path_pending = response.response.path;


        this.pendingAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"yyyy/MM/dd")
          element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd @ HH:mm")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"HH:mm");
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass : ['red-snackbar']
        // });
        this.pendingAppointments = [];
      }
    });
  }

  
  navigateTo_pending(api_url){
    this.pendingApiUrl=api_url;
    if(this.pendingApiUrl){
      this.getPendingAppointments(this.search.pendingKeyword);
    }
  }

  navigateToPageNumber_pending(index){
    this.pendingApiUrl=this.path_pending+'?page='+index;
    if(this.pendingApiUrl){
      this.getPendingAppointments(this.search.pendingKeyword);
    }
  }
  
  arrayOne_pending(n: number): any[] {
    return Array(n);
  }

  
  getNotAssignedAppointments(){

    this.adminService.getNotAssignedAppointments(this.notassignApiUrl).subscribe((response:any) => {
      if(response.data == true){

        this.notAssignedAppointments = response.response.data;
        
        this.current_page_notassign = response.response.current_page;
        this.first_page_url_notassign = response.response.first_page_url;
        this.last_page_notassign = response.response.last_page;
        this.last_page_url_notassign = response.response.last_page_url;
        this.next_page_url_notassign = response.response.next_page_url;
        this.prev_page_url_notassign = response.response.prev_page_url;
        this.path_notassign = response.response.path;

        this.notAssignedAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"yyyy/MM/dd")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"HH:mm");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd @ HH:mm")
        });
        
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        this.notAssignedAppointments = [];
      }
    });
  }

  navigateTo_notassign(api_url){
    this.notassignApiUrl=api_url;
    if(this.notassignApiUrl){
      this.getNotAssignedAppointments();
    }
  }

  navigateToPageNumber_notassign(index){

    this.notassignApiUrl=this.path_notassign+'?page='+index;
    if(this.notassignApiUrl){
      this.getNotAssignedAppointments();
    }
  }
  
  arrayOne_notassign(n: number): any[] {
    return Array(n);
  }



  getOnThewayAppointments(){
    this.adminService.getOnThewayAppointments(this.onthewayApiUrl).subscribe((response:any) => {
      if(response.data == true){
        this.onTheWayAppointments = response.response;
        
        this.onTheWayAppointments = response.response.data;
        
        this.current_page_ontheway = response.response.current_page;
        this.first_page_url_ontheway = response.response.first_page_url;
        this.last_page_ontheway = response.response.last_page;
        this.last_page_url_ontheway = response.response.last_page_url;
        this.next_page_url_ontheway = response.response.next_page_url;
        this.prev_page_url_ontheway = response.response.prev_page_url;
        this.path_ontheway = response.response.path;

        this.onTheWayAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"yyyy/MM/dd")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"HH:mm");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd @ HH:mm")
          
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass : ['red-snackbar']
        // });
        this.onTheWayAppointments = [];
      }
    })
  }

  navigateTo_ontheway(api_url){
    this.onthewayApiUrl=api_url;
    if(this.onthewayApiUrl){
      this.getOnThewayAppointments();
    }
  }

  navigateToPageNumber_ontheway(index){

    this.onthewayApiUrl=this.path_ontheway+'?page='+index;
    if(this.onthewayApiUrl){
      this.getOnThewayAppointments();
    }
  }
  
  arrayOne_ontheway(n: number): any[] {
    return Array(n);
  }

   
  WSAppointSearch(){
    if(this.search.workStartedKeyword.length > 1){
      this.getWorkStartedAppointments(this.search.workStartedKeyword)
    }else{
      this.getWorkStartedAppointments('')
    }
  }

  getWorkStartedAppointments(searchKeyword){

    this.adminService.getWorkStartedAppointments(searchKeyword,this.workstartApiUrl).subscribe((response:any) => {
      if(response.data == true){
     //   this.workStartedAppointments = response.response;

        this.workStartedAppointments = response.response.data;
        
        this.current_page_workstart = response.response.current_page;
        this.first_page_url_workstart = response.response.first_page_url;
        this.last_page_workstart = response.response.last_page;
        this.totalRecord_workstart = response.response.total;
        this.fromRecord_workstart = response.response.from;
        this.toRecord_workstart = response.response.to;
        this.last_page_url_workstart = response.response.last_page_url;
        this.next_page_url_workstart = response.response.next_page_url;
        this.prev_page_url_workstart = response.response.prev_page_url;
        this.path_workstart = response.response.path;

        this.workStartedAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"yyyy/MM/dd")
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"HH:mm");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd @ HH:mm")
          
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass : ['red-snackbar']
        // });
        this.workStartedAppointments = [];
      }
    })
  }

  navigateTo_workstart(api_url){
    this.workstartApiUrl=api_url;
    if(this.workstartApiUrl){
      this.getWorkStartedAppointments(this.search.workStartedKeyword);
    }
  }

  navigateToPageNumber_workstart(index){
    this.workstartApiUrl=this.path_workstart+'?page='+index;
    if(this.workstartApiUrl){
      this.getWorkStartedAppointments(this.search.workStartedKeyword);
    }
  }
  
  arrayOne_workstart(n: number): any[] {
    return Array(n);
  }
  
  fnChangeSubTab(tabName){
    this.inStoreTabName = tabName;
    this.fnWatinglist();
  }



  fnOpenDetails(index){
    
    const dialogRef = this.dialog.open(PendingAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.pendingAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getPendingAppointments(this.search.pendingKeyword);
     
      });
  }

  fnAddNote(index){
    
    const dialogRef = this.dialog.open(addPOSBookingNoteDialog, {
      width: '500px',
      data :{note :this.note_description}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 0){
        this.note_description = null;
      }else{
        this.note_description = result;
      }
    });
  }

  openCouponModal(index){
    
    const dialogRef = this.dialog.open(addPOSCouponDialog, {
      width: '500px',
      data :{cartArr :this.cartArr, businessId:this.businessId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.posCouponApplied = true;
        this.appliedCouponDetail = result;
        console.log(this.appliedCouponDetail)

        // coupon value count 
        
        // let bookingSubTotal = 0;
        // bookingSubTotal = this.subTotalCost;
        this.discount_amount = this.appliedCouponDetail.coupon_value
        if (this.appliedCouponDetail.coupon_type == "F") {
          this.appointmentAmountAfterDiscount = (this.subTotalCost > this.discount_amount) ? this.subTotalCost - this.discount_amount : 0;
        } else if (this.appliedCouponDetail.coupon_type == "P") {
          this.discount_amount = (this.subTotalCost * this.discount_amount)/100;
          this.appointmentAmountAfterDiscount = this.subTotalCost - this.discount_amount;
        } else {
          this.discount_amount = 0;
          this.appointmentAmountAfterDiscount = this.subTotalCost;
        }
        if(this.textPercentage > 0){
          this.totalTax = this.appointmentAmountAfterDiscount*this.textPercentage/100;
        }
      }else{
      }
    });
  }

  removeCoupon(){
    this.posCouponApplied = false;
    this.appliedCouponDetail = null;
    this.discount_amount = 0;
    if(this.textPercentage > 0){
      this.totalTax = this.subTotalCost*this.textPercentage/100;
    }
  }

  fnShowNote(note){
    const dialogRef = this.dialog.open(addPOSBookingNoteDialog, {
      width: '500px',
      data :{note :note, view: 'only_view'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 0){
        this.note_description = null;
      }else{
        this.note_description = result;
      }
    });
  }

  fnPaymentMode(pos_pdf_type){

    if(this.newCustomer.invalid){
      this.newCustomer.get('cus_email').markAsTouched();
      this.newCustomer.get('cus_mobile').markAsTouched();
      this.newCustomer.get('cus_name').markAsTouched();
      this.panelOpenState = !this.panelOpenState;
      return false;
    }

    const dialogRef = this.dialog.open(paymentModeDialog, {
      width: '500px',
     });

    dialogRef.afterClosed().subscribe(result => {
       if(result){
        this.paymentData = result;
        this.fnplaceOrder(pos_pdf_type);
       }
    });

  }

  
  fnOpenOnTheWayDetails(val){

    const dialogRef = this.dialog.open(OnTheWayAppointmentDetailsDialog, {
      height: '700px',
      data :{fulldata : val}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getOnThewayAppointments();
      
      });
  }
  
  fnOpenWorkStartedDetails(index){
   
    const dialogRef = this.dialog.open(WorkStartedAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.workStartedAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getWorkStartedAppointments(this.search.workStartedKeyword);
      
      });
  }

  fnGetCategory(){

    let requestObject = {
      "business_id" : localStorage.getItem('business_id')
    };

    this.adminService.getGetCategory(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.CategoryList = response.response;
      }
    });
  }

  fngetService(category_id=''){
  
    let  requestObject = {}
    this.inStoreSelectedCat =  category_id==''?'all':category_id
    requestObject = {
      "category_id" : category_id==''?'all':category_id, 
      "business_id" : localStorage.getItem('business_id'),
      'search' : this.serach
    };

    this.adminService.getService(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ServiceList = response.response;
      }else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    });
  
  }

  fngetStaff(service_id,index){
    this.isLoaderAdmin = true;
    let requestObject = {
      "service_id" : service_id, 
      "action" : this.staff_filter, 
      "business_id" : localStorage.getItem('business_id')
    };

    this.service_index = index;
    this.service_id = service_id;

    this.adminService.getStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.StaffList = response.response;
        this.staffListDisplay = true;
      }else{
        if(this.staff_filter == 'all'){
          this.staffListDisplay = false;
        }else{
          this.staffListDisplay = true;
        }
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass: ['red-snackbar']
        // });

        this.StaffList = [];
      }
      this.isLoaderAdmin = false;
    });
  }


  fnFilterStaff(event){
    
    this.staff_filter = event;

    var requestObject = {
      "service_id" : this.service_id, 
      "business_id" : localStorage.getItem('business_id'),
      "action" : event
    };

    this.adminService.getStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.StaffList = response.response;
      }else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        this.StaffList = [];
      }
    });

  }

  fnAssignStaff(staff_id,staff_index){
  
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var current_date = yyyy + '-' + mm  + '-' + dd;

    this.staff_id = staff_id;
    let index = false;
    if(this.categoryServiceCheckServiceId.length == 0){
     
      this.categoryServiceCheckServiceId.push(this.ServiceList[this.service_index].id);
   
    }else{

      index = this.categoryServiceCheckServiceId.includes(this.ServiceList[this.service_index].id);
      var my_index = this.categoryServiceCheckServiceId.indexOf(this.ServiceList[this.service_index].id);
    
      if(index==false){
        this.categoryServiceCheckServiceId.push(this.ServiceList[this.service_index].id);
      }
      
      if(index==true){
        this.cartArr.splice(my_index, 1);
        index=false;
      }

    }
    
    if(index==false){
      if(this.StaffList[staff_index].status == 'ideal'){
        this.cartArr.push({
          "id":   this.ServiceList[this.service_index].id,
          "category_id":  this.ServiceList[this.service_index].category_id,
          "sub_category_id":  this.ServiceList[this.service_index].sub_category_id,
          "service_name":   this.ServiceList[this.service_index].service_name,
          "service_description":  this.ServiceList[this.service_index].service_description,
          "service_image":  this.ServiceList[this.service_index].service_image,
          "service_cost": this.ServiceList[this.service_index].service_cost,
          "service_time": this.ServiceList[this.service_index].service_time,
          "service_unit":   this.ServiceList[this.service_index].service_unit,
          "status":   this.ServiceList[this.service_index].status,
          "private_status":   this.ServiceList[this.service_index].private_status,
          "business_id": localStorage.getItem('business_id'),
          "created_at": this.ServiceList[this.service_index].created_at,
          "updated_at": this.ServiceList[this.service_index].updated_at,
          "deleted_at": this.ServiceList[this.service_index].deleted_at,
          "count": 1,
          "subtotal": parseInt(this.ServiceList[this.service_index].service_cost),
          "totalCost": parseInt(this.ServiceList[this.service_index].service_cost),
          "appointmentDate": current_date,
          "appointmentTimeSlot": this.StaffList[staff_index].from,
          "assignedStaff" : staff_id,
          "StaffName" : this.StaffList[staff_index].name
        });
      }else if(this.StaffList[staff_index].status == 'working'){
        this.cartArr.push({
          "id":   this.ServiceList[this.service_index].id,
          "category_id":  this.ServiceList[this.service_index].category_id,
          "sub_category_id":  this.ServiceList[this.service_index].sub_category_id,
          "service_name":   this.ServiceList[this.service_index].service_name,
          "service_description":  this.ServiceList[this.service_index].service_description,
          "service_image":  this.ServiceList[this.service_index].service_image,
          "service_cost": this.ServiceList[this.service_index].service_cost,
          "service_time": this.ServiceList[this.service_index].service_time,
          "service_unit":   this.ServiceList[this.service_index].service_unit,
          "status":   this.ServiceList[this.service_index].status,
          "private_status":   this.ServiceList[this.service_index].private_status,
          "business_id": localStorage.getItem('business_id'),
          "created_at": this.ServiceList[this.service_index].created_at,
          "updated_at": this.ServiceList[this.service_index].updated_at,
          "deleted_at": this.ServiceList[this.service_index].deleted_at,
          "count": 1,
          "subtotal": parseInt(this.ServiceList[this.service_index].service_cost),
          "totalCost": parseInt(this.ServiceList[this.service_index].service_cost),
          "appointmentDate": current_date,
          "appointmentTimeSlot": this.StaffList[staff_index].free_at,
          "assignedStaff" : staff_id,
          "StaffName" : this.StaffList[staff_index].name
      });
      }
      
      

      
      this.subTotalCost = 0;
      this.cartArr.forEach(element => {
        this.subTotalCost = this.subTotalCost+parseInt(element.subtotal);
      });

      if(this.textPercentage > 0){
        this.totalTax = this.subTotalCost*this.textPercentage/100;
      }

    }

    this.fngetService();
    this.StaffList = [];
    this.service_index = null;
  }

  fncartUpdate(Type,index){

    let cartdata = this.cartArr[index];
    if(Type=='minus'){
       this.cartArr[index].count = parseInt(cartdata.count)-1==0?1:parseInt(cartdata.count)-1;
    }else{
      this.cartArr[index].count = parseInt(cartdata.count)+1;
    }
    
    this.cartArr[index].subtotal = this.cartArr[index].count * this.ServiceList[index].service_cost;
    this.cartArr[index].totalCost = this.cartArr[index].count * this.ServiceList[index].service_cost;

    this.subTotalCost = 0;
    this.cartArr.forEach(element => {
      this.subTotalCost = this.subTotalCost+parseInt(element.subtotal);
    });

    if(this.textPercentage > 0){
      this.totalTax = this.subTotalCost*this.textPercentage/100;
    }

  }

  fnDeleteItem(elem){
    this.cartArr.splice(elem, 1);
    this.subTotalCost = 0;
    this.cartArr.forEach(element => {
      this.subTotalCost = this.subTotalCost+parseInt(element.subtotal);
    });

    if(this.textPercentage > 0){
      this.totalTax = this.subTotalCost*this.textPercentage/100;
    }
    
  }

  fnplaceOrder(pos_pdf_type){

    if(this.newCustomer.invalid){
      this.newCustomer.get('cus_email').markAsTouched();
      this.newCustomer.get('cus_mobile').markAsTouched();
      this.newCustomer.get('cus_name').markAsTouched();
      this.panelOpenState = !this.panelOpenState;
      window.scroll(0,0)

      return false;
    }
    
    this.isLoaderAdmin = true;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var payment_datetime = yyyy + '-' + mm  + '-' + dd;
    var newTaxArr = [];


    this.cartArr.forEach(cartelement => {
      var tmpItemTaxArr = [];
      var itemTaxTotal = 0;

      this.taxArr.forEach(element => {
        
        if(this.posCouponApplied){
          itemTaxTotal = itemTaxTotal + parseInt(cartelement.subtotal)*parseInt(element.value)/100;
  
          tmpItemTaxArr.push({
            'amount' : cartelement.subtotal*element.value/100,
            'name' : element.name,
            'value' : element.value
          });
          cartelement.tax = tmpItemTaxArr;
          cartelement.totalCost = parseInt(cartelement.subtotal) + itemTaxTotal;
        }else{
          itemTaxTotal = itemTaxTotal + parseInt(cartelement.subtotal)*parseInt(element.value)/100;
  
          tmpItemTaxArr.push({
            'amount' : cartelement.subtotal*element.value/100,
            'name' : element.name,
            'value' : element.value
          });
          cartelement.tax = tmpItemTaxArr;
          cartelement.totalCost = parseInt(cartelement.subtotal) + itemTaxTotal;
        }
      });
    });
    
    this.taxArr.forEach(element => {
      if(this.discount_amount > 0){
        newTaxArr.push({
          'amount' : this.appointmentAmountAfterDiscount*element.value/100,
          'name' : element.name,
          'value' : element.value
        });
      }else{
        newTaxArr.push({
          'amount' : this.subTotalCost*element.value/100,
          'name' : element.name,
          'value' : element.value
        });
      }
    });

    let bookingNotes = {
      "user_type": 'A',
      "note_type": 'normal',
      "notes":this.note_description
    }
    var requestObject = {
      "business_id" : localStorage.getItem('business_id'),
      'serviceInfo' : this.cartArr,
      "customer_name": this.newCustomer.get('cus_name').value,
      "customer_phone": this.newCustomer.get('cus_mobile').value,
      "customer_email": this.newCustomer.get('cus_email').value,
      "created_by": "admin",
      "subtotal": this.subTotalCost,
      "reference_id": "",
      "transaction_id": "",
      "payment_datetime": payment_datetime,
      "nettotal": this.posCouponApplied?this.appointmentAmountAfterDiscount+this.totalTax:this.subTotalCost+this.totalTax,
      "discount_type" : this.appliedCouponDetail?this.appliedCouponDetail.coupon_type:null,
      "discount_value" : this.discount_amount,
      "discount": this.discount_amount,
      "tax" :  newTaxArr,
      "totalTax" : this.totalTax,
      "payment_method": this.paymentData ? this.paymentData.payment_method : 'cash',
      "card_option": this.paymentData && this.paymentData.payment_method=='Card' ? this.paymentData.card_option : '',
      "order_date": payment_datetime,
      "notes" : bookingNotes,
      "pos_pdf_type" : pos_pdf_type  
    };
   
    this.adminService.placeOrder(requestObject).subscribe((response:any) => {
      
      if(response.data == true){

        if(pos_pdf_type=='print'){
          window.open(response.response,"_blank");
        }
        
        this.cartArr = [];
        this.newCustomer.reset();
        this.subTotalCost = 0;
        this.appliedCouponDetail = null;
        this.subTotalCost = 0;
        this.discount_amount = 0;
        this.totalTax = 0;
        this.appointmentAmountAfterDiscount = 0;
        this._snackBar.open('order created', "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        
        this.note_description = null;
        this.fnWatinglist();
        this.isLoaderAdmin = false;

      }else if(response.data == false){

        this.isLoaderAdmin = false;
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      

    });

  }

  fnWatinglist(){
    
    var requestObject = {
      "business_id" : localStorage.getItem('business_id'),
      "search" : this.serach 
    };

    this.adminService.getWatinglist(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.Watinglist = response.response;
      }else{
        this.Watinglist = [];
      }
    });
  }

  fncancelOrder(order_item_id){


    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: "Are you sure you want to delete?"
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result){
          var requestObject = {
            "business_id" : localStorage.getItem('business_id'),
            "order_item_id" : order_item_id
          };
    
          this.adminService.cancelOrder(requestObject).subscribe((response:any) => {
            if(response.data == true){
              this._snackBar.open(response.response, "X", {
                duration: 2000,
                verticalPosition: 'top',
                panelClass : ['green-snackbar']
              });
              this.fnWatinglist();
            }
          });
        }
    });

  

  }

   
  countDown(countDown){
    var countDownDate = new Date(countDown).getTime();
    // var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (distance < 0) {
          //clearInterval(x);
            return "EXPIRED";
        }else{
            return  hours + ":" + minutes + ":" + seconds;
        }
    //  }, 1000);
  }

  
  


  /*For notification Dialog*/
  getNotificationCount(business_id){
    let headers;
    let userId;
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
    let requestObject = {
      "user_id": userId,
      "user_type": this.userType
    };
    this.CommonService.openNotificationDialog(requestObject, headers).subscribe((response: any) => {
      if (response.data == true) {
        this.notificationData = response.response
        this.notificationCount = this.notificationData.length;
      }else if(response.data == false){
        this.notificationCount = 0
      }

      this.isLoaderAdmin = false;
    })

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

  fnPendingBilling(serach=null) {

    this.isLoaderAdmin = true;
  
    let requestObject = {
      "business_id": localStorage.getItem('business_id'),
      "search": serach
    };
    this.adminService.PendingBilling(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.pendingBillingData = response.response;
        var count  = 0;
        this.pendingBillingData.forEach( (element) => { 
          count = count+1;
          element.orders.tax = JSON.parse(element.orders.tax)
          element.orders.booking_date=this.datePipe.transform(new Date(element.orders.booking_date),"yyyy/MM/dd")
          element.orders.booking_time=this.datePipe.transform(new Date(element.orders.booking_date+" "+element.orders.booking_time),"HH:mm");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd @ HH:mm"),
          element.is_selected  = false
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
    });

  }

  fnSelect(index,customer_id,order_id){
    if(this.selectedBillCustomer==null){
      this.selectedBillCustomer = customer_id;
      this.pendingBillingData[index].is_selected = true;
      this.selectedBillCustomerData = this.pendingBillingData[index];
    }else if(this.selectedBillCustomer!=customer_id){
      this._snackBar.open('Select Same customer', "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
      });
      
      return false;
    }else{
      if(true == this.pendingBillingData[index].is_selected){
        this.pendingBillingData[index].is_selected = false;
      }else{
        this.pendingBillingData[index].is_selected = true;
        this.selectedBillCustomerData = this.pendingBillingData[index];
      }
    }

    this.pendingBillingOrdeTotal = 0;
    var cartArr = [];
    this.pendingBillingData.forEach(element => {
      if(element.is_selected==true){
        element.orders.tax.forEach(element1 => {
          this.pendingBillingTax = this.pendingBillingTax+element1.amount
        });
        cartArr.push(element)
        this.pendingBillingOrdeTotal = this.pendingBillingOrdeTotal + parseInt(element.orders.subtotal);
      }
    });
    if(this.pendingBillingOrdeTotal==0){
      this.selectedBillCustomer = null;
      this.selectedBillCustomerData = [];
    }
  }

  fnPaymentBillingMode(billing_type){

    const dialogRef = this.dialog.open(paymentModeDialog, {
      width: '500px',
     });

    dialogRef.afterClosed().subscribe(result => {
       if(result){
        this.fnPendingbillAction(billing_type,result);
       }
    });

  }

  fnPendingbillAction(billing_type,result){

    var tempArr = [];
    this.pendingBillingData.forEach(element => {
      if(element.is_selected==true){
        tempArr.push(element.order_item_id);
      }
    });
    this.isLoaderAdmin = true;
  
    let requestObject = {
      "business_id": localStorage.getItem('business_id'),
      "order_ids": tempArr,
      "billing_type" : billing_type,
      "payment_method": result ? result.payment_method : 'cash',
      "card_option": result.payment_method=='Card' ? result.card_option : '',
    };

    this.adminService.pendingbillAction(requestObject).subscribe((response: any) => {
      if (response.data == true) {

        if(billing_type=='print'){
          window.open(response.response,"_blank");
        }

        this._snackBar.open(billing_type=='print'?'Order printed':response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });

        this.isLoaderAdmin = false;
        this.fnPendingBilling();
        this.pendingBillingData.forEach(element => {
          element.is_selected=false;
        });

        this.pendingBillingOrdeTotal = 0;
        this.selectedBillCustomer = null;
        this.selectedBillCustomerData = [];

      } else {

        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        this.isLoaderAdmin = false;
      }
    });
  
  }
   
  fnOutdoorOrders(search:any,search_by:any){
    

    let requestObject = {
      "business_id": localStorage.getItem('business_id'),
      'search' : search,
      "search_by" : search_by
    };
    this.adminService.outdoorOrders(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.outdoorOrdersArr = response.response;
        this.isLoaderAdmin = false;
        this.outdoorOrdersArr.forEach((currentValue, index) => {
          this.address[index] = currentValue.orders_info.booking_address+ ", " + currentValue.orders_info.booking_city + ", "+ currentValue.orders_info.booking_state+ " " + currentValue.orders_info.booking_zipcode;
        });
        this.OutDootMap(0);
      } else {
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass: ['red-snackbar']
        // });
        this.outdoorOrdersArr=[];
        this.isLoaderAdmin = false;
      }
    });

  }

  getAddress(latitude, longitude, index) {
    this.geoCoder = new google.maps.Geocoder();
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      if (status === 'OK') {
        if (results[0]) {
          this.address[index] = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  getLocation(address) {
    this.geoCoder = new google.maps.Geocoder();
    this.geoCoder.geocode({ 'address': address }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          let destinationLat = results[0].geometry.location.lat();
          let desiationLong = results[0].geometry.location.lng();
          this.dlat = destinationLat;
          this.dlng = desiationLong;
          this.destination = { lat: destinationLat, lng: desiationLong };
          if(!(this.lat && this.lng)) {
            this.origin = this.destination;
            this.lat = this.dlat;
            this.lng = this.dlng;
          }
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  OutDootMap(index=0){
    var data = this.outdoorOrdersArr[index];
    var address = data.orders_info.booking_address+ ", " + data.orders_info.booking_city + ", "+ data.orders_info.booking_state+ " " + data.orders_info.booking_zipcode;
    //const itemsRef: AngularFireList<any> = this.fireDb.list('trackOrder/currentLocation/'+data.order_id);
    const itemsRef: AngularFireList<any> = this.fireDb.list('trackOrder/currentLocation/94');
    itemsRef.valueChanges().subscribe(
      x=>{
          this.trackOrderList =  x;
          console.log(this.trackOrderList);
          this.ShowMap = true;
          this.lat = parseFloat(this.trackOrderList[0]);
          this.lng = parseFloat(this.trackOrderList[1]);
          if(this.lat && this.lng) {
            this.origin = { lat: this.lat, lng: this.lng };
            this.getAddress(this.lat, this.lng, index);
          }
          this.getLocation(address);
          if(data.service.service_sub_type=='at_home'){
            this.ShowMap  = true;
          }else{
            return;
          }
        }
    );

    // var customer_address =  data.orders_info.booking_address+'+'+data.orders_info.booking_city+'+'+data.orders_info.booking_state+'+'+data.orders_info.booking_zipcode;
    // var staff_address =  data.staff.address+'+'+data.staff.city+'+'+data.staff.state+'+'+data.staff.zip;
    // // this.ShowMap = false;

    // this.adminService.outdoorGoogleaddress(customer_address).subscribe((response: any) => {
    //     if(response.status=='OK'){
    //       this.ShowMap = true;
    //       this.lat = response.results[0].geometry.location.lat;
    //       this.lng = response.results[0].geometry.location.lng;
    //       this.origin.lat = response.results[0].geometry.location.lat;
    //       this.origin.lng = response.results[0].geometry.location.lng;

    //     }
    // });

    // this.adminService.outdoorGoogleaddress(staff_address).subscribe((response: any) => {
    //     if(response.status=='OK'){
    //       this.destination.lat = response.results[0].geometry.location.lat;
    //       this.destination.lng = response.results[0].geometry.location.lng;
    //     }
    //  });
  }

  fnOrderUpdateStatus(status,order_item_id,type){

    var new_status = '';
    if(type=='out_store'){
      if(status=='OW'){
        new_status='WS';
       }else if(status=='WS'){
        new_status='CO';
      }else{
        new_status='OW';
      }
    }

    let requestObject = {
      "order_item_id": order_item_id,
      'status' : new_status
    };
    this.adminService.OrderUpdateStatus(requestObject).subscribe((response: any) => {
      if (response.data == true) {

        this.isLoaderAdmin = false;
        this.fnOutdoorOrders(null,null);

      } else {

        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });

        this.isLoaderAdmin = false;

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
      this.pageSlug = event.url.split('/' , 2)
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    let devidedUrl = url.split('/',4);
    if(devidedUrl[2] == 'my-appointment-live'){
      this.appComponent.isPOS();
      localStorage.setItem('isPOS','true');
      this.sharedService.updateSideMenuState(false);
    }else{
      this.appComponent.isPOS();
      localStorage.setItem('isPOS','false');
      this.sharedService.updateSideMenuState(true);
    }
  }

}


@Component({
  selector: 'online-payment-mode',
  templateUrl: '../_dialogs/online-payment-mode.html',
    providers: [DatePipe]
})
export class paymentModeDialog {

  res = {
    'payment_method' : 'cash',
    'reference_id' : '',
    'transaction_id' : '',
    'card_option' : ''
  };

  payment_method='';
  card_option : string = '';

constructor(
  public dialogRef: MatDialogRef<paymentModeDialog>,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    

}
  onNoClick(): void {
    this.dialogRef.close();
  }

  fnPaymentMethod(payment_method): void {
    this.payment_method =  payment_method;
     this.res = {
      'payment_method' : payment_method,
      'reference_id' : '',
      'transaction_id' : '',
      'card_option' : ''
    };
  }

  Confirm(){

    if(this.payment_method=='Card'){
      if(this.card_option==''){
        this._snackBar.open('Please Select Card Option ', "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        return;
      }
      this.res['card_option'] = this.card_option;
    }

    this.dialogRef.close(this.res);
  }

}

@Component({
  selector: 'add-booking-pos-note',
  templateUrl: '../_dialogs/add-booking-pos-note.html',
    providers: [DatePipe]
})
export class addPOSBookingNoteDialog {
  createNewNote: FormGroup;
  formSettingPage:boolean = false;
  note_description_val:any;
  appointmentDetails = {
  bookingNotes : ''
  };
  viewType:any;
  settingsArr:any =[];

constructor(
  public dialogRef: MatDialogRef<addPOSBookingNoteDialog>,
  private adminService: AdminService,
  private _snackBar: MatSnackBar,
  private datePipe: DatePipe,
  private _formBuilder:FormBuilder,
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.note_description_val = this.data.note
    this.viewType= this.data.view
    this.createNewNote = this._formBuilder.group({
      note_description : [{value:this.note_description_val, disabled: this.viewType?'only_view':false}, Validators.required,],
    });
  }
  onNoClick(): void {
    this.dialogRef.close(this.createNewNote.get('note_description').value);
  }
  deleteNote(): void {
    this.dialogRef.close(0);
  }
  
  onAdd(): void {
    this.dialogRef.close(this.createNewNote.get('note_description').value);
  }
}

@Component({
  selector: 'add-coupon-pos',
  templateUrl: '../_dialogs/add-coupon-pos.html',
    providers: [DatePipe]
})
export class addPOSCouponDialog {
  couponCode:any;
  businessId:any;
  cartArr:any =[];
  couponError:any="";
  allServiceIds:any ="";

constructor(
  public dialogRef: MatDialogRef<addPOSCouponDialog>,
  private adminService: AdminService,
  private _snackBar: MatSnackBar,
  private datePipe: DatePipe,
  private _formBuilder:FormBuilder,
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.businessId = this.data.businessId;
    this.cartArr = this.data.cartArr;
    console.log(this.cartArr) 
    this.cartArr.forEach(element => {
      // this.allServiceIds.push(element.id)
      
      this.allServiceIds=this.allServiceIds+element.id+',';
    });
    this.allServiceIds=this.allServiceIds.substring(0, this.allServiceIds.length - 1);

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  
  onAdd(): void {
    if(this.couponCode) {
      let couponRequestObject = {
        "business_id" : this.businessId,
        "service_id" : this.allServiceIds,
        "coupon_code" : this.couponCode,
      };
      this.adminService.checkCoupon(couponRequestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Coupon Applied Successfully", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.dialogRef.close(response.response);
          
        } else {
          this.couponError=response.response
        }
      });
    } else {
      this._snackBar.open('Select service', "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
      });
    }
  }

}

@Component({
  selector: 'pending-appointment-details',
  templateUrl: '../_dialogs/admin-appointment-detail.html',
    providers: [DatePipe]
})
export class PendingAppointmentDetailsDialog {
//notes:any;
detailsData: any;
activityLog: any=[];
formSettingPage:boolean = false;
appointmentDetails = {
  bookingNotes : ''
};
settingsArr:any =[];
currencySymbol:any;
currencySymbolPosition:any;
currencySymbolFormat:any;
cancellationBufferTime:any;
minReschedulingTime:any;
taxTotal : any = 0;
singleBookingTax:any;
initials:any;
customerShortName:any;
availableStaff: any=[];
singlenote:any;
currentUser : any;
singleBookingNotes:any;

constructor(
  public dialogRef: MatDialogRef<PendingAppointmentDetailsDialog>,
  private adminService: AdminService,
  private _snackBar: MatSnackBar,
  private http: HttpClient,
  private datePipe: DatePipe,
  public dialog: MatDialog,
  private authenticationService : AuthenticationService,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.fnGetSettings();
    this.fnGetActivityLog(this.detailsData.id);
    this.fnGetBookingNotes(this.detailsData.id);
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

  fnGetActivityLog(orderItemId){
    let requestObject = {
      "order_item_id":orderItemId
    };
    this.appointmentDetails.bookingNotes = this.detailsData.booking_notes;

    this.adminService.getActivityLog(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.activityLog=response.response;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass : ['red-snackbar']
        // });
        this.activityLog=[];
      }
    })
  }

  fnRescheduleAppointment(){
    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var is_reseduling = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.min_reseduling_time);

    if(is_reseduling==true){
        this._snackBar.open('Minimum notice required for rescheduleing an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnConfirmAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.detailsData.id),
       "status":"CNF"
      };
      this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Confirmed.", "X", {
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
  fnGetStaff(booking_date,booking_time,serviceId,postal_code){
    let requestObject = {
      "postal_code":postal_code,
      "customer_id":this.detailsData.customer.id,
      "business_id":this.detailsData.business_id,
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

    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.cancellation_buffer_time);

    if(is_cancel==true){
        this._snackBar.open('Minimum notice required for Cancellation an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }
    

    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled.", "X", {
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

  fnGetSettings(){
    let requestObject = {
      "business_id" : localStorage.getItem('business_id')
    };

    this.adminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr = response.response;

        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;
        let cancellation_buffer_time=JSON.parse(this.settingsArr.cancellation_buffer_time);
        let min_rescheduling_time=JSON.parse(this.settingsArr.min_reseduling_time);
        this.cancellationBufferTime = new Date();
        this.cancellationBufferTime.setMinutes( this.cancellationBufferTime.getMinutes() + cancellation_buffer_time);
        this.minReschedulingTime = new Date();
        this.minReschedulingTime.setMinutes( this.minReschedulingTime.getMinutes() + min_rescheduling_time);
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      },(err) =>{
        console.log(err)
      });
  }

  fncompereDate(APPODate,time){
    var Now = new Date();  
    var  APPO = new Date(APPODate);
    Now.setMinutes(Now.getMinutes() + parseInt(time));

    if (Now>APPO){
      return true;
    }else if (Now<APPO){
       return false;  
    } 
  }

}




// @Component({
//   selector: 'notassigned-appointment-details',
//   templateUrl: '../_dialogs/admin-appointment-detail.html',
//   providers:[DatePipe]
// })
// export class NotAssignedAppointmentDetailsDialog {
// //notes:any;
// detailsData: any;
// businessId: any;
// selectedStaff: any;
// availableStaff: any=[];
// activityLog: any=[];
// formSettingPage:boolean = false;
// appointmentDetails = {
//   bookingNotes : ''
// };
// settingsArr:any =[];
// currencySymbol:any;
// currencySymbolPosition:any;
// currencySymbolFormat:any;
// cancellationBufferTime:any;
// minReschedulingTime:any;

// constructor(
//   public dialogRef: MatDialogRef<NotAssignedAppointmentDetailsDialog>,
//   private adminService: AdminService,
//   public dialog: MatDialog,
//   private datePipe: DatePipe,
//   private _formBuilder: FormBuilder,
//   private http: HttpClient,
//   private _snackBar: MatSnackBar,
//   @Inject(MAT_DIALOG_DATA) public data: any) {
//     this.detailsData =  this.data.fulldata;
//     this.fnGetActivityLog(this.detailsData.id);
//     this.fnGetStaff(this.detailsData.booking_date,this.detailsData.booking_time,this.detailsData.service_id,this.detailsData.postal_code);
//     this. fnGetSettings();
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }

//   fnGetActivityLog(orderItemId){
//     let requestObject = {
//       "order_item_id":orderItemId
//     };

//     this.appointmentDetails.bookingNotes = this.detailsData.booking_notes;

//     this.adminService.getActivityLog(requestObject).subscribe((response:any) => {
//       if(response.data == true){
//         this.activityLog=response.response;
//       }
//       else if(response.data == false && response.response !== 'api token or userid invaild'){
//         this._snackBar.open(response.response, "X", {
//           duration: 2000,
//           verticalPosition: 'top',
//           panelClass : ['red-snackbar']
//         });
//         this.activityLog=[];
//       }
//     })
//   }

//   fnRescheduleAppointment(){
  
//     this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
//     var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.min_reseduling_time);
//     if(is_cancel==true){
//       this._snackBar.open('Minimum notice required for rescheduleing an appointment', "X", {
//         duration: 2000,
//         verticalPosition:'top',
//         panelClass :['red-snackbar']
//         });
//         return;
//     }

//     const dialogRef = this.dialog.open(RescheduleAppointment, {
//       height: '700px',
//      data : {appointmentDetails: this.detailsData}
//     });
      
//     dialogRef.afterClosed().subscribe(result => {
//       this.dialogRef.close();
//     });
//   }

//   fnGetStaff(booking_date,booking_time,serviceId,postal_code){
//     let requestObject = {
//       "postal_code":postal_code,
//       "business_id":this.detailsData.business_id,
//       "service_id":JSON.stringify(serviceId),
//       "book_date":this.datePipe.transform(new Date(booking_date),"yyyy/MM/dd"),
//       "book_time":booking_time
//     };
//     let headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//     });

//     this.http.post(`${environment.apiUrl}/service-staff`,requestObject,{headers:headers} ).pipe(
//     map((res) => {
//       return res;
//     }),
//     //catchError(this.handleError)
//     ).subscribe((response:any) => {
//       if(response.data == true){
//         this.availableStaff = response.response;
//         console.log(JSON.stringify(this.availableStaff));
//       }
//       else{
//         this.availableStaff.length=0;
//       }
//     },
//     (err) =>{
//       console.log(err)
//     })
//   }

//   fnOnClickStaff(event){
//     console.log(event.value);
//     let requestObject = {
//       "order_item_id":this.detailsData.id,
//       "staff_id":event.value
//       };
//     this.adminService.assignStaffToOrder(requestObject).subscribe((response:any) => 
//     {
//       if(response.data == true){
//           this._snackBar.open("Staff Assigned.", "X", {
//             duration: 2000,
//             verticalPosition:'top',
//             panelClass :['green-snackbar']
//             });
//           this.dialogRef.close();
//         }
//         else if(response.data == false && response.response !== 'api token or userid invaild'){
//           this._snackBar.open(response.response, "X", {
//             duration: 2000,
//             verticalPosition:'top',
//             panelClass :['red-snackbar']
//             });
//         }
//     },
//     (err) => {
//       // this.error = err;
//     })
//   }


//   fnCancelAppointment(){

//     this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
//     var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.cancellation_buffer_time);
//     if(is_cancel==true){
//       this._snackBar.open('Minimum notice required for Cancellation an appointment', "X", {
//         duration: 2000,
//         verticalPosition:'top',
//         panelClass :['red-snackbar']
//         });
//         return;
//     }

//     let requestObject = {
//      "order_item_id":JSON.stringify(this.detailsData.id),
//      "status":"C"
//     };
//     this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
//       if(response.data == true){
//         this._snackBar.open("Appointment Cancelled.", "X", {
//           duration: 2000,
//           verticalPosition:'top',
//           panelClass :['green-snackbar']
//           });
//         this.dialogRef.close();
//       }
//       else if(response.data == false && response.response !== 'api token or userid invaild'){
//         this._snackBar.open(response.response, "X", {
//           duration: 2000,
//           verticalPosition:'top',
//           panelClass :['red-snackbar']
//           });
//       }
//     })
//   }

//   fnSaveBookingNotes(orderItemId){
    
//     if(this.appointmentDetails.bookingNotes == undefined || this.appointmentDetails.bookingNotes == ""){
//       return false;
//     }
//     let requestObject = {
//       "order_item_id":orderItemId,
//       "booking_notes":this.appointmentDetails.bookingNotes
//     };
//     this.adminService.saveBookingNotes(requestObject).subscribe((response:any) => {
//       if(response.data == true){
//         this._snackBar.open("Booking Notes Updated.", "X", {
//           duration: 2000,
//           verticalPosition:'top',
//           panelClass :['green-snackbar']
//         });
//         this.formSettingPage = false;
//       } else if(response.data == false && response.response !== 'api token or userid invaild'){
//         this._snackBar.open(response.response, "X", {
//           duration: 2000,
//           verticalPosition:'top',
//           panelClass :['red-snackbar']
//         });
//       }
//     })
//   }

//   fnGetSettings(){
//     let requestObject = {
//       "business_id" : localStorage.getItem('business_id')
//     };

//     this.adminService.getSettingValue(requestObject).subscribe((response:any) => {
//       if(response.data == true){
//         this.settingsArr = response.response;
//       }else if(response.data == false && response.response !== 'api token or userid invaild'){
//           this._snackBar.open(response.response, "X", {
//             duration: 2000,
//             verticalPosition: 'top',
//             panelClass : ['red-snackbar']
//           });
//         }
//       },(err) =>{
//         console.log(err)
//       });
//   }


//   fncompereDate(APPODate,time){
//       var Now = new Date();  
//       var  APPO = new Date(APPODate);
//       console.log(this.settingsArr);

//       Now.setMinutes(Now.getMinutes() + parseInt(time));

//       if (Now>APPO){
//         return true;
//       }else if (Now<APPO){
//         return false;  
//       } 
//   }


// }
 
@Component({
  selector: 'ontheway-appointment-details',
  templateUrl: '../_dialogs/admin-appointment-detail.html',
  providers: [DatePipe]
})
export class OnTheWayAppointmentDetailsDialog {
  //notes:any;
  detailsData: any;
  activityLog: any=[];
  formSettingPage:boolean = false;
  appointmentDetails = {
    bookingNotes : ''
  };
  settingsArr:any =[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  cancellationBufferTime:any;
  minReschedulingTime:any;
  taxTotal : any = 0;
  singleBookingTax:any;
  initials:any;
  customerShortName:any;
  availableStaff: any=[];
  singlenote:any;
  currentUser : any;
  singleBookingNotes:any;

  constructor(
    public dialogRef: MatDialogRef<OnTheWayAppointmentDetailsDialog>,
    private adminService: AdminService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private authenticationService : AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     
    this.detailsData =  this.data.fulldata;
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.fnGetActivityLog(this.detailsData.id);
    this.fnGetBookingNotes(this.detailsData.id);
    this.fnGetSettings();
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

  fnGetActivityLog(orderItemId){

    this.appointmentDetails.bookingNotes = this.detailsData.booking_notes;

    let requestObject = {
      "order_item_id":orderItemId
    };
    this.adminService.getActivityLog(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.activityLog=response.response;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass : ['red-snackbar']
        // });
        this.activityLog=[];
      }
    })
  }

  
  fnGetSettings(){
    let requestObject = {
      "business_id" : localStorage.getItem('business_id')
    };

    this.adminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr = response.response;

        
        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;
        let cancellation_buffer_time=JSON.parse(this.settingsArr.cancellation_buffer_time);
        let min_rescheduling_time=JSON.parse(this.settingsArr.min_reseduling_time);
        this.cancellationBufferTime = new Date();
        this.cancellationBufferTime.setMinutes( this.cancellationBufferTime.getMinutes() + cancellation_buffer_time);
        this.minReschedulingTime = new Date();
        this.minReschedulingTime.setMinutes( this.minReschedulingTime.getMinutes() + min_rescheduling_time);
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
      },(err) =>{
        console.log(err)
      });
  }

  fnRescheduleAppointment(){

    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.min_reseduling_time);
    
    if(is_cancel==true){
        this._snackBar.open('Minimum notice required for rescheduleing an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    

    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnConfirmAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.detailsData.id),
       "status":"CO"
      };
      this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Confirmed.", "X", {
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

    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);
    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.cancellation_buffer_time);

    if(is_cancel==true){
        this._snackBar.open('Minimum notice required for Cancellation an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled.", "X", {
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

  fncompereDate(APPODate,time){
      
      var Now = new Date();  
      var  APPO = new Date(APPODate);

      Now.setMinutes(Now.getMinutes() + parseInt(time));

      if (Now>APPO){
        return true;
      }else if (Now<APPO){
        return false;  
      } 

  }

}

@Component({
  selector: 'workstarted-appointment-details',
  templateUrl: '../_dialogs/admin-appointment-detail.html',
  providers: [DatePipe]
})
export class WorkStartedAppointmentDetailsDialog {
//notes:any;
detailsData: any;
activityLog: any=[];
formSettingPage:boolean = false;
appointmentDetails = {
  bookingNotes : ''
};
settingsArr:any =[];
currencySymbol:any;
currencySymbolPosition:any;
currencySymbolFormat:any;
cancellationBufferTime:any;
minReschedulingTime:any;
taxTotal : any = 0;
singleBookingTax:any;
initials:any;
customerShortName:any;
availableStaff: any=[];
singlenote:any;
currentUser : any;
singleBookingNotes:any;


constructor(
  public dialogRef: MatDialogRef<WorkStartedAppointmentDetailsDialog>,
  private adminService: AdminService,
  public dialog: MatDialog,
  private http: HttpClient,
  private datePipe: DatePipe,
  private _snackBar: MatSnackBar,
  private authenticationService : AuthenticationService,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.fnGetSettings();
    this.fnGetActivityLog(this.detailsData.id);
    this.fnGetBookingNotes(this.detailsData.id);
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

  fnGetSettings(){

      let requestObject = {
        "business_id" : localStorage.getItem('business_id')
      };

      this.adminService.getSettingValue(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr = response.response;

          
        this.currencySymbol = this.settingsArr.currency;
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        this.currencySymbolFormat = this.settingsArr.currency_format;
        let cancellation_buffer_time=JSON.parse(this.settingsArr.cancellation_buffer_time);
        let min_rescheduling_time=JSON.parse(this.settingsArr.min_reseduling_time);
        this.cancellationBufferTime = new Date();
        this.cancellationBufferTime.setMinutes( this.cancellationBufferTime.getMinutes() + cancellation_buffer_time);
        this.minReschedulingTime = new Date();
        this.minReschedulingTime.setMinutes( this.minReschedulingTime.getMinutes() + min_rescheduling_time);
        }else if(response.data == false && response.response !== 'api token or userid invaild'){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
        }
      },(err) =>{
        console.log(err)
      });
  }

  fnGetActivityLog(orderItemId){
    this.appointmentDetails.bookingNotes = this.detailsData.booking_notes;

    let requestObject = {
      "order_item_id":orderItemId
    };
    this.adminService.getActivityLog(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.activityLog=response.response;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        // this._snackBar.open(response.response, "X", {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass : ['red-snackbar']
        // });
        this.activityLog=[];
      }
    })
  }

  fnRescheduleAppointment(){

    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);

    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.min_reseduling_time);

    if(is_cancel==true){
        this._snackBar.open('Minimum notice required for rescheduleing an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    const dialogRef = this.dialog.open(RescheduleAppointment, {
      height: '700px',
     data : {appointmentDetails: this.detailsData}
    });
      
    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close();
    });
  }

  fnConfirmAppointment(){
      let requestObject = {
       "order_item_id":JSON.stringify(this.detailsData.id),
       "status":"CO"
      };
      this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Confirmed.", "X", {
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
    
    this.detailsData.booking_date_time=new Date(this.detailsData.booking_date+" "+this.detailsData.booking_time);

    var is_cancel = this.fncompereDate(this.detailsData.booking_date_time,this.settingsArr.cancellation_buffer_time);

    if(is_cancel==true){
        this._snackBar.open('Minimum notice required for Cancellation an appointment', "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
        });
        return;
    }

    let requestObject = {
     "order_item_id":JSON.stringify(this.detailsData.id),
     "status":"C"
    };
    this.adminService.updateAppointmentStatus(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this._snackBar.open("Appointment Cancelled.", "X", {
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

  
  fncompereDate(APPODate,time){
        
    var Now = new Date();  
    var  APPO = new Date(APPODate);

    Now.setMinutes(Now.getMinutes() + parseInt(time));

    if (Now>APPO){
      return true;
    }else if (Now<APPO){
      return false;  
    } 

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

}


@Component({
  selector: 'interrupted-reschedule-dialog',
  templateUrl: '../_dialogs/reschedule-appointment-dialog.html',
  providers: [DatePipe]
})
export class RescheduleAppointment {
formAppointmentRescheduleAdmin:FormGroup;
detailsData:any;
businessId:any;
selectedDate:any;
selectedTimeSlot:any;
selectedStaff:any;
minDate = new Date();
timeSlotArr:any= [];
availableStaff:any= [];
isLoaderAdmin:boolean = true;
constructor(
  public dialogRef: MatDialogRef<RescheduleAppointment>,
  private adminService: AdminService,
  private datePipe: DatePipe,
  private _formBuilder: FormBuilder,
  private http: HttpClient,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.appointmentDetails;
    this.businessId=localStorage.getItem('business_id');
    this.formAppointmentRescheduleAdmin = this._formBuilder.group({
      rescheduleDate: ['', Validators.required],
      rescheduleTime: ['', Validators.required],
      rescheduleStaff: ['', Validators.required],
      rescheduleNote: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
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
      "selected_date":selectedDate
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
        "customer_id":this.detailsData.customer.id,
        "business_id":this.businessId,
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
        //catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
            this.availableStaff = response.response;
        }
        else{
          this.availableStaff.length=0;
        }
        this.isLoaderAdmin = false;
        },
        (err) =>{
          console.log(err)
        })
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
        
        this.formAppointmentRescheduleAdmin.get('rescheduleDate').markAllAsTouched();
        this.formAppointmentRescheduleAdmin.get('rescheduleTime').markAllAsTouched();
        this.formAppointmentRescheduleAdmin.get('rescheduleStaff').markAllAsTouched();
        this.formAppointmentRescheduleAdmin.get('rescheduleNote').markAllAsTouched();
      }

      
    }
}

/*For notification Dialog*/

@Component({
  selector: 'dialog-notification',
  templateUrl: '../../_dialogs/dialog-notification.html',
  providers: [DatePipe]
})
export class DialogNotification {
  notifications: any;
  currentUser: any;
  businessId :any;
  userId: any;
  userType: any;
  animal:any;
  token: any;
  isLoaderAdmin : boolean = false;
  order_item_id : any = [];

  constructor(
    public dialogRef: MatDialogRef<DialogNotification>,
    private datePipe: DatePipe,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private CommonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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

  fnViewNotification(index, orderId){
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
      data : { fulldata : this.notifications[index] }

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
  templateUrl: '../../_dialogs/dialog-notification-appointment.html',
  providers: [DatePipe]
})
export class DialogNotificationAppointment {
  myAppoDetailData:any;
  bookingDateTime:any;
  booking_timeForLabel:any;
  created_atForLabel:any;
  booking_dateForLabel:any;
  booking_time_to:any;

  constructor(
    public dialogRef: MatDialogRef<DialogNotificationAppointment>,
    public router: Router,
    private datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.myAppoDetailData = this.data.fulldata
        this.bookingDateTime = new Date(this.myAppoDetailData.booking_date+" "+this.myAppoDetailData.booking_time);
        this.booking_timeForLabel = this.datePipe.transform(this.bookingDateTime,"HH:mm");
        this.booking_dateForLabel = this.datePipe.transform(new Date(this.myAppoDetailData.booking_date),"yyyy/MM/dd");
        this.created_atForLabel = this.datePipe.transform(new Date(this.myAppoDetailData.created_at),"yyyy/MM/dd @ HH:mm");

        var dateTemp = new Date(this.datePipe.transform(this.bookingDateTime,"yyyy/MM/dd HH:mm"));
        dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(this.myAppoDetailData.service_time) );
        this.booking_time_to=this.datePipe.transform(new Date(dateTemp),"HH:mm")

     }

  onNoClick(): void {
    this.dialogRef.close();
  }


}