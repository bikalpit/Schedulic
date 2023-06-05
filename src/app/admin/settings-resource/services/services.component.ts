import { Component, OnInit,Inject,ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';
import { ExportToCsv } from 'export-to-csv';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../../_services/admin-settings.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { NonNullAssert } from '@angular/compiler';

export interface DialogData {
    animal: string;
    name: string;
    staffList: string;
  }


@Component({
    selector: 'settings-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
    ftfTypeEle: ElementRef;
    // @ViewChild('ftf_type_id') ftfTypeEle: ElementRef;
  @ViewChild('below_all_fields', { static: false }) jump: ElementRef;
    categoryImageUrl:any = '';
    subCategoryImageUrl:any = '';
    serviceImageUrl:any = '';
    animal: any;
    ActionId: any = [];
    staffActionIdSub:any = [];
    selectAll:boolean =false;
    staffList:any=[];


    allCetegoryList: any;
    allServicesList: any=[];
    allCategoryCount: any;
    allServiceCount: any;
    editCategoryId: any;
    editSubCategoryId: any;
    currentCategoryStatus: any;
    currentSubCategoryStatus: any;
    businessId: any;
    selectedValue: any;
    selectedFilter: any;
    selectedServicesArr: any;
    createServiceCategoryId: any;
    createServiceCategoryType: any;
    editServiceId: any;
    categoryServicesList: any;
    subCategoryServicesList: any;
    service_filter: any = 'all';
    subcategory_service_filter: any = 'all';
    servicesList: boolean = false;
    adminSettings: boolean = true;
    selectedCategoryDetails: any;
    selectedSubCategoryDetails: any;
    selectCategoryPage: any = '';
    createNewCategoryPage: boolean = false;
    createNewSubCategoryPage: boolean = false;
    createNewServicePage: boolean = false;
    singleSubCategoryPage: any = '';
    subCategoryPage: boolean = false;
    addNewServicePage: boolean = false;
    isLoaderAdmin: boolean = false;
    settingSideMenuToggle : boolean = false;
    parentCategoryId: any;
    singleServiceStatus: any;
    selectedCategoryIndex: any;
    selectedSubCategoryIndex: any;
    newSubcategoryStatus: any = 'E';
    newSubcategoryPrivate: any = 'N';
    editSubcategoryStatus: any = 'D';
    editSubcategoryPrivate: any = 'N';
    newcategoryStatus: any = 'E';
    newcategoryPrivate: any = 'N';
    editcategoryStatus: any = 'D';
    editcategoryPrivate: any = 'N';
    newServicePrivate: any = 'N';
    newServiceStatus: any = 'E';
    editServicePrivate: any = 'N';
    editServiceStatus: any = 'D';
    newSubCategoryData: any;
    updateSubCategoryData: any;
    newCategoryData: any;
    newServiceData: any;
    updateServiceData: any;
    actionServiceIdarr: any = [];
    updateCategoryData: any;
    //editServiceStatusPrevious: any;
    //editServicePrivateStatusPrevious: any;
    editServiceImage: any;
    createSubCategory: FormGroup;
    createCategory: FormGroup;
    createService: FormGroup;
    assignedStaff: any;
    assignStaffArr: any = [];
    settingsArr:any=[];
    currencySymbol:any;
    currencySymbolPosition:any;
    currencySymbolFormat:any;
    search:any;
    // onlynumeric = /^-?(0|[1-9]\d*)?$/
    onlynumeric = /^[0-9+]*$/
    serviceApiUrl1 : any;
    serviceApiUrl2 : any;
    serviceApiUrl3 : any;
    current_page : any;
    first_page_url : any;
    last_page : any;
    totalRecord : any;
    fromRecord : any;
    toRecord : any;
    last_page_url : any;
    next_page_url : any;
    prev_page_url : any;
    path : any;
    selectAllCategory:boolean = false;
    selectAllSubCat:boolean = false;
    selectedCategoryID:any;
    selectedSubCategoryID:any;
    fromcategory:boolean=false;
    whichSubCategoryButton:any;
    whichServiceButton:any;
    allowed:boolean=false;
    allowedCat:boolean=false;
    NewisLoaderAdmin:boolean =true;
    serviceType:any;
    ftfOPT:any;
    scrollContainer: any;
    noCategoryService:boolean =false;
    noSubCategoryService:boolean =false;
    constructor(
        // private userService: UserService,
        public Change:ChangeDetectorRef,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private el: ElementRef,
        private _snackBar: MatSnackBar,
        @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    ) {
        localStorage.setItem('isBusiness', 'false');
        if (localStorage.getItem('business_id')) {
            this.businessId = localStorage.getItem('business_id');
        }

        let addNewAction = window.location.search.split("?category")
        if (addNewAction.length > 1) {
            this.fnCreateNewCategory();
        }
        this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
            let addNewAction = event.url.split("?category")
            if(addNewAction.length > 1){
                this.fnCreateNewCategory(); 
                this.allowedCat=true;
                console.log('new cate');
                
            }
        }
        });
    }

    ngOnInit() {
        this.serviceApiUrl1=environment.apiUrl+"/admin-service-list";
        this.serviceApiUrl2=environment.apiUrl+"/list-service";
        this.serviceApiUrl3=environment.apiUrl+"/list-subcategory-service";


        this.fnGetSettings();
        this.fnAllCategory();
        this.fnAllServicesNavigation('new');

        this.createSubCategory = this._formBuilder.group({
            subcategory_name: ['',  [Validators.required,Validators.minLength(1),Validators.maxLength(50)]],
            subcategory_description: ['', [Validators.minLength(2),Validators.maxLength(255)]],
            subcategory_id: [''],
        });
        this.createCategory = this._formBuilder.group({
            category_name: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(50)]],
            category_description: ['', [Validators.minLength(2),Validators.maxLength(255)]],
            category_id: [''],
        });
        this.createService = this._formBuilder.group({
            service_name: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(50)]],
            service_description: ['',  [Validators.minLength(2),Validators.maxLength(255)]],
            service_cost: ['', [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
            service_duration: ['', [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1),]],
            service_unit: ['', [Validators.required, Validators.min(1), Validators.pattern(this.onlynumeric)]],
            serviceType: [this.serviceType, [Validators.required]],
            ftfType: ['', [Validators.required]],
            onlineType: [''],
            travelingTime: [null],
            onlineId: [''],
            phoneNo: [''],
            service_id: [''],
        });

    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.NewisLoaderAdmin = false;
        }, 5000);
    }

    fnSearchStaff(value){
        this.search = value
        this.fnstaffList()
    }
    fnSettingMenuToggleSmall(){
        this.settingSideMenuToggle = true;
    }

    fnSettingMenuToggleLarge(){
        this.settingSideMenuToggle = false;
    }

    private scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
          "form .ng-invalid"
        );

        firstInvalidControl.focus(); //without smooth behavior
    }

    conversion(mins) {

        // getting the hours.
        let hrs = Math.floor(parseInt(mins) / 60);
        // getting the minutes.
        let min = mins % 60;
        // formatting the hours.
        let new_hrs = hrs < 10 ? '0' + hrs : hrs;
        // formatting the minutes.
        let new_min = min < 10 ? '0' + min : min;
        // returning them as a string.
      return `${new_hrs}:${new_min}`;
    }

    fnGetSettings(){
        let requestObject = {
            "business_id" : this.businessId
        };

        this.adminSettingsService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true && response.response != ''){
        this.settingsArr = response.response;

        this.currencySymbol = this.settingsArr.currency;

        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;

        this.currencySymbolFormat = this.settingsArr.currency_format;
      }else{

      }
    },(err) =>{
            console.log(err)
        });
    }

    fnCreateNewCategory() {
        this.createNewCategoryPage = true;
        this.selectCategoryPage = '';
        this.singleSubCategoryPage = '';
        this.servicesList = false;
        this.createNewSubCategoryPage = false;
        this.createNewServicePage = false;
        this.categoryImageUrl = '';
    }

    cancelNewCategory() {
        if (this.categoryServicesList != '' && this.categoryServicesList != 'service not found.') {
            this.selectCategoryPage = 'services';
        } else if (this.categoryServicesList == 'service not found.') {
            this.selectCategoryPage = 'notservices';
        }
        this.createNewCategoryPage = false;
        this.createCategory.reset();
        this.editCategoryId = null;
        this.categoryImageUrl = '';
        console.log(this.categoryServicesList);
        this.router.navigate(['/admin/settings-resource']);
        
        // this.fnAllCategory();
    }

    arrayOne(n: number): any[] {
        return Array(n);
    }

    navigateTo(api_url,type){
        if(api_url && type=="service"){
            this.serviceApiUrl1=api_url;
            this.fnAllServices();
        }
        if(api_url && type=="category"){
            this.serviceApiUrl2=api_url;
            this.fnSelectCategory(this.selectedCategoryID,this.selectedCategoryIndex);
        }
        if(api_url && type=="subcategory"){
            this.serviceApiUrl3=api_url;
            this.fnSelectSubCategory(this.selectedSubCategoryID,this.selectedSubCategoryIndex);
        }
    }

    navigateToPageNumber(index,type){
        if(index && type=="service"){
            this.serviceApiUrl1=this.path+'?page='+index;
            this.fnAllServices();
        }
        if(index && type=="category"){
            this.serviceApiUrl2=this.path+'?page='+index;
            this.fnSelectCategory(this.selectedCategoryID,this.selectedCategoryIndex);
        }
        if(index && type=="subcategory"){
            this.serviceApiUrl3=this.path+'?page='+index;
            this.fnSelectSubCategory(this.selectedSubCategoryID,this.selectedSubCategoryIndex);
        }
    }

    fnAllServicesNavigation(action){
        this.serviceApiUrl1=environment.apiUrl+"/admin-service-list";
        this.fnAllServices2(action);
    }

    fnAllServices() {
        this.isLoaderAdmin = true;
        this.createNewCategoryPage = false;
        this.createNewSubCategoryPage = false;
        this.createNewServicePage = false;
        this.singleSubCategoryPage = '';
        this.selectCategoryPage = '';
        this.subCategoryPage = false;
        this.addNewServicePage = false;
        let requestObject = {
            'business_id': this.businessId,
        };
        this.adminSettingsService.fnAllServices(requestObject,this.serviceApiUrl1).subscribe((response: any) => {
            if (response.data == true) {
                this.allServicesList = response.response.data;
                this.current_page = response.response.current_page;
                this.first_page_url = response.response.first_page_url;
                this.last_page = response.response.last_page;
                this.totalRecord = response.response.total;
                this.fromRecord = response.response.from;
                this.toRecord = response.response.to;
                this.last_page_url = response.response.last_page_url;
                this.next_page_url = response.response.next_page_url;
                this.prev_page_url = response.response.prev_page_url;
                this.path = response.response.path;
                this.ActionId = [];
                this.selectAllCategory = false;
                this.selectAll  = false;

                if (this.allServicesList != '') {

                    //this.servicesList = true;
                    this.allServiceCount = this.allServicesList.length;
                    this.allServicesList.forEach( (element) => {
                        element.is_selected = false;
                    });

                } else if (this.allServicesList == '') {
                    this.servicesList = false;
                }
                this.isLoaderAdmin = false;
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                this.allServicesList = [];
                this.isLoaderAdmin = false;
            }
        })
    }
    fnAllServices2(action) {
        this.isLoaderAdmin = true;
        this.createNewCategoryPage = false;
        this.createNewSubCategoryPage = false;
        this.createNewServicePage = false;
        this.singleSubCategoryPage = '';
        this.selectCategoryPage = '';
        this.subCategoryPage = false;
        this.addNewServicePage = false;
        let requestObject = {
            'business_id': this.businessId,
        };
        this.adminSettingsService.fnAllServices(requestObject,this.serviceApiUrl1).subscribe((response: any) => {
            if (response.data == true) {
                this.allServicesList = response.response.data;
                this.current_page = response.response.current_page;
                this.first_page_url = response.response.first_page_url;
                this.last_page = response.response.last_page;
                this.totalRecord = response.response.total;
                this.fromRecord = response.response.from;
                this.toRecord = response.response.to;
                this.last_page_url = response.response.last_page_url;
                this.next_page_url = response.response.next_page_url;
                this.prev_page_url = response.response.prev_page_url;
                this.path = response.response.path;
                this.ActionId = [];
                this.selectAllCategory = false;
                this.selectAll  = false;

                if (this.allServicesList != '') {

                    this.servicesList = true;
                    this.allServiceCount = this.allServicesList.length;
                    this.allServicesList.forEach( (element) => {
                        element.is_selected = false;
                    });

                } else if (this.allServicesList == '') {
                    this.servicesList = false;
                }
                this.isLoaderAdmin = false;
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                this.allServicesList = [];
                this.isLoaderAdmin = false;
            }
            let addNewAction = window.location.search.split("?category")
            if(addNewAction.length > 1 && action != 'not-new'){
            // this.addNewEvents = false;
                this.fnCreateNewCategory();
            }
        })
    }


    fnAddStaffId(event, staffId,i) {

        if (event == true) {
        this.ActionId.push(staffId);
        this.allServicesList[i].is_selected = true;

        }else if (event == false) {
            this.allServicesList[i].is_selected = false;

        const index = this.ActionId.indexOf(staffId, 0);
        if (index > -1) {
            this.ActionId.splice(index, 1);
        }
        }

        if (this.ActionId.length == this.allServicesList.length ) {
        this.selectAll = true;
        } else {
        this.selectAll = false;
        }

    }

    checkAll(event){

        this.ActionId = [];
        for (let i = 0; i < this.allServicesList.length; i++) {
        const item = this.allServicesList[i];
        item.is_selected = event.checked;

        if(event.checked){
            this.ActionId.push(item.id)
        }

        }

        if(event.checked){
        this.selectAll = true;
        }else{
        this.selectAll = false;
        }

    }


    fnAllCategory() {

        this.isLoaderAdmin = true;
        let requestObject = {
            'business_id': this.businessId,
        };
        this.adminSettingsService.fnAllCategory(requestObject).subscribe((response: any) => {
            if (response.data == true && response.response.length > 0) {
                this.allCetegoryList = response.response
                this.allCategoryCount = this.allCetegoryList.length;
                if(this.allCategoryCount > 0){
                    this.servicesList = true;
                }
                this.isLoaderAdmin = false;
                if(this.allowed){
                    this.allowed=false;
                    this.fnSelectSubCategoryNavigate(
                    this.allCetegoryList[this.selectedCategoryIndex].subcategory[this.allCetegoryList[this.selectedCategoryIndex].subcategory.length-1].id,
                    this.allCetegoryList[this.selectedCategoryIndex].subcategory.length-1
                    );
                }
                if(this.allowedCat){
                    this.allowedCat=false;
                    this.fnSelectCategoryNavigation(
                    this.allCetegoryList[this.allCategoryCount - 1].id,this.allCategoryCount-1);
                }

            }else if(response.data == true && response.response.length == 0){
                this.allCetegoryList = [];
                this.allCategoryCount = 0;

            } else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.allCetegoryList = [];
                this.allCategoryCount = 0;
                this.isLoaderAdmin = false;
            }

        let addNewAction = window.location.search.split("?category")
        if(addNewAction.length > 1){
        // this.addNewEvents = false;
            this.fnCreateNewCategory();
        }
        })
    }

    fnstaffList(){
        this.isLoaderAdmin = true;
        let requestObject = {
            "business_id":this.businessId,
            "search": this.search
        }
        this.adminSettingsService.fnstaffList(requestObject).subscribe((response: any) => {
            if (response.data == true) {
                this.staffList = response.response
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                 this.staffList = [];
                 this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
            }
            this.isLoaderAdmin = false;
        })
    }

    openDialog() {
        this.dialog.open(DialogDataExampleDialog, {
            width: '350px',
            height: '400px',

        //   data: {
        //     staff: 'panda'
        //   }
        });
    }

    dropCategory(event: CdkDragDrop<string[]>) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.fnUpdateServiceOrder(event.container.data[event.currentIndex]['id'], event.container.data[event.previousIndex]['order']).subscribe((response: any) => {
            this.isLoaderAdmin = false;
        });
        this.isLoaderAdmin = true;
        this.adminSettingsService.fnUpdateServiceOrder(event.container.data[event.previousIndex]['id'], event.container.data[event.currentIndex]['order']).subscribe((response: any) => {
            this.isLoaderAdmin = false;
        });
        moveItemInArray(this.categoryServicesList, event.previousIndex, event.currentIndex);
    }
    dropSubCategory(event: CdkDragDrop<string[]>) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.fnUpdateServiceOrder(event.container.data[event.currentIndex]['id'], event.container.data[event.previousIndex]['order']).subscribe((response: any) => {
            this.isLoaderAdmin = false;
        });
        this.isLoaderAdmin = true;
        this.adminSettingsService.fnUpdateServiceOrder(event.container.data[event.previousIndex]['id'], event.container.data[event.currentIndex]['order']).subscribe((response: any) => {
            this.isLoaderAdmin = false;
        });
        moveItemInArray(this.subCategoryServicesList, event.previousIndex, event.currentIndex);
    }
    drop(event: CdkDragDrop<string[]>) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.fnUpdateServiceOrder(event.container.data[event.currentIndex]['id'], event.container.data[event.previousIndex]['order']).subscribe((response: any) => {
            this.isLoaderAdmin = false;
        });
        this.isLoaderAdmin = true;
        this.adminSettingsService.fnUpdateServiceOrder(event.container.data[event.previousIndex]['id'], event.container.data[event.currentIndex]['order']).subscribe((response: any) => {
            this.isLoaderAdmin = false;
        });
        moveItemInArray(this.allServicesList, event.previousIndex, event.currentIndex);
    }

    fnSelectCategoryNavigation(categoryId, index){
        this.selectedFilter = undefined;
        this.serviceApiUrl2=environment.apiUrl+"/list-service";
        this.fnSelectCategory(categoryId, index);
        this.categoryImageUrl = '';
        this.subCategoryImageUrl = '';
        this.serviceImageUrl = '';
        this.createSubCategory.reset();
        this.createCategory.reset();
        this.editCategoryId=null;
        this.editSubCategoryId=null;
        this.selectedSubCategoryID=null;
        // this.createNewCategoryPage = false;
        // this.createNewSubCategoryPage = false;
    }

    fnSelectCategory(categoryId, index) {
        this.isLoaderAdmin = true;
        this.selectCategoryPage = '';
        this.singleSubCategoryPage = '';
        this.createNewSubCategoryPage = false;
        this.selectedCategoryID = categoryId
        this.selectedCategoryIndex = index
        this.createNewCategoryPage = false;
        this.createNewServicePage = false;
        this.selectedSubCategoryDetails = '';
        this.fromcategory=true;
        this.actionServiceIdarr = [];
        let requestObject = {
            'business_id': this.businessId,
            'category_id': categoryId,
            'filter': this.service_filter
        };
        this.adminSettingsService.getServiceForCategoiry(requestObject,this.serviceApiUrl2).subscribe((response: any) => {
            if (response.data == true) {

                this.categoryServicesList = response.response.data;
                this.current_page = response.response.current_page;
                this.first_page_url = response.response.first_page_url;
                this.last_page = response.response.last_page;
                this.totalRecord = response.response.total;
                this.fromRecord = response.response.from;
                this.toRecord = response.response.to;
                this.last_page_url = response.response.last_page_url;
                this.next_page_url = response.response.next_page_url;
                this.prev_page_url = response.response.prev_page_url;
                this.path = response.response.path;

                this.categoryServicesList.forEach( (element) => {
                    element.is_selected = false;
                });
                this.selectAllCategory = false;
                this.selectAll = false;
                this.ActionId = [];

                if (this.categoryServicesList != '' && this.categoryServicesList != 'service not found.') {
                    this.servicesList = false;
                    this.selectCategoryPage = 'services';
                    this.selectedCategoryDetails = this.allCetegoryList[index];
                    this.noCategoryService= false;
                } else if (this.categoryServicesList == 'service not found.') {
                    this.servicesList = false;
                    this.selectedCategoryDetails = this.allCetegoryList[index]
                    this.selectCategoryPage = 'notservices';
                    if(this.service_filter != 'all'){
                        this.noCategoryService= false;
                    }else{
                        this.noCategoryService= true;
                    }
                }

                this.singleSubCategoryPage = '';
                this.isLoaderAdmin = false;
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                this.categoryServicesList = [];
                if (response.response == 'service not found.' || response.response == 'service not found') {
                    this.servicesList = false;
                    this.selectedCategoryDetails = this.allCetegoryList[index]
                    this.selectCategoryPage = 'notservices';
                    if(this.service_filter != 'all'){
                        this.noCategoryService= false;
                    }else{
                        this.noCategoryService= true;
                    }
                }
                this.isLoaderAdmin = false;
            }
            this.service_filter = 'all';
        })
    }

    changeServiceStaus(event, serviceId) {
        if (event == true) {
            this.singleServiceStatus = 'E'
        } else if(event == false){
            this.singleServiceStatus = 'D'
        }
        this.actionServiceIdarr.push(serviceId);
        this.adminSettingsService.fnServiceAction(this.actionServiceIdarr, this.singleServiceStatus).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Status Updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.actionServiceIdarr.length = 0;
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open("Status Not Updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
            }
        })
    }

    fnCreateNewSubCategoryPage(categoryId,type) {
        this.selectCategoryPage = '';
        this.createNewSubCategoryPage = true;
        this.parentCategoryId = categoryId;
        this.whichSubCategoryButton=type;
    }

    newSubCategoryStatus(event) {
        if (event == true) {
            this.newSubcategoryStatus = 'E';
        }
        else if (event == false) {
            this.newSubcategoryStatus = 'D';
        }
    }
    newSubCategoryPrivate(event) {
        if (event == true) {
            this.newSubcategoryPrivate = 'Y';
        }
        else if (event == false) {
            this.newSubcategoryPrivate = 'N';
        }
    }
    fnEditSubCategoryStatus(event) {
        if (event == true) {
            this.editSubcategoryStatus = 'E';
        }
        else if (event == false) {
            this.editSubcategoryStatus = 'D';
        }
    }

    fnEditSubCategoryPrivate(event) {
        if (event == true) {
            this.editSubcategoryPrivate = 'Y';
        }
        else if (event == false) {
            this.editSubcategoryPrivate = 'N';
        }
    }

    fnCreateNewSubCategorySubmit() {
        if(this.editSubCategoryId != undefined){
            if (this.createSubCategory.valid) {
                if(this.subCategoryImageUrl != ''){
                    this.updateSubCategoryData = {
                        'business_id': this.businessId,
                        'sub_category_id': this.editSubCategoryId,
                        'sub_category_name': this.createSubCategory.get('subcategory_name').value,
                        'sub_category_description': this.createSubCategory.get('subcategory_description').value,
                        'sub_category_private': this.editSubcategoryPrivate,
                        'sub_category_status': this.editSubcategoryStatus,
                        'sub_category_image': this.subCategoryImageUrl
                    }
                }else if(this.subCategoryImageUrl == ''){
                    this.updateSubCategoryData = {
                        'business_id': this.businessId,
                        'sub_category_id': this.editSubCategoryId,
                        'sub_category_name': this.createSubCategory.get('subcategory_name').value,
                        'sub_category_description': this.createSubCategory.get('subcategory_description').value,
                        'sub_category_private': this.editSubcategoryPrivate,
                        'sub_category_status': this.editSubcategoryStatus,
                    }
                }
                this.updateSubCategory(this.updateSubCategoryData);
            }else{
                this.createSubCategory.get("subcategory_name").markAsTouched();
                this.createSubCategory.get("subcategory_description").markAsTouched();
            }
        } else{
            if (this.createSubCategory.valid) {
                this.newSubCategoryData = {
                    'business_id': this.businessId,
                    'category_id': this.parentCategoryId,
                    'sub_category_name': this.createSubCategory.get('subcategory_name').value,
                    'sub_category_description': this.createSubCategory.get('subcategory_description').value,
                    'sub_category_private': this.newSubcategoryPrivate,
                    'sub_category_status': this.newSubcategoryStatus,
                    'sub_category_image': this.subCategoryImageUrl
                }
                this.createNewSubCategory(this.newSubCategoryData);
            }else{
                this.createSubCategory.get("subcategory_name").markAsTouched();
                this.createSubCategory.get("subcategory_description").markAsTouched();
            }
        }
    }

    createNewSubCategory(newSubCategoryData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.createNewSubCategory(newSubCategoryData).subscribe((response: any) => {
            this.isLoaderAdmin = false;
            if (response.data == true) {
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.allowed=true;
                this.newSubcategoryStatus = 'E';
                this.newSubcategoryPrivate = 'N';
                this.fnAllCategory();
                setTimeout(() => {
                    // this.fnSelectCategoryNavigation(this.selectedCategoryID , this.selectedCategoryIndex);

                    this.createSubCategory.reset();
                    this.servicesList = false;
                    this.selectCategoryPage = '';
                    this.createNewSubCategoryPage = false;
                }, 300);

                this.isLoaderAdmin = false;
            }else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }

    updateSubCategory(updateSubCategoryData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.updateSubCategory(updateSubCategoryData).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.createSubCategory.reset();
                this.fnAllCategory();
                this.fnSelectSubCategory(this.editSubCategoryId, this.selectedSubCategoryIndex);
                // this.servicesList = true;
                this.createNewSubCategoryPage = false;
                this.isLoaderAdmin = false;
                this.subCategoryImageUrl = '';
                this.editSubCategoryId = undefined;
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }

    newCategoryStatus(event) {
        if (event == true) {
            this.newcategoryStatus = 'E';
        }
        else if (event == false) {
            this.newcategoryStatus = 'D';
        }
    }

    newCategoryPrivate(event) {
        if (event == true) {
            this.newcategoryPrivate = 'Y';
        }
        else if (event == false) {
            this.newcategoryPrivate = 'N';
        }
    }

    editCategoryStatus(event) {
        if (event == true) {
            this.editcategoryStatus = 'E';
        }
        else if (event == false) {
            this.editcategoryStatus = 'D';
        }
    }
    editCategoryPrivate(event) {
        if (event == true) {
            this.editcategoryPrivate = 'Y';
        }
        else if (event == false) {
            this.editcategoryPrivate = 'N';
        }
    }

    fnCreateNewCategorySubmit() {

        if (this.createCategory.get('category_id').value) {

          this.editCategoryId = this.createCategory.get('category_id').value;

            if (this.createCategory.valid) {
                if(this.categoryImageUrl != ''){
                    this.updateCategoryData = {
                        'category_id': this.editCategoryId,
                        'business_id': this.businessId,
                        'category_title': this.createCategory.get('category_name').value,
                        'category_description': this.createCategory.get('category_description').value,
                        'category_private': this.editcategoryPrivate,
                        'status': this.editcategoryStatus,
                        "category_image" : this.categoryImageUrl,
                    }
                }else if(this.categoryImageUrl == ''){
                    this.updateCategoryData = {
                        'category_id': this.editCategoryId,
                        'business_id': this.businessId,
                        'category_title': this.createCategory.get('category_name').value,
                        'category_description': this.createCategory.get('category_description').value,
                        'category_private': this.editcategoryPrivate,
                        'status': this.editcategoryStatus,
                    }
                }
                this.updateCategory(this.updateCategoryData);
            }else{
                this.createCategory.get('category_name').markAsTouched();
                this.createCategory.get('category_description').markAsTouched();
            }
        } else {
            if (this.createCategory.valid) {
                this.newCategoryData = {
                    'business_id': this.businessId,
                    'category_title': this.createCategory.get('category_name').value,
                    'category_description': this.createCategory.get('category_description').value,
                    'category_private': this.newcategoryPrivate,
                    'status': this.newcategoryStatus,
                    "category_image" : this.categoryImageUrl,
                }
                this.createNewCategory(this.newCategoryData);
            }else{
                this.createCategory.get('category_name').markAsTouched();
                this.createCategory.get('category_description').markAsTouched();
            }
        }
    }

    updateCategory(updateCategoryData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.updateCategory(updateCategoryData).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Category updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.allowedCat=false;
                this.newcategoryStatus = 'D';
                this.newcategoryPrivate = 'N';
                this.fnAllCategory();
                setTimeout(() => {
                    this.fnSelectCategory(this.editCategoryId, this.selectedCategoryIndex);
                    this.createCategory.reset();
                    this.createNewCategoryPage = false;
                    this.categoryImageUrl = '';
                    this.editCategoryId = undefined;
                }, 300);
                //this.servicesList = true;
                this.isLoaderAdmin = false;
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open("Category Not updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }

    createNewCategory(newCategoryData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.createNewCategory(newCategoryData).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Category Created", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.createCategory.reset();
                this.allowedCat=true;
                this.fnAllCategory();
                this.servicesList = true;
                this.createNewCategoryPage = false;
                this.isLoaderAdmin = false;
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }

    editCategory(editCategoryId) {
        this.editCategoryId = editCategoryId
        this.selectCategoryPage = '';
        this.createNewCategoryPage = true;
        this.isLoaderAdmin = true;
        this.createCategory.controls['category_id'].setValue(editCategoryId);
        this.createCategory.controls['category_name'].setValue(this.selectedCategoryDetails.category_title);
        this.createCategory.controls['category_description'].setValue(this.selectedCategoryDetails.category_description);
        this.editcategoryStatus = this.selectedCategoryDetails.status
        this.editcategoryPrivate = this.selectedCategoryDetails.private_status
        this.isLoaderAdmin = false;
    }

    deleteCategory(deleteCategoryId) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: "Are you sure you want to delete?"
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.isLoaderAdmin = true;
                let requestObject = {
                    'business_id': this.businessId,
                    'category_id': deleteCategoryId,
                    'filter': 'filter'
                };
                this.adminSettingsService.deleteCategory(requestObject).subscribe((response: any) => {
                    if (response.data == true) {
                        this._snackBar.open("Category deleted", "X", {
                            duration: 2000,
                            verticalPosition: 'top',
                            panelClass: ['green-snackbar']
                        });

                        this.fnAllServices();
                        this.fnAllCategory();
                        this.fnAllServicesNavigation('not-new');
                        this.servicesList = true;
                        this.createNewCategoryPage = false;
                        this.isLoaderAdmin = false;
                    }else if(response.data == false && response.response !== 'api token or userid invaild'){
                        this._snackBar.open("Category Not deleted", "X", {
                            duration: 2000,
                            verticalPosition: 'top',
                            panelClass: ['red-snackbar']
                        });
                        this.isLoaderAdmin = false;
                    }
                });

            }
        });


    }

    deleteSubCategory(deleteSubCategoryId) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: "Are you sure you want to delete?"
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result){
                this.isLoaderAdmin = true;
                this.adminSettingsService.deleteSubCategory(deleteSubCategoryId).subscribe((response: any) => {
                    if (response.data == true) {
                        this._snackBar.open(response.response, "X", {
                            duration: 2000,
                            verticalPosition: 'top',
                            panelClass: ['green-snackbar']
                        });

                        this.fnAllServices();
                        this.fnAllCategory();
                        this.fnSelectCategoryNavigation(this.selectedCategoryID , this.selectedCategoryIndex);
                        this.servicesList = false;
                        this.selectCategoryPage = 'notservices';
                        this.createNewSubCategoryPage = false;
                        this.isLoaderAdmin = false;
                        this.singleSubCategoryPage = '';


                    } else if(response.data == false && response.response !== 'api token or userid invaild'){
                        this._snackBar.open(response.response, "X", {
                            duration: 2000,
                            verticalPosition: 'top',
                            panelClass: ['red-snackbar']
                        });
                        this.isLoaderAdmin = false;
                    }
                });

            }
        });


    }

    changeCategoryStatus(categoryStatus, categoryId) {
        if (categoryStatus == true) {
            this.currentCategoryStatus = 'E'
            this.selectedCategoryDetails.status = 'E'
            this.editcategoryStatus = 'E'
        }
        if (categoryStatus == false) {
            this.currentCategoryStatus = 'D'
            this.selectedCategoryDetails.status = 'D'
            this.editcategoryStatus = 'D'
        }
        this.adminSettingsService.changeCategoryStatus(this.currentCategoryStatus, categoryId).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.fnAllCategory()
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.isLoaderAdmin = false;
            }
        })
    }

    fnActionServiceId(event, serviceId,i) {

        if (event == true) {
            this.actionServiceIdarr.push(serviceId);
            this.categoryServicesList[i].is_selected = true;
        } else {
            const index = this.actionServiceIdarr.indexOf(serviceId, 0);
            if (index > -1) {
                this.actionServiceIdarr.splice(index, 1);
            }
            this.categoryServicesList[i].is_selected = false;
        }

        if (this.actionServiceIdarr.length == this.categoryServicesList.length ) {
            this.selectAllCategory = true;
          } else {
            this.selectAllCategory = false;
          }
    }

    checkAllCategory(event){


        this.actionServiceIdarr = [];
        for (let i = 0; i < this.categoryServicesList.length; i++) {
          const item = this.categoryServicesList[i];
          item.is_selected = event.checked;

          if(event.checked){
            this.actionServiceIdarr.push(item.id)

          }
        }

        if(event.checked){
          this.selectAllCategory = true;
        }else{
          this.selectAllCategory = false;
          this.actionServiceIdarr = [];
        }

        //this.Change.detectChanges();

    }




    fnServiceAction(action, categoryId, type) {
        if(action=='DEL'){
            const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
                width:'400px',
                data:'Are you sure you want to delete?'
            });

            dialogRef.afterClosed().subscribe(result =>{
                if(result){
                   this.serviceStatusAction(action, categoryId, type)
                }
            })
        }else{
            this.serviceStatusAction(action, categoryId, type)
        }


    }

    serviceStatusAction(action, categoryId, type){
        if (this.actionServiceIdarr.length > 0) {
            this.adminSettingsService.fnServiceAction(this.actionServiceIdarr, action).subscribe((response: any) => {
                if (response.data == true) {
                    this._snackBar.open("Status Updated.", "X", {
                        duration: 2000,
                        verticalPosition: 'top',
                        panelClass: ['green-snackbar']
                    });
                    this.actionServiceIdarr.length = 0;
                this.fnAllServices();
                    this.selectedValue = undefined;
                    if (type == 'category') {
                        this.fnSelectCategory(categoryId, this.selectedCategoryIndex);
                    } else if (type == 'subcategory') {
                        this.fnSelectSubCategory(categoryId, this.selectedSubCategoryIndex)
                    }
                }
                else if(response.data == false && response.response !== 'api token or userid invaild'){
                    this._snackBar.open(response.response, "X", {
                        duration: 2000,
                        verticalPosition: 'top',
                        panelClass: ['red-snackbar']
                    });
                }
            })
        }
    }

    fnFilterService(categoryId, filter, type) {
        this.selectedFilter = filter;
        if (type == 'category') {
            this.service_filter = this.selectedFilter
            this.fnSelectCategory(categoryId, this.selectedCategoryIndex)
        } else if (type == 'subcategory') {
            this.subcategory_service_filter = this.selectedFilter
            this.fnSelectSubCategory(categoryId, this.selectedSubCategoryIndex)
        }

    }

    fnSelectSubCategoryNavigate(subCategoryId, index){
        this.selectedFilter = undefined;
        this.serviceApiUrl3=environment.apiUrl+"/list-subcategory-service";;
       this.fnSelectSubCategory(subCategoryId, index);
       this.selectedSubCategoryID = subCategoryId;
       this.selectedSubCategoryIndex = index;
       this.categoryImageUrl = '';
       this.subCategoryImageUrl = '';
       this.serviceImageUrl = '';
       this.createCategory.reset();
       this.editSubCategoryId=null;
    }

    fnSelectSubCategory(subCategoryId, index) {

        this.isLoaderAdmin = true;
        this.createNewSubCategoryPage = false;
        this.createNewCategoryPage = false;
        this.fromcategory = false;
        this.selectedSubCategoryID = subCategoryId;
        this.selectedSubCategoryIndex = index;
        this.actionServiceIdarr = [];
        let requestObject = {
            'business_id': this.businessId,
            'sub_category_id': subCategoryId,
            'filter': this.subcategory_service_filter
        };
        this.adminSettingsService.getServiceForSubCategoiry(requestObject, this.serviceApiUrl3).subscribe((response: any) => {
            if (response.data == true) {
                this.subCategoryServicesList = response.response.data;
                this.current_page = response.response.current_page;
                this.first_page_url = response.response.first_page_url;
                this.last_page = response.response.last_page;
                this.totalRecord = response.response.total;
                this.fromRecord = response.response.from;
                this.toRecord = response.response.to;
                this.last_page_url = response.response.last_page_url;
                this.next_page_url = response.response.next_page_url;
                this.prev_page_url = response.response.prev_page_url;
                this.path = response.response.path;

                this.subCategoryServicesList.forEach( (element) => {
                    element.is_selected = false;
                });
                this.staffActionIdSub = [];
                this.selectAllSubCat = false;

                if (this.subCategoryServicesList != '' && this.subCategoryServicesList != 'service not found.') {
                    this.servicesList = false;
                    this.singleSubCategoryPage = 'services';
                    this.selectedSubCategoryDetails = this.allCetegoryList[this.selectedCategoryIndex].subcategory[this.selectedSubCategoryIndex];

                    this.noSubCategoryService = false;
                } else if (this.subCategoryServicesList == 'service not found.') {
                    this.servicesList = false;
                    this.selectedSubCategoryDetails = this.allCetegoryList[this.selectedCategoryIndex].subcategory[this.selectedSubCategoryIndex]
                    this.selectCategoryPage = '';
                    this.singleSubCategoryPage = 'notservices';
                    if(this.subcategory_service_filter != 'all'){
                        this.noSubCategoryService = false;
                    }else{
                        this.noSubCategoryService = true;
                    }
                }
                this.selectCategoryPage = '';
                this.createNewServicePage = false;
                this.isLoaderAdmin = false;
            } else if(response.data == false && response.response !== 'api token or userid invaild'){
                if (response.response == 'service not found.' || response.response == 'service not found') {
                    this.servicesList = false;


                    if(this.allCetegoryList[this.selectedCategoryIndex]!=undefined){
                        this.selectedSubCategoryDetails = this.allCetegoryList[this.selectedCategoryIndex].subcategory[index]
                    }
                    this.selectCategoryPage = '';
                    this.singleSubCategoryPage = 'notservices';
                    if(this.subcategory_service_filter != 'all'){
                        this.noSubCategoryService = false;
                    }else{
                        this.noSubCategoryService = true;
                    }
                }
                this.categoryServicesList = [];
                this.createNewServicePage = false;
                this.isLoaderAdmin = false;
            }
            this.subcategory_service_filter = 'all';
        })
    }

    fnAddStaffIdSub(event, staffId,i) {
        if (event == true) {
          this.staffActionIdSub.push(staffId)
          this.subCategoryServicesList[i].is_selected = true;

        }else if (event == false) {
          this.subCategoryServicesList[i].is_selected = false;

          const index = this.staffActionIdSub.indexOf(staffId, 0);
          if (index > -1) {
            this.staffActionIdSub.splice(index, 1);
          }
        }

        if (this.staffActionIdSub.length == this.subCategoryServicesList.length ) {
          this.selectAllSubCat = true;
        } else {
          this.selectAllSubCat = false;
        }
    }

    checkAllSubcat(event){

        this.staffActionIdSub = [];

        for (let i = 0; i < this.subCategoryServicesList.length; i++) {
          const item = this.subCategoryServicesList[i];
          item.is_selected = event.checked;
          if(event.checked){
            this.staffActionIdSub.push(item.id)
            this.actionServiceIdarr =  this.staffActionIdSub
          }
        }

        if(event.checked){
          this.selectAllSubCat = true;
        }else{
          this.selectAllSubCat = false;
          this.actionServiceIdarr = [];
        }

    }


    fnCreateNewServicePage(categoryId, type,btntype) {
        this.fnstaffList();
        this.createService.controls['service_name'].setValue(null);
        this.createService.controls['service_description'].setValue(null);
        this.createService.controls['service_cost'].setValue(null);
        this.createService.controls['service_duration'].setValue(null);
        this.createService.controls['service_unit'].setValue(null);
        this.createService.controls['service_id'].setValue(null);
        this.createService.controls['travelingTime'].setValue(null);
        this.assignStaffArr.length = 0;
        this.createServiceCategoryId = categoryId
        this.createServiceCategoryType = type
        this.createNewServicePage = true;
        this.servicesList = false;
        this.selectCategoryPage = '';
        this.createNewSubCategoryPage = false;
        this.createNewCategoryPage = false;
        this.singleSubCategoryPage = '';
        this.whichServiceButton=btntype;
        this.editServiceId=undefined;

    }

    fnCalcelNewSubcategory(){

        if(this.whichSubCategoryButton == "main"){
            this.singleSubCategoryPage = 'notservices';
        }else{
            this.singleSubCategoryPage="services";
        }
        this.editSubCategoryId = null;
        this.createNewSubCategoryPage = false;
        this.servicesList = false;
        this.createNewServicePage = false;
        this.subCategoryImageUrl='';
    }

    fnCancelAddService(){
        this.servicesList = false;
        this.createNewServicePage = false;
        this.createNewSubCategoryPage = false;
        this.serviceImageUrl = '';
        if(this.whichServiceButton == "main"){
            if(this.fromcategory == true){
                this.selectCategoryPage = 'notservices';
            }else{
                this.singleSubCategoryPage="notservices";
            }
        }else{
            if(this.fromcategory == true){
                this.selectCategoryPage="services";
            }else{
              this.singleSubCategoryPage="services";
            }
        }
    }
    fnNewServiceStatus(event) {
        if (event == true) {
            this.newServiceStatus = 'E';
        }
        else if (event == false) {
            this.newServiceStatus = 'D';
        }
    }
    fnNewServicePrivate(event) {
        if (event == true) {
            this.newServicePrivate = 'Y';
        }
        else if (event == false) {
            this.newServicePrivate = 'N';
        }
    }
    fnEditServiceStatus(event) {
        if (event == true) {
            this.editServiceStatus = 'E';
        }
        else if (event == false) {
            this.editServiceStatus = 'D';
        }
    }
    fnEditServicePrivate(event) {
        if (event == true) {
            this.editServicePrivate = 'Y';
        }
        else if (event == false) {
            this.editServicePrivate = 'N';
        }
    }
    fnCreateServiceSubmit() {
        if (this.createService.get('service_id').value != null && this.createService.get('service_id').value != '') {
            if (this.createService.valid) {
                if(this.serviceImageUrl != ''){
                    if(this.serviceType == 'face_to_face'){
                        this.updateServiceData = {
                            'service_id': this.createService.get('service_id').value,
                            'business_id': this.businessId,
                            'service_name': this.createService.get('service_name').value,
                            'service_description': this.createService.get('service_description').value,
                            'service_cost': this.createService.get('service_cost').value,
                            'service_time': this.createService.get('service_duration').value,
                            'service_unit': this.createService.get('service_unit').value,
                            'service_type': this.createService.get('serviceType').value,
                            'service_sub_type': this.createService.get('ftfType').value,
                            'traveling_time': this.createService.get('travelingTime').value,
                            'service_private': this.editServicePrivate,
                            'service_status': this.editServiceStatus,
                            'service_image': this.serviceImageUrl,
                            'staff_list' : this.assignStaffArr
                        }
                    }else if(this.serviceType == 'online'){
                        this.updateServiceData = {
                            'service_id': this.createService.get('service_id').value,
                            'business_id': this.businessId,
                            'service_name': this.createService.get('service_name').value,
                            'service_description': this.createService.get('service_description').value,
                            'service_cost': this.createService.get('service_cost').value,
                            'service_time': this.createService.get('service_duration').value,
                            'service_unit': this.createService.get('service_unit').value,
                            'service_type': this.createService.get('serviceType').value,
                            'service_sub_type': this.createService.get('onlineType').value,
                            'service_sub_type_value': this.createService.get('onlineId').value,
                            'service_private': this.editServicePrivate,
                            'service_status': this.editServiceStatus,
                            'service_image': this.serviceImageUrl,
                            'staff_list' : this.assignStaffArr
                        }
                    }else if(this.serviceType == 'phone'){
                        this.updateServiceData = {
                            'service_id': this.createService.get('service_id').value,
                            'business_id': this.businessId,
                            'service_name': this.createService.get('service_name').value,
                            'service_description': this.createService.get('service_description').value,
                            'service_cost': this.createService.get('service_cost').value,
                            'service_time': this.createService.get('service_duration').value,
                            'service_unit': this.createService.get('service_unit').value,
                            'service_type': this.createService.get('serviceType').value,
                            'service_sub_type_value': this.createService.get('phoneNo').value,
                            'service_private': this.editServicePrivate,
                            'service_status': this.editServiceStatus,
                            'service_image': this.serviceImageUrl,
                            'staff_list' : this.assignStaffArr
                        }
                    }
                }else if(this.serviceImageUrl == ''){
                    // this.updateServiceData = {
                    //     'service_id': this.createService.get('service_id').value,
                    //     'business_id': this.businessId,
                    //     'service_name': this.createService.get('service_name').value,
                    //     'service_description': this.createService.get('service_description').value,
                    //     'service_cost': this.createService.get('service_cost').value,
                    //     'service_time': this.createService.get('service_duration').value,
                    //     'service_unit': this.createService.get('service_unit').value,
                    //     'service_private': this.editServicePrivate,
                    //     'service_status': this.editServiceStatus,
                    //     'staff_list' : this.assignStaffArr

                    // }
                    if(this.serviceType == 'face_to_face'){
                        if(this.ftfOPT == 'at_home'){
                            this.updateServiceData = {
                                'service_id': this.createService.get('service_id').value,
                                'business_id': this.businessId,
                                'service_name': this.createService.get('service_name').value,
                                'service_description': this.createService.get('service_description').value,
                                'service_cost': this.createService.get('service_cost').value,
                                'service_time': this.createService.get('service_duration').value,
                                'service_unit': this.createService.get('service_unit').value,
                                'service_type': this.createService.get('serviceType').value,
                                'service_sub_type': this.createService.get('ftfType').value,
                                'traveling_time': this.createService.get('travelingTime').value,
                                'service_private': this.editServicePrivate,
                                'service_status': this.editServiceStatus,
                                'staff_list' : this.assignStaffArr
                            }
                        }else{
                            this.updateServiceData = {
                                'service_id': this.createService.get('service_id').value,
                                'business_id': this.businessId,
                                'service_name': this.createService.get('service_name').value,
                                'service_description': this.createService.get('service_description').value,
                                'service_cost': this.createService.get('service_cost').value,
                                'service_time': this.createService.get('service_duration').value,
                                'service_unit': this.createService.get('service_unit').value,
                                'service_type': this.createService.get('serviceType').value,
                                'service_sub_type': this.createService.get('ftfType').value,
                                'traveling_time': NonNullAssert,
                                'service_private': this.editServicePrivate,
                                'service_status': this.editServiceStatus,
                                'staff_list' : this.assignStaffArr
                            }
                        }
                    }else if(this.serviceType == 'online'){
                        this.updateServiceData = {
                            'service_id': this.createService.get('service_id').value,
                            'business_id': this.businessId,
                            'service_name': this.createService.get('service_name').value,
                            'service_description': this.createService.get('service_description').value,
                            'service_cost': this.createService.get('service_cost').value,
                            'service_time': this.createService.get('service_duration').value,
                            'service_unit': this.createService.get('service_unit').value,
                            'service_type': this.createService.get('serviceType').value,
                            'service_sub_type': this.createService.get('onlineType').value,
                            'service_sub_type_value': this.createService.get('onlineId').value,
                            'service_private': this.editServicePrivate,
                            'service_status': this.editServiceStatus,
                            'staff_list' : this.assignStaffArr
                        }
                    }else if(this.serviceType == 'phone'){
                        this.updateServiceData = {
                            'service_id': this.createService.get('service_id').value,
                            'business_id': this.businessId,
                            'service_name': this.createService.get('service_name').value,
                            'service_description': this.createService.get('service_description').value,
                            'service_cost': this.createService.get('service_cost').value,
                            'service_time': this.createService.get('service_duration').value,
                            'service_unit': this.createService.get('service_unit').value,
                            'service_type': this.createService.get('serviceType').value,
                            'service_sub_type_value': this.createService.get('phoneNo').value,
                            'service_private': this.editServicePrivate,
                            'service_status': this.editServiceStatus,
                            'staff_list' : this.assignStaffArr
                        }
                    }
                }
                this.updateService(this.updateServiceData);
            }else{
                this.createService.get('service_name').markAsTouched();
                this.createService.get('service_description').markAsTouched();
                this.createService.get('service_cost').markAsTouched();
                this.createService.get('service_duration').markAsTouched();
                this.createService.get('service_unit').markAsTouched();
                this.createService.get('serviceType').markAsTouched();
                if(this.createService.get('serviceType').value == 'face_to_face'){
                    this.createService.get('ftfType').markAsTouched();
                    this.createService.get('travelingTime').markAsTouched();
                }else if(this.createService.get('serviceType').value == 'online'){
                    this.createService.get('onlineType').markAsTouched();
                    this.createService.get('onlineId').markAsTouched();
                }else if(this.createService.get('serviceType').value == 'phone'){
                    this.createService.get('phoneNo').markAsTouched();
                }

            }

        }
        else if (this.createService.get('service_id').value == null || this.createService.get('service_id').value == '') {
            if (this.createService.valid) {
                if (this.createServiceCategoryType == 'category') {
                    if(this.serviceType == 'face_to_face'){
                        if(this.ftfOPT == 'at_home'){

                            this.newServiceData = {
                                'category_id': this.createServiceCategoryId,
                                'business_id': this.businessId,
                                'service_name': this.createService.get('service_name').value,
                                'service_description': this.createService.get('service_description').value,
                                'service_cost': this.createService.get('service_cost').value,
                                'service_time': this.createService.get('service_duration').value,
                                'service_unit': this.createService.get('service_unit').value,
                                'service_type': this.createService.get('serviceType').value,
                                'service_sub_type': this.createService.get('ftfType').value,
                                'traveling_time': this.createService.get('travelingTime').value,
                                'service_private': this.newServicePrivate,
                                'service_status': this.newServiceStatus,
                                'service_image': this.serviceImageUrl,
                                'staff_list' : this.assignStaffArr
                            }
                        }else{

                            this.newServiceData = {
                                'category_id': this.createServiceCategoryId,
                                'business_id': this.businessId,
                                'service_name': this.createService.get('service_name').value,
                                'service_description': this.createService.get('service_description').value,
                                'service_cost': this.createService.get('service_cost').value,
                                'service_time': this.createService.get('service_duration').value,
                                'service_unit': this.createService.get('service_unit').value,
                                'service_type': this.createService.get('serviceType').value,
                                'service_sub_type': this.createService.get('ftfType').value,
                                'traveling_time': null,
                                'service_private': this.newServicePrivate,
                                'service_status': this.newServiceStatus,
                                'service_image': this.serviceImageUrl,
                                'staff_list' : this.assignStaffArr
                            }
                        }
                    }else if(this.serviceType == 'online'){
                        this.newServiceData = {
                            'category_id': this.createServiceCategoryId,
                            'business_id': this.businessId,
                            'service_name': this.createService.get('service_name').value,
                            'service_description': this.createService.get('service_description').value,
                            'service_cost': this.createService.get('service_cost').value,
                            'service_time': this.createService.get('service_duration').value,
                            'service_unit': this.createService.get('service_unit').value,
                            'service_type': this.createService.get('serviceType').value,
                            'service_sub_type': this.createService.get('onlineType').value,
                            'service_sub_type_value': this.createService.get('onlineId').value,
                            'service_private': this.newServicePrivate,
                            'service_status': this.newServiceStatus,
                            'service_image': this.serviceImageUrl,
                            'staff_list' : this.assignStaffArr
                        }
                    }else if(this.serviceType == 'phone'){
                        this.newServiceData = {
                            'category_id': this.createServiceCategoryId,
                            'business_id': this.businessId,
                            'service_name': this.createService.get('service_name').value,
                            'service_description': this.createService.get('service_description').value,
                            'service_cost': this.createService.get('service_cost').value,
                            'service_time': this.createService.get('service_duration').value,
                            'service_unit': this.createService.get('service_unit').value,
                            'service_type': this.createService.get('serviceType').value,
                            'service_sub_type_value': this.createService.get('phoneNo').value,
                            'service_private': this.newServicePrivate,
                            'service_status': this.newServiceStatus,
                            'service_image': this.serviceImageUrl,
                            'staff_list' : this.assignStaffArr
                        }
                    }

                }
                else if (this.createServiceCategoryType == 'subcategory') {
                    // this.newServiceData = {
                    //     'sub_category_id': this.createServiceCategoryId,
                    //     'business_id': this.businessId,
                    //     'service_name': this.createService.get('service_name').value,
                    //     'service_description': this.createService.get('service_description').value,
                    //     'service_cost': this.createService.get('service_cost').value,
                    //     'service_time': this.createService.get('service_duration').value,
                    //     'service_unit': this.createService.get('service_unit').value,
                    //     'service_private': this.newServicePrivate,
                    //     'service_status': this.newServiceStatus,
                    //     'service_image': this.serviceImageUrl,
                    //     'staff_list' : this.assignStaffArr
                    // }
                    if(this.serviceType == 'face_to_face'){
                        this.newServiceData = {
                            'sub_category_id': this.createServiceCategoryId,
                            'business_id': this.businessId,
                            'service_name': this.createService.get('service_name').value,
                            'service_description': this.createService.get('service_description').value,
                            'service_cost': this.createService.get('service_cost').value,
                            'service_time': this.createService.get('service_duration').value,
                            'service_unit': this.createService.get('service_unit').value,
                            'service_type': this.createService.get('serviceType').value,
                            'service_sub_type': this.createService.get('ftfType').value,
                            'traveling_time': this.createService.get('travelingTime').value,
                            'service_private': this.newServicePrivate,
                            'service_status': this.newServiceStatus,
                            'service_image': this.serviceImageUrl,
                            'staff_list' : this.assignStaffArr
                        }
                    }else if(this.serviceType == 'online'){
                        this.newServiceData = {
                            'sub_category_id': this.createServiceCategoryId,
                            'business_id': this.businessId,
                            'service_name': this.createService.get('service_name').value,
                            'service_description': this.createService.get('service_description').value,
                            'service_cost': this.createService.get('service_cost').value,
                            'service_time': this.createService.get('service_duration').value,
                            'service_unit': this.createService.get('service_unit').value,
                            'service_type': this.createService.get('serviceType').value,
                            'service_sub_type': this.createService.get('onlineType').value,
                            'service_sub_type_value': this.createService.get('onlineId').value,
                            'service_private': this.newServicePrivate,
                            'service_status': this.newServiceStatus,
                            'service_image': this.serviceImageUrl,
                            'staff_list' : this.assignStaffArr
                        }
                    }else if(this.serviceType == 'phone'){
                        this.newServiceData = {
                            'sub_category_id': this.createServiceCategoryId,
                            'business_id': this.businessId,
                            'service_name': this.createService.get('service_name').value,
                            'service_description': this.createService.get('service_description').value,
                            'service_cost': this.createService.get('service_cost').value,
                            'service_time': this.createService.get('service_duration').value,
                            'service_unit': this.createService.get('service_unit').value,
                            'service_type': this.createService.get('serviceType').value,
                            'service_sub_type_value': this.createService.get('phoneNo').value,
                            'service_private': this.newServicePrivate,
                            'service_status': this.newServiceStatus,
                            'service_image': this.serviceImageUrl,
                            'staff_list' : this.assignStaffArr
                        }
                    }
                }
                this.createNewService(this.newServiceData);
            }else{
                this.createService.get('service_name').markAsTouched();
                this.createService.get('service_description').markAsTouched();
                this.createService.get('service_cost').markAsTouched();
                this.createService.get('service_duration').markAsTouched();
                this.createService.get('service_unit').markAsTouched();
                this.createService.get('serviceType').markAsTouched();
                this.createService.get('ftfType').markAsTouched();
                this.createService.get('onlineType').markAsTouched();
                this.createService.get('onlineId').markAsTouched();
                this.createService.get('phoneNo').markAsTouched();
                this.createService.get('travelingTime').markAsTouched();
                this.scrollToFirstInvalidControl();
            }
        }
    }

    createNewService(newServiceData) {
        this.adminSettingsService.createNewService(newServiceData).subscribe((response: any) => {
            this.isLoaderAdmin = true;
            if (response.data == true) {
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.fnAllServices();
                this.createService.reset();
                this.assignStaffArr.length = 0;
                this.createNewServicePage = false;
                this.serviceType="";
                this.servicesList = false;
                this.newServicePrivate = 'N';
                this.newServiceStatus = 'D';
                // this.fnAllCategory();
                if(this.createServiceCategoryType == 'category'){
                    this.fnSelectCategoryNavigation(this.selectedCategoryID,this.selectedCategoryIndex);
                    this.singleSubCategoryPage = 'services'
                }else if(this.createServiceCategoryType == 'subcategory'){
                    this.fnSelectSubCategoryNavigate(this.selectedSubCategoryID,this.selectedSubCategoryIndex);
                    this.selectCategoryPage = 'services'
                }
                this.isLoaderAdmin = false;
            } else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.assignStaffArr.length = 0;
            }
            this.isLoaderAdmin = false;
        })
    }
    updateService(updateServiceData) {
        this.isLoaderAdmin = true;
        this.adminSettingsService.updateService(updateServiceData).subscribe((response: any) => {
            if (response.data == true && response.response == 'service updated.') {
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
                this.createService.reset();
                this.createNewServicePage = false;
                this.assignStaffArr.length = 0;
                this.servicesList = false;
                this.editServiceId = undefined;
                this.editServiceStatus = '';
                this.editServicePrivate = '';
                this.editServiceImage = '';
                this.serviceType="";
                this.serviceImageUrl = undefined;
                // this.fnAllCategory();
                if(this.createServiceCategoryType == 'category'){
                    this.selectedCategoryDetails = '';
                    this.selectCategoryPage = '';
                    this.fnSelectCategoryNavigation(this.selectedCategoryID,this.selectedCategoryIndex);
                    //this.singleSubCategoryPage = 'services'
                }else if(this.createServiceCategoryType == 'subcategory'){
                    this.selectedCategoryDetails = '';
                    this.selectCategoryPage = '';
                    this.fnSelectSubCategoryNavigate(this.selectedSubCategoryID,this.selectedSubCategoryIndex);
                    //this.selectCategoryPage = 'services'
                }
                this.isLoaderAdmin = false;

            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                this._snackBar.open(response.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                });
                this.isLoaderAdmin = false;
            }else{
            }
            this.isLoaderAdmin = false;
        })
    }
    changeSubCategoryStatus(categoryStatus, subcategoryId) {
        if (categoryStatus == true) {
            this.currentSubCategoryStatus = 'E'
            this.selectedSubCategoryDetails.sub_category_status = 'E'
            this.editSubcategoryStatus = 'E'
        }
        if (categoryStatus == false) {
            this.currentSubCategoryStatus = 'D'
            this.selectedSubCategoryDetails.sub_category_status = 'D'
            this.editSubcategoryStatus = 'D'
        }
        this.adminSettingsService.changeSubCategoryStatus(this.currentSubCategoryStatus, subcategoryId).subscribe((response: any) => {
            if (response.data == true) {
                this._snackBar.open("Sub Category Status Updated", "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['green-snackbar']
                });
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
                this.isLoaderAdmin = false;
            }
        })
    }
    editSubCategory(editSubCategoryId){

        // this.fnAllCategory();
        // this.fnSelectSubCategory(this.selectedSubCategoryID,this.selectedSubCategoryIndex);
        this.editSubCategoryId = editSubCategoryId
        this.singleSubCategoryPage = '';
        this.createNewSubCategoryPage = true;
        this.isLoaderAdmin = true;
        this.createSubCategory.controls['subcategory_id'].setValue(editSubCategoryId);
        this.createSubCategory.controls['subcategory_name'].setValue(this.selectedSubCategoryDetails.sub_category_name);
        this.createSubCategory.controls['subcategory_description'].setValue(this.selectedSubCategoryDetails.sub_category_description);
        this.editSubcategoryStatus = this.selectedSubCategoryDetails.sub_category_status
        this.editSubcategoryPrivate = this.selectedSubCategoryDetails.sub_category_private
        this.isLoaderAdmin = false;
    }
    fnEditService(index, serviceId, type) {
        this.fnstaffList();
        this.editServiceId = serviceId
        this.isLoaderAdmin = true;
        this.createNewServicePage = true;
        this.servicesList = false;
        this.selectCategoryPage = '';
        this.singleSubCategoryPage = '';
        this.createServiceCategoryType = type
        this.whichServiceButton="upper";



        if (type == 'category') {

        if(this.categoryServicesList[index] && this.categoryServicesList[index].staffs){
            this.assignedStaff = this.categoryServicesList[index].staffs;
            if(this.assignedStaff != '' || this.assignedStaff != [] || this.assignedStaff != undefined){
                this.assignedStaff.forEach(element => {
                     this.assignStaffArr.push(element.id);
                 });
            }
        }


            this.createService.controls['service_id'].setValue(this.editServiceId);
            this.createService.controls['service_name'].setValue(this.categoryServicesList[index].service_name);
            this.createService.controls['service_description'].setValue(this.categoryServicesList[index].service_description);
            this.createService.controls['service_cost'].setValue(this.categoryServicesList[index].service_cost);
            this.createService.controls['service_duration'].setValue(this.categoryServicesList[index].service_time);
            this.createService.controls['service_unit'].setValue(this.categoryServicesList[index].service_unit);
            this.createService.controls['serviceType'].setValue(this.categoryServicesList[index].service_type);
            this.serviceType = this.categoryServicesList[index].service_type;
            this.ftfOPT = this.categoryServicesList[index].service_sub_type;
            if(this.ftfOPT == 'at_home' && this.serviceType == 'face_to_face'){
                this.createService.controls["travelingTime"].setValidators(Validators.required);
                this.createService.controls["travelingTime"].updateValueAndValidity();
            }else{
                this.createService.controls['travelingTime'].setValue(null);
                this.createService.controls["travelingTime"].setValidators(null);
                this.createService.controls["travelingTime"].updateValueAndValidity();
            }
            if(this.serviceType == 'face_to_face'){
                this.createService.controls['ftfType'].setValue(this.categoryServicesList[index].service_sub_type);
                if(this.ftfOPT == 'at_home' && this.serviceType == 'face_to_face'){
                  this.createService.controls['travelingTime'].setValue(this.categoryServicesList[index].traveling_time);
                }
            }else if(this.serviceType == 'online'){
                this.createService.controls['onlineType'].setValue(this.categoryServicesList[index].service_sub_type);
                this.createService.controls['onlineId'].setValue(this.categoryServicesList[index].service_sub_type_value);
            }else if(this.serviceType == 'phone'){
                this.createService.controls['phoneNo'].setValue(this.categoryServicesList[index].service_sub_type_value);
            }
            this.editServiceStatus = this.categoryServicesList[index].status
            this.editServicePrivate = this.categoryServicesList[index].private_status
            this.editServiceImage = this.categoryServicesList[index].service_image
        }
        else if(type == 'subcategory'){
            if(this.subCategoryServicesList[index] && this.subCategoryServicesList[index].staffs){
                this.assignedStaff = this.subCategoryServicesList[index].staffs;
                if(this.assignedStaff != '' || this.assignedStaff != [] || this.assignedStaff != undefined){
                    this.assignedStaff.forEach(element => {
                         this.assignStaffArr.push(element.id);
                     });
                }
            }
            this.createService.controls['service_id'].setValue(this.editServiceId);
            this.createService.controls['service_name'].setValue(this.subCategoryServicesList[index].service_name);
            this.createService.controls['service_description'].setValue(this.subCategoryServicesList[index].service_description);
            this.createService.controls['service_cost'].setValue(this.subCategoryServicesList[index].service_cost);
            this.createService.controls['service_duration'].setValue(this.subCategoryServicesList[index].service_time);
            this.createService.controls['service_unit'].setValue(this.subCategoryServicesList[index].service_unit);
            this.createService.controls['serviceType'].setValue(this.subCategoryServicesList[index].service_type);
            this.serviceType = this.subCategoryServicesList[index].service_type;
            this.ftfOPT = this.subCategoryServicesList[index].service_sub_type;
            if(this.ftfOPT == 'at_home' && this.serviceType == 'face_to_face'){
                this.createService.controls["travelingTime"].setValidators(Validators.required);
                this.createService.controls["travelingTime"].updateValueAndValidity();
            }else{
                this.createService.controls["travelingTime"].setValidators(null);
                this.createService.controls["travelingTime"].updateValueAndValidity();
            }
            if(this.serviceType == 'face_to_face'){
                this.createService.controls['ftfType'].setValue(this.subCategoryServicesList[index].service_sub_type);
                if(this.ftfOPT == 'at_home' && this.serviceType == 'face_to_face'){
                    this.createService.controls['travelingTime'].setValue(this.subCategoryServicesList[index].traveling_time);
                }
            }else if(this.serviceType == 'online'){
                this.createService.controls['onlineType'].setValue(this.subCategoryServicesList[index].service_sub_type);
                this.createService.controls['onlineId'].setValue(this.subCategoryServicesList[index].service_sub_type_value);
            }else if(this.serviceType == 'phone'){
                this.createService.controls['phoneNo'].setValue(this.subCategoryServicesList[index].service_sub_type_value);
            }
            this.editServiceStatus = this.subCategoryServicesList[index].status
            this.editServicePrivate = this.subCategoryServicesList[index].private_status
            this.editServiceImage = this.subCategoryServicesList[index].service_image
        }
        if(this.serviceType == 'face_to_face'){
            if(this.createService.get('ftfType').value == 'at_home'){
                this.createService = this._formBuilder.group({
                    service_name: [this.createService.get('service_name').value, [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
                    service_description: [this.createService.get('service_description').value,  [Validators.minLength(2),Validators.maxLength(255)]],
                    service_cost: [this.createService.get('service_cost').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                    service_duration: [this.createService.get('service_duration').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                    service_unit: [this.createService.get('service_unit').value, [Validators.required, Validators.min(1), Validators.pattern(this.onlynumeric)]],
                    serviceType: [this.serviceType, [Validators.required]],
                    ftfType: [this.createService.get('ftfType').value, [Validators.required]],
                    onlineType: [this.createService.get('onlineType').value],
                    onlineId: [this.createService.get('onlineId').value],
                    phoneNo: [this.createService.get('phoneNo').value],
                    travelingTime: [this.createService.get('travelingTime').value, [Validators.required]],
                    service_id: [this.editServiceId],
                });
            }else{
                this.createService = this._formBuilder.group({
                    service_name: [this.createService.get('service_name').value, [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
                    service_description: [this.createService.get('service_description').value,  [Validators.minLength(2),Validators.maxLength(255)]],
                    service_cost: [this.createService.get('service_cost').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                    service_duration: [this.createService.get('service_duration').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                    service_unit: [this.createService.get('service_unit').value, [Validators.required, Validators.min(1), Validators.pattern(this.onlynumeric)]],
                    serviceType: [this.serviceType, [Validators.required]],
                    ftfType: [this.createService.get('ftfType').value, [Validators.required]],
                    onlineType: [this.createService.get('onlineType').value],
                    onlineId: [this.createService.get('onlineId').value],
                    phoneNo: [this.createService.get('phoneNo').value],
                    travelingTime: [null],
                    service_id: [this.editServiceId],
                });
            }

        }else if(this.serviceType == 'online'){
            this.createService = this._formBuilder.group({
                service_name: [this.createService.get('service_name').value, [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
                service_description: [this.createService.get('service_description').value,  [Validators.minLength(2),Validators.maxLength(255)]],
                service_cost: [this.createService.get('service_cost').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                service_duration: [this.createService.get('service_duration').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                service_unit: [this.createService.get('service_unit').value, [Validators.required, Validators.min(1), Validators.pattern(this.onlynumeric)]],
                serviceType: [this.serviceType, [Validators.required]],
                ftfType: [this.createService.get('ftfType').value],
                onlineType: [this.createService.get('onlineType').value, [Validators.required]],
                onlineId: [this.createService.get('onlineId').value, [Validators.required]],
                phoneNo: [this.createService.get('phoneNo').value],
                travelingTime: [null],
                service_id: [this.editServiceId],
            });
        }else if(this.serviceType == 'phone'){
            this.createService = this._formBuilder.group({
                service_name: [this.createService.get('service_name').value, [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
                service_description: [this.createService.get('service_description').value,  [Validators.minLength(2),Validators.maxLength(255)]],
                service_cost: [this.createService.get('service_cost').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                service_duration: [this.createService.get('service_duration').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                service_unit: [this.createService.get('service_unit').value, [Validators.required, Validators.min(1), Validators.pattern(this.onlynumeric)]],
                serviceType: [this.serviceType, [Validators.required]],
                ftfType: [this.createService.get('ftfType').value],
                onlineType: [this.createService.get('onlineType').value],
                onlineId: [this.createService.get('onlineId').value],
                phoneNo: [this.createService.get('phoneNo').value, [Validators.required, Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
                travelingTime: [null],
                service_id: [this.editServiceId],
            });
        }
        this.isLoaderAdmin = false;
    }
    fnDeleteService(){
        const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
            width:'400px',
            data: 'Are you sure you want to delete?',
        })

        dialogRef.afterClosed().subscribe(result =>{
            if(result){
                this.isLoaderAdmin = true;
                this.adminSettingsService.fnDeleteService(this.editServiceId).subscribe((response: any) => {
                    if (response.data == true) {
                        this._snackBar.open("Service Deleted.", "X", {
                            duration: 2000,
                            verticalPosition: 'top',
                            panelClass: ['green-snackbar']
                        });
                        this.fnAllServices();
                        if(this.createServiceCategoryType == 'category'){
                            this.fnSelectCategoryNavigation(this.selectedCategoryID,this.selectedCategoryIndex);
                            this.singleSubCategoryPage = 'services'
                        }else if(this.createServiceCategoryType == 'subcategory'){
                            this.fnSelectSubCategoryNavigate(this.selectedSubCategoryID,this.selectedSubCategoryIndex);
                            this.selectCategoryPage = 'services'
                        }
                        this.isLoaderAdmin = false;
                    }
                    else if(response.data == false && response.response !== 'api token or userid invaild'){
                        this._snackBar.open(response.response, "X", {
                        duration: 2000,
                        verticalPosition: 'top',
                        panelClass: ['red-snackbar']
                    });
                        this.isLoaderAdmin = false;
                    }
                })
            }

        });

    }

    fnExportService(){
        const options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true,
          showTitle: false,
          // title: 'Exported Service Data',
          useTextFile: false,
          useBom: true,
          useKeysAsHeaders: true,
          // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
        };
        const csvExporter = new ExportToCsv(options);
          this.isLoaderAdmin = true;
          this.adminSettingsService.fnExportService(this.businessId).subscribe((response:any) => {
            if(response.data == true){
              this.selectedServicesArr = response.response
              csvExporter.generateCsv(this.selectedServicesArr);
            }
            else if(response.data == false && response.response !== 'api token or userid invaild'){
              this._snackBar.open(response.response, "X", {
                duration: 2000,
                verticalPosition: 'top',
                panelClass : ['red-snackbar']
              });
            }
            this.isLoaderAdmin = false;
          })
        }


    ImportFileUpload() {
        const dialogRef = this.dialog.open(DialogImportServiceUpload, {
            width: '500px',
            data: {
                businessId:this.businessId,
              }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'success'){
                this.fnAllServices();
                this.fnAllCategory();
            }
        });
    }

    fnAssignStaffToService(event, staffId){
        if(event == true){
            this.assignStaffArr.push(staffId)
        }else if(event == false){
             const index = this.assignStaffArr.indexOf(staffId, 0);
            if (index > -1) {
                this.assignStaffArr.splice(index, 1);
            }
        }
    }
    fnChangeOnlineType(event){
        this.createService.controls['onlineId'].setValue('');
    }
    fnChangeFTFType(event){
        this.ftfOPT = event.value;
        if(this.ftfOPT == 'at_home'){
            this.createService.controls["travelingTime"].setValidators(Validators.required);
            this.createService.controls["travelingTime"].updateValueAndValidity();
        }else{
            this.createService.controls["travelingTime"].setValidators(null);
            this.createService.controls["travelingTime"].updateValueAndValidity();
        }
    }
    fnChangeServiceType(event){
        var elmnt = document.getElementById("create_new_service_form");
        window.scrollTo(0,elmnt.offsetHeight);
        this.serviceType= event.value
        if(this.serviceType == 'face_to_face'){
            if(this.ftfOPT == 'at_home'){
                this.createService = this._formBuilder.group({
                    service_name: [this.createService.get('service_name').value, [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
                    service_description: [this.createService.get('service_description').value,  [Validators.minLength(2),Validators.maxLength(255)]],
                    service_cost: [this.createService.get('service_cost').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                    service_duration: [this.createService.get('service_duration').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                    service_unit: [this.createService.get('service_unit').value, [Validators.required, Validators.min(1), Validators.pattern(this.onlynumeric)]],
                    serviceType: [this.serviceType, [Validators.required]],
                    ftfType: ['', [Validators.required]],
                    onlineType: [this.createService.get('onlineType').value],
                    onlineId: [this.createService.get('onlineId').value],
                    phoneNo: [this.createService.get('phoneNo').value],
                    travelingTime: [null, [Validators.required]],
                    service_id: [this.editServiceId],
                });
            }else{
                this.createService = this._formBuilder.group({
                    service_name: [this.createService.get('service_name').value, [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
                    service_description: [this.createService.get('service_description').value,  [Validators.minLength(2),Validators.maxLength(255)]],
                    service_cost: [this.createService.get('service_cost').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                    service_duration: [this.createService.get('service_duration').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                    service_unit: [this.createService.get('service_unit').value, [Validators.required, Validators.min(1), Validators.pattern(this.onlynumeric)]],
                    serviceType: [this.serviceType, [Validators.required]],
                    ftfType: ['', [Validators.required]],
                    onlineType: [this.createService.get('onlineType').value],
                    onlineId: [this.createService.get('onlineId').value],
                    phoneNo: [this.createService.get('phoneNo').value],
                    travelingTime: [null],
                    service_id: [this.editServiceId],
                });
            }
            // this.createService.get('service_name').markAsTouched();
            // this.createService.get('service_description').markAsTouched();
            // this.createService.get('service_cost').markAsTouched();
            // this.createService.get('service_duration').markAsTouched();
            // this.createService.get('service_unit').markAsTouched();
            // this.createService.get('serviceType').markAsTouched();
        }else if(this.serviceType == 'online'){
            this.createService = this._formBuilder.group({
                service_name: [this.createService.get('service_name').value, [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
                service_description: [this.createService.get('service_description').value,  [Validators.minLength(2),Validators.maxLength(255)]],
                service_cost: [this.createService.get('service_cost').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                service_duration: [this.createService.get('service_duration').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                service_unit: [this.createService.get('service_unit').value, [Validators.required, Validators.min(1), Validators.pattern(this.onlynumeric)]],
                serviceType: [this.serviceType, [Validators.required]],
                ftfType: [this.createService.get('ftfType').value],
                onlineType: [this.createService.get('onlineType').value, [Validators.required]],
                onlineId: [this.createService.get('onlineId').value, [Validators.required]],
                phoneNo: [this.createService.get('phoneNo').value],
                travelingTime: [null],
                service_id: [this.editServiceId],
            });
            // this.createService.get('service_name').markAsTouched();
            // this.createService.get('service_description').markAsTouched();
            // this.createService.get('service_cost').markAsTouched();
            // this.createService.get('service_duration').markAsTouched();
            // this.createService.get('service_unit').markAsTouched();
            // this.createService.get('serviceType').markAsTouched();
        }else if(this.serviceType == 'phone'){
            this.createService = this._formBuilder.group({
                service_name: [this.createService.get('service_name').value, [Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
                service_description: [this.createService.get('service_description').value,  [Validators.minLength(2),Validators.maxLength(255)]],
                service_cost: [this.createService.get('service_cost').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                service_duration: [this.createService.get('service_duration').value, [Validators.required, Validators.pattern(this.onlynumeric), Validators.min(1)]],
                service_unit: [this.createService.get('service_unit').value, [Validators.required, Validators.min(1), Validators.pattern(this.onlynumeric)]],
                serviceType: [this.serviceType, [Validators.required]],
                ftfType: [this.createService.get('ftfType').value],
                onlineType: [this.createService.get('onlineType').value],
                onlineId: [this.createService.get('onlineId').value],
                phoneNo: [this.createService.get('phoneNo').value, [Validators.required, Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
                travelingTime: [null],
                service_id: [this.editServiceId],
            });
            // this.createService.get('service_name').markAsTouched();
            // this.createService.get('service_description').markAsTouched();
            // this.createService.get('service_cost').markAsTouched();
            // this.createService.get('service_duration').markAsTouched();
            // this.createService.get('service_unit').markAsTouched();
            // this.createService.get('serviceType').markAsTouched();
        }
        this.scrollContainer = this.jump.nativeElement;
        console.log('1')
        this.scrollContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }


    categoryImage() {
        const dialogRef = this.dialog.open(DialogCategoryImageUpload, {
          width: '500px',

        });

         dialogRef.afterClosed().subscribe(result => {
            // if(result != undefined){
            //     this.categoryImageUrl = result;
            // }
            if(result != undefined){
                this.categoryImageUrl = result;
            }
         });
    }

    subCategoryImage() {
    const dialogRef = this.dialog.open(DialogSubCategoryImageUpload, {
        width: '500px',

    });

        dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.subCategoryImageUrl = result;
            }
        });
    }

    serviceImage() {
        const dialogRef = this.dialog.open(DialogServiceImageUpload, {
        width: '500px',

        });

        dialogRef.afterClosed().subscribe(result => {
            if(result != undefined){
                this.serviceImageUrl = result;
            }
        });
    }
}


@Component({
    selector: 'import-service-upload',
    templateUrl: '../_dialogs/import-service-upload.html',
  })
  export class DialogImportServiceUpload {

  fileToUpload:any;
  isLoaderAdmin : boolean = false;
  businessId:any;

  constructor(
    public dialogRef: MatDialogRef<DialogImportServiceUpload>,
    public http: HttpClient,
    private _snackBar: MatSnackBar,
    @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
        this.businessId = this.data.businessId;
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    private handleError(error: HttpErrorResponse) {
      return throwError('Error! something went wrong.');
    }

    handleFileInput(files): void {
      this.fileToUpload = files.item(0);
      console.log(this.fileToUpload.type);
      if(this.fileToUpload.type != "application/vnd.ms-excel" && this.fileToUpload.type != "text/csv"){
        this._snackBar.open("Please select CSV file", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
        return;
      }



    }

    fileupload(){
      console.log(this.fileToUpload.type);
      if(this.fileToUpload.type != "application/vnd.ms-excel" && this.fileToUpload.type != "text/csv"){

        this._snackBar.open("Please select CSV file", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
        return;

      }


      this.isLoaderAdmin = true;
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload);
      formData.append('business_id',JSON.parse(localStorage.getItem('business_id')));
      this.adminSettingsService.fnImportService(formData).subscribe((response:any) => {
        if(response.data == true){
            this._snackBar.open("CSV file is uploaded", "X", {
                duration: 2000,
                verticalPosition:'top',
                panelClass :['green-snackbar']
              });
            this.dialogRef.close('success');
        }
        else if(response.data == false && response.response !== 'api token or userid invaild'){
            this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
            });
        }
        this.isLoaderAdmin = false;
      })

      this.isLoaderAdmin = false;
    }

  }

      @Component({
        selector: 'category-image-upload',
        templateUrl: '../_dialogs/category-image-upload.html',
      })
      export class DialogCategoryImageUpload {

        uploadForm: FormGroup;
        imageSrc: string;
        profileImage: string;

      constructor(
        public dialogRef: MatDialogRef<DialogCategoryImageUpload>,
        private _formBuilder:FormBuilder,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

        onNoClick(): void {
            this.dialogRef.close(this.profileImage);
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

        if(event.target.files[0].type==undefined){
            return;
        }
        var file_type = event.target.files[0].type;


        if(file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){

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

        this._snackBar.open("Image selected.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
        });

      }


    }

    @Component({
        selector: 'service-image-upload',
        templateUrl: '../_dialogs/service-image-upload-dialog.html',
      })
      export class DialogServiceImageUpload {

        uploadForm: FormGroup;
        imageSrc: string;
        profileImage: string;

      constructor(
        public dialogRef: MatDialogRef<DialogServiceImageUpload>,
        private _formBuilder:FormBuilder,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

        onNoClick(): void {
            this.dialogRef.close(this.profileImage);
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

        if(file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
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
        this._snackBar.open("Image selected.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
        });
      }


    }
    @Component({
        selector: 'dialog-data-example-dialog',
        templateUrl: '../_dialogs/dialog-data-example-dialog.html',
      })
      export class DialogDataExampleDialog {
        isLoaderAdmin:boolean = false;
        businessId:any;
        search:any;
        staffList : any;
        constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _snackBar: MatSnackBar,
        @Inject(AdminSettingsService) public adminSettingsService: AdminSettingsService,
        ) {
            if (localStorage.getItem('business_id')) {
                this.businessId = localStorage.getItem('business_id');
            }
            this.fnstaffList();
        }

        fnstaffList(){
            this.isLoaderAdmin = true;
            let requestObject = {
                "business_id":this.businessId,
                "search": this.search
            }
            this.adminSettingsService.fnstaffList(requestObject).subscribe((response: any) => {
                if (response.data == true) {
                    this.staffList = response.response
                }
                else if(response.data == false && response.response !== 'api token or userid invaild'){
                     this.staffList = [];
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


    @Component({
        selector: 'sub-category-image-upload',
        templateUrl: '../_dialogs/sub-category-image-upload.html',
      })
      export class DialogSubCategoryImageUpload {

        uploadForm: FormGroup;
        imageSrc: string;
        profileImage: string;

      constructor(
        public dialogRef: MatDialogRef<DialogSubCategoryImageUpload>,
        private _formBuilder:FormBuilder,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

        onNoClick(): void {
            this.dialogRef.close(this.profileImage);
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

        if(file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
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
        this._snackBar.open("Image selected.", "X", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
        });

      }


    }



