import { Component, OnInit, Inject } from '@angular/core';
import { AdminSettingsService } from '../../_services/admin-settings.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface DialogData {

}
@Component({
  selector: 'app-postalcodes',
  templateUrl: './postalcodes.component.html',
  styleUrls: ['./postalcodes.component.scss']
})

export class PostalcodesComponent implements OnInit {
  adminSettings: boolean = true;
  postalCodeList: any = [];
  changePostalCodeStatusObject: any;
  selectedValue: any;
  isLoaderAdmin: boolean = false;
  postalCodeIdArr: any = [];
  businessId: any;
  settingSideMenuToggle: boolean = false;
  settingData: any;
  PostalCodeCheckStatus: boolean = false;
  singlePostalCode: any;
  editPostalCodeId: any;
  selectAll: boolean = false;
  search = {
    postalCode: "",
  }

  constructor(public dialog: MatDialog,
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    private _snackBar: MatSnackBar,
  ) {
    this.fnGetPostalCodeList();
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }
    this.getSettingValue();
    let addNewAction = window.location.search.split("?postalcode")
    if (addNewAction.length > 1) {
      // this.addNewEvents = false; 
      this.addPostalCode();
    }
  }

  ngOnInit() { }

  getSettingValue() {
    this.isLoaderAdmin = true;
    let requestObject = {
      'business_id': this.businessId,
    };
    // old -getSettingsValue
    this.adminSettingsService.getAlertSettingsValue(requestObject).subscribe((response: any) => {
      if (response.data == true && response.response != '') {
        this.settingData = response.response
        console.log(this.settingData);
        if (this.settingData.postal_code_check) {
          this.PostalCodeCheckStatus = JSON.parse(this.settingData.postal_code_check).status;
          console.log(this.PostalCodeCheckStatus)

        }
      }
      this.isLoaderAdmin = false;
    })
  }

  addPostalCode() {

    const dialogRef = this.dialog.open(DialogAddPostalCode, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.fnGetPostalCodeList();
      }
    });
  }

  editPostalCode(postalCodeId) {
    this.isLoaderAdmin = true;
    let requestObject = {
      'business_id': localStorage.getItem('business_id'),
      'postal_id': postalCodeId
    };
    this.adminSettingsService.getPostalCodeDetail(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.singlePostalCode = response.response;
        this.editPostalCodeId = response.response.id;
        var selectedStaff = this.singlePostalCode.staffs.map(
          data => data.id
        );
        const dialogRef = this.dialog.open(DialogEditPostalCode, {
          width: '500px',
          data: {
            id: this.editPostalCodeId,
            postalCode: this.singlePostalCode.postal_code,
            postalCodeArea: this.singlePostalCode.area,
            postalCodeStaff: selectedStaff
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          if (result) {
            this.fnGetPostalCodeList();
          }
        });
      }
      this.isLoaderAdmin = false;
    });
  }

  addcsvPostalCode() {

    const dialogRef = this.dialog.open(DialogNewCSVPostalCode, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.fnGetPostalCodeList();
    });
  }


  fnGetPostalCodeList() {
    this.isLoaderAdmin = true;
    let requestObject = {
      'business_id': localStorage.getItem('business_id'),
    };
    this.adminSettingsService.getPostalCodeList(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.postalCodeList = response.response;
        this.postalCodeList.forEach(element => {
          if (element.postal_status == 'E') {
            element.postal_status = true;
          } else {
            element.postal_status = false;
          }
        });
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this.postalCodeList = [];
      }
      this.isLoaderAdmin = false;
    })
  }

  fnChangePostalCodeStatus(event, postalCodeId) {
    console.log(event + " " + postalCodeId);

    if (event == true) {
      this.changePostalCodeStatusObject = {
        'postal_id': postalCodeId,
        'status': "E"
      };
    } else {
      this.changePostalCodeStatusObject = {
        'postal_id': postalCodeId,
        'status': "D"
      };
    }
    this.isLoaderAdmin = true;
    this.adminSettingsService.changePostalCodeStatus(this.changePostalCodeStatusObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
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
  fnChangePostalCodeCheck(status) {
    this.isLoaderAdmin = true;
    let requestObject = {
      "business_id": this.businessId,
      "status": JSON.stringify(status)
    }
    this.adminSettingsService.fnChangePostalCodeCheck(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Status Updated.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        // this.fnGetPostalCodeList();
        this.getSettingValue();
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


  checkAll(event) {

    this.postalCodeIdArr = [];
    for (let i = 0; i < this.postalCodeList.length; i++) {
      const item = this.postalCodeList[i];
      item.is_selected = event.checked;
      if (event.checked) {
        this.postalCodeIdArr.push(item.id)
      }
    }

    if (event.checked) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }


  }

  fnAddPostalCodeId(event, postalCodeId) {
    if (event == true) {
      console.log(this.postalCodeIdArr);
      this.postalCodeIdArr.push(postalCodeId);
    } else {
      const index = this.postalCodeIdArr.indexOf(postalCodeId, 0);
      if (index > -1) {
        this.postalCodeIdArr.splice(index, 1);
      }
    }
    if (this.postalCodeIdArr.length == this.postalCodeList.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }

  fnSelectedPostalCodeStatus(event) {
    if (this.postalCodeIdArr.length > 0) {
      if (event.value == "active") {
        status = "E";
      } else {
        status = "D";
      }
      let requestObject = {
        "postal_code": this.postalCodeIdArr,
        "status": status
      }
      this.isLoaderAdmin = true;
      this.adminSettingsService.changeSelectedPostalCodeStatus(requestObject).subscribe((response: any) => {
        if (response.data == true) {
          this._snackBar.open("Status Updated.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
          this.postalCodeIdArr.length = 0;
          this.selectedValue = undefined;
          this.fnGetPostalCodeList();
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

  }

  fnDeletePostalCode(postalCodeId) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoaderAdmin = true;
        let requestObject = {
          'postal_id': postalCodeId,
        };
        this.adminSettingsService.deletePostalCode(requestObject).subscribe((response: any) => {
          if (response.data == true) {
            this.fnGetPostalCodeList();
          }
          else if (response.data == false && response.response !== 'api token or userid invaild') {

          }
          this.isLoaderAdmin = false;
        })
      }
    });


  }
  fnSettingMenuToggleSmall() {
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge() {
    this.settingSideMenuToggle = false;
  }

  postalCodeSearch() {
    this.isLoaderAdmin = true;
    if (this.search.postalCode.length > 1) {
      let requestObject = {
        "search": this.search.postalCode,
        "business_id": this.businessId,
      }
      console.log(requestObject);
      this.adminSettingsService.postalCodeSearch(requestObject).subscribe((response: any) => {
        if (response.data == true) {
          this.postalCodeList = response.response;
          this.isLoaderAdmin = false;
        }
        else if (response.data == false) {
          // this._snackBar.open(response.response, "X", {
          //   duration: 2000,
          //   verticalPosition:'top',
          //   panelClass :['red-snackbar']
          // });
          this.postalCodeList = [];
          this.isLoaderAdmin = false;
        }
      })
    } else {
      this.fnGetPostalCodeList();
      this.isLoaderAdmin = false;
    }
  }

}

@Component({
  selector: 'new-postalcode',
  templateUrl: '../_dialogs/add-new-postalcode.html',
})
export class DialogAddPostalCode {
  formCreatePostalCode: FormGroup;
  businessId: any;
  staffList: any;
  constructor(
    public dialogRef: MatDialogRef<DialogAddPostalCode>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
      this.fnGetStaffList();
    }
    this.formCreatePostalCode = this._formBuilder.group({
      postalCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(7)]],
      postalCodeArea: ['', [Validators.required, Validators.maxLength(20)]],
      postalCodeStaff: ['',]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  fnGetStaffList() {
    let requestObject = {
      'business_id': this.businessId,
      'action': 'E',
    };
    this.adminSettingsService.getStaffList(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.staffList = response.response;
      }
      else {
        this.staffList = [];
      }
    })
  }

  fnCreatePostalCode() {
    if (this.formCreatePostalCode.invalid) {
      this.formCreatePostalCode.get("postalCode").markAsTouched();
      this.formCreatePostalCode.get("postalCodeArea").markAsTouched();
      this.formCreatePostalCode.get("postalCodeStaff").markAsTouched();
      return false;
    }
    if (this.formCreatePostalCode.get("postalCodeStaff").value == '') {
      this.formCreatePostalCode.controls["postalCodeStaff"].setValue([]);
    }
    let requestObject = {
      'business_id': this.businessId,
      'postal_code': this.formCreatePostalCode.get("postalCode").value,
      'area': this.formCreatePostalCode.get("postalCodeArea").value,
      'staff_id': this.formCreatePostalCode.get("postalCodeStaff").value,
    };
    this.adminSettingsService.createPostalCode(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("PostalCode Added.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.dialogRef.close(true);
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
  }


}

@Component({
  selector: 'edit-postalcode',
  templateUrl: '../_dialogs/edit-postalcode.html',
})
export class DialogEditPostalCode {
  formCreatePostalCode: FormGroup;
  businessId: any;
  staffList: any;
  id: any;
  selectedStaff: any;
  postalCode: any;
  postalCodeArea: any;
  postalCodeStaff: any;
  constructor(
    public dialogRef: MatDialogRef<DialogEditPostalCode>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {
    this.id = this.data.id;
    this.postalCode = this.data.postalCode;
    this.postalCodeArea = this.data.postalCodeArea;
    this.selectedStaff = this.data.postalCodeStaff;
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
      this.fnGetStaffList();
    }
    this.formCreatePostalCode = this._formBuilder.group({
      id: [this.id, []],
      postalCode: [this.postalCode, [Validators.required, Validators.minLength(3), Validators.maxLength(7)]],
      postalCodeArea: [this.postalCodeArea, [Validators.required, Validators.maxLength(20)]],
      postalCodeStaff: [this.selectedStaff, []]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  fnGetStaffList() {
    let requestObject = {
      'business_id': this.businessId,
      'action': 'E',
    };
    this.adminSettingsService.getStaffList(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.staffList = response.response;
      }
      else {
        this.staffList = [];
      }
    })
  }

  fnEditPostalCode() {
    if (this.formCreatePostalCode.invalid) {
      this.formCreatePostalCode.get("postalCode").markAsTouched();
      this.formCreatePostalCode.get("postalCodeArea").markAsTouched();
      this.formCreatePostalCode.get("postalCodeStaff").markAsTouched();
      return false;
    }
    if (this.formCreatePostalCode.get("postalCodeStaff").value == '') {
      this.formCreatePostalCode.controls["postalCodeStaff"].setValue([]);
    }
    let requestObject = {
      'business_id': this.businessId,
      'id': this.id,
      'postal_code': this.formCreatePostalCode.get("postalCode").value,
      'area': this.formCreatePostalCode.get("postalCodeArea").value,
      'staff_id': this.selectedStaff,
    };
    this.adminSettingsService.editPostalCodeDetail(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("PostalCode Edited.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.staffList = [];
        this.fnGetStaffList();
        this.dialogRef.close(true);
      }
      else if (response.data == false && response.response !== 'api token or userid invaild') {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      }
    })
  }
}


@Component({
  selector: 'csv-postalcode',
  templateUrl: '../_dialogs/add-csv-postalcode.html',
})
export class DialogNewCSVPostalCode {
  formCreatePostalCode: FormGroup;
  businessId: any;
  staffList: any;
  uploadedFile: any
  fileToUpload: any;
  isLoaderAdmin: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogNewCSVPostalCode>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public http: HttpClient,

  ) {

    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }

  handleFileInput(files): void {
    console.log(files)
    this.uploadedFile = files

  }
  uploadPostal() {
    this.fileToUpload = this.uploadedFile.item(0);
    if (this.fileToUpload.type != "application/vnd.ms-excel") {

      this._snackBar.open("Please select CSV file.", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
      });
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload);
    formData.append('business_id', JSON.parse(localStorage.getItem('business_id')));

    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let headers = new HttpHeaders({
      'admin-id': JSON.stringify(currentUser.user_id),
      'api-token': currentUser.token,
    });

    this.http.post(`${environment.apiUrl}/postal-code-import`, formData, { headers: headers }).pipe(map((response: any) => {

      if (response.data == true) {

        this._snackBar.open("CSV file is uploaded.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });

        this.dialogRef.close();

      }
    }), catchError(this.handleError)).subscribe((res) => {
      console.log(res);
    });

  }

}



