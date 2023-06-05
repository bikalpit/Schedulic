import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../../_services/admin-settings.service';
import { DatePipe} from '@angular/common';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@app/my-date-formats';
import { Router, Event, NavigationEnd} from '@angular/router';

export interface DialogData {
  selectedStaffId: any;
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  providers: [DatePipe]
})
export class StaffComponent implements OnInit {
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  @ViewChild('below_file_upload', { static: false }) jump: ElementRef;
  files: any[] = [];
  animal: any;
  isLoaderAdmin: boolean = false;
  StaffCreate: FormGroup;
  addStaffPage: boolean = false;
  staffListPage: boolean = true;
  singleStaffView: boolean = false;
  businessId: any;
  allStaffList: any;
  staffActionId: any = [];
  addPostalCodeId: any = [];
  singleStaffStatus: any;
  singleStaffDetail: any;
  staffImageUrl:any = '';
  progress: any;
  singleStaffDataRating: any;
  singleStaffIndex: any;
  search ={
    postalCode :"",
    staff : ""
  }

  addStaffPageValid:FormGroup;
  selectedServicesArr: any = [];
  selectedPostalCodeArr: any = [];
  selectedServiceNewStaff: any = [];
  staffInternalStatus: any;
  staffLoginStatus: any;
  selectedStaffId: any;
  singlePostalCodeStatus: any;
  selectedValue: any;
  categoryServiceList: any=[];
  categoryServiceListTemp: any=[];
  newStaffData: any;
  updateStaffData: any;
  editStaffId: any;
  validationArr:any=[];
  settingSideMenuToggle : boolean = false;

  
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^-?(0|[1-9]\d*)?$/

  formSetWorkingHours: FormGroup;
  timeSlotList: any=[];
  workingHoursList: any=[];
  mondayOn : boolean;
  tuesdayOn : boolean;
  wednesdayOn : boolean;
  thursdayOn : boolean;
  fridayOn : boolean;
  saturdayOn : boolean;
  sundayOn : boolean;
  mondayWorkingHourStartTimeIndex:any;
  mondayWorkingHourEndTimeIndex:any;
  tuesdayWorkingHourStartTimeIndex:any;
  tuesdayWorkingHourEndTimeIndex:any;
  wednesdayWorkingHourStartTimeIndex:any;
  wednesdayWorkingHourEndTimeIndex:any;
  thursdayWorkingHourStartTimeIndex:any;
  thursdayWorkingHourEndTimeIndex:any;
  fridayWorkingHourStartTimeIndex:any;
  fridayWorkingHourEndTimeIndex:any;
  saturdayWorkingHourStartTimeIndex:any;
  saturdayWorkingHourEndTimeIndex:any;
  sundayWorkingHourStartTimeIndex:any;
  sundayWorkingHourEndTimeIndex:any;

  bussinessWorkingHoursList: any=[];
  bussinessSundayOn : boolean;
  bussinessMondayOn : boolean;
  bussinessTuesdayOn : boolean;
  bussinessWednesdayOn : boolean;
  bussinessThursdayOn : boolean;
  bussinessFridayOn : boolean;
  bussinessSaturdayOn : boolean;
  mondayBussinessWorkingHourStartTimeIndex:any;
  mondayBussinessWorkingHourEndTimeIndex:any;
  tuesdayBussinessWorkingHourStartTimeIndex:any;
  tuesdayBussinessWorkingHourEndTimeIndex:any;
  wednesdayBussinessWorkingHourStartTimeIndex:any;
  wednesdayBussinessWorkingHourEndTimeIndex:any;
  thursdayBussinessWorkingHourStartTimeIndex:any;
  thursdayBussinessWorkingHourEndTimeIndex:any;
  fridayBussinessWorkingHourStartTimeIndex:any;
  fridayBussinessWorkingHourEndTimeIndex:any;
  saturdayBussinessWorkingHourStartTimeIndex:any;
  saturdayBussinessWorkingHourEndTimeIndex:any;
  sundayBussinessWorkingHourStartTimeIndex:any;
  sundayBussinessWorkingHourEndTimeIndex:any;

  breakTimeList: any=[];
  selectedStartTimeMonday: any;
  selectedEndTimeMonday: any;
  selectedStartTimeTuesday: any;
  selectedEndTimeTuesday: any;
  selectedStartTimeWednesday: any;
  selectedEndTimeWednesday: any;
  selectedStartTimeThursday: any;
  selectedEndTimeThursday: any;
  selectedStartTimeFriday: any;
  selectedEndTimeFriday: any;
  selectedStartTimeSaturday: any;
  selectedEndTimeSaturday: any;
  selectedStartTimeSunday: any;
  selectedEndTimeSunday: any;
  showMondayAddForm: boolean=false;
  showTuesdayAddForm: boolean=false;
  showWednesdayAddForm: boolean=false;
  showThursdayAddForm: boolean=false;
  showFridayAddForm: boolean=false;
  showSaturdayAddForm: boolean=false;
  showSundayAddForm: boolean=false;
  mondayBreakStartTimeIndex:any;
  mondayBreakEndTimeIndex:any;
  tuesdayBreakStartTimeIndex:any;
  tuesdayBreakEndTimeIndex:any;
  wednesdayBreakStartTimeIndex:any;
  wednesdayBreakEndTimeIndex:any;
  thursdayBreakStartTimeIndex:any;
  thursdayBreakEndTimeIndex:any;
  fridayBreakStartTimeIndex:any;
  fridayBreakEndTimeIndex:any;
  saturdayBreakStartTimeIndex:any;
  saturdayBreakEndTimeIndex:any;
  sundayBreakStartTimeIndex:any;
  sundayBreakEndTimeIndex:any;
  selectedWorkHourStartTimeMonday: any;
  selectedWorkHourEndTimeMonday: any;
  selectedWorkHourStartTimeTuesday: any;
  selectedWorkHourEndTimeTuesday: any;
  selectedWorkHourStartTimeWednesday: any;
  selectedWorkHourEndTimeWednesday: any;
  selectedWorkHourStartTimeThursday: any;
  selectedWorkHourEndTimeThursday: any;
  selectedWorkHourStartTimeFriday: any;
  selectedWorkHourEndTimeFriday: any;
  selectedWorkHourStartTimeSaturday: any;
  selectedWorkHourEndTimeSaturday: any;
  selectedWorkHourStartTimeSunday: any;
  selectedWorkHourEndTimeSunday: any;
  showMondayWorkHourAddForm: boolean=false;
  showTuesdayWorkHourAddForm: boolean=false;
  showWednesdayWorkHourAddForm: boolean=false;
  showThursdayWorkHourAddForm: boolean=false;
  showFridayWorkHourAddForm: boolean=false;
  showSaturdayWorkHourAddForm: boolean=false;
  showSundayWorkHourAddForm: boolean=false;
  
  timeOffList: any=[];
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  reviewOrderData : any;
  staffApiUrl : any;
  current_page : any;
  first_page_url : any;
  last_page : any;
  totalRecord : any;
  fromRecord : any;
  toRecord : any;
  last_page_url : any;
  next_page_url : any;
  prev_page_url : any;
  path : any;
  selectAll:boolean =false;

  categoryServiceCheckCatId: any = [];
  categoryServiceChecksubCatId: any = [];
  categoryServiceCheckServiceId: any = [];
  allCountry: any=[];
  allStates: any=[];
  allCities: any=[];
  scrollContainer: any;
  selectAllPostalCode: boolean = false;

  onFileDropped($event) {
    this.prepareFilesList($event);  
    console.log($event)
  }
 
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
 
  deleteFile(index: number) {
 
   

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: "Are you sure you want to delete?"
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result){
          if (this.files[index].progress < 100) {
            return;
          }
        this.files.splice(index, 1);
        }
    });

  }

  deleteOldFile(index,document_id: number) {
   
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: "Are you sure you want to delete?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
          this.isLoaderAdmin = true;
          this.adminSettingsService.fnRemovedocument(document_id).subscribe((response: any) => {
            if (response.data == true) {
              this._snackBar.open("document deleted.", "X", {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['green-snackbar']
              });
              this.isLoaderAdmin = false;
            }else if (response.data == false) {
              this.isLoaderAdmin = false;
            }
          });

          this.singleStaffDetail.staff[0].getdocument.splice(index, 1);
      }
    });
    
    
  }
  

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
        this.scrollContainer = this.jump.nativeElement;
              this.scrollContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
  
    console.log(files)
    for (const item of files) {
      item.progress = 0;

      var file_type = item.type;

      if( file_type!='application/pdf' &&  file_type!='application/vnd.openxmlformats-officedocument.wordprocessingml.document' && file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
          
          this._snackBar.open("Sorry, only PDF, JPG, PNG & DOC files are allowed", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
          });
        
      }else{
        this.files.push(item);
      }

      
    }
    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);   
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    private datePipe: DatePipe,
  ) {
    localStorage.setItem('isBusiness', 'false');
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }
    this.fnGetTimeSlotsList("00:00","23:30","30");
    this.formSetWorkingHours = this._formBuilder.group({
      mondayToggle: [false],
      mondayStartTime: [this.timeSlotList[0].long],
      mondayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      tuesdayToggle: [false],
      tuesdayStartTime: [this.timeSlotList[0].long],
      tuesdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      wednesdayToggle: [false],
      wednesdayStartTime: [this.timeSlotList[0].long],
      wednesdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      thursdayToggle: [false],
      thursdayStartTime: [this.timeSlotList[0].long],
      thursdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      fridayToggle: [false],
      fridayStartTime: [this.timeSlotList[0].long],
      fridayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      saturdayToggle: [false],
      saturdayStartTime: [this.timeSlotList[0].long],
      saturdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      sundayToggle: [false],
      sundayStartTime: [this.timeSlotList[0].long],
      sundayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
    });
   
  }
  
  

  ngOnInit() {
    this.staffApiUrl=environment.apiUrl+"/staff-list-with-review";
    this.fnGetSettings();
    this.getAllStaff();

    this.StaffCreate = this._formBuilder.group({
      firstname : ['',[ Validators.required,Validators.minLength(3),Validators.maxLength(11)]],
      lastname : ['', [Validators.required,Validators.minLength(3),Validators.maxLength(11)]],
      address : ['', [Validators.required,Validators.minLength(3),Validators.maxLength(255)]],
      email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isEmailUnique.bind(this)],
      phone : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      description : ['',Validators.maxLength(255)],
      country : ['',Validators.required],
      state : ['',Validators.required],
      city : ['',Validators.required],
      zip : ['',Validators.required],
      staff_id : [null],
    });
    
    let newStaffAction = window.location.search.split("?goto=")
    console.log(newStaffAction)
    if(newStaffAction.length > 1 && newStaffAction[1] == 'newstaff'){
      this.fnAddNewStaff();
    }
     let addNewAction = window.location.search.split("?staff")
    if (addNewAction.length > 1) {
      // this.addNewEvents = false;
      this.fnAddNewStaff();
    }
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        let addNewAction = event.url.split("?staff")
        if(addNewAction.length > 1){
          this.fnAddNewStaff();
        }
      }
    });
  }

  // private handleError(error: HttpErrorResponse) {
  //   return throwError('Error! something went wrong.');
  //   //return error.error ? error.error : error.statusText;
  // }

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

  fnStaffListing(){
    this.addStaffPage = false;
    this.staffListPage = true;
    this.singleStaffView = false;
  }

  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }

  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
  }


  isEmailUniqueForEdit(control: FormControl) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/admin-staff-email-check`,{ email: control.value,user_id:parseInt(this.editStaffId) },{headers:headers}).pipe(map((response : any) =>{
          return response;
        }),
        catchError(this.handleError)).subscribe((res) => {
          if(res){
            if(res.data == false){
            resolve({ isEmailUniqueForEdit: true });
            }else{
            resolve(null);
            }
          }
        });
      }, 500);
    });
  }

  fnGetSettings(){
  let requestObject = {
    "business_id" : this.businessId
    };

  this.adminSettingsService.getSettingValue(requestObject).subscribe((response:any) => {
    if(response.data == true && response.response != ''){
      this.settingsArr = response.response;
     // console.log(this.settingsArr);

      this.currencySymbol = this.settingsArr.currency;
      //console.log(this.currencySymbol);
      
      this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
      //console.log(this.currencySymbolPosition);
      
      this.currencySymbolFormat = this.settingsArr.currency_format;
     // console.log(this.currencySymbolFormat);
    }else{

    }
    },
    (err) =>{
      console.log(err)
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  navigateTo(api_url){
    this.staffApiUrl=api_url;
    console.log(this.staffApiUrl);
    if(this.staffApiUrl){
      this.getAllStaff();
    }
  }

  navigateToPageNumber(index){
    this.staffApiUrl=this.path+'?page='+index;
    console.log(this.staffApiUrl);
    if(this.staffApiUrl){
      this.getAllStaff();
    }
  }

  getAllStaff() {
    this.isLoaderAdmin = true;
    let requestObject = {
        'business_id': this.businessId,
    };
    this.adminSettingsService.getAllStaff(requestObject,this.staffApiUrl).subscribe((response: any) => {
      if (response.data == true) {
        this.current_page = response.response.current_page;
        this.first_page_url = response.response.first_page_url;
        this.last_page = response.response.last_page;
        this.totalRecord = response.response.total;
        this.fromRecord = response.response.from;
        this.toRecord = response.response.to;
        this.last_page_url = response.response.last_page_url;
        this.next_page_url = response.response.next_page_url;
        this.prev_page_url = response.response.prev_page_url;
        this.path = response.response.path;
        this.allStaffList = response.response.data;

        this.allStaffList.forEach( (element) => { 
          element.is_selected = false;
        });
        this.selectAll = false;

        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.allStaffList = [];
        this.isLoaderAdmin = false;
      }
    })
  }

  fnAddStaffId(event, staffId,i) {
    if (event == true) {
      this.staffActionId.push(staffId)
      this.allStaffList[i].is_selected = true;

    }else if (event == false) {
      this.allStaffList[i].is_selected = false;

      const index = this.staffActionId.indexOf(staffId, 0);
      if (index > -1) {
        this.staffActionId.splice(index, 1);
      }
    }
    
    if (this.staffActionId.length == this.allStaffList.length ) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
    console.log(this.staffActionId);
  }
  
  checkAll(event){
    
    this.staffActionId =[];

    for (let i = 0; i < this.allStaffList.length; i++) {
      const item = this.allStaffList[i];
      item.is_selected = event.checked;
      if(event.checked){
        this.staffActionId.push(item.id)
      }
    }
    
    if(event.checked){
      this.selectAll = true;
    }else{
      this.selectAll = false;
    }

  }
  
  fnActionStaff(action) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnActionStaff(action, this.staffActionId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Staff status updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.selectedValue = undefined
        this.staffActionId.length = 0;
        this.getAllStaff();
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnGetWorkingHours(){
    let requestObject={
      "business_id":this.businessId
    }
    this.adminSettingsService.getWorkingHours(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.bussinessWorkingHoursList=response.response;
        console.log(this.bussinessWorkingHoursList);
        console.log(this.selectedStaffId);
        this.bussinessWorkingHoursList.forEach(element => {
          if(element.week_day_id == 0 && element.staff_id == this.selectedStaffId){
            element.week_day_name="Sunday";
            if(element.off_day=="N"){
              this.bussinessSundayOn=true;
              this.saturdayOn = true;
              this.formSetWorkingHours.controls['sundayToggle'].setValue(true);
            }else{
              this.bussinessSundayOn=false;
              this.sundayOn = false;
              this.formSetWorkingHours.controls['sundayToggle'].setValue(false);
            }
            if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 1 && element.staff_id == this.selectedStaffId){
            element.week_day_name="Monday";            
            if(element.off_day=="N"){
              this.bussinessMondayOn=true;
              this.mondayOn = true;
              this.formSetWorkingHours.controls['mondayToggle'].setValue(true);
            }else{
              this.bussinessMondayOn=false;
              this.mondayOn = false;
              this.formSetWorkingHours.controls['mondayToggle'].setValue(false);
            }
            if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 2 && element.staff_id == this.selectedStaffId){
            element.week_day_name="Tuesday";         
            if(element.off_day=="N"){
              this.bussinessTuesdayOn=true;
              this.tuesdayOn = true;
              this.formSetWorkingHours.controls['tuesdayToggle'].setValue(true);
            }else{
              this.bussinessTuesdayOn=false;
              this.tuesdayOn=false;
              this.formSetWorkingHours.controls['tuesdayToggle'].setValue(false);
            }
            if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 3 && element.staff_id == this.selectedStaffId){
            element.week_day_name="Wednesday";        
            if(element.off_day=="N"){
              this.bussinessWednesdayOn=true;
              this.wednesdayOn = true;
              this.formSetWorkingHours.controls['wednesdayToggle'].setValue(true);
            }else{
              this.bussinessWednesdayOn=false;
              this.wednesdayOn = false;
              this.formSetWorkingHours.controls['wednesdayToggle'].setValue(false);
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 4 && element.staff_id == this.selectedStaffId){
            element.week_day_name="Thursday";       
            if(element.off_day=="N"){
              this.bussinessThursdayOn=true;
              this.thursdayOn = true;
              this.formSetWorkingHours.controls['thursdayToggle'].setValue(true);
            }else{
              this.bussinessThursdayOn=false;
              this.thursdayOn = false;
              this.formSetWorkingHours.controls['thursdayToggle'].setValue(false);
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 5 && element.staff_id == this.selectedStaffId){
            element.week_day_name="Friday";     
            if(element.off_day=="N"){
              this.bussinessFridayOn=true;
              this.fridayOn = true;
              this.formSetWorkingHours.controls['fridayToggle'].setValue(true);
            }else{
              this.bussinessFridayOn=false;
              this.fridayOn = false;
              this.formSetWorkingHours.controls['fridayToggle'].setValue(false);
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
            }
          }
          if(element.week_day_id == 6 && element.staff_id == this.selectedStaffId){
            element.week_day_name="Saturday";    
            if(element.off_day=="N"){
              this.bussinessSaturdayOn=true;
              this.saturdayOn = true;
              this.formSetWorkingHours.controls['saturdayToggle'].setValue(true);
            }else{
              this.bussinessSaturdayOn=false;
              this.saturdayOn = false;
              this.formSetWorkingHours.controls['saturdayToggle'].setValue(false);
            }
            if(element.day_start_time && element.day_end_time){
            element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
            element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
            }
          }
        });
      }
      else{
       
      }
    })
  }

  fnShowAddWorkHourForm(day){
    if(day == "Monday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("mondayStartTime").value){
          this.mondayWorkingHourStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("mondayEndTime").value){
          this.mondayWorkingHourEndTimeIndex=i;
        }
      }
      this.selectedWorkHourStartTimeMonday=this.formSetWorkingHours.get("mondayStartTime").value;
      this.selectedWorkHourEndTimeMonday=this.formSetWorkingHours.get("mondayEndTime").value;
      this.showMondayAddForm=this.showMondayAddForm==true?false:true;
      // this.mondayBreakStartTimeIndex=0;
      // this.mondayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Tuesday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("tuesdayStartTime").value){
          this.tuesdayWorkingHourStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("tuesdayEndTime").value){
          this.tuesdayWorkingHourEndTimeIndex=i;
        }
      }
      this.selectedWorkHourStartTimeTuesday=this.formSetWorkingHours.get("tuesdayStartTime").value;
      this.selectedWorkHourEndTimeTuesday=this.formSetWorkingHours.get("tuesdayEndTime").value;
      this.showTuesdayAddForm=this.showTuesdayAddForm==true?false:true;
      // this.tuesdayBreakStartTimeIndex=0;
      // this.tuesdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Wednesday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("wednesdayStartTime").value){
          this.wednesdayWorkingHourStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("wednesdayEndTime").value){
          this.wednesdayWorkingHourEndTimeIndex=i;
        }
      }
      this.selectedWorkHourStartTimeWednesday=this.formSetWorkingHours.get("wednesdayStartTime").value;
      this.selectedWorkHourEndTimeWednesday=this.formSetWorkingHours.get("wednesdayEndTime").value;
      this.showWednesdayAddForm=this.showWednesdayAddForm==true?false:true;
      // this.wednesdayBreakStartTimeIndex=0;
      // this.wednesdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Thursday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("thursdayStartTime").value){
          this.thursdayWorkingHourStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("thursdayEndTime").value){
          this.thursdayWorkingHourEndTimeIndex=i;
        }
      }
      this.selectedWorkHourStartTimeThursday=this.formSetWorkingHours.get("thursdayStartTime").value;
      this.selectedWorkHourEndTimeThursday=this.formSetWorkingHours.get("thursdayEndTime").value;
      this.showThursdayAddForm=this.showThursdayAddForm==true?false:true;
      // this.thursdayBreakStartTimeIndex=0;
      // this.thursdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Friday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("fridayStartTime").value){
          this.fridayWorkingHourStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("fridayEndTime").value){
          this.fridayWorkingHourEndTimeIndex=i;
        }
      }
      this.selectedWorkHourStartTimeFriday=this.formSetWorkingHours.get("fridayStartTime").value;
      this.selectedWorkHourEndTimeFriday=this.formSetWorkingHours.get("fridayEndTime").value;
      this.showFridayAddForm=this.showFridayAddForm==true?false:true;
      // this.fridayBreakStartTimeIndex=0;
      // this.fridayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Saturday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("saturdayStartTime").value){
          this.saturdayWorkingHourStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("saturdayEndTime").value){
          this.saturdayWorkingHourEndTimeIndex=i;
        }
      }
      this.selectedWorkHourStartTimeSaturday=this.formSetWorkingHours.get("saturdayStartTime").value;
      this.selectedWorkHourEndTimeSaturday=this.formSetWorkingHours.get("saturdayEndTime").value;
      this.showSaturdayAddForm=this.showSaturdayAddForm==true?false:true;
      // this.saturdayBreakStartTimeIndex=0;
      // this.saturdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Sunday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("sundayStartTime").value){
          this.sundayWorkingHourStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("sundayEndTime").value){
          this.sundayWorkingHourEndTimeIndex=i;
        }
      }
      this.selectedWorkHourStartTimeSunday=this.formSetWorkingHours.get("sundayStartTime").value;
      this.selectedWorkHourEndTimeSunday=this.formSetWorkingHours.get("sundayEndTime").value;
      this.showSundayAddForm=this.showSundayAddForm==true?false:true;
      // this.sundayBreakStartTimeIndex=0;
      // this.sundayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
  }

  fnOnChangeStartTimeWorkHour(event,day){
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.mondayWorkingHourEndTimeIndex<=this.mondayWorkingHourStartTimeIndex){
        this.selectedWorkHourEndTimeMonday=null;
      }
    }

    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.tuesdayWorkingHourEndTimeIndex<=this.tuesdayWorkingHourStartTimeIndex){
        this.selectedWorkHourEndTimeTuesday=null;
      }
    }

    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.wednesdayWorkingHourEndTimeIndex<=this.wednesdayWorkingHourStartTimeIndex){
        this.selectedWorkHourEndTimeWednesday=null;
      }
    }

    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.thursdayWorkingHourEndTimeIndex<=this.thursdayWorkingHourStartTimeIndex){
        this.selectedWorkHourEndTimeThursday=null;
      }
    }

    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.fridayWorkingHourEndTimeIndex<=this.fridayWorkingHourStartTimeIndex){
        this.selectedWorkHourEndTimeFriday=null;
      }
    }

    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.saturdayWorkingHourEndTimeIndex<=this.saturdayWorkingHourStartTimeIndex){
        this.selectedWorkHourEndTimeSaturday=null;
      }
    }

    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.sundayWorkingHourEndTimeIndex<=this.sundayWorkingHourStartTimeIndex){
        this.selectedWorkHourEndTimeSunday=null;
      }
    }
  }

  fnOnChangeEndTimeWorkHour(event,day){
    
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayWorkingHourEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayWorkingHourEndTimeIndex=i;
        }
      }
    }
  }

  fnAddWorkHour(day){
    let requestObject={
      "business_id":'',
      "staff_id": this.selectedStaffId,
      "start_time":'',
      "end_time":'',
      "dayNumber":''
    }
    if(day == "Monday"){
      if(this.selectedWorkHourStartTimeMonday==null || this.selectedWorkHourEndTimeMonday==null){
        if(this.selectedWorkHourStartTimeMonday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeMonday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }

        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "staff_id": this.selectedStaffId,
        "start_time":this.selectedWorkHourStartTimeMonday,
        "end_time":this.selectedWorkHourEndTimeMonday,
        "dayNumber":"1"
      }
      console.log(requestObject);
    }
    if(day == "Tuesday"){
      if(this.selectedWorkHourStartTimeTuesday==null || this.selectedWorkHourEndTimeTuesday==null){
        if(this.selectedWorkHourStartTimeTuesday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeTuesday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "staff_id": this.selectedStaffId,
        "start_time":this.selectedWorkHourStartTimeTuesday,
        "end_time":this.selectedWorkHourEndTimeTuesday,
        "dayNumber":"2"
      }
      console.log(requestObject);
    }
    if(day == "Wednesday"){
      if(this.selectedWorkHourStartTimeWednesday==null || this.selectedWorkHourEndTimeWednesday==null){
        if(this.selectedWorkHourStartTimeWednesday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeWednesday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "staff_id": this.selectedStaffId,
        "start_time":this.selectedWorkHourStartTimeWednesday,
        "end_time":this.selectedWorkHourEndTimeWednesday,
        "dayNumber":"3"
      }
      console.log(requestObject);
    }
    if(day == "Thursday"){
      if(this.selectedWorkHourStartTimeThursday==null || this.selectedWorkHourEndTimeThursday==null){
        if(this.selectedWorkHourStartTimeThursday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeThursday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "staff_id": this.selectedStaffId,
        "start_time":this.selectedWorkHourStartTimeThursday,
        "end_time":this.selectedWorkHourEndTimeThursday,
        "dayNumber":"4"
      }
      console.log(requestObject);
    }
    if(day == "Friday"){
      if(this.selectedWorkHourStartTimeFriday==null || this.selectedWorkHourEndTimeFriday==null){
        if(this.selectedWorkHourStartTimeFriday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeFriday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "staff_id": this.selectedStaffId,
        "start_time":this.selectedWorkHourStartTimeFriday,
        "end_time":this.selectedWorkHourEndTimeFriday,
        "dayNumber":"5"
      }
      console.log(requestObject);
    }
    if(day == "Saturday"){
      if(this.selectedWorkHourStartTimeSaturday==null || this.selectedWorkHourEndTimeSaturday==null){
        if(this.selectedWorkHourStartTimeSaturday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeSaturday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "staff_id": this.selectedStaffId,
        "start_time":this.selectedWorkHourStartTimeSaturday,
        "end_time":this.selectedWorkHourEndTimeSaturday,
        "dayNumber":"6"
      }
      console.log(requestObject);
    }
    if(day == "Sunday"){
      if(this.selectedWorkHourStartTimeSunday==null || this.selectedWorkHourEndTimeSunday==null){
        if(this.selectedWorkHourStartTimeSunday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeSunday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "staff_id": this.selectedStaffId,
        "start_time":this.selectedWorkHourStartTimeSunday,
        "end_time":this.selectedWorkHourEndTimeSunday,
        "dayNumber":"0"
      }
      console.log(requestObject);
    }
    this.adminSettingsService.addNewWorkingHoursStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this.showMondayWorkHourAddForm=false;
        this.showTuesdayWorkHourAddForm=false;
        this.showWednesdayWorkHourAddForm=false;
        this.showThursdayWorkHourAddForm=false;
        this.showFridayWorkHourAddForm=false;
        this.showSaturdayWorkHourAddForm=false;
        this.showSundayWorkHourAddForm=false;
        this.showMondayAddForm=false;
        this.showTuesdayAddForm=false;
        this.showWednesdayAddForm=false;
        this.showThursdayAddForm=false;
        this.showFridayAddForm=false;
        this.showSaturdayAddForm=false;
        this.showSundayAddForm=false;
        this._snackBar.open("Working Hours Added.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
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

  fnDeleteWorkHour(WorkHourId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(WorkHourId);
        let requestObject={
          "working_hours_id":WorkHourId
        }

        this.adminSettingsService.deleteWorkingHours(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
            this._snackBar.open(response.response?response.response:"Working Hour Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
          } else if(response.data == false && response.response !== 'api token or userid invaild'){
           this._snackBar.open(response.response?response.response:"Working Hour Not Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
        })
      }
    });
  }

  fnChangeStaffStatus(event, staffId) {
    this.isLoaderAdmin = true;
    if (event == true) {
      this.singleStaffStatus = 'E'
    }
    else if (event == false) {
      this.singleStaffStatus = 'D'
    }
    this.staffActionId.push(staffId)
    this.adminSettingsService.fnActionStaff(this.singleStaffStatus, this.staffActionId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Staff status updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.getAllStaff();
        this.staffActionId.length = 0;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnViewSingleStaff(staffId,index) {
    
    this.selectedPostalCodeArr = [];
    console.log(this.selectedPostalCodeArr);
    this.singleStaffIndex = index;
    this.isLoaderAdmin = true;
    this.selectedStaffId= staffId;
    //this.fnGetWorkingHours();
    this.singleStaffDataRating = this.allStaffList[index]

    let requestObject = {
        'business_id': this.businessId,
        'staff_id': staffId,
    };
    this.adminSettingsService.fnViewSingleStaff(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.singleStaffDetail = response.response
        if(this.singleStaffDetail.postalCode.length == 0){
          this.singleStaffDetail.postalCode = undefined;
        }
        this.selectedServiceNewStaff=[];
        this.singleStaffDetail.staff[0].services.forEach(element => {
          this.selectedServiceNewStaff.push(element.id);
        });
        this.singleStaffDetail.staff[0].postal_codes.forEach(element => {
          this.selectedPostalCodeArr.push(element.id);
        });
        if(this.singleStaffDetail.workingHours.length>0){
          this.workingHoursList=this.singleStaffDetail.workingHours;
          this.workingHoursList.forEach(element => {
            if(element.week_day_id == 0){
              element.week_day_name="Sunday";
              if(element.off_day=="N"){
                this.sundayOn=true;
                this.formSetWorkingHours.controls['sundayToggle'].setValue(true);
              }else{
                this.sundayOn=false;
                this.formSetWorkingHours.controls['sundayToggle'].setValue(false);
              }
              if(element.day_start_time && element.day_end_time){
                element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
                element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 1){
              element.week_day_name="Monday";            
              if(element.off_day=="N"){
                this.mondayOn=true;
                this.formSetWorkingHours.controls['mondayToggle'].setValue(true);
              }else{
                this.mondayOn=false;
                this.formSetWorkingHours.controls['mondayToggle'].setValue(false);
              }
              if(element.day_start_time && element.day_end_time){
                element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
                element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 2){
              element.week_day_name="Tuesday";         
              if(element.off_day=="N"){
                this.tuesdayOn=true;
                this.formSetWorkingHours.controls['tuesdayToggle'].setValue(true);
              }else{
                this.tuesdayOn=false;
                this.formSetWorkingHours.controls['tuesdayToggle'].setValue(false);
              }
              if(element.day_start_time && element.day_end_time){
                element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
                element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 3){
              element.week_day_name="Wednesday";        
              if(element.off_day=="N"){
                this.wednesdayOn=true;
                this.formSetWorkingHours.controls['wednesdayToggle'].setValue(true);
              }else{
                this.wednesdayOn=false;
                this.formSetWorkingHours.controls['wednesdayToggle'].setValue(false);
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 4){
              element.week_day_name="Thursday";       
              if(element.off_day=="N"){
                this.thursdayOn=true;
                this.formSetWorkingHours.controls['thursdayToggle'].setValue(true);
              }else{
                this.thursdayOn=false;
                this.formSetWorkingHours.controls['thursdayToggle'].setValue(false);
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 5){
              element.week_day_name="Friday";     
              if(element.off_day=="N"){
                this.fridayOn=true;
                this.formSetWorkingHours.controls['fridayToggle'].setValue(true);
              }else{
                this.fridayOn=false;
                this.formSetWorkingHours.controls['fridayToggle'].setValue(false);
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 6){
              element.week_day_name="Saturday";    
              if(element.off_day=="N"){
                this.saturdayOn=true;
                this.formSetWorkingHours.controls['saturdayToggle'].setValue(true);
              }else{
                this.saturdayOn=false;
                this.formSetWorkingHours.controls['saturdayToggle'].setValue(false);
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.day_end_time),"HH:mm");
              }
            }
          });

        }
        if(this.singleStaffDetail.breaktime.length>0){
          this.breakTimeList= this.singleStaffDetail.breaktime;
          this.breakTimeList.forEach(element => {
            if(element.break_start_time){
             element.break_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.break_start_time),"HH:mm");
            }
            if(element.break_end_time){
              element.break_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+element.break_end_time),"HH:mm");
            }
          });
        }else{
          this.breakTimeList= [];
        }

        if(this.singleStaffDetail.timeoff.length>0){
        this.timeOffList= this.singleStaffDetail.timeoff;
        this.timeOffList.forEach(element => {
          if(element.start_date){
            element.start_date=this.datePipe.transform(new Date(element.start_date),"MMM dd, yyyy");
          }
          if(element.end_date){
            element.end_date=this.datePipe.transform(new Date(element.end_date),"MMM dd, yyyy");
          }
        });
      }else{
        this.timeOffList= [];
      }

        this.staffListPage = false;
        this.addStaffPage = false;
        this.singleStaffView = true;
        this.isLoaderAdmin = false;
        
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnChangeInternalStaff(event, staffId) {
    this.isLoaderAdmin = true;
    if (event == true) {
      this.staffInternalStatus = 'Y'
    }
    else if (event == false) {
      this.staffInternalStatus = 'N'
    }
    this.adminSettingsService.fnChangeInternalStaff(this.staffInternalStatus, staffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Internal Staff status updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnChangeLoginAllowStaff(event, staffId) {
    this.isLoaderAdmin = true;
    if (event == true) {
      this.staffLoginStatus = 'Y'
    }
    else if (event == false) {
      this.staffLoginStatus = 'N'
    }
    this.adminSettingsService.fnChangeLoginAllowStaff(this.staffLoginStatus, staffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Login allowed status updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  checkAllPostalCode(event) {

    this.addPostalCodeId = [];
    for (let i = 0; i < this.singleStaffDetail.postalCode.length; i++) {
      const item = this.singleStaffDetail.postalCode[i];
      item.is_selected = event.checked;
      if (event.checked) {
        this.addPostalCodeId.push(item.id)
      }
    }

    if (event.checked) {
      this.selectAllPostalCode = true;
    } else {
      this.selectAllPostalCode = false;
    }


  }

  fnAddPostalCodeId(event, postalCodeId) {
    if (event == true) {
      this.addPostalCodeId.push(postalCodeId)
    }
    else if (event == false) {
      const index = this.addPostalCodeId.indexOf(postalCodeId, 0);
      if (index > -1) {
        this.addPostalCodeId.splice(index, 1);
      }
    }
  }

  fnAssignPostalToStaff(value) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnAssignPostalToStaff(value, this.addPostalCodeId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.selectedPostalCodeArr.length = 0;
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex)
        this.addPostalCodeId.length = 0;
        this.selectedValue = undefined
        this.isLoaderAdmin = false;
        this.selectAllPostalCode = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnSingleAssignPostalCode(event, postalCodeId) {
    this.isLoaderAdmin = true;
    if (event == true) {
      this.singlePostalCodeStatus = 'E'
    } else if (event == false) {
      this.singlePostalCodeStatus = 'D'
    }
    this.addPostalCodeId.push(postalCodeId)
    this.adminSettingsService.fnAssignPostalToStaff(this.singlePostalCodeStatus, this.addPostalCodeId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        const selectedPostalCodeIndex = this.singleStaffDetail.postalCode.findIndex(x => x.id === postalCodeId);
        let selectedPostalCodeIndex1 = this.selectedPostalCodeArr.indexOf(postalCodeId);
        console.log(selectedPostalCodeIndex);
        console.log(this.addPostalCodeId);
        console.log(this.selectedPostalCodeArr);
        if (event == true) {
          this.selectedPostalCodeArr.push(postalCodeId)
        } else if (event == false) {
          this.selectedPostalCodeArr.splice(selectedPostalCodeIndex1, 1)
        }
        // this.selectedPostalCodeArr.length = 0;
        console.log(this.singleStaffDetail.postalCode);
        
        // this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex)
        this.addPostalCodeId.length = 0;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnAssignServiceToStaff(event, serviceId) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnAssignServiceToStaff(event, serviceId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open('Staff service updated.', "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex)
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnBackStaffList(){
    this.isLoaderAdmin = true;
    this.addStaffPage = false;
    this.staffListPage = true;
    this.singleStaffView = false;
    this.getAllStaff();
    this.isLoaderAdmin = false;
  }

  fnAddNewStaff(){
    this.isLoaderAdmin = true;
    this.gelAllCountry();
    this.addStaffPage = true;
    this.staffListPage = false;
    this.singleStaffView = false;
    this.isLoaderAdmin = false;
    this.StaffCreate.reset();
    this.selectedServiceNewStaff=[];
    this.files=[];
    if(this.singleStaffDetail){ 
      this.singleStaffDetail.staff[0].getdocument = []; 
    }
    this.editStaffId=null;
    this.getCateServiceList();
    this.StaffCreate = this._formBuilder.group({
      firstname : ['',[ Validators.required,Validators.minLength(3),Validators.maxLength(11)]],
      lastname : ['', [Validators.required,Validators.minLength(3),Validators.maxLength(11)]],
      address : ['', [Validators.required,Validators.minLength(3),Validators.maxLength(255)]],
      email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isEmailUnique.bind(this)],
      phone : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      description : ['',Validators.maxLength(255)],
      country : ['',Validators.required],
      state : ['',Validators.required],
      city : ['',Validators.required],
      zip : ['',Validators.required],
      staff_id : [null],
    });  
  }


  
  gelAllCountry(){
    this.isLoaderAdmin =true;
    this.adminSettingsService.gelAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
        
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.allCountry = [];
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin =false;
    })
  }
  selectCountry(country_id){
    this.isLoaderAdmin =true;
    this.adminSettingsService.gelAllState(country_id).subscribe((response:any) => {
      if(response.data == true){
        this.allStates = response.response
        this.StaffCreate.controls['state'].setValue('');
        if(this.editStaffId){
          this.StaffCreate.controls['state'].setValue(this.singleStaffDetail.staff[0].state_details.id);
        }
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.allStates = ''
        this.StaffCreate.controls['state'].setValue('');
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
    this.adminSettingsService.gelAllCities(state_id).subscribe((response:any) => {
      if(response.data == true){
        this.StaffCreate.controls['city'].setValue('');
        this.allCities = response.response;
        if(this.editStaffId){
          this.StaffCreate.controls['city'].setValue(this.singleStaffDetail.staff[0].city_details.id);
        }
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.allCities = [];
        this.StaffCreate.controls['city'].setValue('');
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin =false;
    })
  }

  searchService(event){
    this.categoryServiceListTemp=[];
    this.categoryServiceList.forEach(element => {
      if(element.category_title && element.category_title.toLowerCase().includes(event.target.value.toLowerCase())){
        this.categoryServiceListTemp.push(element);
        return;
      }
      element.subcategory.forEach(subelement => {
        if(subelement.sub_category_name && subelement.sub_category_name.toLowerCase().includes(event.target.value.toLowerCase())){
          if(!this.categoryServiceListTemp.some((item) => item.id == element.id)){
            this.categoryServiceListTemp.push(element);
          }
          console.log(subelement.sub_category_name);
          return;
        }
        subelement.services.forEach(serviceselement => {
          if(serviceselement.service_name && serviceselement.service_name.toLowerCase().includes(event.target.value.toLowerCase())){
            if(!this.categoryServiceListTemp.some((item) => item.id == element.id)){
              this.categoryServiceListTemp.push(element);
            }
            console.log(serviceselement.service_name);
            return;
          }
        });
      });
    });

    
    console.log(this.categoryServiceList);

  }

  getCateServiceList(){
    this.isLoaderAdmin = true;
    let requestObject = {
        'business_id': this.businessId,
        'search': ""
    };

    this.adminSettingsService.getCateServiceList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.categoryServiceList = response.response;

        this.categoryServiceList.forEach(element => {
          element.is_selected  = false;
          
          let subCategoryLength = element.subcategory.length ;
          let selectedSubCategoryCount = 0;
          element.subcategory.forEach(subelement => {
            subelement.is_selected = false;
            let serviceLength = subelement.services.length ;
            let selectedServiceCount = 0;
            subelement.services.forEach(serviceselement => {
              serviceselement.is_selected = false;
              
              const index = this.selectedServiceNewStaff.indexOf(serviceselement.id, 0);
              if (index > -1) {
                this.categoryServiceCheckServiceId.push(serviceselement.id);
                serviceselement.is_selected = true;
                selectedServiceCount++;
              }
            });
            if(selectedServiceCount!= 0 && selectedServiceCount == serviceLength){
              subelement.is_selected = true;
              selectedSubCategoryCount++;
            }
          });
          if(selectedSubCategoryCount!= 0 && selectedSubCategoryCount == subCategoryLength){
            element.is_selected = true;
          }

          if(element.getservices.length > 0){
            let dserviceLength = element.getservices.length ;
            let dselectedServiceCount = 0;
            element.getservices.forEach(serviceselement => {
              serviceselement.is_selected = false;
              const index = this.selectedServiceNewStaff.indexOf(serviceselement.id, 0);
              if (index > -1) {
                this.categoryServiceCheckServiceId.push(serviceselement.id);
                serviceselement.is_selected = true;
                dselectedServiceCount++;
              }
            });
            if(dserviceLength == dselectedServiceCount){
              element.is_selected = true;
            }
          }
        });

        this.categoryServiceListTemp=this.categoryServiceList;
        console.log(" this.categoryServiceListTemp>>>>>>>>>>>", this.categoryServiceListTemp);
        
        this.isLoaderAdmin = false;
      } else if(response.data == false && response.response !== 'api token or userid invaild'){

        this.categoryServiceList = [];
        this.categoryServiceListTemp = [];
        this.isLoaderAdmin = false;

      }
    });

  }
  
  checkServie(event,type,index,sub_index=null,service_index=null){
    
    console.log("categoryServiceList>>>>>>>>>>index",this.categoryServiceList[index]);
    if(type=='category'){
        if(event.checked == true) {  this.categoryServiceList[index].is_selected=true; }else{ this.categoryServiceList[index].is_selected=false; }

        this.categoryServiceList[index].subcategory.forEach(subelement => {
          if(event.checked == true) {
            subelement.is_selected=true;
           }else{ 
            subelement.is_selected=false;
          }
          subelement.services.forEach(serviceselement => {
            if(event.checked == true) {  serviceselement.is_selected=true; }else{ serviceselement.is_selected=false; }
          });
        });
    }
    
    if(type=='subcategory'){

      if(event.checked == true) { 
         this.categoryServiceList[index].subcategory[sub_index].is_selected=true;
      }else{ 
        this.categoryServiceList[index].subcategory[sub_index].is_selected=false;
      }

      this.categoryServiceList[index].subcategory[sub_index].services.forEach(serviceselement => {
        if(event.checked == true) {  serviceselement.is_selected=true; }else{ serviceselement.is_selected=false; }
      });

      var category_i = 0;

      this.categoryServiceList[index].subcategory.forEach(element => {
          if(element.is_selected == true){
            category_i++;
          }
      });

      if(category_i == this.categoryServiceList[index].subcategory.length){
        this.categoryServiceList[index].is_selected = true;
      }else{
        this.categoryServiceList[index].is_selected = false;
      }
    }

    if(type=='service'){

      if(event.checked == true) { 
        this.categoryServiceList[index].subcategory[sub_index].services[service_index].is_selected=true;
      }else{ 
        this.categoryServiceList[index].subcategory[sub_index].services[service_index].is_selected=false;
      }

      var subcategory_i = 0;

      this.categoryServiceList[index].subcategory[sub_index].services.forEach(serviceselement => {
        if(serviceselement.is_selected==true){
          subcategory_i++;
        }
      });
      
      if(subcategory_i == this.categoryServiceList[index].subcategory[sub_index].services.length){
        this.categoryServiceList[index].subcategory[sub_index].is_selected = true;
      }else{
        this.categoryServiceList[index].subcategory[sub_index].is_selected = false;
      }

      
      var category_i = 0;
      this.categoryServiceList[index].subcategory.forEach(element => {
          if(element.is_selected == true){
            category_i++;
          }
      });

      if(category_i == this.categoryServiceList[index].subcategory.length){
        this.categoryServiceList[index].is_selected = true;
      }else{
        this.categoryServiceList[index].is_selected = false;
      }
    }


    this.categoryServiceCheckServiceId = [];
    this.categoryServiceList.forEach(element => {
      element.subcategory.forEach(subelement => {
        subelement.services.forEach(serviceselement => {
          if(serviceselement.is_selected == true){
            this.categoryServiceCheckServiceId.push(serviceselement.id)
          }
        });
      });
    });

    console.log(this.categoryServiceCheckServiceId);
    this.categoryServiceListTemp=this.categoryServiceList;

  }

  fnNewCheckService(event,serviceId,index,service_index){

    if(event == true){
      this.categoryServiceCheckServiceId.push(serviceId) 
    }else if(event == false){
      const index = this.categoryServiceCheckServiceId.indexOf(serviceId);
      this.categoryServiceCheckServiceId.splice(index, 1);
    }

    this.categoryServiceList[index].getservices[service_index].is_selected=event;
    var category_i = 0;
    this.categoryServiceList[index].getservices.forEach(serviceselement => {
      if(serviceselement.is_selected==true){
        category_i = category_i+1;
        console.log('--');
      }
    });

    if(category_i == this.categoryServiceList[index].getservices.length){
      this.categoryServiceList[index].is_selected = true;
    }else{
      this.categoryServiceList[index].is_selected = false;
    }

    this.categoryServiceListTemp=this.categoryServiceList;

  }

  checkCategoryServie(event,Category_index){
    this.categoryServiceList[Category_index].getservices.forEach(element => {
      if(event == true){
        element.is_selected = true;
        this.categoryServiceCheckServiceId.push(element.id);
        this.categoryServiceList[Category_index].is_selected = true;
      }else{
        element.is_selected = false;
        this.categoryServiceList[Category_index].is_selected = false;
        const index = this.categoryServiceCheckServiceId.indexOf(element.id);
        this.categoryServiceCheckServiceId.splice(index, 1);
      }
    });

    this.removeDuplicates(this.categoryServiceCheckServiceId);
  }

  removeDuplicates(num) {
    var x,
        len=num.length,
        out=[],
        obj={};
   
    for (x=0; x<len; x++) {
      obj[num[x]]=0;
    }
    for (x in obj) {
      out.push(parseInt(x));
    }
    
    this.categoryServiceCheckServiceId = out;
    console.log(this.categoryServiceCheckServiceId);
  }

  fnSubmitCreateStaff(){
    if(this.editStaffId){
    // if(this.StaffCreate.get('staff_id').value != '' || this.StaffCreate.get('staff_id').value != null){
      if(this.StaffCreate.valid){
        // New code by RJ
          let formData = new FormData();
          var i=0;
          console.log(this.files)
          this.files.forEach(element => {
            formData.append('document[]', this.files[i]); 
            i++;
          });
          formData.append('staff_id', this.StaffCreate.get('staff_id').value);
          formData.append('firstname', this.StaffCreate.get('firstname').value);
          formData.append('lastname', this.StaffCreate.get('lastname').value);
          formData.append('email', this.StaffCreate.get('email').value);
          formData.append('phone', this.StaffCreate.get('phone').value);
          formData.append('address', this.StaffCreate.get('address').value);
          formData.append('description', this.StaffCreate.get('description').value);
          formData.append('country', this.StaffCreate.get('country').value);
          formData.append('state', this.StaffCreate.get('state').value);
          formData.append('city', this.StaffCreate.get('city').value);
          formData.append('postalcode', this.StaffCreate.get('zip').value); 
          formData.append('servicelist', this.categoryServiceCheckServiceId);
          
          if(this.staffImageUrl!=undefined){
            formData.append('image', this.staffImageUrl);
          }
          this.updateStaff(formData);

      }else{
        this.StaffCreate.get('firstname').markAsTouched();
        this.StaffCreate.get('lastname').markAsTouched();
        this.StaffCreate.get('email').markAsTouched();
        this.StaffCreate.get('phone').markAsTouched();
        this.StaffCreate.get('address').markAsTouched();
        this.StaffCreate.get('description').markAsTouched();
        this.StaffCreate.get('country').markAsTouched();
        this.StaffCreate.get('state').markAsTouched();
        this.StaffCreate.get('city').markAsTouched();
        this.StaffCreate.get('zip').markAsTouched();
      }

    }else{ 

      if(this.StaffCreate.valid){
        let formData = new FormData();
        var i=0;
        this.files.forEach(element => {
          formData.append('document[]', this.files[i]); 
          i++;
        });
        
        formData.append('business_id', this.businessId);        
        formData.append('firstname', this.StaffCreate.get('firstname').value);
        formData.append('lastname', this.StaffCreate.get('lastname').value);
        formData.append('email', this.StaffCreate.get('email').value);
        formData.append('phone', this.StaffCreate.get('phone').value);
        formData.append('address', this.StaffCreate.get('address').value);
        formData.append('description', this.StaffCreate.get('description').value);
        formData.append('country', this.StaffCreate.get('country').value);
        formData.append('state', this.StaffCreate.get('state').value);
        formData.append('city', this.StaffCreate.get('city').value);
        formData.append('postalcode', this.StaffCreate.get('zip').value);  
        formData.append('servicelist', this.categoryServiceCheckServiceId);
        formData.append('image', this.staffImageUrl);
         this.createNewStaff(formData);

         console.log('-----------------------------++++++++++++++++++++++++++++++++++++++++++++')
         console.log(this.StaffCreate.get('description').value)
      }else{
        this.StaffCreate.get('firstname').markAsTouched();
        this.StaffCreate.get('lastname').markAsTouched();
        this.StaffCreate.get('email').markAsTouched();
        this.StaffCreate.get('phone').markAsTouched();
        this.StaffCreate.get('address').markAsTouched();
        this.StaffCreate.get('description').markAsTouched();
        this.StaffCreate.get('country').markAsTouched();
        this.StaffCreate.get('state').markAsTouched();
        this.StaffCreate.get('city').markAsTouched();
        this.StaffCreate.get('zip').markAsTouched();
      }
    }
  }

  createNewStaff(newStaffData){
    this.isLoaderAdmin = true;
    this.adminSettingsService.createNewStaff(newStaffData).subscribe((response:any) => {
      this.isLoaderAdmin = false;
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
         this.getAllStaff();
         this.StaffCreate.reset();
         this.staffImageUrl = undefined
         this.addStaffPage = false;
         this.staffListPage = true;
        this.isLoaderAdmin = false;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.isLoaderAdmin = false;
      }
    });

  }

  updateStaff(updateStaffData){
    this.isLoaderAdmin = true;
    this.adminSettingsService.updateStaff(updateStaffData).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
         this.getAllStaff();
         this.StaffCreate.reset();
         this.staffImageUrl = undefined
         this.addStaffPage = false;
         this.staffListPage = false;
         this.editStaffId=undefined;
         this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
         this.singleStaffView = true;
        this.isLoaderAdmin = false;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.isLoaderAdmin = false;
      }
    })
  }

  fnDeleteStaff(staffId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(staffId);
        this.selectedStaffId = staffId
        this.isLoaderAdmin = true;
        let requestObject = {
            'staff_id': this.selectedStaffId,
            'business_id': this.businessId,
        };
        this.adminSettingsService.fnDeleteStaff(requestObject).subscribe((response:any) => {
            if(response.data == true){
              this._snackBar.open(response.response, "X", {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['green-snackbar']
              });
            this.getAllStaff();
            this.singleStaffView = false;
            this.staffListPage = true;
            this.isLoaderAdmin = false;
          }
          else if(response.data == false && response.response !== 'api token or userid invaild'){
            this.isLoaderAdmin = false;
          }
        })
      }
    });
  }

  fnEditStaff(staffId){
    this.editStaffId = staffId;
    this.gelAllCountry();
    this.selectCountry(this.singleStaffDetail.staff[0].country_details.id?this.singleStaffDetail.staff[0].country_details.id:1);
    this.selectStates(this.singleStaffDetail.staff[0].state_details.id?this.singleStaffDetail.staff[0].state_details.id:1);
    this.isLoaderAdmin = true;
    this.addStaffPage = true;
    this.staffListPage = false;
    this.singleStaffView = false;
    this.selectedServiceNewStaff=[];
    this.files =[];
    this.StaffCreate = this._formBuilder.group({
      firstname : [this.singleStaffDetail.staff[0].firstname,[ Validators.required,Validators.minLength(3),Validators.maxLength(11)]],
      lastname : [this.singleStaffDetail.staff[0].lastname, [Validators.required,Validators.minLength(3),Validators.maxLength(11)]],
      address : [this.singleStaffDetail.staff[0].address, [Validators.required,Validators.minLength(3),Validators.maxLength(255)]],
      email : [this.singleStaffDetail.staff[0].email, [Validators.required,Validators.email,Validators.pattern(this.emailFormat)],this.isEmailUniqueForEdit.bind(this)],
      phone : [this.singleStaffDetail.staff[0].phone, [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
      description : [this.singleStaffDetail.staff[0].description,Validators.maxLength(255)],
      country : [this.singleStaffDetail.staff[0].country_details.id,Validators.required],
      state : ['', Validators.required],
      city : ['', Validators.required],
      zip : [this.singleStaffDetail.staff[0].zip,Validators.required],
      staff_id : [staffId],
    });

    this.singleStaffDetail.staff[0].services.forEach(element => {
      this.selectedServiceNewStaff.push(element.id);
    });
    console.log(this.StaffCreate);

    this.getCateServiceList();
    this.isLoaderAdmin = false;
  }

 fnBackStaff(){
   this.addStaffPage = false;
    this.staffListPage = true;
    this.singleStaffView = false;

 }

 fnCancelStaff(){
   if(this.editStaffId){
    this.staffImageUrl = undefined
    this.addStaffPage = false;
    this.staffListPage = false;
    this.singleStaffView = true;
    this.StaffCreate.reset();
   }else{
    this.staffImageUrl = undefined
    this.addStaffPage = false;
    this.staffListPage = true;
    this.singleStaffView = false;
    this.StaffCreate.reset();
   }
   this.router.navigate(['/admin/settings-resource/staff']);
   
 }

  addTimeOff() {
    const dialogRef = this.dialog.open(DialogAddNewTimeOff, {
      width: '500px',
      data:{selectedStaffId:this.selectedStaffId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result != undefined){
        if(result.call==true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
       }
      }
    });
  }

  staffImage() {
    const dialogRef = this.dialog.open(DialogStaffImageUpload, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.staffImageUrl = result;
        // this.singleStaffDetail.staff[0].image=result;
      }
    });
  }

  staffRemoveImage() {
    let requestObject = {
      'user_type': 'SM',
      'user_id': this.singleStaffDetail.staff[0].id
    }
    this.isLoaderAdmin =true;
    this.adminSettingsService.removeImage(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        let requestObject = {
          'business_id': this.businessId,
          'staff_id': this.singleStaffDetail.staff[0].id,
        };
        this.adminSettingsService.fnViewSingleStaff(requestObject).subscribe((response: any) => {
          if (response.data == true) {
            this.singleStaffDetail = response.response
            this.fnEditStaff(this.singleStaffDetail.staff[0].id)
          }
        });
      }else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
      this.isLoaderAdmin =false;
    })
  }

  fnGetTimeSlotsList(start, end,interval){
    var start = start.split(":");
    var end = end.split(":");

    start = parseInt(start[0]) * 60 + parseInt(start[1]);
    end = parseInt(end[0]) * 60 + parseInt(end[1]);

    var result = [];

    for ( var time = start; time <= end; time+=parseInt(interval)){
        result.push( this.timeString(time));
    }
  
    this.timeSlotList=result;
    //console.log(this.timeSlotList[0]);
  }

  timeString(time){
      var hours = Math.floor(time / 60);
      var minutes = time % 60;

      if (hours < 10)
      {
        let h="0" + hours;
        hours = parseFloat(h); //optional
      } 
      if (minutes < 10)
      {
        let m="0" + minutes;
        minutes = parseFloat(m); //optional
      }  
      let tempArr={
        //long: hours + ":" + minutes,
        long: this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+hours + ":" + minutes),"HH:mm"),
        short:this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+hours + ":" + minutes),"hh:mm a")
      };
     return tempArr;
  }

  fnChangeToggle(event,day){
//    console.log(event);
    if(day=="Monday"){
      this.mondayOn=event.checked;
    }
    if(day=="Tuesday"){
      this.tuesdayOn=event.checked;
    }
    if(day=="Wednesday"){
      this.wednesdayOn=event.checked;
    }
    if(day=="Thursday"){
      this.thursdayOn=event.checked;
    }
    if(day=="Friday"){
      this.fridayOn=event.checked;
    }
    if(day=="Saturday"){
      this.saturdayOn=event.checked;
    }
    if(day=="Sunday"){
      this.sundayOn=event.checked;
    }
    
  }

  fnOnChangeStartTimeWorkingHour(event,day){
    // console.log(event);
    // console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.mondayWorkingHourEndTimeIndex<=this.mondayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["mondayEndTime"].setValue(null);
      }
      if(this.mondayWorkingHourStartTimeIndex>this.mondayBreakStartTimeIndex || this.mondayBreakStartTimeIndex>this.mondayWorkingHourEndTimeIndex){
        this.selectedStartTimeMonday=null;
      }
      if(this.mondayWorkingHourStartTimeIndex>this.mondayBreakEndTimeIndex || this.mondayBreakEndTimeIndex>this.mondayWorkingHourEndTimeIndex){
        this.selectedEndTimeMonday=null;
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.tuesdayWorkingHourEndTimeIndex<=this.tuesdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["tuesdayEndTime"].setValue(null);
      }
      if(this.tuesdayWorkingHourStartTimeIndex>this.tuesdayBreakStartTimeIndex || this.tuesdayBreakStartTimeIndex>this.tuesdayWorkingHourEndTimeIndex){
        this.selectedStartTimeTuesday=null;
      }
      if(this.tuesdayWorkingHourStartTimeIndex>this.tuesdayBreakEndTimeIndex || this.tuesdayBreakEndTimeIndex>this.tuesdayWorkingHourEndTimeIndex){
        this.selectedEndTimeTuesday=null;
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.wednesdayWorkingHourEndTimeIndex<=this.wednesdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["wednesdayEndTime"].setValue(null);
      }
      if(this.wednesdayWorkingHourStartTimeIndex>this.wednesdayBreakStartTimeIndex || this.wednesdayBreakStartTimeIndex>this.wednesdayWorkingHourEndTimeIndex){
        this.selectedStartTimeWednesday=null;
      }
      if(this.wednesdayWorkingHourStartTimeIndex>this.wednesdayBreakEndTimeIndex || this.wednesdayBreakEndTimeIndex>this.wednesdayWorkingHourEndTimeIndex){
        this.selectedEndTimeWednesday=null;
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.thursdayWorkingHourEndTimeIndex<=this.thursdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["thursdayEndTime"].setValue(null);
      }
      if(this.thursdayWorkingHourStartTimeIndex>this.thursdayBreakStartTimeIndex || this.thursdayBreakStartTimeIndex>this.thursdayWorkingHourEndTimeIndex){
        this.selectedStartTimeThursday=null;
      }
      if(this.thursdayWorkingHourStartTimeIndex>this.thursdayBreakEndTimeIndex || this.thursdayBreakEndTimeIndex>this.thursdayWorkingHourEndTimeIndex){
        this.selectedEndTimeThursday=null;
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.fridayWorkingHourEndTimeIndex<=this.fridayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["fridayEndTime"].setValue(null);
      }
      if(this.fridayWorkingHourStartTimeIndex>this.fridayBreakStartTimeIndex || this.fridayBreakStartTimeIndex>this.fridayWorkingHourEndTimeIndex){
        this.selectedStartTimeFriday=null;
      }
      if(this.fridayWorkingHourStartTimeIndex>this.fridayBreakEndTimeIndex || this.fridayBreakEndTimeIndex>this.fridayWorkingHourEndTimeIndex){
        this.selectedEndTimeFriday=null;
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.saturdayWorkingHourEndTimeIndex<=this.saturdayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["saturdayEndTime"].setValue(null);
      }
      if(this.saturdayWorkingHourStartTimeIndex>this.saturdayBreakStartTimeIndex || this.saturdayBreakStartTimeIndex>this.saturdayWorkingHourEndTimeIndex){
        this.selectedStartTimeSaturday=null;
      }
      if(this.saturdayWorkingHourStartTimeIndex>this.saturdayBreakEndTimeIndex || this.saturdayBreakEndTimeIndex>this.saturdayWorkingHourEndTimeIndex){
        this.selectedEndTimeSaturday=null;
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayWorkingHourStartTimeIndex=i;
        }
      }
      if(this.sundayWorkingHourEndTimeIndex<=this.sundayWorkingHourStartTimeIndex){
        this.formSetWorkingHours.controls["sundayEndTime"].setValue(null);
      }
      if(this.sundayWorkingHourStartTimeIndex>this.sundayBreakStartTimeIndex || this.sundayBreakStartTimeIndex>this.sundayWorkingHourEndTimeIndex){
        this.selectedStartTimeSunday=null;
      }
      if(this.sundayWorkingHourStartTimeIndex>this.sundayBreakEndTimeIndex || this.sundayBreakEndTimeIndex>this.sundayWorkingHourEndTimeIndex){
        this.selectedEndTimeSunday=null;
      }
    }

  }

  fnOnChangeEndTimeWorkingHour(event,day){
    // console.log(event);
    // console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayWorkingHourEndTimeIndex=i;
        }
      }
      if(this.mondayWorkingHourStartTimeIndex>this.mondayBreakStartTimeIndex || this.mondayBreakStartTimeIndex>this.mondayWorkingHourEndTimeIndex){
        this.selectedStartTimeMonday=null;
      }
      if(this.mondayWorkingHourStartTimeIndex>this.mondayBreakEndTimeIndex || this.mondayBreakEndTimeIndex>this.mondayWorkingHourEndTimeIndex){
        this.selectedEndTimeMonday=null;
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayWorkingHourEndTimeIndex=i;
        }
      }
      if(this.tuesdayWorkingHourStartTimeIndex>this.tuesdayBreakStartTimeIndex || this.tuesdayBreakStartTimeIndex>this.tuesdayWorkingHourEndTimeIndex){
        this.selectedStartTimeTuesday=null;
      }
      if(this.tuesdayWorkingHourStartTimeIndex>this.tuesdayBreakEndTimeIndex || this.tuesdayBreakEndTimeIndex>this.tuesdayWorkingHourEndTimeIndex){
        this.selectedEndTimeTuesday=null;
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayWorkingHourEndTimeIndex=i;
        }
      }
      if(this.wednesdayWorkingHourStartTimeIndex>this.wednesdayBreakStartTimeIndex || this.wednesdayBreakStartTimeIndex>this.wednesdayWorkingHourEndTimeIndex){
        this.selectedStartTimeWednesday=null;
      }
      if(this.wednesdayWorkingHourStartTimeIndex>this.wednesdayBreakEndTimeIndex || this.wednesdayBreakEndTimeIndex>this.wednesdayWorkingHourEndTimeIndex){
        this.selectedEndTimeWednesday=null;
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayWorkingHourEndTimeIndex=i;
        }
      }
      if(this.thursdayWorkingHourStartTimeIndex>this.thursdayBreakStartTimeIndex || this.thursdayBreakStartTimeIndex>this.thursdayWorkingHourEndTimeIndex){
        this.selectedStartTimeThursday=null;
      }
      if(this.thursdayWorkingHourStartTimeIndex>this.thursdayBreakEndTimeIndex || this.thursdayBreakEndTimeIndex>this.thursdayWorkingHourEndTimeIndex){
        this.selectedEndTimeThursday=null;
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayWorkingHourEndTimeIndex=i;
        }
      }
      if(this.fridayWorkingHourStartTimeIndex>this.fridayBreakStartTimeIndex || this.fridayBreakStartTimeIndex>this.fridayWorkingHourEndTimeIndex){
        this.selectedStartTimeFriday=null;
      }
      if(this.fridayWorkingHourStartTimeIndex>this.fridayBreakEndTimeIndex || this.fridayBreakEndTimeIndex>this.fridayWorkingHourEndTimeIndex){
        this.selectedEndTimeFriday=null;
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayWorkingHourEndTimeIndex=i;
        }
      }
      if(this.saturdayWorkingHourStartTimeIndex>this.saturdayBreakStartTimeIndex || this.saturdayBreakStartTimeIndex>this.saturdayWorkingHourEndTimeIndex){
        this.selectedStartTimeSaturday=null;
      }
      if(this.saturdayWorkingHourStartTimeIndex>this.saturdayBreakEndTimeIndex || this.saturdayBreakEndTimeIndex>this.saturdayWorkingHourEndTimeIndex){
        this.selectedEndTimeSaturday=null;
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayWorkingHourEndTimeIndex=i;
        }
      }
      if(this.sundayWorkingHourStartTimeIndex>this.sundayBreakStartTimeIndex || this.sundayBreakStartTimeIndex>this.sundayWorkingHourEndTimeIndex){
        this.selectedStartTimeSunday=null;
      }
      if(this.sundayWorkingHourStartTimeIndex>this.sundayBreakEndTimeIndex || this.sundayBreakEndTimeIndex>this.sundayWorkingHourEndTimeIndex){
        this.selectedEndTimeSunday=null;
      }
    }
  }

  fnFormBuild(mondayOn,tuesdayOn,wednesdayOn,thursdayOn,fridayOn,saturdayOn,sundayOn){
   // console.log(mondayOn+"--"+tuesdayOn+"--"+wednesdayOn+"--"+thursdayOn+"--"+fridayOn+"--"+saturdayOn+"--"+sundayOn);
    this.formSetWorkingHours = this._formBuilder.group({
      mondayToggle: [this.formSetWorkingHours.get("mondayToggle").value?true:false,mondayOn?Validators.required:''],
      mondayStartTime: [this.formSetWorkingHours.get("mondayStartTime").value,mondayOn?Validators.required:''],
      mondayEndTime: [this.formSetWorkingHours.get("mondayEndTime").value,mondayOn?Validators.required:''],
      tuesdayToggle: [this.formSetWorkingHours.get("tuesdayToggle").value?true:false,tuesdayOn?Validators.required:''],
      tuesdayStartTime: [this.formSetWorkingHours.get("tuesdayStartTime").value,tuesdayOn?Validators.required:''],
      tuesdayEndTime: [this.formSetWorkingHours.get("tuesdayEndTime").value,tuesdayOn?Validators.required:''],
      wednesdayToggle: [this.formSetWorkingHours.get("wednesdayToggle").value?true:false,wednesdayOn?Validators.required:''],
      wednesdayStartTime: [this.formSetWorkingHours.get("wednesdayStartTime").value,wednesdayOn?Validators.required:''],
      wednesdayEndTime: [this.formSetWorkingHours.get("wednesdayEndTime").value,wednesdayOn?Validators.required:''],
      thursdayToggle: [this.formSetWorkingHours.get("thursdayToggle").value?true:false,thursdayOn?Validators.required:''],
      thursdayStartTime: [this.formSetWorkingHours.get("thursdayStartTime").value,thursdayOn?Validators.required:''],
      thursdayEndTime: [this.formSetWorkingHours.get("thursdayEndTime").value,thursdayOn?Validators.required:''],
      fridayToggle: [this.formSetWorkingHours.get("fridayToggle").value?true:false,fridayOn?Validators.required:''],
      fridayStartTime: [this.formSetWorkingHours.get("fridayStartTime").value,fridayOn?Validators.required:''],
      fridayEndTime: [this.formSetWorkingHours.get("fridayEndTime").value,fridayOn?Validators.required:''],
      saturdayToggle: [this.formSetWorkingHours.get("saturdayToggle").value?true:false,saturdayOn?Validators.required:''],
      saturdayStartTime: [this.formSetWorkingHours.get("saturdayStartTime").value,saturdayOn?Validators.required:''],
      saturdayEndTime: [this.formSetWorkingHours.get("saturdayEndTime").value,saturdayOn?Validators.required:''],
      sundayToggle: [this.formSetWorkingHours.get("sundayToggle").value?true:false,sundayOn?Validators.required:''],
      sundayStartTime: [this.formSetWorkingHours.get("sundayStartTime").value,sundayOn?Validators.required:''],
      sundayEndTime: [this.formSetWorkingHours.get("sundayEndTime").value,sundayOn?Validators.required:''],
    })
  }

  fnCreateWorkingHours(){
    this.isLoaderAdmin = true;
    if(this.formSetWorkingHours.invalid){
      return false;
    }
    let workingHoursArray:any=[];
    let workingHoursTempArray={
      dayNumber:"",
      offday:"",
      start_time:"",
      end_time:""
    };

    workingHoursTempArray={
      dayNumber:"1",
      offday:this.formSetWorkingHours.get("mondayToggle").value?"N":"Y",
      start_time:this.selectedWorkHourStartTimeMonday,
      end_time:this.selectedWorkHourEndTimeMonday,
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"2",
      offday:this.formSetWorkingHours.get("tuesdayToggle").value?"N":"Y",
      start_time:this.selectedWorkHourStartTimeTuesday,
      end_time:this.selectedWorkHourEndTimeTuesday,
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"3",
      offday:this.formSetWorkingHours.get("wednesdayToggle").value?"N":"Y",
      start_time:this.selectedWorkHourStartTimeWednesday,
      end_time:this.selectedWorkHourEndTimeWednesday,
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"4",
      offday:this.formSetWorkingHours.get("thursdayToggle").value?"N":"Y",
      start_time:this.selectedWorkHourStartTimeThursday,
      end_time:this.selectedWorkHourEndTimeThursday,
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"5",
      offday:this.formSetWorkingHours.get("fridayToggle").value?"N":"Y",
      start_time:this.selectedWorkHourStartTimeFriday,
      end_time:this.selectedWorkHourEndTimeFriday,
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"6",
      offday:this.formSetWorkingHours.get("saturdayToggle").value?"N":"Y",
      start_time:this.selectedWorkHourStartTimeSaturday,
      end_time:this.selectedWorkHourEndTimeSaturday,
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"0",
      offday:this.formSetWorkingHours.get("sundayToggle").value?"N":"Y",
      start_time:this.selectedWorkHourStartTimeSunday,
      end_time:this.selectedWorkHourEndTimeSunday,
    };
    workingHoursArray.push(workingHoursTempArray);
   // console.log(JSON.stringify(workingHoursArray));
    let requestObject={
      "staff_id":this.selectedStaffId,
      "workingHour":workingHoursArray
    }
   // console.log(JSON.stringify(requestObject));

    this.adminSettingsService.createWorkingHoursStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open("Working Hours Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open("Working Hours Not Updated", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnApplyToAll(){
    if(!this.mondayOn){
      return false;
    }
    let mondayHours = [];
    mondayHours = this.workingHoursList.filter(element => element.week_day_id == 1);

    mondayHours.forEach(element => {
      if(element.day_start_time == '' || element.day_start_time == null || element.day_end_time == '' || element.day_end_time == null){
        this._snackBar.open("Start & End Time can not be empty.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        return false;
      }
    });
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":this.selectedStaffId,
      "working_hours":mondayHours,
    }
   // console.log(JSON.stringify(requestObject));
    
    this.adminSettingsService.applyToAllStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open("Working Hours applied to all", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open("Working Hours Not Updated", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnApplyBreaksToAll(){
    console.log(this.breakTimeList)
    if(!this.mondayOn){
      return false;
    }
    let mondayBreaks = [];
    mondayBreaks = this.breakTimeList.filter(element => element.week_day_id == 1);
console.log(mondayBreaks)
// return false;
    mondayBreaks.forEach(element => {
      if(element.day_start_time == '' || element.day_start_time == null || element.day_end_time == '' || element.day_end_time == null){
        this._snackBar.open("Break start & end time can not be empty.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        return false;
      }
    });
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":this.selectedStaffId,
      "type":"S",
      "breaks":mondayBreaks,
    }
   // console.log(JSON.stringify(requestObject));
    
    this.adminSettingsService.applyBreaksToAllStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open("Breaks applied to all", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open("Breaks Not Updated", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnWorkingHoursResetToDefault(){
    this.isLoaderAdmin = true;
    let requestObject={
      "business_id":this.businessId,
      "staff_id":this.selectedStaffId
    }
    this.adminSettingsService.workingHoursResetToDefault(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open("Working Hours Reset", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open("Working Hours Not Reset", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }
  
  fnShowAddBreakForm(day){
    if(day == "Monday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("mondayStartTime").value){
          this.mondayBreakStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("mondayEndTime").value){
          this.mondayBreakEndTimeIndex=i;
        }
      }
      this.selectedStartTimeMonday=this.formSetWorkingHours.get("mondayStartTime").value;
      this.selectedEndTimeMonday=this.formSetWorkingHours.get("mondayEndTime").value;
      this.showMondayAddForm=this.showMondayAddForm==true?false:true;
      // this.mondayBreakStartTimeIndex=0;
      // this.mondayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Tuesday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("tuesdayStartTime").value){
          this.tuesdayBreakStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("tuesdayEndTime").value){
          this.tuesdayBreakEndTimeIndex=i;
        }
      }
      this.selectedStartTimeTuesday=this.formSetWorkingHours.get("tuesdayStartTime").value;
      this.selectedEndTimeTuesday=this.formSetWorkingHours.get("tuesdayEndTime").value;
      this.showTuesdayAddForm=this.showTuesdayAddForm==true?false:true;
      // this.tuesdayBreakStartTimeIndex=0;
      // this.tuesdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Wednesday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("wednesdayStartTime").value){
          this.wednesdayBreakStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("wednesdayEndTime").value){
          this.wednesdayBreakEndTimeIndex=i;
        }
      }
      this.selectedStartTimeWednesday=this.formSetWorkingHours.get("wednesdayStartTime").value;
      this.selectedEndTimeWednesday=this.formSetWorkingHours.get("wednesdayEndTime").value;
      this.showWednesdayAddForm=this.showWednesdayAddForm==true?false:true;
      // this.wednesdayBreakStartTimeIndex=0;
      // this.wednesdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Thursday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("thursdayStartTime").value){
          this.thursdayBreakStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("thursdayEndTime").value){
          this.thursdayBreakEndTimeIndex=i;
        }
      }
      this.selectedStartTimeThursday=this.formSetWorkingHours.get("thursdayStartTime").value;
      this.selectedEndTimeThursday=this.formSetWorkingHours.get("thursdayEndTime").value;
      this.showThursdayAddForm=this.showThursdayAddForm==true?false:true;
      // this.thursdayBreakStartTimeIndex=0;
      // this.thursdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Friday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("fridayStartTime").value){
          this.fridayBreakStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("fridayEndTime").value){
          this.fridayBreakEndTimeIndex=i;
        }
      }
      this.selectedStartTimeFriday=this.formSetWorkingHours.get("fridayStartTime").value;
      this.selectedEndTimeFriday=this.formSetWorkingHours.get("fridayEndTime").value;
      this.showFridayAddForm=this.showFridayAddForm==true?false:true;
      // this.fridayBreakStartTimeIndex=0;
      // this.fridayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Saturday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("saturdayStartTime").value){
          this.saturdayBreakStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("saturdayEndTime").value){
          this.saturdayBreakEndTimeIndex=i;
        }
      }
      this.selectedStartTimeSaturday=this.formSetWorkingHours.get("saturdayStartTime").value;
      this.selectedEndTimeSaturday=this.formSetWorkingHours.get("saturdayEndTime").value;
      this.showSaturdayAddForm=this.showSaturdayAddForm==true?false:true;
      // this.saturdayBreakStartTimeIndex=0;
      // this.saturdayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
    if(day == "Sunday"){
       for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("sundayStartTime").value){
          this.sundayBreakStartTimeIndex=i;
        }
        if(this.timeSlotList[i].long==this.formSetWorkingHours.get("sundayEndTime").value){
          this.sundayBreakEndTimeIndex=i;
        }
      }
      this.selectedStartTimeSunday=this.formSetWorkingHours.get("sundayStartTime").value;
      this.selectedEndTimeSunday=this.formSetWorkingHours.get("sundayEndTime").value;
      this.showSundayAddForm=this.showSundayAddForm==true?false:true;
      // this.sundayBreakStartTimeIndex=0;
      // this.sundayBreakEndTimeIndex=this.timeSlotList.length-1;
    }
  }

  fnOnChangeStartTimeBreak(event,day){
    // console.log(event);
    // console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayBreakStartTimeIndex=i;
        }
      }
      if(this.mondayBreakEndTimeIndex<=this.mondayBreakStartTimeIndex){
        this.selectedEndTimeMonday=null;
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayBreakStartTimeIndex=i;
        }
      }
      if(this.tuesdayBreakEndTimeIndex<=this.tuesdayBreakStartTimeIndex){
        this.selectedEndTimeTuesday=null;
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayBreakStartTimeIndex=i;
        }
      }
      if(this.wednesdayBreakEndTimeIndex<=this.wednesdayBreakStartTimeIndex){
        this.selectedEndTimeWednesday=null;
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayBreakStartTimeIndex=i;
        }
      }
      if(this.thursdayBreakEndTimeIndex<=this.thursdayBreakStartTimeIndex){
        this.selectedEndTimeThursday=null;
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayBreakStartTimeIndex=i;
        }
      }
      if(this.fridayBreakEndTimeIndex<=this.fridayBreakStartTimeIndex){
        this.selectedEndTimeFriday=null;
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayBreakStartTimeIndex=i;
        }
      }
      if(this.saturdayBreakEndTimeIndex<=this.saturdayBreakStartTimeIndex){
        this.selectedEndTimeSaturday=null;
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayBreakStartTimeIndex=i;
        }
      }
      if(this.sundayBreakEndTimeIndex<=this.sundayBreakStartTimeIndex){
        this.selectedEndTimeSunday=null;
      }
    }

  }

  fnOnChangeEndTimeBreak(event,day){
    // console.log(event);
    // console.log(day);
    if(day == 'Monday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.mondayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Tuesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.tuesdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Wednesday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.wednesdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Thursday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.thursdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Friday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.fridayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Saturday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.saturdayBreakEndTimeIndex=i;
        }
      }
    }
    
    if(day == 'Sunday'){
      for(var i=0; i<this.timeSlotList.length; i++){
        if(this.timeSlotList[i].long==event.value){
          this.sundayBreakEndTimeIndex=i;
        }
      }
    }
  }

  fnAddBreak(day){
    let requestObject={
      "staff_id":'',
      "start_time":'',
      "end_time":'',
      "dayNumber":''
    }
    if(day == "Monday"){
      if(this.selectedStartTimeMonday==null || this.selectedEndTimeMonday==null){
        if(this.selectedStartTimeMonday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeMonday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeMonday,
        "end_time":this.selectedEndTimeMonday,
        "dayNumber":"1"
      }
     // console.log(requestObject);
    }
    if(day == "Tuesday"){
      if(this.selectedStartTimeTuesday==null || this.selectedEndTimeTuesday==null){
        if(this.selectedStartTimeTuesday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeTuesday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeTuesday,
        "end_time":this.selectedEndTimeTuesday,
        "dayNumber":"2"
      }
      console.log(requestObject);
    }
    if(day == "Wednesday"){
      if(this.selectedStartTimeWednesday==null || this.selectedEndTimeWednesday==null){
        if(this.selectedStartTimeWednesday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeWednesday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeWednesday,
        "end_time":this.selectedEndTimeWednesday,
        "dayNumber":"3"
      }
      console.log(requestObject);
    }
    if(day == "Thursday"){
      if(this.selectedStartTimeThursday==null || this.selectedEndTimeThursday==null){
        if(this.selectedStartTimeThursday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeThursday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeThursday,
        "end_time":this.selectedEndTimeThursday,
        "dayNumber":"4"
      }
      console.log(requestObject);
    }
    if(day == "Friday"){
      if(this.selectedStartTimeFriday==null || this.selectedEndTimeFriday==null){
        if(this.selectedStartTimeFriday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeFriday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeFriday,
        "end_time":this.selectedEndTimeFriday,
        "dayNumber":"5"
      }
      console.log(requestObject);
    }
    if(day == "Saturday"){
      if(this.selectedStartTimeSaturday==null || this.selectedEndTimeSaturday==null){
        if(this.selectedStartTimeSaturday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeSaturday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeSaturday,
        "end_time":this.selectedEndTimeSaturday,
        "dayNumber":"6"
      }
      console.log(requestObject);
    }
    if(day == "Sunday"){
      if(this.selectedStartTimeSunday==null || this.selectedEndTimeSunday==null){
        if(this.selectedStartTimeSunday==null){
          this._snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeSunday==null){
          this._snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeSunday,
        "end_time":this.selectedEndTimeSunday,
        "dayNumber":"0"
      }
      console.log(requestObject);
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.addNewBreakStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this.showMondayAddForm=false;
        this.showTuesdayAddForm=false;
        this.showWednesdayAddForm=false;
        this.showThursdayAddForm=false;
        this.showFridayAddForm=false;
        this.showSaturdayAddForm=false;
        this.showSundayAddForm=false;
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnDeleteBreak(breakId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoaderAdmin = true;
        console.log(breakId);
        let requestObject={
          "staff_id":this.selectedStaffId ,
          "break_id":breakId
        }

        this.adminSettingsService.deleteBreakStaff(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
          }else if(response.data == false && response.response !== 'api token or userid invaild'){
          this.isLoaderAdmin = false;
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
          }
        })
      }
    });
  }

  fnResetToDefaultBreak(){
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":this.selectedStaffId ,
      "business_id":this.businessId
    }

    this.adminSettingsService.resetToDefaultBreakStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnChangeTimeOffStatus(event,timeOffId){
    this.isLoaderAdmin = true;
    console.log(event.checked+"--"+timeOffId);
    let requestObject={
      "staff_id":this.selectedStaffId ,
      "time_off_id":timeOffId,
      "status":event.checked?"E":"D"
    }

    this.adminSettingsService.changeTimeOffStatusStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open('Time off status updated.', "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnResetToDefaultTimeOff(){
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":this.selectedStaffId ,
      "business_id":this.businessId
    }

    this.adminSettingsService.resetToDefaultTimeOffStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
      this.isLoaderAdmin = false;
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnDeleteTimeOff(timeOffId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoaderAdmin = true;
        console.log(timeOffId);
        let requestObject={
          "time_off_id":timeOffId
        }

        this.adminSettingsService.deleteTimeOff(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnViewSingleStaff(this.selectedStaffId, this.singleStaffIndex);
            this._snackBar.open('Time off deleted.', "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
          }else if(response.data == false && response.response !== 'api token or userid invaild'){
            this.isLoaderAdmin = false;
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
        })
      }
    });
  }

  viewStaffReviewDetail(index,OrderId){
    console.log(this.singleStaffDetail.staff[0].review[index])
    this.isLoaderAdmin = true;
    this.adminSettingsService.viewStaffReviewDetail(OrderId).subscribe((response:any) => {
      if(response.data == true){
        this.reviewOrderData = response.response;
        console.log(this.reviewOrderData)
        this.reviewOrderData.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"yyyy/MM/dd")   
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"HH:mm");
          element.created_at=this.datePipe.transform(new Date(element.created_at),"yyyy/MM/dd @ HH:mm")
        });

         const dialogRef = this.dialog.open(DialogStaffViewReview, {
          height: '700px',
          data :{fulldata : this.singleStaffDetail.staff[0].review[index], orderData : this.reviewOrderData}
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.animal = result;
        });
        this.isLoaderAdmin = false;
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.isLoaderAdmin = false;
      }
    })
  }  
  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
    //return error.error ? error.error : error.statusText;
  }
  
  isEmailUnique(control: FormControl){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/admin-staff-email-check`,{ email: control.value },{headers:headers}).pipe(map((response : any) =>{
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
  sendEmailVerification(staffId){
    let requestObject={
      "staff_id":staffId
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.sendEmailVerification(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.isLoaderAdmin = false;
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  sendPhoneVerification(staffId){
    let requestObject={
      "staff_id":staffId
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.sendPhoneVerification(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }else if(response.data == false && response.response !== 'api token or userid invaild'){
        this.isLoaderAdmin = false;
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  postalCodeSearch(){
    this.isLoaderAdmin=true;
    if(this.search.postalCode.length > 1){
      let requestObject = {
        "search":this.search.postalCode,
        "business_id":this.businessId,
      }
      console.log(requestObject);
      this.adminSettingsService.postalCodeSearch(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this.singleStaffDetail.postalCode = response.response;
          this.isLoaderAdmin=false;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
          this.singleStaffDetail.postalCode = [];
          this.isLoaderAdmin=false;
        }
      })
    }else{
      this.fnViewSingleStaff(this.selectedStaffId,this.singleStaffIndex);
      this.isLoaderAdmin=false;
    }
  }

  staffSearch(){
    
    if(this.search.staff.length >= 1){
      this.isLoaderAdmin=true;
      let requestObject = {
        "search":this.search.staff,
        "business_id":this.businessId,
      }
      console.log(requestObject);
      this.adminSettingsService.staffSearch(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this.current_page = response.response.current_page;
          this.first_page_url = response.response.first_page_url;
          this.last_page = response.response.last_page;
          this.totalRecord = response.response.total;
          this.fromRecord = response.response.from;
          this.toRecord = response.response.to;
          this.last_page_url = response.response.last_page_url;
          this.next_page_url = response.response.next_page_url;
          this.prev_page_url = response.response.prev_page_url;
          this.path = response.response.path;
          this.allStaffList = response.response.data;

          this.allStaffList.forEach( (element) => { 
            element.is_selected = false;
          });
          this.selectAll = false;

          this.isLoaderAdmin=false;
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
          this.allStaffList = [];
          this.isLoaderAdmin=false;
        }
      })
    }else{
      this.getAllStaff();
      this.isLoaderAdmin=false;
    }
  }

}
@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/staff-view-review-dialog.html',
})
export class DialogStaffViewReview {
detailsData: any;
reviewData:any;
initials:any;
customerShortName:any;
constructor(
  public dialogRef: MatDialogRef<DialogStaffViewReview>,
  @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
  @Inject(MAT_DIALOG_DATA) public data: any) {

     this.detailsData =  this.data.orderData[0];
     this.reviewData =  this.data.fulldata;
     this.initials = this.detailsData.customer.fullname.split(" ",2);
      this.customerShortName = '';
      this.initials.forEach( (element2) => {
        this.customerShortName = this.customerShortName+element2.charAt(0);
      });
    //  console.log(this.orderDataFull);
    console.log(this.detailsData);
    console.log(this.reviewData);
  }

onNoClick(): void {
  this.dialogRef.close();
}

}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/add-new-time-off-dialog.html',
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    DatePipe
  ]
})
export class DialogAddNewTimeOff {
  businessId:any;
  selectedStaffId:any;
  minStartDate = new Date();
  minEndDate = new Date();
  formAddNewTimeOff: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogAddNewTimeOff>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder, 
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    private _snackBar: MatSnackBar) {
    this.formAddNewTimeOff = this._formBuilder.group({
      startDate: [this.minStartDate,Validators.required],
      endDate: ['',Validators.required],
      description: ['',Validators.required],
    });
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
    this.selectedStaffId=this.data.selectedStaffId;
  }

  fnDateChange(event: MatDatepickerInputEvent<Date>){
    console.log(event);
    this.minEndDate=event.value
  }

  onNoClick(): void {
    this.dialogRef.close({ call: false });
  }

  fnAddNewTimeOff(){
    if(this.formAddNewTimeOff.invalid){
      this.formAddNewTimeOff.get("startDate").markAsTouched();
      this.formAddNewTimeOff.get("endDate").markAsTouched();
      this.formAddNewTimeOff.get("description").markAsTouched();
      return false;
    }
    let requestObject={
      "staff_id":this.selectedStaffId,
      "start_date":this.datePipe.transform(new Date(this.formAddNewTimeOff.get("startDate").value),"yyyy/MM/dd"),
      "end_date":this.datePipe.transform(new Date(this.formAddNewTimeOff.get("endDate").value),"yyyy/MM/dd"),
      "description":this.formAddNewTimeOff.get("description").value
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.addNewTimeOffStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.dialogRef.close({ call: true });
        this._snackBar.open('Time off added.', "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
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

@Component({
  selector: 'staff-image-upload',
  templateUrl: '../_dialogs/staff-upload-profile-image-dialog.html',
})
export class DialogStaffImageUpload {

  uploadForm: FormGroup;
  imageSrc: string;
  profileImage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogStaffImageUpload>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

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
    this.profileImage = this.imageSrc
    this.dialogRef.close(this.profileImage);
  }




}
