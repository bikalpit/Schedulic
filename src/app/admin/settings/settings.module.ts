import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '@app/_helpers/material.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AdminSettingsRoutingModule } from './settings-routing.module';
import { ServicesComponent } from './services/services.component';
import { DataTablesModule } from 'angular-datatables';
import { MdePopoverModule } from '@material-extended/mde';

import { SettingsComponent } from './settings.component';
import { StaffComponent } from './staff/staff.component';

import { CompanyDetailsComponent } from './company-details/company-details.component';

import { AppearanceComponent } from './appearance/appearance.component';


import { DialogAddNewTimeOff } from './staff/staff.component';
import { DialogAddNewTimeOffBussiness } from './business-hours/business-hours.component';
import { PostalcodesComponent } from './postalcodes/postalcodes.component';
import{ DialogAddPostalCode } from './postalcodes/postalcodes.component';
import{ DialogNewCSVPostalCode } from './postalcodes/postalcodes.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { DialogAddNewTax } from './paymentrules/paymentrules.component';
// import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { ColorPickerModule } from 'ngx-color-picker';
import { enableRipple } from '@syncfusion/ej2-base';

import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { PaymentrulesComponent } from './paymentrules/paymentrules.component';
import { BookingrulesComponent } from './bookingrules/bookingrules.component';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
import { AlertsettingsComponent } from './alertsettings/alertsettings.component';
import { DialogCategoryImageUpload } from './services/services.component';
import { DialogSubCategoryImageUpload } from './services/services.component';
import { DialogServiceImageUpload } from './services/services.component';
import { DialogStaffImageUpload } from './staff/staff.component';
import { DialogCompanyDetailsImageUpload } from './company-details/company-details.component';
import {DialogDataExampleDialog} from './services/services.component';
import { DialogPreviewEmailTemp } from './alertsettings/alertsettings.component';
import { SharedModule } from '../../shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogStaffViewReview } from './staff/staff.component';

import { DndDirective } from './direcitves/dnd.directive';
import { ProgressComponent } from './components/progress/progress.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';



enableRipple(true);

@NgModule({
  declarations: [
    ServicesComponent,
    SettingsComponent,
    StaffComponent,
    DialogAddNewTimeOffBussiness,
    DialogAddNewTimeOff,
    DialogAddNewTax,
    PaymentgatewayComponent,
    PaymentrulesComponent,
    BookingrulesComponent,
    AlertsettingsComponent,
    CompanyDetailsComponent,
    AppearanceComponent,
    PostalcodesComponent,
    DialogAddPostalCode,
    DialogNewCSVPostalCode,
    BusinessHoursComponent,
    DialogCategoryImageUpload,
    DialogSubCategoryImageUpload,
    DialogServiceImageUpload,
    DialogStaffImageUpload,
    DialogCompanyDetailsImageUpload,
    DialogDataExampleDialog,
    DialogStaffViewReview,
    DialogPreviewEmailTemp,
    DndDirective,
    ProgressComponent
  ],
  imports: [
      CommonModule,
      HttpClientModule,
      AdminSettingsRoutingModule,
      MaterialModule,
      FlexLayoutModule,
      ReactiveFormsModule,
      FormsModule,
      DragDropModule,
      MatSidenavModule,
      DataTablesModule,
      MatDatepickerModule,
      ColorPickerModule,
      MdePopoverModule,
      NgbModule,
      SharedModule,
      NgxIntlTelInputModule
  ],
  exports: [
    FormsModule
  ],
  bootstrap: [AppearanceComponent],
   entryComponents: [SettingsComponent,DialogAddNewTimeOff,DialogAddNewTax,DialogAddPostalCode,DialogNewCSVPostalCode,DialogAddNewTimeOffBussiness,DialogCategoryImageUpload,DialogSubCategoryImageUpload,DialogServiceImageUpload,DialogStaffImageUpload,DialogCompanyDetailsImageUpload,DialogDataExampleDialog,DialogStaffViewReview,DialogPreviewEmailTemp],
})
export class SettingsModule {}
