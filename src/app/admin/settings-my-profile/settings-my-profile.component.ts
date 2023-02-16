import { Component, OnInit, Inject } from '@angular/core';
import { AppComponent } from '@app/app.component'
import { AdminService } from '../_services/admin-main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthenticationService } from '@app/_services';

export interface DialogData {
  animal: string;
  name: string;
  StaffCreate: FormGroup;
}

@Component({
  selector: 'app-settings-my-profile',
  templateUrl: './settings-my-profile.component.html',
  styleUrls: ['./settings-my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  adminSettings : boolean = true;

  profileDetails: any;
  settingMyProfile:FormGroup;
  changePwd:FormGroup;
  updatedAdminProfileData:any;
  adminId:any;
  myProfileImageUrl:any = '';

  isLoaderAdmin : boolean=false;
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^\+(?:[0-9] ?){6,14}[0-9]$/
  hide1 = true;
  hide2 = true;
  constructor(
    public dialog: MatDialog,
    private appComponent : AppComponent,
    private AdminService: AdminService,
    private _snackBar: MatSnackBar,
    private authenticationService:AuthenticationService,
    private _formBuilder:FormBuilder) {
      this.adminId=JSON.stringify(this.authenticationService.currentUserValue.user_id);

    //this.appComponent.settingsModule(this.adminSettings);
   }

  ngOnInit() {
    this.getMyProfileDetails();
    this.settingMyProfile = this._formBuilder.group({
      first_name : ['', [Validators.required,Validators.maxLength(8)]],
      last_name : ['', [Validators.required,Validators.maxLength(8)]],
      // email : new FormControl({ value: "", disabled: true }, [Validators.required]),
      email : ['', [Validators.required]],
      mobile : ['', [Validators.required,Validators.minLength(6),Validators.maxLength(15),Validators.pattern(this.onlynumeric)]],
    });
    this.changePwd = this._formBuilder.group({
      oldPassword : ['',[Validators.required]],
      newPassword:['',[Validators.required,Validators.minLength(8)]],
      ReNewPassword: ['', Validators.required]            
    
    },{validator: this.checkPasswords });
    
  }
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.newPassword.value;
    let confirmPass = group.controls.ReNewPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  getMyProfileDetails(){
    this.isLoaderAdmin =true;
    this.AdminService.getMyProfileDetails().subscribe((response:any) => {
      if(response.data == true){
        this.profileDetails = response.response;
        this.settingMyProfile.controls['first_name'].setValue(this.profileDetails.firstname);
        this.settingMyProfile.controls['last_name'].setValue(this.profileDetails.lastname);
        this.settingMyProfile.controls['email'].setValue(this.profileDetails.email);
        this.settingMyProfile.controls['mobile'].setValue(this.profileDetails.phone);
      }
      this.isLoaderAdmin =false;
    })
  }

  onRemoveProfile(){
    let requestObject = {
      'user_type': 'A',
      'user_id': this.adminId
    }
    this.isLoaderAdmin =true;
    this.AdminService.removeImage(requestObject).subscribe((response:any) => {
      if(response.data == true){
        window.location.reload();
        this.getMyProfileDetails();
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

  fnSubmitMyProfile(){
      if(this.settingMyProfile.valid){
        if(this.myProfileImageUrl === ''){
          this.updatedAdminProfileData = {
            'firstname': this.settingMyProfile.controls['first_name'].value,
            'lastname': this.settingMyProfile.controls['last_name'].value,
            'phone': this.settingMyProfile.controls['mobile'].value,
            'email': this.profileDetails.email,
          }
        }else if(this.myProfileImageUrl !== ''){
          this.updatedAdminProfileData = {
            'firstname': this.settingMyProfile.controls['first_name'].value,
            'lastname': this.settingMyProfile.controls['last_name'].value,
            'phone': this.settingMyProfile.controls['mobile'].value,
            'email': this.profileDetails.email,
            'image': this.myProfileImageUrl
          }
        }
        this.updateProfile(this.updatedAdminProfileData);
      }
  }

  updateProfile(updatedAdminProfileData){
    this.isLoaderAdmin =true;
    this.AdminService.updateProfile(updatedAdminProfileData).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Profile Updated.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['green-snackbar']
        });
        this.getMyProfileDetails();
        localStorage.setItem('currentUser', JSON.stringify(response.response));
        this.appComponent.loadLocalStorage();
        window.location.reload();
      }
      else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
      }
      this.isLoaderAdmin =false;
    })
  }

  fnChangePassword(){
    if(this.changePwd.valid){
      this.isLoaderAdmin =true;
      let requestObject = {
        'user_id': this.adminId,
        'user_type':'A',
        "old_password" : this.changePwd.get('oldPassword').value,
        "password" : this.changePwd.get('ReNewPassword').value,
      }
      this.AdminService.changePassword(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.changePwd.reset();
        }
        else if(response.data == false){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
        this.isLoaderAdmin =false;
      })
    }
    else{
      this.changePwd.get("oldPassword").markAsTouched();
      this.changePwd.get("newPassword").markAsTouched();
    }
  }
  
  myProfleImage() {
    const dialogRef = this.dialog.open(DialogMyProfileImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.myProfileImageUrl = result;
            console.log(result);
           }
     });
  }

}


@Component({
  selector: 'my-profile-image-upload',
  templateUrl: '../_dialogs/my-profile-image-upload-dialog.html',
})
export class DialogMyProfileImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogMyProfileImageUpload>,
  private _formBuilder:FormBuilder,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['',Validators.required]
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
  console.log(event.target.files);
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
    for(var i = 0; i < event.target.files.length; i++) {
      if(event.target.files[i].type!="image/png" && event.target.files[i].type!="image/jpeg" && event.target.files[i].type!="image/jpg"){
        this._snackBar.open("Select valid image file", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
        return false;
      }
    }
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
  if(this.uploadForm.invalid){
    this.uploadForm.controls['profile'].markAsTouched();
    this._snackBar.open("Select Image", "X", {
      duration: 2000,
      verticalPosition:'top',
      panelClass :['red-snackbar']
    });
    return false;
  }
  this.profileImage = this.imageSrc;
  this.dialogRef.close(this.profileImage);
}



}
