import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AdminService } from '../_services/admin-main.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe} from '@angular/common';
import { environment } from '@environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { AppComponent } from '@app/app.component';

export interface DialogData {
  animal: string;
  name: string;
 
}
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  providers: [DatePipe]
})
export class AppointmentComponent implements OnInit {
  adminSettings : boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  
  animal: any;
  businessId: any;
  allAppointments:any;
  durationType : any;
  dataTable: any;
  selectedServices: any;
  allservices: any;
  isLoaderAdmin : boolean = false;
  orderItemsIdArr: any = [];
  selectedValue: any;
  selectAll: boolean = false;
  settingsArr: any;
  cancellationBufferTime: any;
  minReschedulingTime: any;
  constructor(
    public dialog: MatDialog,
    private AdminService: AdminService,
    private datePipe: DatePipe,
    private appComponent : AppComponent,
    private _snackBar: MatSnackBar,
    ) {
      localStorage.setItem('isBusiness', 'false');
      this.businessId=localStorage.getItem('business_id');
     }

  ngOnInit() {
    this.durationType = 'month';
    this.selectedServices =  'all';
    this.fnGetSettingValue();
    this.getAllAppointments(this.durationType,this.selectedServices);
    this.getAllServices();
    
    this.dtOptions = {
     
      // Use this attribute to enable the responsive extension
      responsive: true,
    };
   
  }

  fnGetSettingValue(){
    let requestObject = {
      "business_id":this.businessId
    };
    this.AdminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr=response.response;
        console.log(this.settingsArr);
        let cancellation_buffer_time=JSON.parse(this.settingsArr.cancellation_buffer_time);
        let min_rescheduling_time=JSON.parse(this.settingsArr.min_reseduling_time);
        console.log(cancellation_buffer_time);
        console.log(min_rescheduling_time);
       
        this.cancellationBufferTime = new Date();
        this.cancellationBufferTime.setMinutes( this.cancellationBufferTime.getMinutes() + cancellation_buffer_time);
        console.log("cancellationBufferTime - "+this.cancellationBufferTime);

        this.minReschedulingTime = new Date();
        this.minReschedulingTime.setMinutes( this.minReschedulingTime.getMinutes() + min_rescheduling_time);
        console.log("minReschedulingTime - "+this.minReschedulingTime);
      }
      else if(response.data == false){
        
      }
    })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  selectdurationType(type){
    this.durationType = type;
    this.getAllAppointments(this.durationType,this.selectedServices);
  }
  selectService(service){
    this.selectedServices = service;
    this.getAllAppointments(this.durationType,this.selectedServices);
  }

  getAllAppointments(durationType,services){
    this.isLoaderAdmin = true;
    this.AdminService.getAllAppointments(durationType,services).subscribe((response:any) => {
      if(response.data == true){
        this.allAppointments = response.response
        console.log( this.allAppointments)
        this.allAppointments.forEach( (element) => { 
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")   
          element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");

          
        });
        this.dtTrigger.next();
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.allAppointments = ''
        this.isLoaderAdmin = false;
      }
    })
  }

  getAllServices(){
    this.isLoaderAdmin = true;
    this.AdminService.getAllServices().subscribe((response:any) => {
      if(response.data == true){
        this.allservices = response.response
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.allservices = ''
        this.isLoaderAdmin = false;
      }
    })
  }

  addAppointment() {
    const dialogRef = this.dialog.open(DialogAddNewAppointment, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllAppointments(this.durationType,this.selectedServices);
     });
  }

  fnOpenDetails(){
    const dialogRef = this.dialog.open(DialogAllAppointmentDetails, {
      width: '500px',
      data: {animal: this.animal}
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
      //this.getAllAppointments(this.durationType,this.selectedServices);
     });


  }
  fnAddOrderId(event, orderId){
    if(event == true){
      this.orderItemsIdArr.push(orderId);
    }else if(event == false){
      const index = this.orderItemsIdArr.indexOf(orderId, 0);
      if (index > -1) {
          this.orderItemsIdArr.splice(index, 1);
      }
    }
    console.log(this.orderItemsIdArr);
    if (this.allAppointments.every(a => a.checked)) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }

  fnAppointAction(status){
    this.isLoaderAdmin = true;
    this.AdminService.fnAppointAction(status, this.orderItemsIdArr).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.selectedValue = undefined;
        this.orderItemsIdArr.length = 0;
        this.getAllAppointments(this.durationType,this.selectedServices);
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.isLoaderAdmin = false;
      }
    })
  }

  cancelAppointment(status, orderId){
    this.orderItemsIdArr.push(orderId);
    this.AdminService.fnAppointAction(status, this.orderItemsIdArr).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.orderItemsIdArr.length = 0;
        this.getAllAppointments(this.durationType,this.selectedServices);
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.isLoaderAdmin = false;
      }
    })
  }
  confirmAppointment(status, orderId){
    this.orderItemsIdArr.push(orderId);
    this.AdminService.fnAppointAction(status, this.orderItemsIdArr).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.orderItemsIdArr.length = 0;
        this.getAllAppointments(this.durationType,this.selectedServices);
        this.isLoaderAdmin = false;
      }
      else if(response.data == false){
        this.isLoaderAdmin = false;
      }
    })
  }
  checkAll(){
  if (this.selectAll === true) {
    this.allAppointments.map((appoint) => {
      appoint.checked = true;
    });

  } else {
    this.allAppointments.map((appoint) => {
      appoint.checked = false;
    });
  }
}

}

@Component({
  selector: 'add-new-appointment',
  templateUrl: '../_dialogs/add-new-appointment.html',
  providers: [DatePipe]
})
export class DialogAddNewAppointment {
  formAddNewAppointmentStaffStep1:FormGroup;
  formAddNewAppointmentStaffStep2:FormGroup;
  secondStep:boolean = false;
  adminId:any;
  token:any;
  bussinessId:any;
  catdata :[];
  subcatdata :[];
  serviceData:any= [];
  selectedCatId:any;
  selectedSubCatId:any;
  selectedServiceId:any;
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
  constructor(
    public dialogRef: MatDialogRef<DialogAddNewAppointment>,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private AdminService: AdminService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.adminId=(JSON.parse(localStorage.getItem('currentUser'))).user_id
    this.token=(JSON.parse(localStorage.getItem('currentUser'))).token
    this.bussinessId=localStorage.getItem('business_id')
    console.log(this.adminId);
    console.log(this.token);
    console.log(this.bussinessId);
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    let onlynumeric = /^-?(0|[1-9]\d*)?$/

    this.subcatdata=[];
    this.serviceData=[];

    this.formAddNewAppointmentStaffStep1 = this._formBuilder.group({
      customerFullName: ['', Validators.required],
      customerEmail: ['', [Validators.required,Validators.email,Validators.pattern(emailPattern)]],
      customerPhone: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(onlynumeric)]],
      customerAddress: ['', Validators.required],
      customerState: ['', Validators.required],
      customerCity: ['', Validators.required],
      customerPostalCode: ['',[Validators.required,Validators.pattern(onlynumeric)]],
    });

    this.formAddNewAppointmentStaffStep2 = this._formBuilder.group({
      customerCategory: ['', Validators.required],
      customerSubCategory: ['', Validators.required],
      customerService: ['', [Validators.required]],
      customerDate: ['', Validators.required],
      customerTime: ['', Validators.required],
      customerStaff: ['', Validators.required]
    });
    console.log("ar"+this.formAddNewAppointmentStaffStep2.get('customerDate').value);
    this.fnGetSettingValue();
    this.fnGetTaxDetails();
    this.fnGetOffDays();

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
          temp=temp && (d.getDay() !== this.workingHoursOffDaysList[i]);
      }
      //return (d.getMonth()+1!==4 || d.getDate()!==30) && (d.getMonth()+1!==5 || d.getDate()!==15);
      return temp;
      }else{
      return true;
      }
    }
  }

  fnGetSettingValue(){
    let requestObject = {
      "business_id":this.bussinessId
    };
    this.AdminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr=response.response;
        console.log(this.settingsArr);
        this.minimumAdvanceBookingTime=JSON.parse(this.settingsArr.min_advance_booking_time);
        this.maximumAdvanceBookingTime=JSON.parse(this.settingsArr.max_advance_booking_time);
        
        this.minimumAdvanceBookingDateTimeObject = new Date();
        this.minimumAdvanceBookingDateTimeObject.setMinutes( this.minimumAdvanceBookingDateTimeObject.getMinutes() + this.minimumAdvanceBookingTime );
        console.log("minimumAdvanceBookingDateTimeObject - "+this.minimumAdvanceBookingDateTimeObject);
        this.minDate = this.minimumAdvanceBookingDateTimeObject;

        this.maximumAdvanceBookingDateTimeObject = new Date();
        this.maximumAdvanceBookingDateTimeObject.setMinutes( this.maximumAdvanceBookingDateTimeObject.getMinutes() + this.maximumAdvanceBookingTime );
        console.log("maximumAdvanceBookingDateTimeObject - "+this.maximumAdvanceBookingDateTimeObject);
        this.maxDate = this.maximumAdvanceBookingDateTimeObject;
      }
      else if(response.data == false){
        
      }
    })
  }

  fnGetTaxDetails(){
    this.AdminService.getTaxDetails().subscribe((response:any) => {
      if(response.data == true){
        let tax = response.response
        this.taxArr=tax;
        console.log(this.taxArr);
      }
      else if(response.data == false){
        
      }
    })
  }

  fnGetOffDays(){
    let requestObject = {
      "business_id":this.bussinessId
    };
    this.AdminService.getOffDays(requestObject).subscribe((response:any) => {
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
      }
      else{

      }
    },
    (err) =>{
      console.log(err)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  fnNewAppointment() {
    if(this.formAddNewAppointmentStaffStep1.invalid){
      this.formAddNewAppointmentStaffStep1.get('customerFullName').markAsTouched();
      this.formAddNewAppointmentStaffStep1.get('customerEmail').markAsTouched();
      this.formAddNewAppointmentStaffStep1.get('customerPhone').markAsTouched();
      this.formAddNewAppointmentStaffStep1.get('customerAddress').markAsTouched();
      this.formAddNewAppointmentStaffStep1.get('customerState').markAsTouched();
      this.formAddNewAppointmentStaffStep1.get('customerCity').markAsTouched();
      this.formAddNewAppointmentStaffStep1.get('customerPostalCode').markAsTouched();
      return false;
    }
    this.fnGetCategories(); 
    this.secondStep=true;
  }

  fnGetCategories(){
    let requestObject = {
      "business_id":this.bussinessId,
      "status":"E"
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'mode': 'no-cors'
    });

    this.http.post(`${environment.apiUrl}/get-all-category`,requestObject,{headers:headers} )
    .pipe(
    map((res) => {
      return res;
    })
    ).subscribe((response:any) => {
      if(response.data == true){
        this.catdata = response.response;
        console.log(this.catdata);
      }else{
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnSelectCat(selected_cat_id){
    console.log(selected_cat_id)
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
    console.log(this.selectedSubCatId);
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
      this.subcatdata = response.response;
      console.log(this.subcatdata)
      }else{
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnSelectSubCat(selected_subcat_id){
    console.log(selected_subcat_id)
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
          this.serviceData[i].totalCost=0;
          this.serviceData[i].appointmentDate='';
          this.serviceData[i].appointmentTimeSlot='';
          this.serviceData[i].assignedStaff=null;
          this.serviceCount[this.serviceData[i].id]=this.serviceData[i];
        }
        console.log(JSON.stringify(this.serviceData));
      }else{
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnSelectService(selected_service_id){
    console.log(selected_service_id)
    this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
    this.selectedStaffId=undefined;
    for(let i=0; i<this.serviceCount.length;i++){
      if(this.serviceCount[i] != null && this.serviceCount[i].id == selected_service_id){
        this.serviceCount[i].count=1;
        this.serviceCount[i].totalCost=1*this.serviceCount[i].service_cost;
        if(this.selectedDate){
          this.serviceCount[i].appointmentDate=this.selectedDate;
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
        this.serviceCount[i].totalCost=0;
        this.serviceCount[i].appointmentDate='';
        this.serviceCount[i].appointmentTimeSlot='';
        this.serviceCount[i].assignedStaff=null;
      }
    }
    if(this.bussinessId != undefined && this.selectedServiceId != undefined && this.selectedDate != undefined && this.selectedTime != undefined){
      this.fnGetStaff();
    }
    console.log(JSON.stringify(this.serviceCount));
  }

  fnDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log(this.datePipe.transform(new Date(event.value),"yyyy-MM-dd"));
    let date = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd")
    this.formAddNewAppointmentStaffStep2.controls['customerTime'].setValue(null);
    this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
    this.selectedTime=undefined;
    this.selectedStaffId=undefined;
    this.timeSlotArr= [];
    this.timeSlotArrForLabel= [];
    if(this.selectedServiceId != undefined){
      this.serviceCount[this.selectedServiceId].appointmentDate=date
    }
    this.selectedDate=date;
    console.log(JSON.stringify(this.serviceCount));
    this.fnGetTimeSlots(date);
  }

  fnGetTimeSlots(date){
    let requestObject = {
      "business_id":this.bussinessId,
      "selected_date":date
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
        var dateTemp=this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element+":00";
         this.timeSlotArrForLabel[i]= this.datePipe.transform(new Date(dateTemp),"hh:mm a");
         i++;
      });
      }
      else{
      }
    },
    (err) =>{
      console.log(err)
    })
  }

  fnSelectTime(timeSlot){
    if(this.selectedServiceId != undefined){
      this.serviceCount[this.selectedServiceId].appointmentTimeSlot =timeSlot;
    }
    this.formAddNewAppointmentStaffStep2.controls['customerStaff'].setValue(null);
    this.selectedStaffId=undefined;
    this.selectedTime=timeSlot;
    console.log(JSON.stringify(this.serviceCount));
    if(this.bussinessId != undefined && this.selectedServiceId != undefined && this.selectedDate != undefined && this.selectedTime != undefined){
      this.fnGetStaff();
    }
  }

  fnGetStaff(){
    let requestObject = {
      "business_id":this.bussinessId,
      "postal_code":this.formAddNewAppointmentStaffStep1.get('customerPostalCode').value,
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
        console.log(JSON.stringify(this.availableStaff));
      }else{
        this.availableStaff.length=0;
        this.isStaffAvailable = false;
      }
    },
    (err) =>{
      this.isStaffAvailable = false;
      console.log(err);
    })
  }

  fnSelectStaff(selected_staff_id){
    console.log(selected_staff_id);
    this.selectedStaffId=selected_staff_id;
    if(this.selectedServiceId != undefined){
      this.serviceCount[this.selectedServiceId].assignedStaff =this.selectedStaffId;
    }
    console.log(JSON.stringify(this.serviceCount));
  }

  onBackClick(){
    this.secondStep=false;
  }

  fnNewAppointmentStep2(){
    if(this.formAddNewAppointmentStaffStep2.invalid){
      this.formAddNewAppointmentStaffStep2.get('customerCategory').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerSubCategory').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerService').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerDate').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerTime').markAsTouched();
      this.formAddNewAppointmentStaffStep2.get('customerStaff').markAsTouched();
      return false;
    }

    let serviceCartArrTemp:any= [];
    for(let i=0; i<this.serviceCount.length;i++){
      if(this.serviceCount[i] != null && this.serviceCount[i].count > 0){
        serviceCartArrTemp.push(this.serviceCount[i]);
      }
    }
    // if(serviceCartArrTemp[0].totalCost > 0){
    //   if(this.taxType == "P"){
    //     this.taxAmount= serviceCartArrTemp[0].totalCost * this.taxValue/100;
    //   }else{
    //     this.taxAmount= this.taxValue;
    //   }
    // }
    // this.netCost=serviceCartArrTemp[0].totalCost+this.taxAmount;

    var amountAfterDiscount=serviceCartArrTemp[0].totalCost;
    var amountAfterTax=0;
    if(amountAfterDiscount > 0){
      this.taxArr.forEach((element) => {
        let taxTemp={
          name:'',
          amount:0
        }
        console.log(element.name+" -- "+element.value);
        if(this.taxType == "P"){
         taxTemp.name= element.name;
         taxTemp.amount= amountAfterDiscount * element.value/100;
          amountAfterTax=amountAfterTax+taxTemp.amount;
        }else{
          taxTemp.name= element.name;
          taxTemp.amount=  element.value;
          amountAfterTax=amountAfterTax+taxTemp.amount;
        }
        this.taxAmountArr.push(taxTemp);
        console.log(this.taxAmountArr);
      });
    }
    this.netCost=amountAfterDiscount+amountAfterTax;

    console.log(this.taxAmountArr);
    console.log(JSON.stringify(serviceCartArrTemp));
    const currentDateTime = new Date();
    let requestObject = {
      "postal_code": this.formAddNewAppointmentStaffStep1.get('customerPostalCode').value,
      "business_id": this.bussinessId,
      "serviceInfo": serviceCartArrTemp,
      "customer_name": this.formAddNewAppointmentStaffStep1.get('customerFullName').value,
      "customer_email": this.formAddNewAppointmentStaffStep1.get('customerEmail').value,
      "customer_phone": this.formAddNewAppointmentStaffStep1.get('customerPhone').value,
      "appointment_address": this.formAddNewAppointmentStaffStep1.get('customerAddress').value,
      "appointment_state": this.formAddNewAppointmentStaffStep1.get('customerState').value,
      "appointment_city": this.formAddNewAppointmentStaffStep1.get('customerCity').value,
      "appointment_zipcode": this.formAddNewAppointmentStaffStep1.get('customerPostalCode').value,
      "coupon_code": '',
      "subtotal": serviceCartArrTemp[0].totalCost,
      "discount": 0,
      "tax": this.taxAmountArr,
      "nettotal": this.netCost,
      "created_by": "admin",
      "payment_method": "Cash",
      "order_date": this.datePipe.transform(currentDateTime,"yyyy-MM-dd hh:mm:ss") 
    };
    console.log(JSON.stringify(requestObject));
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-token': this.token,
      'admin-id': JSON.stringify(this.adminId),
    });
    this.http.post(`${environment.apiUrl}/order-create-check`,requestObject,{headers:headers} ).
    pipe(
    map((res) => {
      return res;
    }),
    ).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Appointment created", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
        });
        this.dialogRef.close();
      }
      else{
          this._snackBar.open("Appointment not created", "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['red-snackbar']
          });
      }
    },
    (err) =>{
      
    })
  }
}


@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/new-appointment.html',
})
export class DialogNewAppointment {

constructor(
  public dialogRef: MatDialogRef<DialogNewAppointment>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}


}
@Component({
  selector: 'allappointment-listing-details',
  templateUrl: '../_dialogs/allappointment-listing-details.html',
})
export class DialogAllAppointmentDetails {

constructor(
  public dialogRef: MatDialogRef<DialogAllAppointmentDetails>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
}


}

