import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-alertsettings',
  templateUrl: './alertsettings.component.html',
  styleUrls: ['./alertsettings.component.scss']
})
export class AlertsettingsComponent implements OnInit {

  businessId : any;
  emailCustomerAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  emailStaffAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  emailAdminAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  emailAlertCustomer : any;
  emailAlertCustomerDays: any;
  emailAlertCustomerHours: any;
  emailAlertCustomerMinutes: any;
  emailAlertStaff: any;
  emailAlertStaffDays: any;
  emailAlertStaffHours: any;
  emailAlertStaffMinutes: any;
  emailAlertAdmin: any;
  emailAlertAdminDays: any;
  emailAlertAdminHours: any;
  emailAlertAdminMinutes: any;
  Months:any;
  Days:any;
  Hours:any;
  Minutes:any;
  adminSettings : boolean = true;
  appointmentsReminder : boolean = false;
  appointmentsReminderStaff :boolean = false;
  appointmentsReminderAdmin :boolean = false;
  AppointmentsReminderSMS : boolean = false;
  totalTimeCustomerEmail:any;
  totalTimeStaffEmail: any;
  totalTimeAdminEmail: any;
  customizeEmailAlertData: any;
  adminEmailForAlert: FormGroup;
  customizeAlert: FormGroup;
  cusAppRequest: FormGroup;
  maxCharacters = 500; 
  characters = this.maxCharacters;
  constructor(
    private appComponent : AppComponent,
    public adminSettingsService : AdminSettingsService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    ) {
      if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
      }

      this.emailAlertCustomerDays = "0";
      this.emailAlertCustomerHours= "0";
      this.emailAlertCustomerMinutes= "0";
      this.emailAlertStaffDays = "0";
      this.emailAlertStaffHours= "0";
      this.emailAlertStaffMinutes= "0";
      this.emailAlertAdminDays = "0";
      this.emailAlertAdminHours= "0";
      this.emailAlertAdminMinutes= "0";
    }
     

  ngOnInit() {
    this.getSettingsValue();
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    this.adminEmailForAlert = this._formBuilder.group({
      alertEmail: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]]
    });

    this.customizeAlert = this._formBuilder.group({
      senderName: ['',[Validators.required]],
      emailSignature: ['',[Validators.required]]
    });

    // Email Templates
    this.cusAppRequest = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
 
  } 
  count(value: string){
    this.characters = this.maxCharacters - value.length;
  }

  fnConvertMins(minutes){
    let min_advance_booking_time=minutes;
    let months = (min_advance_booking_time/(30*24*60)).toString();
    this.Months=(parseInt(months)).toString();
    let RAM = min_advance_booking_time%(30*24*60);
    let days = (RAM/(24*60)).toString();
    this.Days=(parseInt(days)).toString();
    let RAD = RAM%(24*60);
    let hours= (RAD/60).toString();
    this.Hours=(parseInt(hours)).toString();
    let RAH = (RAD%(60)).toString();
    this.Minutes=(parseInt(RAH)).toString();
  }

  getSettingsValue(){
  this.adminSettingsService.getSettingsValue().subscribe((response:any) => {
      if(response.data == true){
        console.log(response.response)
        this.emailAlertCustomer = JSON.parse(response.response.email_alert_settings_customer)
        this.fnConvertMins(this.emailAlertCustomer.reminder_lead_time);
          this.emailAlertCustomerDays=this.Days;
          this.emailAlertCustomerHours=this.Hours;
          this.emailAlertCustomerMinutes=this.Minutes;
          this.appointmentsReminder = this.emailAlertCustomer.status;
          this.emailCustomerAppointment =  JSON.parse(this.emailAlertCustomer.appointment);
          this.emailAlertStaff = JSON.parse(response.response.email_alert_settings_staff)
          this.fnConvertMins(this.emailAlertStaff.reminder_lead_time);
          this.emailAlertStaffDays=this.Days;
          this.emailAlertStaffHours=this.Hours;
          this.emailAlertStaffMinutes=this.Minutes;
          this.appointmentsReminderStaff = this.emailAlertStaff.status;
          this.emailStaffAppointment =  JSON.parse(this.emailAlertStaff.appointment);
          this.emailAlertAdmin = JSON.parse(response.response.email_alert_settings_admin)
          this.fnConvertMins(this.emailAlertAdmin.reminder_lead_time);
          this.emailAlertAdminDays=this.Days;
          this.emailAlertAdminHours=this.Hours;
          this.emailAlertAdminMinutes=this.Minutes;
          this.appointmentsReminderAdmin = this.emailAlertAdmin.status;
          if(this.emailAlertAdmin.admin_mail){
           this.adminEmailForAlert.controls['alertEmail'].setValue(this.emailAlertAdmin.admin_mail);
          }
          this.emailAdminAppointment =  JSON.parse(this.emailAlertAdmin.appointment);
          
          this.customizeEmailAlertData = JSON.parse(response.response.customize_email_alert)
          console.log(this.customizeEmailAlertData);
          if(this.customizeEmailAlertData){
            this.customizeAlert.controls['senderName'].setValue(this.customizeEmailAlertData.sender_name);
            this.customizeAlert.controls['emailSignature'].setValue(this.customizeEmailAlertData.email_signature);
          }
      }
      else{
       
      }
    })
  }
fnAppointmentsReminder(event){
    if(event == true){
      this.appointmentsReminder = true;
    }else if(event == false){
      this.appointmentsReminder = false;
    }
    let customerAlertSetting = {
      "reminder_lead_time" : this.totalTimeCustomerEmail,
      "appointment" : JSON.stringify(this.emailCustomerAppointment),
      "status":this.appointmentsReminder,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminder,
      "email_alert_settings_customer" : customerAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateCusEmailAlert(requestObject);
    
}

fnAppointmentsReminderStaff(event){
    if(event == true){
      this.appointmentsReminderStaff = true;
    }else if(event == false){
      this.appointmentsReminderStaff = false;
    }
    let staffAlertSetting = {
      "reminder_lead_time" : this.totalTimeStaffEmail,
      "appointment" : JSON.stringify(this.emailStaffAppointment),
      "status":this.appointmentsReminderStaff,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminderStaff,
      "email_alert_settings_staff" : staffAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateStaffEmailAlert(requestObject);
  }
  fnAppointmentsReminderAdmin(event){
    if(event == true){
      this.appointmentsReminderAdmin = true;
    }else if(event == false){
      this.appointmentsReminderAdmin = false;
    }
    let adminAlertSetting = {
      "reminder_lead_time" : this.totalTimeAdminEmail,
      "appointment" : JSON.stringify(this.emailAdminAppointment),
      "status":this.appointmentsReminderAdmin,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminderAdmin,
      "email_alert_settings_admin" : adminAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateAdminEmailAlert(requestObject);
  }

fnAppointmentsReminderSMS(event){
    if(event == true){
      this.AppointmentsReminderSMS = true;
    }else if(event == false){
      this.AppointmentsReminderSMS = false;
    }
}

  fnCusEmailAppoint(event, value){
    if(event == true){
      this.emailCustomerAppointment[value].status=1;
    }else{
      this.emailCustomerAppointment[value].status=0;
    }
    console.log(this.emailCustomerAppointment);
  }
  fnStaffEmailAppoint(event, value){
    if(event == true){
      this.emailStaffAppointment[value].status=1;
    }else{
      this.emailStaffAppointment[value].status=0;
    }
    console.log(this.emailStaffAppointment);
  }
  fnAdminEmailAppoint(event, value){
    if(event == true){
      this.emailAdminAppointment[value].status=1;
    }else{
      this.emailAdminAppointment[value].status=0;
    }
    console.log(this.emailAdminAppointment);
  }

  fnSetCustomerEmailReminderTime(event){
    let email_alert_customer_days=0;
    let email_alert_customer_hours=0;
    let email_alert_customer_minutes=0;
    if(this.emailAlertCustomerDays !=undefined){
     email_alert_customer_days =  parseInt(this.emailAlertCustomerDays)*24*60;
    }
    if(this.emailAlertCustomerHours !=undefined){
     email_alert_customer_hours =  parseInt(this.emailAlertCustomerHours)*60;
    }
    if(this.emailAlertCustomerMinutes !=undefined){
     email_alert_customer_minutes =  parseInt(this.emailAlertCustomerMinutes);
    }
    this.totalTimeCustomerEmail=email_alert_customer_days+email_alert_customer_hours+email_alert_customer_minutes;
    console.log(this.totalTimeCustomerEmail);

  }
  fnSubmitCusEmailAlert(){
    let customerAlertSetting = {
      "reminder_lead_time" : this.totalTimeCustomerEmail,
      "appointment" : JSON.stringify(this.emailCustomerAppointment),
      "status":this.appointmentsReminder,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminder,
      "email_alert_settings_customer" : customerAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateCusEmailAlert(requestObject);
  }
  fnUpdateCusEmailAlert(requestObject){
    this.adminSettingsService.fnAppointmentsReminderCustomer(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email alerts for the Customer are Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnSetStaffEmailReminderTime(){
    let email_alert_staff_days=0;
    let email_alert_staff_hours=0;
    let email_alert_staff_minutes=0;
    if(this.emailAlertStaffDays !=undefined){
     email_alert_staff_days =  parseInt(this.emailAlertStaffDays)*24*60;
    }
    if(this.emailAlertStaffHours !=undefined){
     email_alert_staff_hours =  parseInt(this.emailAlertStaffHours)*60;
    }
    if(this.emailAlertStaffMinutes !=undefined){
     email_alert_staff_minutes =  parseInt(this.emailAlertStaffMinutes);
    }
    this.totalTimeStaffEmail=email_alert_staff_days+email_alert_staff_hours+email_alert_staff_minutes;
    console.log(this.totalTimeStaffEmail);
  }
  fnSubmitStaffEmailAlert(){
    let staffAlertSetting = {
      "reminder_lead_time" : this.totalTimeStaffEmail,
      "appointment" : JSON.stringify(this.emailStaffAppointment),
      "status":this.appointmentsReminderStaff,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminderStaff,
      "email_alert_settings_staff" : staffAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateStaffEmailAlert(requestObject);
  }

  fnUpdateStaffEmailAlert(requestObject){
    this.adminSettingsService.fnUpdateStaffEmailAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email alerts for the Staff are Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnSetAdminEmailReminderTime(event){
    let email_alert_admin_days=0;
    let email_alert_admin_hours=0;
    let email_alert_admin_minutes=0;
    if(this.emailAlertAdminDays !=undefined){
     email_alert_admin_days =  parseInt(this.emailAlertAdminDays)*24*60;
    }
    if(this.emailAlertAdminHours !=undefined){
     email_alert_admin_hours =  parseInt(this.emailAlertAdminHours)*60;
    }
    if(this.emailAlertAdminMinutes !=undefined){
     email_alert_admin_minutes =  parseInt(this.emailAlertAdminMinutes);
    }
    this.totalTimeAdminEmail=email_alert_admin_days+email_alert_admin_hours+email_alert_admin_minutes;
    console.log(this.totalTimeAdminEmail);

  }
  fnSubmitAdminEmailAlert(){
    if(this.adminEmailForAlert.valid){ 
      let adminAlertSetting = {
        "reminder_lead_time" : this.totalTimeAdminEmail,
        "appointment" : JSON.stringify(this.emailAdminAppointment),
        "status":this.appointmentsReminderAdmin,
        "admin_mail": this.adminEmailForAlert.get('alertEmail').value
      }
      let requestObject={
        "business_id":this.businessId,
        "status":this.appointmentsReminderAdmin,
        "email_alert_settings_admin" : adminAlertSetting
      }
      console.log(requestObject);
      this.fnUpdateAdminEmailAlert(requestObject);
    }
    // else{
    //   setTimeout(() => this.adminEmailForAlert.focus(), 0);
    //   //this.adminEmailForAlert.controls['alertEmail'].focus();
    // }
   
  }
  fnUpdateAdminEmailAlert(requestObject){
    this.adminSettingsService.fnUpdateAdminEmailAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email alerts for the Admin are Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnSubmitCustomizeAlert(){
    if(this.customizeAlert.valid){
      let customizeEmailAlert = {
        "sender_name" : this.customizeAlert.get('senderName').value,
        "email_signature" : this.customizeAlert.get('emailSignature').value,
      }
      let requestObject={
        "business_id":this.businessId,
        "customize_email_alert" : customizeEmailAlert
      }

      this.adminSettingsService.fnSubmitCustomizeAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Customize Email alerts are Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
    }
  }

  // fnSaveCusAppReqEmailTemp(){
  //   if(this.customizeAlert.valid){
  //     let requestObject={
  //       "business_id":this.businessId,
  //       "user_type" : userType,
  //       "template_type" : tempType,
  //       "status" : emailStatus,
  //       "subject" : tempSubject,
  //       "message" : 
  //     }
      
  //   }
  // }

  // fnUpdateEmailTemplate(requestObject){
  //   this.adminSettingsService.fnUpdateEmailTemplate(requestObject).subscribe((response:any) => {
  //     if(response.data == true){
  //       this._snackBar.open("Email Template is Updated", "X", {
  //         duration: 2000,
  //         verticalPosition: 'top',
  //         panelClass : ['green-snackbar']
  //       });
  //       this.getSettingsValue();
  //     }
  //     else{
  //     this._snackBar.open(response.response, "X", {
  //         duration: 2000,
  //         verticalPosition: 'top',
  //         panelClass : ['red-snackbar']
  //       });
  //     }
  //   })
  // }

}


