import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '@app/app.component'
import { AdminSettingsService } from '../../_services/admin-settings.service';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-paymentgateway',
  templateUrl: './paymentgateway.component.html',
  styleUrls: ['./paymentgateway.component.scss']
})
export class PaymentgatewayComponent implements OnInit {
  adminSettings : boolean = true;

  currentUser:any;
  paypal: FormGroup;
  stripe: FormGroup;
  payumoney: FormGroup;
  bankTransfer: FormGroup;
  settingsValue: any;
  paypalSettingValue: any;
  stripeSettingValue: any;
  payUMoneySettingValue: any;
  bankTransferSettingValue: any;
  isLoaderAdmin : boolean = false;
  businessId : any;
  paypalStatus : boolean = false;
  stripeStatus : boolean = false;
  payumoneyStatus : boolean = false;
  bankTransferStatus : boolean = false;
  paypalGuestStatus : boolean = false;
  paypalTestStatus : boolean = false;
  settingSideMenuToggle : boolean = false;
  gatewayList:any=[];


  constructor(
    private appComponent : AppComponent,
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
      private authenticationService: AuthenticationService,
  )
   {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    //this.appComponent.settingsModule(this.adminSettings);
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
   }

  ngOnInit() {
    this.getAllPaymentGateways();
  }
  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
  }

  getAllPaymentGateways(){
    let requestObject = {
      'admin_id' : this.currentUser.user_id,
      'business_id' : this.businessId,
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.getAllPaymentGateways(requestObject).subscribe((response:any) => {
      if(response.status == 'success'){
        this.gatewayList = response.data;
        // this.ErrorService.successMessage('Paypal Updated')
      } else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    });
    setTimeout(() => {
      this.isLoaderAdmin = false;
    }, 500);

  }


  public onSubmitPaymentGateway(data:NgForm,gateway_type,is_default,code){
        //console.log(data.value);
        let testMode = data.value.testMode?1:0;
        //console.log(testMode);
        let login_details = {};
        Object.entries(data.value).forEach(([key, value]) => {
          // login_details[key] = encodeURIComponent(String(value));
          login_details[key] = String(value);
        });
        delete login_details['testMode'];
        let requestObject = {
          'admin_id' : this.currentUser.user_id,
          'business_id' : this.businessId,
          'gateway_type' : gateway_type,
          'gateway_code' : code,
          'login_detail' : login_details,
          'testMode' : testMode,
        }
        this.isLoaderAdmin = true;
        this.adminSettingsService.UpdatePaymentGateway(requestObject).subscribe(response => {
          //console.log(response);
          if(response['status']==='success'){
            this._snackBar.open(response['message'], "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
            this.getAllPaymentGateways();
          }else if(response['status']=='error'){
            this._snackBar.open(response['message'], "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['red-snackbar']
            });
          }
          this.isLoaderAdmin = false;
        },err=>{
          this.isLoaderAdmin = false;
          this._snackBar.open(environment.ErrorMsg, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
        })
  }


  public ChangePaymentStatus(code,type,status){
    if (status) {
      let requestObject = {
        'code':code,
        'status':'active',
        'gateway_type':type,
        'admin_id' : this.currentUser.user_id,
        'business_id' : this.businessId,
      }
      this.isLoaderAdmin = true;
      this.adminSettingsService.ChangeGatewayStatus(requestObject).subscribe(response => {
        if(response['status']=='success'){
          this.getAllPaymentGateways();
          this._snackBar.open(response['message'], "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
        }else if(response['status']==='error'){
          this._snackBar.open(response['message'], "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        this.getAllPaymentGateways();
        this.isLoaderAdmin = false;
      },err=>{
        this.isLoaderAdmin = false;
        this._snackBar.open(environment.ErrorMsg, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      })
    }
    else {
      let requestObject = {
        'code':code,
        'status':'inactive',
        'gateway_type':type,
        'admin_id' : this.currentUser.user_id,
        'business_id' : this.businessId,
      }
      this.isLoaderAdmin = true;
      this.adminSettingsService.ChangeGatewayStatus(requestObject).subscribe(response => {
        if(response['status']=='success'){
         this._snackBar.open(response['message'], "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
        }else if(response['status']==='error'){
          this._snackBar.open(response['message'], "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
        }
        this.getAllPaymentGateways();
        this.isLoaderAdmin = false;
      },err=>{
        this.isLoaderAdmin = false;
        this._snackBar.open(environment.ErrorMsg, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      })
    }
  }

  SetDefault(code,type) {
    let requestObject = {
      'admin_id' : this.currentUser.user_id,
      'business_id' : this.businessId,
      'gateway_type' : type,
      'code' : code,
      'is_default' : 1,
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.ChangeDefaultGateway(requestObject).subscribe(response => {
      if(response['status']=='success'){
        this.getAllPaymentGateways();
        this._snackBar.open(response['message'], "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass : ['green-snackbar']
            });
      }else if(response['status']=='error'){
          this._snackBar.open(response['message'], "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
      }else{
          this._snackBar.open(response['message'], "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass : ['red-snackbar']
          });
      }
      this.isLoaderAdmin = false;
    },err=>{
      this.isLoaderAdmin = false;
      this._snackBar.open(environment.ErrorMsg, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['green-snackbar']
      });
    })
  }


}
