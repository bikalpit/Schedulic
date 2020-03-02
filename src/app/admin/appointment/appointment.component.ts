import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AdminService } from '../_services/admin-main.service';
import { Subject } from 'rxjs';


export interface DialogData {
  animal: string;
  name: string;
 
}
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  
  animal: any;
  allAppointments:any;
  durationType : any;
  dataTable: any;
  selectedServices: any;
  allservices: any;
  isLoaderAdmin : boolean = false;
  constructor(
    public dialog: MatDialog,
    private AdminService: AdminService,
    ) {
      localStorage.setItem('isBusiness', 'false');
     }

  ngOnInit() {
    this.durationType = 'month';
    this.selectedServices =  'all';
    this.getAllAppointments(this.durationType,this.selectedServices);
    this.getAllServices();
    
    this.dtOptions = {
     
      // Use this attribute to enable the responsive extension
      responsive: true,
    };
   
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
    alert(services);
    this.isLoaderAdmin = true;
    this.AdminService.getAllAppointments(durationType,services).subscribe((response:any) => {
      if(response.data == true){
        this.allAppointments = response.response
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
       this.animal = result;
     });
  }

   
  newAppointment() {
    const dialogRef = this.dialog.open(DialogNewAppointment, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
     });
  }

}

@Component({
  selector: 'add-new-appointment',
  templateUrl: '../_dialogs/add-new-appointment.html',
})
export class DialogAddNewAppointment {

constructor(
  public dialogRef: MatDialogRef<DialogAddNewAppointment>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

onNoClick(): void {
  this.dialogRef.close();
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