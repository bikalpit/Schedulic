import { Component, OnInit, ViewContainerRef, Inject } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ColorPickerService } from 'ngx-color-picker';
import { AdminSettingsService } from '../../_services/admin-settings.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';
import { NgbDateParserFormatter, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '@app/_services';

export interface DialogData {
  animal: string;
  name: string;

}

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {

  Appearance: FormGroup;
  allAppColor: any;
  AppearanceData: any;
  gradientColor: any;
  settingData: any;
  getAppearanceData: any;
  ChangeName: boolean = false;
  ChangeNumber: boolean = false;
  ChangeRequired: boolean = false;
  ChangeAddress: boolean = false;
  settingSideMenuToggle: boolean = false;
  isTextCopie: boolean = false;
  isLoaderAdmin: boolean = false;
  gradientColorDb: any;
  appearanceValue: any;
  formArr = {
    contact_field_status: false,
    nameField: {
      status: 0,
      required: 0
    },
    numberField: {
      status: 0,
      required: 0
    },
    emailField: {
      status: 0,
      required: 0
    },
    addressField: {
      status: 0,
      required: 0
    },
  };

  formSettingPage: boolean = false;
  formSettingData: any = [];
  primarycolor: any = '#2889e9';
  primarygradient1: any = '#2889e9';
  primarygradient2: any = '#4fa3f7';
  textcolor: any = '#000000';
  textbgcolor: any = '#ffffff';
  embededCode: any;
  businessId: any
  encodedBusinessId: any;
  selectedFont: any = 'Poppins, sans-serif'
  defaultTheme: any = '1';
  model: NgbDateStruct;
  dateformatter: NgbDateParserFormatter;
  date: { year: number, month: number };
  minDate: { year: number, month: number, day: number };
  maxDate: { year: number, month: number, day: number };
  displayMonths = 1;
  companyDetailsData: any;
  navigation = 'arrows';
  widgetBGImage: any;
  frontBookingUrl: any;
  encriptedUserId: any;
  selectedtab: any = 0;
  currentUser: any;
  activatedBtn:number = 1;
  appearanceObject= {
    widgetBackground:{
      backgroundColor:'',
      backgroundImage:'',
    },
    widgetForeGround:{
      backgroundColor:'',
      isShadow:false,
      isBorder:false,
      shadowColor:'',
      borderColor:'',
    },
    widgetStoreDetails:{
      showStoreLogo:false,
      showStoreName:false,
      showStoreAddress:false,
    },
    widgetPrimaryText:{
      font:'',
      color:'',
    },
    widgetSecondaryText:{
      font:'',
      color:'',
    },
    widgetButton:{
      font:'',
      textColor:'',
      backgroundColor:'',
      style:'',
      isBorder:false,
      isShadow:false,
      borderColor:'',
      shadowColor:'',
    },
    widgetButtonHover:{
      isHover:false,
      font:'',
      textColor:'',
      backgroundColor:'',
      isBorder:false,
      isShadow:false,
      borderColor:'',
      shadowCOlor:'',
    }
  }
  constructor(
    private appComponent: AppComponent,
    private _formBuilder: FormBuilder,
    public vcRef: ViewContainerRef,
    private cpService: ColorPickerService,
    private _snackBar: MatSnackBar,
    private calendar: NgbCalendar,
    public dialog: MatDialog,
    @Inject(AdminSettingsService) private AdminSettingsService: AdminSettingsService,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
      this.encriptedUserId = JSON.parse(localStorage.getItem('currentUser'));
      console.log('this.encriptedUserId:', this.encriptedUserId);

      // this.frontBookingUrl = environment.bookpageLink + "/booking/" + window.btoa(this.businessId)
      this.frontBookingUrl = environment.bookpageLink + "/booking/" + this.encriptedUserId.encrypted_id
      // this.frontBookingUrl = environment.bookpageLink + "/business-booking/" + this.encriptedUserId.encrypted_id
      // this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='" + environment.bookpageLink + "/booking/" + window.btoa(this.businessId) + "' frameborder='0'></iframe>";
      this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='" + environment.bookpageLink + "/booking/" + this.encriptedUserId.encrypted_id + "' frameborder='0'></iframe>";
      // this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='" + environment.bookpageLink + "/business-booking/" + this.encriptedUserId.encrypted_id + "' frameborder='0'></iframe>";
    }
    // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    let newWidgetAction = window.location.search.split("?goto=")
    if (newWidgetAction.length > 1 && newWidgetAction[1] == 'link') {
      this.selectedtab = 4;
    }
    if (newWidgetAction.length > 1 && newWidgetAction[1] == 'widgets') {
      this.selectedtab = 1;
    }
  }

  ngOnInit() {
    this.Appearance = this._formBuilder.group({
      font: ['']
    });
    this.getSettingValue();
    this.update_SCSS_var();
    this.getCompanyDetails();
  }
  getCompanyDetails() {
    this.isLoaderAdmin = true;
    let requestObject = {
      "business_id": this.businessId
    }
    this.AdminSettingsService.getCompanyDetails(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.companyDetailsData = response.response;
        console.log(this.companyDetailsData);

      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {

        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnChangeFont(event) {
    console.log(event.value)
    this.selectedFont = event.value
    this.update_SCSS_var();
  }

  activateBTN(btnNo){
    this.activatedBtn = btnNo
  }

  onChangePrimaryColor(event) {
    console.log('--' + event);
    this.primarycolor = event
    this.update_SCSS_var();
  }
  onChangePrimaryGradient1(event) {
    this.primarygradient1 = event
    this.update_SCSS_var();
  }
  onChangePrimaryGradient2(event) {
    this.primarygradient2 = event
    this.update_SCSS_var();
  }
  onChangeTextColor(event) {
    this.textcolor = event
    this.update_SCSS_var();
  }
  onChangeTextBgColor(event) {
    this.textbgcolor = event
    this.update_SCSS_var();
  }

  update_SCSS_var() {
    this.appearanceValue = '{"pri_color":"' + this.primarycolor + '","pri_gradient1":"' + this.primarygradient1 + '","pri_gradient2":"' + this.primarygradient2 + '","text_color":"' + this.textcolor + '","text_bgcolor":"' + this.textbgcolor + '","font":"' + this.selectedFont + '"}';
    console.log(this.appearanceValue);
    const data = JSON.parse(this.appearanceValue);
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

  fnChangeContactFormStatus(event) {
    if (event == true) {
      this.formArr['contact_field_status'] = true;
    } else if (event == false) {
      this.formArr['contact_field_status'] = false;
      this.fnFormSetting();
    }
  }
  fnSettingMenuToggleSmall() {
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge() {
    this.settingSideMenuToggle = false;
  }
  fnChangeFieldStatus(event, field_name) {
    if (event == true) {
      this.formArr[field_name].status = 1;
    } else if (event == false) {
      this.formArr[field_name].status = 0;
      this.formArr[field_name].required = 0;
    }
    console.log(this.formArr);
  }

  fnChangeRequiredStatus(event, field_name) {
    if (event == true) {
      this.formArr[field_name].required = 1;
    } else if (event == false) {
      this.formArr[field_name].required = 0;
    }
    console.log(this.formArr);
  }

  fnSaveAppearanceSettings() {
    if (this.Appearance.valid) {
      this.gradientColor = this.primarygradient1 + "," + this.primarygradient2
      this.AppearanceData = {
        'pri_color': this.primarycolor,
        'pri_gradient1': this.primarygradient1,
        'pri_gradient2': this.primarygradient2,
        'text_color': this.textcolor,
        'text_bgcolor': this.textbgcolor,
        'font': this.Appearance.controls['font'].value,
        'old_image': true,
        'image': this.widgetBGImage
      }
      this.fnCreateAppearance(this.AppearanceData);
    }
  }

  fnCreateAppearance(AppearanceData) {
    this.isLoaderAdmin = true;
    let requestObject = {
      // 'business_id': this.businessId,
      'admin_id': this.currentUser.user_id,
      "appearance": AppearanceData
    };
    this.AdminSettingsService.fnCreateAppearance(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Appearance Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.getSettingValue();
      } else if (response.data == false && response.response !== 'api token or userid invaild') {

        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  getSettingValue() {
    this.isLoaderAdmin = true;
    let requestObject = {
      // 'business_id': this.businessId,
      'admin_id': this.currentUser.user_id,
    };
    this.AdminSettingsService.getSettingsValue(requestObject).subscribe((response: any) => {
      if (response.data == true && response.response != '') {
        this.settingData = response.response
        console.log(this.settingData);
        if (this.settingData.appearance) {
          this.getAppearanceData = JSON.parse(this.settingData.appearance);
          this.primarycolor = this.getAppearanceData.pri_color;
          this.primarygradient1 = this.getAppearanceData.pri_gradient1;
          this.primarygradient2 = this.getAppearanceData.pri_gradient2;
          this.textcolor = this.getAppearanceData.text_color;
          this.textbgcolor = this.getAppearanceData.text_bgcolor;
          this.widgetBGImage = this.getAppearanceData.image;
          this.Appearance.controls['font'].setValue(this.getAppearanceData.font);
          this.update_SCSS_var();
        }
        if (this.settingData.form_settings) {
          this.formArr = JSON.parse(this.settingData.form_settings);
        }
        if (this.settingData.theme) {
          this.defaultTheme = this.settingData.theme
          // if(this.defaultTheme == 1){
          //   this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='"+environment.urlForLink+"/booking?business_id="+window.btoa(this.businessId)+"'></iframe>";
          // }else{
          //   this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='"+environment.urlForLink+"/booking-"+this.defaultTheme+"?business_id="+window.btoa(this.businessId)+"'></iframe>";
          // }
        }
        // else{
        //   this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='"+environment.urlForLink+"/booking?business_id="+window.btoa(this.businessId)+"'></iframe>";
        // }

      } else if (response.data == false && response.response !== 'api token or userid invaild') {

        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnFormSetting() {
    this.isLoaderAdmin = true;
    let requestObject = {
      // 'business_id': this.businessId,
      'admin_id': this.currentUser.user_id,
      'form_settings': this.formArr
    };
    this.AdminSettingsService.fnFormSetting(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Form Settings Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
      } else if (response.data == false && response.response !== 'api token or userid invaild') {

        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }
  /* To copy any Text */
  copyEmbedCode(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.isTextCopie = true
    setTimeout(() => {
      this.isTextCopie = false
    }, 5000);
  }

  fnCancelAppearance() {
    this.getSettingValue();
  }

  fnChnageTheme(selectedTheme) {
    this.isLoaderAdmin = true;
    let requestObject = {
      // 'business_id': this.businessId,
      'admin_id': this.currentUser.user_id,
      'theme': selectedTheme
    };

    this.AdminSettingsService.fnChnageTheme(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Default Theme Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.getSettingValue();
      } else if (response.data == false && response.response !== 'api token or userid invaild') {

        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }
  fnThemePreview(themeNumber) {
    const dialogRef = this.dialog.open(DialogPreviewTheme, {
      width: '900px',
      data: { themeNumber: themeNumber }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  uploadWidgetBGImage() {
    const dialogRef = this.dialog.open(DialogWidgetBGUpload, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.widgetBGImage = result;
        this.AppearanceData = {
          'pri_color': this.primarycolor,
          'pri_gradient1': this.primarygradient1,
          'pri_gradient2': this.primarygradient2,
          'text_color': this.textcolor,
          'text_bgcolor': this.textbgcolor,
          'font': this.Appearance.controls['font'].value,
          'old_image': false,
          'image': this.widgetBGImage,
        }
        this.fnCreateAppearance(this.AppearanceData);
      }
    });
  }


  fnShare(type) {
    if (type == 'facebook') {
      window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(this.frontBookingUrl), "_blank", "width=600,height=600");
    } else if (type == 'twitter') {
      window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(this.frontBookingUrl), "_blank", "width=600,height=600");
    }
  }

}


@Component({
  selector: 'bg-image-upload-dialog',
  templateUrl: '../_dialogs/image-upload-dialog.html',
})
export class DialogWidgetBGUpload {

  uploadForm: FormGroup;
  imageSrc: any;
  profileImage: string;
  constructor(
    public dialogRef: MatDialogRef<DialogWidgetBGUpload>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
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

    if (file_type != 'image/jpeg' && file_type != 'image/png' && file_type != 'image/jpg' && file_type != 'image/gif') {

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

@Component({
  selector: 'dialog-preview-theme',
  templateUrl: '../_dialogs/appearance-theme-preview.html',
})
export class DialogPreviewTheme {

  businessId: any;
  themeNumber: any;
  constructor(
    public dialogRef: MatDialogRef<DialogPreviewTheme>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.themeNumber = this.data.themeNumber;

    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
