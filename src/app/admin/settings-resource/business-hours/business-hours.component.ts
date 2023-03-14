import { Component, Inject, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AdminSettingsService } from '../../_services/admin-settings.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe} from '@angular/common';
import { MatSnackBar} from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ReplaySubject, Subject } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@app/my-date-formats';

export interface DialogData {
  animal: string;
  name: string;
  
}
export interface ListTimeZoneListArry {
  id: string;
  name: string;
}


@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['./business-hours.component.scss'],
  providers: [DatePipe]
})
export class BusinessHoursComponent implements OnInit {
  isLoaderAdmin : boolean = false;
  adminSettings : boolean = true;
  mondayOn : boolean;
  tuesdayOn : boolean;
  wednesdayOn : boolean;
  thursdayOn : boolean;
  fridayOn : boolean;
  saturdayOn : boolean;
  sundayOn : boolean;
  animal: any;
  businessId: any;
  timeZoneList: any=[];
  workingHoursList: any=[];
  timeSlotList: any=[];
  timeOffList: any=[];
  breakTimeList: any=[];
  selectedTimeZone: any;
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
  mondayWorkHourAvailable:boolean=false;
  sundayWorkHourAvailable:boolean=false;
  tuesdayWorkHourAvailable:boolean=false;
  wednesdayWorkHourAvailable:boolean=false;
  thursdayWorkHourAvailable:boolean=false;
  fridayWorkHourAvailable:boolean=false;
  saturdayWorkHourAvailable:boolean=false;
  showMondayAddForm: boolean=false;
  showTuesdayAddForm: boolean=false;
  showWednesdayAddForm: boolean=false;
  showThursdayAddForm: boolean=false;
  showFridayAddForm: boolean=false;
  showSaturdayAddForm: boolean=false;
  showSundayAddForm: boolean=false;
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
  formSetWorkingHours: FormGroup;
  settingSideMenuToggle : boolean = false;

  
  protected listTimeZoneListArry: ListTimeZoneListArry[];
  public timeZoneFilterCtrl: FormControl = new FormControl();
  public listTimeZoneList: ReplaySubject<ListTimeZoneListArry[]> = new ReplaySubject<ListTimeZoneListArry[]>(1);
  protected _onDestroy = new Subject<void>();

  constructor(private appComponent : AppComponent,
    public dialog: MatDialog, 
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar) { 
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
    // this.fnGetTimeZone();
    this.fnGetTimeSlotsList("00:00","23:30","30");
    this.fnGetBussinessTimeZone();
    this.fnGetWorkingHours();
    this.fnGetTimeOffList();
    this.fnGetBreakTimeList();

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
    })
  }

  ngOnInit() {
  }

  fnGetBussinessTimeZone(){
    this.isLoaderAdmin = true;
    let requestObject={
      "business_id":this.businessId
    }

    this.adminSettingsService.getBussinessTimeZone(requestObject).subscribe((response:any) => {
      if(response.data == true){
       this.selectedTimeZone= response.response[0].time_zone;
      }
      this.isLoaderAdmin = false;
    })
  }

  fnCreateWorkingHours(){
    if(this.formSetWorkingHours.invalid){
    
      return false;
    }
    let workingHoursArray:any=[];
    let workingHoursTempArray={
      dayNumber:"",
      offday:""
    };

    workingHoursTempArray={
      dayNumber:"1",
      offday:this.mondayOn?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"2",
      offday:this.tuesdayOn?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"3",
      offday:this.wednesdayOn?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"4",
      offday:this.thursdayOn?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"5",
      offday:this.fridayOn?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"6",
      offday:this.saturdayOn?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"0",
      offday:this.sundayOn?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);
    let requestObject={
      "business_id":this.businessId,
      "workingHour":workingHoursArray
    }

    this.isLoaderAdmin = true;
    this.adminSettingsService.createWorkingHours(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnGetWorkingHours();
        this.snackBar.open("Working Hours Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.fnGetBussinessTimeZone();
        this.fnGetWorkingHours();
        this.fnGetTimeOffList();
        this.fnGetBreakTimeList();

      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open("Working Hours Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnApplyToAll(){
    let mondayHours = [];
    mondayHours = this.workingHoursList.filter(element => element.week_day_id == 1);

    mondayHours.forEach(element => {
      if(element.day_start_time == '' || element.day_start_time == null || element.day_end_time == '' || element.day_end_time == null){
        this.snackBar.open("Start & End Time can not be empty.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        return false;
      }
    });
    let requestObject={
      "business_id":this.businessId,
      "working_hours":mondayHours,
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.applyToAll(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnGetWorkingHours();
        this.snackBar.open("Working Hours applied to all.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open("Working Hours Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  

  fnApplyToAllBreaks(){
    let mondayBreaks = [];
    mondayBreaks = this.breakTimeList.filter(element => element.week_day_id == 1);

    mondayBreaks.forEach(element => {
      if(element.break_start_time == '' || element.break_start_time == null || element.break_end_time == '' || element.break_end_time == null){
        this.snackBar.open("Start & End Time can not be empty.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
        return false;
      }
    });
    let requestObject={
      "business_id":this.businessId,
      "type":"A",
      "breaks":mondayBreaks,
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.applyToAllBreaks(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnGetBreakTimeList();
        this.snackBar.open("Breaks applied to all.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open("Breaks Not Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }


  fnCancelWorkingHours(){
    this.fnGetWorkingHours();
  }

  fnChangeToggle(event,day){
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
        long: this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+hours + ":" + minutes),"HH:mm"),
        short:this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy/MM/dd")+" "+hours + ":" + minutes),"hh:mm a")
      };
     return tempArr;
  }

  fnGetWorkingHours(){
    this.isLoaderAdmin = true;
    let requestObject={
      "business_id":this.businessId
    }
    this.adminSettingsService.getWorkingHours(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.workingHoursList=response.response;
        this.workingHoursList.forEach(element => {
          if(element.week_day_id == 0){
            element.week_day_name="Sunday";
            if(element.off_day=="N"){
              this.sundayOn=true;
            }else{
              this.sundayOn=false;
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
            }else{
              this.mondayOn=false;
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
            }else{
              this.tuesdayOn=false;
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
            }else{
              this.wednesdayOn=false;
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
            }else{
              this.thursdayOn=false;
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
            }else{
              this.fridayOn=false;
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
            }else{
              this.saturdayOn=false;
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
      this.isLoaderAdmin = false;
    })
  }

  fnOnChangeStartTimeWorkingHour(event,day){
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

  addTimeOff(){
    const dialogRef = this.dialog.open(DialogAddNewTimeOffBussiness, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        if(result.call==true){
        this.fnGetTimeOffList();
       }
      }
       
     });

  }

  fnGetTimeOffList(){
    let requestObject={
      "business_id":this.businessId
    }

    this.adminSettingsService.getTimeOffList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.timeOffList= response.response;
        this.timeOffList.forEach(element => {
          if(element.start_date){
            element.start_date=this.datePipe.transform(new Date(element.start_date),"yyyy/MM/dd");
          }
          if(element.end_date){
            element.end_date=this.datePipe.transform(new Date(element.end_date),"yyyy/MM/dd");
          }
        });
      }else{
        this.timeOffList= [];
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
        let requestObject={
          "time_off_id":timeOffId
        }

        this.adminSettingsService.deleteTimeOffStaff(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnGetTimeOffList();
            this.snackBar.open("Time off Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
          } else if(response.data == false && response.response !== 'api token or userid invaild'){
           this.snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
        })
      }
    });
  }

  fnChangeTimeOffStatus(event,timeOffId){
    this.isLoaderAdmin = true;
    let requestObject={
      "time_off_id":timeOffId,
      "status":event.checked?"E":"D"
    }

    this.adminSettingsService.changeTimeOffStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnGetTimeOffList();
        this.snackBar.open("Time off status updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      } else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnGetBreakTimeList(){
    this.isLoaderAdmin = true;
    let requestObject={
      "business_id":this.businessId
    }

    this.adminSettingsService.getBreakTimeList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.breakTimeList= response.response;
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
      this.isLoaderAdmin = false;
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

  fnOnChangeStartTimeBreak(event,day){
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

  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
  }

  fnAddBreak(day){
    let requestObject={
      "business_id":'',
      "start_time":'',
      "end_time":'',
      "dayNumber":''
    }
    if(day == "Monday"){
      if(this.selectedStartTimeMonday==null || this.selectedEndTimeMonday==null){
        if(this.selectedStartTimeMonday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeMonday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeMonday,
        "end_time":this.selectedEndTimeMonday,
        "dayNumber":"1"
      }
    }
    if(day == "Tuesday"){
      if(this.selectedStartTimeTuesday==null || this.selectedEndTimeTuesday==null){
        if(this.selectedStartTimeTuesday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeTuesday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeTuesday,
        "end_time":this.selectedEndTimeTuesday,
        "dayNumber":"2"
      }
    }
    if(day == "Wednesday"){
      if(this.selectedStartTimeWednesday==null || this.selectedEndTimeWednesday==null){
        if(this.selectedStartTimeWednesday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeWednesday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeWednesday,
        "end_time":this.selectedEndTimeWednesday,
        "dayNumber":"3"
      }
    }
    if(day == "Thursday"){
      if(this.selectedStartTimeThursday==null || this.selectedEndTimeThursday==null){
        if(this.selectedStartTimeThursday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeThursday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeThursday,
        "end_time":this.selectedEndTimeThursday,
        "dayNumber":"4"
      }
    }
    if(day == "Friday"){
      if(this.selectedStartTimeFriday==null || this.selectedEndTimeFriday==null){
        if(this.selectedStartTimeFriday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeFriday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeFriday,
        "end_time":this.selectedEndTimeFriday,
        "dayNumber":"5"
      }
    }
    if(day == "Saturday"){
      if(this.selectedStartTimeSaturday==null || this.selectedEndTimeSaturday==null){
        if(this.selectedStartTimeSaturday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeSaturday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeSaturday,
        "end_time":this.selectedEndTimeSaturday,
        "dayNumber":"6"
      }
    }
    if(day == "Sunday"){
      if(this.selectedStartTimeSunday==null || this.selectedEndTimeSunday==null){
        if(this.selectedStartTimeSunday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedEndTimeSunday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedStartTimeSunday,
        "end_time":this.selectedEndTimeSunday,
        "dayNumber":"0"
      }
    }
    this.adminSettingsService.addNewBreak(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnGetBreakTimeList();
        this.showMondayAddForm=false;
        this.showTuesdayAddForm=false;
        this.showWednesdayAddForm=false;
        this.showThursdayAddForm=false;
        this.showFridayAddForm=false;
        this.showSaturdayAddForm=false;
        this.showSundayAddForm=false;
        this.snackBar.open("Break Added.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
       else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnAddWorkHour(day){
    let requestObject={
      "business_id":'',
      "start_time":'',
      "end_time":'',
      "dayNumber":''
    }
    if(day == "Monday"){
      if(this.selectedWorkHourStartTimeMonday==null || this.selectedWorkHourEndTimeMonday==null){
        if(this.selectedWorkHourStartTimeMonday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeMonday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }

        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedWorkHourStartTimeMonday,
        "end_time":this.selectedWorkHourEndTimeMonday,
        "dayNumber":"1"
      }
    }
    if(day == "Tuesday"){
      if(this.selectedWorkHourStartTimeTuesday==null || this.selectedWorkHourEndTimeTuesday==null){
        if(this.selectedWorkHourStartTimeTuesday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeTuesday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedWorkHourStartTimeTuesday,
        "end_time":this.selectedWorkHourEndTimeTuesday,
        "dayNumber":"2"
      }
    }
    if(day == "Wednesday"){
      if(this.selectedWorkHourStartTimeWednesday==null || this.selectedWorkHourEndTimeWednesday==null){
        if(this.selectedWorkHourStartTimeWednesday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeWednesday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedWorkHourStartTimeWednesday,
        "end_time":this.selectedWorkHourEndTimeWednesday,
        "dayNumber":"3"
      }
    }
    if(day == "Thursday"){
      if(this.selectedWorkHourStartTimeThursday==null || this.selectedWorkHourEndTimeThursday==null){
        if(this.selectedWorkHourStartTimeThursday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeThursday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedWorkHourStartTimeThursday,
        "end_time":this.selectedWorkHourEndTimeThursday,
        "dayNumber":"4"
      }
    }
    if(day == "Friday"){
      if(this.selectedWorkHourStartTimeFriday==null || this.selectedWorkHourEndTimeFriday==null){
        if(this.selectedWorkHourStartTimeFriday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeFriday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedWorkHourStartTimeFriday,
        "end_time":this.selectedWorkHourEndTimeFriday,
        "dayNumber":"5"
      }
      
    }
    if(day == "Saturday"){
      if(this.selectedWorkHourStartTimeSaturday==null || this.selectedWorkHourEndTimeSaturday==null){
        if(this.selectedWorkHourStartTimeSaturday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeSaturday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedWorkHourStartTimeSaturday,
        "end_time":this.selectedWorkHourEndTimeSaturday,
        "dayNumber":"6"
      }
      
    }
    if(day == "Sunday"){
      if(this.selectedWorkHourStartTimeSunday==null || this.selectedWorkHourEndTimeSunday==null){
        if(this.selectedWorkHourStartTimeSunday==null){
          this.snackBar.open("Select Start Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        if(this.selectedWorkHourEndTimeSunday==null){
          this.snackBar.open("Select End Time.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        return false;
      }
      requestObject={
        "business_id":this.businessId,
        "start_time":this.selectedWorkHourStartTimeSunday,
        "end_time":this.selectedWorkHourEndTimeSunday,
        "dayNumber":"0"
      }
      
    }
    console.log('requestObject--',requestObject);
    
    this.adminSettingsService.addNewWorkingHoursStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnGetWorkingHours();
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
        this.snackBar.open("Working Hour Added.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
       else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
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
        let requestObject={
          "working_hours_id":WorkHourId
        }

        this.adminSettingsService.deleteWorkingHours(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnGetWorkingHours();
            this.snackBar.open("Working Hour Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
          } else if(response.data == false && response.response !== 'api token or userid invaild'){
           this.snackBar.open("Working Hour Not Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
        })
      }
    });
  }

  fnDeleteBreak(breakId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let requestObject={
          "break_id":breakId
        }

        this.adminSettingsService.deleteBreak(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnGetBreakTimeList();
            this.snackBar.open("Break Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
          } else if(response.data == false && response.response !== 'api token or userid invaild'){
           this.snackBar.open("Break Not Deleted.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
        })
      }
    });
  }
}

@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/bussiness-hour-add-time-off.html',
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    DatePipe
  ]
})
export class DialogAddNewTimeOffBussiness {

businessId:any;
minStartDate = new Date();
minEndDate = new Date();
formAddNewTimeOff: FormGroup;
constructor(
  public dialogRef: MatDialogRef<DialogAddNewTimeOffBussiness>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData,
  private datePipe: DatePipe,
  private _formBuilder: FormBuilder, 
  @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
  private snackBar: MatSnackBar) {
  this.formAddNewTimeOff = this._formBuilder.group({
    startDate: [this.minStartDate,Validators.required],
    endDate: ['',Validators.required],
    description: ['',Validators.required],
  });
  if(localStorage.getItem('business_id')){
    this.businessId = localStorage.getItem('business_id');
  }
}

fnDateChange(event: MatDatepickerInputEvent<Date>){
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
      "business_id":this.businessId,
      "start_date":this.datePipe.transform(new Date(this.formAddNewTimeOff.get("startDate").value),"yyyy/MM/dd"),
      "end_date":this.datePipe.transform(new Date(this.formAddNewTimeOff.get("endDate").value),"yyyy/MM/dd"),
      "description":this.formAddNewTimeOff.get("description").value
    }
    this.adminSettingsService.addNewTimeOff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.dialogRef.close({ call: true });
        this.snackBar.open("Holiday added.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
       else if(response.data == false && response.response !== 'api token or userid invaild'){
       this.snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
}


}
