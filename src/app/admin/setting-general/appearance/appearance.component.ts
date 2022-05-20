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
import {DomSanitizer} from "@angular/platform-browser";

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
  frontBookingUrl: any;
  encriptedUserId: any;
  selectedtab: any = 0;
  currentUser: any;
  activatedBtn: number = 1;
  appearanceObject = {
    widgetBackground_backgroundColor: '',
    widgetBackground_backgroundImage: '',
    widgetHeader_color: '',
    widgetForeGround_backgroundColor: '',
    widgetForeGround_isShadow: false,
    widgetForeGround_isBorder: false,
    widgetForeGround_shadowColor: '',
    widgetForeGround_borderColor: '',
    widgetStoreDetails_showStoreLogo: false,
    widgetStoreDetails_showStoreName: false,
    widgetStoreDetails_showStoreAddress: false,
    widgetPrimaryText_font: 'Poppins, sans-serif',
    widgetPrimaryText_color: '',
    widgetSecondaryText_font: 'Poppins, sans-serif',
    widgetSecondaryText_color: '',
    widgetButton_font: 'Poppins, sans-serif',
    widgetButton_textColor: '',
    widgetButton_backgroundColor: '',
    widgetButton_style: 1,
    widgetButton_isBorder: false,
    widgetButton_isShadow: false,
    widgetButton_borderColor: '',
    widgetButton_shadowColor: '',
    widgetButtonHover_isHover: false,
    widgetButtonHover_font: 'Poppins, sans-serif',
    widgetButtonHover_textColor: '',
    widgetButtonHover_backgroundColor: '',
    widgetButtonHover_isBorder: false,
    widgetButtonHover_isShadow: false,
    widgetButtonHover_borderColor: '',
    widgetButtonHover_shadowColor: '',
  }
  theme1appearanceObject:any;
  theme2appearanceObject:any;
  theme3appearanceObject:any;
  theme4appearanceObject:any;
  theme5appearanceObject:any;
  embededCodePreview:any;
  commonAppearanceObject:any ={
    default:'',
    new:''
  }
  constructor(
    public vcRef: ViewContainerRef,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private sanitizer:DomSanitizer,
    @Inject(AdminSettingsService) private AdminSettingsService: AdminSettingsService,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
      this.encriptedUserId = JSON.parse(localStorage.getItem('currentUser'));

      // this.frontBookingUrl = environment.bookpageLink + "/booking/" + window.btoa(this.businessId)
      this.frontBookingUrl = environment.bookpageLink + "/booking/" + this.encriptedUserId.encrypted_id
      // this.frontBookingUrl = environment.bookpageLink + "/business-booking/" + this.encriptedUserId.encrypted_id
      // this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='" + environment.bookpageLink + "/booking/" + window.btoa(this.businessId) + "' frameborder='0'></iframe>";
      this.embededCode = "<iframe id='front_iframe' height='100%' style='height:100vh' width='100%' src='" + environment.bookpageLink + "/booking/" + this.encriptedUserId.encrypted_id + "' frameborder='0'></iframe>";
      this.embededCodePreview = this.transform(this.embededCode);
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


    // theme wise appearance

    this.theme1appearanceObject = {
      widgetBackground_backgroundColor: '#fff',
      widgetBackground_backgroundImage: '',
      widgetHeader_color: '#1D1D1D',
      widgetForeGround_backgroundColor: '#fff',
      widgetForeGround_isShadow: false,
      widgetForeGround_isBorder: false,
      widgetForeGround_shadowColor: '',
      widgetForeGround_borderColor: '',
      widgetStoreDetails_showStoreLogo: true,
      widgetStoreDetails_showStoreName: false,
      widgetStoreDetails_showStoreAddress: false,
      widgetPrimaryText_font: 'Poppins, sans-serif',
      widgetPrimaryText_color: '#1D1D1D',
      widgetSecondaryText_font: 'Poppins, sans-serif',
      widgetSecondaryText_color: '#A2A2A2',
      widgetButton_font: 'Poppins, sans-serif',
      widgetButton_textColor: '#000000',
      widgetButton_backgroundColor: '#fff',
      widgetButton_style: 2,
      widgetButton_isBorder: true,
      widgetButton_isShadow: false,
      widgetButton_borderColor: '#707070',
      widgetButton_shadowColor: '',
      widgetButtonHover_isHover: true,
      widgetButtonHover_font: 'Poppins, sans-serif',
      widgetButtonHover_textColor: '#fff',
      widgetButtonHover_backgroundColor: '#1D1D1D',
      widgetButtonHover_isBorder: false,
      widgetButtonHover_isShadow: false,
      widgetButtonHover_borderColor: '',
      widgetButtonHover_shadowColor: '',
    }
    this.theme2appearanceObject = {
      widgetBackground_backgroundColor: '#fff',
      widgetBackground_backgroundImage: '',
      widgetHeader_color: '#fff',
      widgetForeGround_backgroundColor: '#fff',
      widgetForeGround_isShadow: false,
      widgetForeGround_isBorder: false,
      widgetForeGround_shadowColor: '',
      widgetForeGround_borderColor: '',
      widgetStoreDetails_showStoreLogo: true,
      widgetStoreDetails_showStoreName: false,
      widgetStoreDetails_showStoreAddress: false,
      widgetPrimaryText_font: 'Poppins, sans-serif',
      widgetPrimaryText_color: '#000000',
      widgetSecondaryText_font: 'Poppins, sans-serif',
      widgetSecondaryText_color: '#2C2C2C',
      widgetButton_font: 'Poppins, sans-serif',
      widgetButton_textColor: '#fff',
      widgetButton_backgroundColor: '#C4C4C4',
      widgetButton_style: 2,
      widgetButton_isBorder: false,
      widgetButton_isShadow: false,
      widgetButton_borderColor: '',
      widgetButton_shadowColor: '',
      widgetButtonHover_isHover: true,
      widgetButtonHover_font: 'Poppins, sans-serif',
      widgetButtonHover_textColor: '#fff',
      widgetButtonHover_backgroundColor: '#3B31B9',
      widgetButtonHover_isBorder: false,
      widgetButtonHover_isShadow: false,
      widgetButtonHover_borderColor: '',
      widgetButtonHover_shadowColor: '',
    }
    this.theme3appearanceObject = {
      widgetBackground_backgroundColor: '#fff',
      widgetBackground_backgroundImage: '',
      widgetHeader_color: '#3B31B9',
      widgetForeGround_backgroundColor: '#fff',
      widgetForeGround_isShadow: false,
      widgetForeGround_isBorder: false,
      widgetForeGround_shadowColor: '',
      widgetForeGround_borderColor: '',
      widgetStoreDetails_showStoreLogo: true,
      widgetStoreDetails_showStoreName: false,
      widgetStoreDetails_showStoreAddress: false,
      widgetPrimaryText_font: 'Poppins, sans-serif',
      widgetPrimaryText_color: '#2C2C2C',
      widgetSecondaryText_font: 'Poppins, sans-serif',
      widgetSecondaryText_color: '#686868',
      widgetButton_font: 'Poppins, sans-serif',
      widgetButton_textColor: '#fff',
      widgetButton_backgroundColor: '#3B31B9',
      widgetButton_style: 2,
      widgetButton_isBorder: false,
      widgetButton_isShadow: false,
      widgetButton_borderColor: '',
      widgetButton_shadowColor: '',
      widgetButtonHover_isHover: false,
      widgetButtonHover_font: '',
      widgetButtonHover_textColor: '',
      widgetButtonHover_backgroundColor: '',
      widgetButtonHover_isBorder: false,
      widgetButtonHover_isShadow: false,
      widgetButtonHover_borderColor: '',
      widgetButtonHover_shadowColor: '',
    }
    this.theme4appearanceObject = {
      widgetBackground_backgroundColor: '#fff',
      widgetBackground_backgroundImage: '',
      widgetHeader_color: '#fff',
      widgetForeGround_backgroundColor: '#fff',
      widgetForeGround_isShadow: false,
      widgetForeGround_isBorder: false,
      widgetForeGround_shadowColor: '',
      widgetForeGround_borderColor: '',
      widgetStoreDetails_showStoreLogo: true,
      widgetStoreDetails_showStoreName: false,
      widgetStoreDetails_showStoreAddress: false,
      widgetPrimaryText_font: 'Poppins, sans-serif',
      widgetPrimaryText_color: '#2C2C2C',
      widgetSecondaryText_font: 'Poppins, sans-serif',
      widgetSecondaryText_color: '#A7A7A7',
      widgetButton_font: 'Poppins, sans-serif',
      widgetButton_textColor: '#fff',
      widgetButton_backgroundColor: '#FF5D5D',
      widgetButton_style: 2,
      widgetButton_isBorder: false,
      widgetButton_isShadow: false,
      widgetButton_borderColor: '',
      widgetButton_shadowColor: '',
      widgetButtonHover_isHover: false,
      widgetButtonHover_font: '',
      widgetButtonHover_textColor: '',
      widgetButtonHover_backgroundColor: '',
      widgetButtonHover_isBorder: false,
      widgetButtonHover_isShadow: false,
      widgetButtonHover_borderColor: '',
      widgetButtonHover_shadowColor: '',
    }
    this.theme5appearanceObject = {
      widgetBackground_backgroundColor: '#fff',
      widgetBackground_backgroundImage: '',
      widgetHeader_color: '#fff',
      widgetForeGround_backgroundColor: '#fff',
      widgetForeGround_isShadow: false,
      widgetForeGround_isBorder: false,
      widgetForeGround_shadowColor: '',
      widgetForeGround_borderColor: '',
      widgetStoreDetails_showStoreLogo: true,
      widgetStoreDetails_showStoreName: false,
      widgetStoreDetails_showStoreAddress: false,
      widgetPrimaryText_font: 'Poppins, sans-serif',
      widgetPrimaryText_color: '#1D1D1D',
      widgetSecondaryText_font: 'Poppins, sans-serif',
      widgetSecondaryText_color: '#818181',
      widgetButton_font: 'Poppins, sans-serif',
      widgetButton_textColor: '#048FA5',
      widgetButton_backgroundColor: '#F1F1F1',
      widgetButton_style: 2,
      widgetButton_isBorder: true,
      widgetButton_isShadow: false,
      widgetButton_borderColor: '#048FA5',
      widgetButton_shadowColor: '',
      widgetButtonHover_isHover: true,
      widgetButtonHover_font: 'Poppins, sans-serif',
      widgetButtonHover_textColor: '#fff',
      widgetButtonHover_backgroundColor: '#048FA5',
      widgetButtonHover_isBorder: false,
      widgetButtonHover_isShadow: false,
      widgetButtonHover_borderColor: '',
      widgetButtonHover_shadowColor: '',
    }

  }

  ngOnInit() {
    this.getSettingValue();
    this.getThemeAppearance();
    this.update_SCSS_var();
    this.getCompanyDetails();
  }

  
  transform(embededCode) {
    return  this.sanitizer.bypassSecurityTrustHtml(embededCode);
  }

  getCompanyDetails() {
    this.isLoaderAdmin = true;
    let requestObject = {
      "business_id": this.businessId
    }
    this.AdminSettingsService.getCompanyDetails(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.companyDetailsData = response.response;
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

  fnChangeFont(event, type) {
    if (type == 'primary_font') {
      this.appearanceObject.widgetPrimaryText_font = event.value;
    } else if (type == 'secondary_font') {
      this.appearanceObject.widgetSecondaryText_font = event.value;
    } else if (type == 'button_font') {
      this.appearanceObject.widgetButton_font = event.value;
    } else if (type == 'button_hover_font') {
      this.appearanceObject.widgetButtonHover_font = event.value;
    }
    this.update_SCSS_var();
  }

  activateBTN(btnNo) {
    this.activatedBtn = btnNo
    this.appearanceObject.widgetButton_style = this.activatedBtn;
    this.update_SCSS_var();
  }

  onChangeAppearance(event) {
    if(event == 'forground'){
      this.appearanceObject.widgetHeader_color = this.appearanceObject.widgetForeGround_backgroundColor
    }
    this.update_SCSS_var();
  }

  onToggleChange(event, type) {
    if (type == 'button_hover_border') {
      this.appearanceObject.widgetButtonHover_isBorder = event.checked;
    } else if (type == 'foreground_shadow') {
      this.appearanceObject.widgetForeGround_isShadow = event.checked;
    } else if (type == 'foreground_border') {
      this.appearanceObject.widgetForeGround_isBorder = event.checked;
    } else if (type == 'store_logo') {
      this.appearanceObject.widgetStoreDetails_showStoreLogo = event.checked;
    } else if (type == 'store_name') {
      this.appearanceObject.widgetStoreDetails_showStoreName = event.checked;
    } else if (type == 'store_address') {
      this.appearanceObject.widgetStoreDetails_showStoreAddress = event.checked;
    } else if (type == 'button_border') {
      this.appearanceObject.widgetButton_isBorder = event.checked;
    } else if (type == 'button_shadow') {
      this.appearanceObject.widgetButton_isShadow = event.checked;
    } else if (type == 'button_hover_shadow') {
      this.appearanceObject.widgetButtonHover_isShadow = event.checked;
    } else if (type == 'button_hover') {
      this.appearanceObject.widgetButtonHover_isHover = event.checked;
    }
    this.update_SCSS_var();
  }

  update_SCSS_var() {
    this.appearanceValue = '{"widgetBackground_backgroundColor":"' + this.appearanceObject.widgetBackground_backgroundColor + '","widgetForeGround_backgroundColor":"' + this.appearanceObject.widgetForeGround_backgroundColor + '","widgetHeader_color":"' + this.appearanceObject.widgetHeader_color + '","widgetForeGround_shadowColor":"' + this.appearanceObject.widgetForeGround_shadowColor + '","widgetForeGround_borderColor":"' + this.appearanceObject.widgetForeGround_borderColor + '","widgetPrimaryText_color":"' + this.appearanceObject.widgetPrimaryText_color + '","widgetPrimaryText_font":"' + this.appearanceObject.widgetPrimaryText_font + '","widgetSecondaryText_color":"' + this.appearanceObject.widgetSecondaryText_color + '","widgetSecondaryText_font":"' + this.appearanceObject.widgetSecondaryText_font + '","widgetButton_textColor":"' + this.appearanceObject.widgetButton_textColor + '","widgetButton_font":"' + this.appearanceObject.widgetButton_font + '","widgetButton_backgroundColor":"' + this.appearanceObject.widgetButton_backgroundColor + '","widgetButton_borderColor":"' + this.appearanceObject.widgetButton_borderColor + '","widgetButton_shadowColor":"' + this.appearanceObject.widgetButton_shadowColor + '","widgetButtonHover_textColor":"' + this.appearanceObject.widgetButtonHover_textColor + '","widgetButtonHover_backgroundColor":"' + this.appearanceObject.widgetButtonHover_backgroundColor + '","widgetButtonHover_borderColor":"' + this.appearanceObject.widgetButtonHover_borderColor + '","widgetButtonHover_shadowColor":"' + this.appearanceObject.widgetButtonHover_shadowColor + '","widgetForeGround_isShadow":' + this.appearanceObject.widgetForeGround_isShadow + ',"widgetForeGround_isBorder":' + this.appearanceObject.widgetForeGround_isBorder + ',"widgetStoreDetails_showStoreLogo":' + this.appearanceObject.widgetStoreDetails_showStoreLogo + ',"widgetStoreDetails_showStoreName":' + this.appearanceObject.widgetStoreDetails_showStoreName + ',"widgetStoreDetails_showStoreAddress":' + this.appearanceObject.widgetStoreDetails_showStoreAddress + ',"widgetButton_isBorder":' + this.appearanceObject.widgetButton_isBorder + ',"widgetButton_isShadow":' + this.appearanceObject.widgetButton_isShadow + ',"widgetButtonHover_isHover":' + this.appearanceObject.widgetButtonHover_isHover + ',"widgetButtonHover_isBorder":' + this.appearanceObject.widgetButtonHover_isBorder + ',"widgetButtonHover_isShadow":' + this.appearanceObject.widgetButtonHover_isShadow + ',"widgetButtonHover_font":"' + this.appearanceObject.widgetButtonHover_font + '"}';
    const data = JSON.parse(this.appearanceValue);
    for (const [key, value] of Object.entries(data)) {
      this.setPropertyOfSCSS('--' + key, value);
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
  }

  fnChangeRequiredStatus(event, field_name) {
    if (event == true) {
      this.formArr[field_name].required = 1;
    } else if (event == false) {
      this.formArr[field_name].required = 0;
    }
  }

  fnSaveAppearanceSettings() {

    this.fnCreateAppearance(this.appearanceObject);
  }

  fnCreateAppearance(AppearanceData) {
    this.isLoaderAdmin = true;
    if(this.defaultTheme == '1'){
      this.commonAppearanceObject = {
        'default':this.theme1appearanceObject,
        'new' : AppearanceData
      }
    }else if(this.defaultTheme == '3'){
      this.commonAppearanceObject = {
        'default':this.theme2appearanceObject,
        'new' : AppearanceData
      }
    }else if(this.defaultTheme == '4'){
      this.commonAppearanceObject = {
        'default':this.theme3appearanceObject,
        'new' : AppearanceData
      }
    }else if(this.defaultTheme == '5'){
      this.commonAppearanceObject = {
        'default':this.theme4appearanceObject,
        'new' : AppearanceData
      }
    }else if(this.defaultTheme == '6'){
      this.commonAppearanceObject = {
        'default':this.theme5appearanceObject,
        'new' : AppearanceData
      }
    }
    
    let requestObject = {
      'business_id': JSON.parse(this.businessId),
      'admin_id': this.currentUser.user_id,
      'theme': this.defaultTheme,
      "appearance": this.commonAppearanceObject
    };
    this.AdminSettingsService.fnCreateAppearance(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Appearance Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.getSettingValue();
        this.getThemeAppearance();
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

  getThemeAppearance(){
    this.isLoaderAdmin = true;
    alert(this.defaultTheme)
    let requestObject = {
      // 'business_id': this.businessId,
      'admin_id': this.currentUser.user_id,
      'business_id': this.businessId,
      'theme': this.defaultTheme,
    };
    this.AdminSettingsService.getThemeAppearance(requestObject).subscribe((response: any) => {
      if (response.data == true && response.response != '') {
          let optionValue = JSON.parse(response.response.option_value)
          console.log(optionValue);
          this.appearanceObject = optionValue.new
          this.update_SCSS_var();
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
        if (this.settingData.form_settings) {
          this.formArr = JSON.parse(this.settingData.form_settings);
        }
        if (this.settingData.theme) {
          this.defaultTheme = this.settingData.theme
        }
        // document.getElementById('front_iframe').src+= '';
        // this.embededCode = "<iframe id='front_iframe' height='100%' style='height:100vh' width='100%' src='" + environment.bookpageLink + "/booking/" + this.encriptedUserId.encrypted_id + "' frameborder='0'></iframe>";
        this.embededCodePreview = this.transform(this.embededCode);

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
    if(this.defaultTheme == '1'){
      this.fnCreateAppearance(this.theme1appearanceObject);
    }else if(this.defaultTheme == '3'){
      this.fnCreateAppearance(this.theme2appearanceObject);
    }else if(this.defaultTheme == '4'){
      this.fnCreateAppearance(this.theme3appearanceObject);
    }else if(this.defaultTheme == '5'){
      this.fnCreateAppearance(this.theme4appearanceObject);
    }else if(this.defaultTheme == '6'){
      this.fnCreateAppearance(this.theme5appearanceObject);
    }
  }

  fnChangeTheme(selectedTheme) {
    this.isLoaderAdmin = true;
    let requestObject = {
      'admin_id': this.currentUser.user_id,
      'theme': selectedTheme
    };

    this.AdminSettingsService.fnChangeTheme(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Default Theme Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.defaultTheme = selectedTheme
        // if(selectedTheme == 1){
        //   this.fnCreateAppearance(this.theme1appearanceObject);
        // }else if(selectedTheme == 3){
        //   this.fnCreateAppearance(this.theme2appearanceObject);
        // }else if(selectedTheme == 4){
        //   this.fnCreateAppearance(this.theme3appearanceObject);
        // }else if(selectedTheme == 5){
        //   this.fnCreateAppearance(this.theme4appearanceObject);
        // }else if(selectedTheme == 6){
        //   this.fnCreateAppearance(this.theme5appearanceObject);
        // }
        this.getSettingValue();
        this.getThemeAppearance();
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
        this.appearanceObject.widgetBackground_backgroundImage = result;
        // this.fnCreateAppearance(this.appearanceObject);
      }
    });
  }
  removeWidgetBGImage(){
    this.appearanceObject.widgetBackground_backgroundImage = '';
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
