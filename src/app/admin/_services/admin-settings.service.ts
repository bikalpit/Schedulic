import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '@app/_services';
import { DialogReAuthentication } from '@app/app.component';
import { CountryISO } from 'ngx-intl-tel-input';

@Injectable({ providedIn: 'root' })

export class AdminSettingsService {
    adminId: any
    adminToken: any;
    dialogRef: any;
    currentUser: any;
    businessId: any = localStorage.getItem('business_id') ? localStorage.getItem('business_id') : '';
    constructor(
        private http: HttpClient,
        public router: Router,
        private authenticationService: AuthenticationService,
        public dialog: MatDialog,
    ) {

        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.adminId = JSON.stringify(this.authenticationService.currentUserValue.user_id);
        this.adminToken = this.authenticationService.currentUserValue.token;
        localStorage.setItem('isBusiness', 'false');
        this.businessId = localStorage.getItem('business_id')
    }

    private handleError(error: HttpErrorResponse) {
        console.log("test----" + error);
        return throwError('Error! something went wrong.');
    }

    ngOnInit() {
        // const http$ = this.http.get<Course[]>('/api/courses'); 

        // http$.subscribe(
        //     res => console.log('HTTP response', res),
        //     err => console.log('HTTP Error', err),
        //     () => console.log('HTTP request completed.')
        // );
    }

    checkAuthentication() {
        let requestObject = {
            "user_type": this.currentUser.user_type,
            "user_id": this.currentUser.user_id,
            "token": this.currentUser.token
        };
        this.http.post(`${environment.apiUrl}/check-token`, requestObject).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError)
        ).subscribe((response: any) => {
            if (response.data == true) {
            } else if (response.data == false) {
                this.reAuthenticateUser();
            }
        }, (err) => {
            console.log(err)
        });

    }

    getTimeZone() {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/get-timezone`, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    fnAllServices(requestObject, api_url) {
        this.checkAuthentication();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${api_url}`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnExportService(BusinessId) {
        let requestObject = {
            'business_id': BusinessId,
        };
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/export-service`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    fnUpdateServiceOrder(id, order) {
        this.checkAuthentication();
        let requestObject = {
            'service_id': id,
            'order': order
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-service-order`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    fnImportService(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/service-import`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnstaffList(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));

    }

    fnAllCategory(requestObject) {
        this.checkAuthentication();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/get-categories`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getPostalCodeList(requestObject) {
        this.checkAuthentication();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/postal-code-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    createPostalCode(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-postal-code`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getPostalCodeDetail(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/get-postal-code`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    editPostalCodeDetail(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/edit-postal-code`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deletePostalCode(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/postal-code-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getStaffList(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changePostalCodeStatus(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/postal-code-status-update`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeSelectedPostalCodeStatus(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/postal-code-status-mulitiple`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getServiceForCategoiry(requestObject, api_url) {
        this.checkAuthentication();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${api_url}`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    createNewSubCategory(newSubCategoryData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-sub-category`, newSubCategoryData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    createNewCategory(newCategoryData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-category`, newCategoryData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updateCategory(updateCategoryData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-category`, updateCategoryData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updateSubCategory(updateSubCategoryData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-sub-category`, updateSubCategoryData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    deleteCategory(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/delete-category`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    changeCategoryStatus(currentCategoryStatus, categoryId) {
        this.checkAuthentication();
        let requestObject = {
            'category_id': categoryId,
            'status': currentCategoryStatus,

        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-status-category`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnServiceAction(serviceIDArr, action) {
        this.checkAuthentication();
        let requestObject = {
            'services_id': serviceIDArr,
            'action': action,

        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/multiple-action-service`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getServiceForSubCategoiry(requestObject, api_url) {
        this.checkAuthentication();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${api_url}`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    createNewService(newServiceData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-service`, newServiceData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updateService(updateServiceData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-service`, updateServiceData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    changeSubCategoryStatus(currentSubCategoryStatus, subcategoryId) {
        this.checkAuthentication();
        let requestObject = {
            'subcategory_id': subcategoryId,
            'status': currentSubCategoryStatus,

        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/update-status-subcategory`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    // changeTimeZone(requestObject) {
    //     let headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'admin-id': this.adminId,
    //         'api-token': this.adminToken
    //     });
    //     return this.http.post(`${environment.apiUrl}/timezone-change`, requestObject, { headers: headers }).pipe(
    //         map((res) => {
    //             return res;
    //         }),
    //         catchError(this.handleError));
    // }

    // getWorkingHours(requestObject) {
    //     let headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'admin-id': this.adminId,
    //         'api-token': this.adminToken
    //     });
    //     return this.http.post(`${environment.apiUrl}/business-workhour-list`, requestObject, { headers: headers }).pipe(
    //         map((res) => {
    //             return res;
    //         }),
    //         catchError(this.handleError));
    // }
    fnDeleteService(editServiceId) {
        this.checkAuthentication();
        let requestObject = {
            'service_id': editServiceId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/delete-service`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    deleteSubCategory(deleteSubCategoryId) {
        this.checkAuthentication();
        let requestObject = {
            'sub_category_id': deleteSubCategoryId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/delete-sub-category`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnAddTax(createAddTaxData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/tax-create`, createAddTaxData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getAllTax(requestObject) {
        this.checkAuthentication();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/tax-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getAllCurrencies(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/currency-get`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    //delete tax

    deleteTax(taxId) {
        this.checkAuthentication();
        let requestObject = {
            'tax_id': taxId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/tax-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    // company detail
    getCompanyDetails(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/get-business`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    gelAllCountry() {
        this.checkAuthentication();
        let requestObject = {
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/countries`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    gelAllState(country_id) {
        this.checkAuthentication();
        let requestObject = {
            'country_id': country_id
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/states`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    gelAllCities(state_id) {
        this.checkAuthentication();
        let requestObject = {
            'state_id': state_id
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(`${environment.apiUrl}/cities`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnupdateBusineData(updateCompanyDetailsData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-update`, updateCompanyDetailsData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnChangeCurrency(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-currency`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnCreateAppearance(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        // create-appearance -----old 
        return this.http.post(`${environment.apiUrl}/create-appearance-admin`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnChangeTheme(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        // set-theme-value ---- old 
        return this.http.post(`${environment.apiUrl}/set-theme-value-admin`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getSettingsValue(requestObject) {
        this.checkAuthentication();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        // get-setting-value ---- old 
        return this.http.post(`${environment.apiUrl}/get-setting-value-admin`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getThemeAppearance(requestObject) {
        this.checkAuthentication();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        // get-setting-value ---- old 
        return this.http.post(`${environment.apiUrl}/get-appearance-admin`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    // for alart ruls API
    getAlertSettingsValue(requestObject) {
        this.checkAuthentication();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        // get-setting-value ---- old get-setting-value-admin
        return this.http.post(`${environment.apiUrl}/get-setting-value`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnCurrencyFormat(requestObject) {
        this.checkAuthentication();

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-currency-format`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnCurrencyPosition(requestObject) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/create-currency-position`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnFormSetting(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        // set-form-settings   ---old
        return this.http.post(`${environment.apiUrl}/set-form-settings-admin`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    // Staff Module
    getAllStaff(requestObject, api_url) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${api_url}`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnActionStaff(action, staffId) {
        this.checkAuthentication();
        let requestObject = {
            'status': action,
            'staff_id': staffId,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-status-change`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    fnRemovedocument(document_id) {
        this.checkAuthentication();
        let requestObject = {
            'document_id': document_id,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/remove-document`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    fnViewSingleStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-details`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeTimeZone(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/timezone-change`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getWorkingHours(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-workhour-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    createWorkingHours(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-workhour-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    applyToAll(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/workhour-applyall`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    applyToAllBreaks(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/break-applyall`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getBussinessTimeZone(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/timezone-get`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getTimeOffList(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-timeoff-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deleteTimeOff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-timeoff-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeTimeOffStatus(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-timeoff-status-update`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    addNewTimeOff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-timeoff-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getBreakTimeList(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-breaktime-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    addNewBreak(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-breaktime-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    addNewWorkingHours(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-working-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    addNewWorkingHoursStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-working-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deleteBreak(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-breaktime-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deleteWorkingHours(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/business-working-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    setMinAdvBookingTime(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-min-advance-booking-time`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    setMaxAdvBookingTime(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-max-advance-booking-time`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    setTimeInterval(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-time-interval-slots`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    setCancellationBufferTime(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-cancel-buffer-time`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    setMinResedulingTime(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-min-reseduling-time`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeCustomerLoginStatus(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-customer-login-status`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeStaffOnFrontStatus(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-staff-list-front`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    updateAppAutoConfirmSettings(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-auto-confirm`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeCustomerAllowStaffRatingStatus(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-customer-allow-staff-rating`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeOwAndgtNotificationStatus(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-ow-and-gt-notification`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    updateTermsConditionsStatusValues(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-terms-conditions`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    updatePrivacyPolicyStatusValues(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-privacy-policy`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    updateThankyouPageStatusValues(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/set-thank-you`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getSettingValue(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/get-setting-value`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnChangeInternalStaff(status, staffId) {
        this.checkAuthentication();
        let requestObject = {
            'staff_id': staffId,
            'internal_staff': status,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-internal`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnChangeLoginAllowStaff(status, staffId) {
        this.checkAuthentication();
        let requestObject = {
            'staff_id': staffId,
            'login_allowed': status,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-login-allowed`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnAssignPostalToStaff(status, postalCodeId, staffId) {
        this.checkAuthentication();
        let requestObject = {
            'staff_id': staffId,
            'postalCodes': postalCodeId,
            'status': status,
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-postalcode-update`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnAssignServiceToStaff(status, serviceId, staffId) {
        this.checkAuthentication();
        let requestObject = {
            'staff_id': staffId,
            'service_id': serviceId,
            'status': JSON.stringify(status),
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-service-attach`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    createWorkingHoursStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-working-hour-update`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    applyToAllStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-working-hour-applyall`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    applyBreaksToAllStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/break-applyall`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    workingHoursResetToDefault(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-working-hour-default`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    addNewBreakStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-break-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deleteBreakStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-break-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    resetToDefaultBreakStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-break-default`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    deleteTimeOffStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-timeoff-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    changeTimeOffStatusStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-timeoff-status`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    addNewTimeOffStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-timeoff-create`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    resetToDefaultTimeOffStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-timeoff-default`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    createNewStaff(newStaffData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-create`, newStaffData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnDeleteStaff(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-delete`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    updateStaff(updateStaffData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/staff-update`, updateStaffData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    // get category and services

    getCateServiceList(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': this.adminId,
            'api-token': this.adminToken
        });
        return this.http.post(`${environment.apiUrl}/get-category-service`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    viewStaffReviewDetail(orderId) {
        this.checkAuthentication();
        let requestObject = {
            'order_item_id': orderId,
        };
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/rating-orderinfo`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnAppointmentsReminderCustomer(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-email-alert-setting-customer`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnUpdateStaffEmailAlert(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-email-alert-setting-staff`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnUpdateAdminEmailAlert(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-email-alert-setting-admin`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnSubmitCustomizeAlert(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-customize-email-alert`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnSubmitSmtpSetting(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-smtp-setting`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getEmailTemplates(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/get-email-template`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnUpdateEmailTemp(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/update-email-template`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnChangeTemStatus(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/update-email-template-status`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnDefaultEmailTemp(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/default-email-message`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnUpdateSmsAlert(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-sms-reminder`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getSmsTemplates(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/get-sms-template`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnChangeSmsTemStatus(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/update-sms-status-template`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnDefaultSmsTemp(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-default-sms-template`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnUpdateSmsTemp(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/update-sms-template`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updatePaypalSetting(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-paypal`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updateStripeSetting(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-stripe`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updatePayumoneySetting(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-payumoney`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updateBankTransferSetting(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-bank-transfer`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updateTwillioSettings(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-twilo-sms`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updateNexmoSettings(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-nexmo-sms`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    updateTextLocalSettings(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-textlocal-sms`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    sendEmailVerification(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/send-verification-email`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    sendPhoneVerification(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/send-verification-sms`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    postalCodeSearch(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/search-postal-code`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    staffSearch(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/search-staff`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    fnChangePostalCodeCheck(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/set-postal-code-check`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getSubscriptionPlans(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/plan-list`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    cancelSubscriptionPlans(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/admin-cancel-plan`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    fnChangePlan(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/admin-change-plan`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }
    getSubscriptionPayment(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/admin-card-details`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    getAllPaymentGateways(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/showAllPaymentGateway`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    ChangeDefaultGateway(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/makeDefaultPaymentGatway`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    ChangeGatewayStatus(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/changeStatusPaymentGateway`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    UpdatePaymentGateway(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/savePaymentGateway`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    onRemoveProfile(requestObject) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'admin-id': this.adminId,
            'api-token': this.adminToken,
            'Content-Type': 'application/json'
        });
        return this.http.post(`${environment.apiUrl}/remove-profile-image`, requestObject, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }

    reAuthenticateUser() {
        if (this.dialogRef) {
            return
        };
        this.dialogRef = this.dialog.open(DialogReAuthentication, {
            width: '500px',

        });

        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.currentUser = result
                console.log(this.currentUser)
            } else {
                this.authenticationService.logout();
                this.router.navigate(['/login']);
            }
        });
    }

    removeImage(newCustomerData) {
        this.checkAuthentication();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id': JSON.stringify(this.currentUser.user_id),
            'api-token': this.currentUser.token
        });
        return this.http.post(`${environment.apiUrl}/remove-profile-image`, newCustomerData, { headers: headers }).pipe(
            map((res) => {
                return res;
            }),
            catchError(this.handleError));
    }


    fncountySelected(countryCode) {

        if (countryCode == 1) { return CountryISO.Afghanistan; }
        if (countryCode == 2) { return CountryISO.Albania; }
        if (countryCode == 3) { return CountryISO.Algeria; }
        if (countryCode == 4) { return CountryISO.AmericanSamoa; }
        if (countryCode == 5) { return CountryISO.Andorra; }
        if (countryCode == 6) { return CountryISO.Angola; }
        if (countryCode == 7) { return CountryISO.Anguilla; }
        if (countryCode == 8) { return CountryISO.Argentina; }
        if (countryCode == 9) { return CountryISO.AntiguaAndBarbuda; }
        if (countryCode == 10) { return CountryISO.Argentina; }
        if (countryCode == 11) { return CountryISO.Armenia; }
        if (countryCode == 12) { return CountryISO.Aruba; }
        if (countryCode == 13) { return CountryISO.Australia; }
        if (countryCode == 14) { return CountryISO.Austria; }
        if (countryCode == 15) { return CountryISO.Azerbaijan; }
        if (countryCode == 16) { return CountryISO.Bahamas; }
        if (countryCode == 17) { return CountryISO.Bahrain; }
        if (countryCode == 18) { return CountryISO.Bangladesh; }
        if (countryCode == 19) { return CountryISO.Barbados; }
        if (countryCode == 20) { return CountryISO.Belarus; }
        if (countryCode == 21) { return CountryISO.Belgium; }
        if (countryCode == 22) { return CountryISO.Belize; }
        if (countryCode == 23) { return CountryISO.Benin; }
        if (countryCode == 24) { return CountryISO.Bermuda; }
        if (countryCode == 25) { return CountryISO.Bhutan; }
        if (countryCode == 26) { return CountryISO.Bolivia; }
        if (countryCode == 27) { return CountryISO.BosniaAndHerzegovina; }
        if (countryCode == 28) { return CountryISO.Botswana; }
        //if(countryCode==29){ return CountryISO.BouvetIsland;  }
        if (countryCode == 30) { return CountryISO.Brazil; }
        if (countryCode == 31) { return CountryISO.BritishIndianOceanTerritory; }
        if (countryCode == 32) { return CountryISO.Brunei; }
        if (countryCode == 33) { return CountryISO.Bulgaria; }
        if (countryCode == 34) { return CountryISO.BurkinaFaso; }
        if (countryCode == 35) { return CountryISO.Burundi; }
        if (countryCode == 36) { return CountryISO.Cambodia; }
        if (countryCode == 37) { return CountryISO.Cameroon; }
        if (countryCode == 38) { return CountryISO.Canada; }
        if (countryCode == 39) { return CountryISO.CapeVerde; }
        if (countryCode == 40) { return CountryISO.CaymanIslands; }
        if (countryCode == 41) { return CountryISO.CentralAfricanRepublic; }
        if (countryCode == 42) { return CountryISO.Chad; }
        if (countryCode == 43) { return CountryISO.Chile; }
        if (countryCode == 44) { return CountryISO.China; }
        if (countryCode == 45) { return CountryISO.ChristmasIsland; }
        if (countryCode == 46) { return CountryISO.Cocos; }
        if (countryCode == 47) { return CountryISO.Colombia; }
        if (countryCode == 48) { return CountryISO.Comoros; }
        //if(countryCode==49){ return CountryISO.Congo;  }
        //if(countryCode==50){ return CountryISO.Congo The Democratic Republic Of The;  }
        if (countryCode == 51) { return CountryISO.CookIslands; }
        if (countryCode == 52) { return CountryISO.CostaRica; }
        //if(countryCode==53){ return CountryISO.Cote D'Ivoire (Ivory Coast);  }
        if (countryCode == 54) { return CountryISO.Croatia; }
        if (countryCode == 55) { return CountryISO.Cuba; }
        if (countryCode == 56) { return CountryISO.Cyprus; }
        if (countryCode == 57) { return CountryISO.CzechRepublic; }
        if (countryCode == 58) { return CountryISO.Denmark; }
        if (countryCode == 59) { return CountryISO.Djibouti; }
        if (countryCode == 60) { return CountryISO.Dominica; }
        if (countryCode == 61) { return CountryISO.DominicanRepublic; }
        // if(countryCode==62){ return CountryISO.EastTimor;  }
        if (countryCode == 63) { return CountryISO.Ecuador; }
        if (countryCode == 64) { return CountryISO.Egypt; }
        if (countryCode == 65) { return CountryISO.ElSalvador; }
        if (countryCode == 66) { return CountryISO.EquatorialGuinea; }
        if (countryCode == 67) { return CountryISO.Eritrea; }
        if (countryCode == 68) { return CountryISO.Estonia; }
        if (countryCode == 69) { return CountryISO.Ethiopia; }
        //if(countryCode==70){ return CountryISO.ExternalTerritoriesofAustralia;  }
        if (countryCode == 71) { return CountryISO.FalklandIslands; }
        if (countryCode == 72) { return CountryISO.FaroeIslands; }
        if (countryCode == 73) { return CountryISO.Fiji; }
        if (countryCode == 74) { return CountryISO.Finland; }
        if (countryCode == 75) { return CountryISO.France; }
        if (countryCode == 76) { return CountryISO.FrenchGuiana; }
        if (countryCode == 77) { return CountryISO.FrenchPolynesia; }
        //if(countryCode==78){ return CountryISO.FrenchSouthernTerritories;  }
        if (countryCode == 79) { return CountryISO.Gabon; }
        if (countryCode == 80) { return CountryISO.Gambia; }
        if (countryCode == 81) { return CountryISO.Georgia; }
        if (countryCode == 82) { return CountryISO.Germany; }
        if (countryCode == 83) { return CountryISO.Ghana; }
        if (countryCode == 84) { return CountryISO.Gibraltar; }
        if (countryCode == 85) { return CountryISO.Greece; }
        if (countryCode == 86) { return CountryISO.Greenland; }
        if (countryCode == 87) { return CountryISO.Grenada; }
        if (countryCode == 88) { return CountryISO.Guadeloupe; }
        if (countryCode == 89) { return CountryISO.Guam; }
        if (countryCode == 90) { return CountryISO.Guatemala; }
        //  if(countryCode==91){ return CountryISO.GuernseyandAlderney;  }
        if (countryCode == 92) { return CountryISO.Guinea; }
        if (countryCode == 93) { return CountryISO.GuineaBissau; }
        if (countryCode == 94) { return CountryISO.Guyana; }
        if (countryCode == 95) { return CountryISO.Haiti; }
        //if(countryCode==96){ return CountryISO.HeardandMcDonaldIslands;  }
        if (countryCode == 97) { return CountryISO.Honduras; }
        //  if(countryCode==98){ return CountryISO.HongKongS.A.R.;  }
        if (countryCode == 99) { return CountryISO.Hungary; }
        if (countryCode == 100) { return CountryISO.Iceland; }
        if (countryCode == 101) { return CountryISO.India; }
        if (countryCode == 102) { return CountryISO.Indonesia; }
        if (countryCode == 103) { return CountryISO.Iran; }
        if (countryCode == 104) { return CountryISO.Iraq; }
        if (countryCode == 105) { return CountryISO.Ireland; }
        if (countryCode == 106) { return CountryISO.Israel; }
        if (countryCode == 107) { return CountryISO.Italy; }
        if (countryCode == 108) { return CountryISO.Jamaica; }
        if (countryCode == 109) { return CountryISO.Japan; }
        if (countryCode == 110) { return CountryISO.Jersey; }
        if (countryCode == 111) { return CountryISO.Jordan; }
        if (countryCode == 112) { return CountryISO.Kazakhstan; }
        if (countryCode == 113) { return CountryISO.Kenya; }
        if (countryCode == 114) { return CountryISO.Kiribati; }
        if (countryCode == 115) { return CountryISO.NorthKorea; }
        if (countryCode == 116) { return CountryISO.SouthKorea; }
        if (countryCode == 117) { return CountryISO.Kuwait; }
        if (countryCode == 118) { return CountryISO.Kyrgyzstan; }
        if (countryCode == 119) { return CountryISO.Laos; }
        if (countryCode == 120) { return CountryISO.Latvia; }
        if (countryCode == 121) { return CountryISO.Lebanon; }
        if (countryCode == 122) { return CountryISO.Lesotho; }
        if (countryCode == 123) { return CountryISO.Liberia; }
        if (countryCode == 124) { return CountryISO.Libya; }
        if (countryCode == 125) { return CountryISO.Liechtenstein; }
        if (countryCode == 126) { return CountryISO.Lithuania; }
        if (countryCode == 127) { return CountryISO.Luxembourg; }
        if (countryCode == 128) { return CountryISO.Macau; }
        if (countryCode == 129) { return CountryISO.Macedonia; }
        if (countryCode == 130) { return CountryISO.Madagascar; }
        if (countryCode == 131) { return CountryISO.Malawi; }
        if (countryCode == 132) { return CountryISO.Malaysia; }
        if (countryCode == 133) { return CountryISO.Maldives; }
        if (countryCode == 134) { return CountryISO.Mali; }
        if (countryCode == 135) { return CountryISO.Malta; }
        //if(countryCode==136){ return CountryISO.Man;  }
        if (countryCode == 137) { return CountryISO.MarshallIslands; }
        if (countryCode == 138) { return CountryISO.Martinique; }
        if (countryCode == 139) { return CountryISO.Mauritania; }
        if (countryCode == 140) { return CountryISO.Mauritius; }
        if (countryCode == 141) { return CountryISO.Mayotte; }
        if (countryCode == 142) { return CountryISO.Mexico; }
        if (countryCode == 143) { return CountryISO.Micronesia; }
        if (countryCode == 144) { return CountryISO.Moldova; }
        if (countryCode == 145) { return CountryISO.Monaco; }
        if (countryCode == 146) { return CountryISO.Mongolia; }
        if (countryCode == 147) { return CountryISO.Montserrat; }
        if (countryCode == 148) { return CountryISO.Morocco; }
        if (countryCode == 149) { return CountryISO.Mozambique; }
        if (countryCode == 150) { return CountryISO.Myanmar; }
        if (countryCode == 151) { return CountryISO.Namibia; }
        if (countryCode == 152) { return CountryISO.Nauru; }
        if (countryCode == 153) { return CountryISO.Nepal; }
        if (countryCode == 154) { return CountryISO.Netherlands; }
        if (countryCode == 155) { return CountryISO.CaribbeanNetherlands; }
        if (countryCode == 156) { return CountryISO.NewCaledonia; }
        if (countryCode == 157) { return CountryISO.NewZealand; }
        if (countryCode == 158) { return CountryISO.Nicaragua; }
        if (countryCode == 159) { return CountryISO.Niger; }
        if (countryCode == 160) { return CountryISO.Nigeria; }
        if (countryCode == 161) { return CountryISO.Niue; }
        if (countryCode == 162) { return CountryISO.NorfolkIsland; }
        if (countryCode == 163) { return CountryISO.NorthernMarianaIslands; }
        if (countryCode == 164) { return CountryISO.Norway; }
        if (countryCode == 165) { return CountryISO.Oman; }
        if (countryCode == 166) { return CountryISO.Pakistan; }
        if (countryCode == 167) { return CountryISO.Palau; }
        //if(countryCode==168){ return CountryISO.PalestinianTerritoryOccupied;  }
        if (countryCode == 169) { return CountryISO.Panama; }
        if (countryCode == 170) { return CountryISO.PapuaNewGuinea; }
        if (countryCode == 171) { return CountryISO.Paraguay; }
        if (countryCode == 172) { return CountryISO.Peru; }
        if (countryCode == 173) { return CountryISO.Philippines; }
        //if(countryCode==174){ return CountryISO.PitcairnIsland;  }
        if (countryCode == 175) { return CountryISO.Poland; }
        if (countryCode == 176) { return CountryISO.Portugal; }
        if (countryCode == 177) { return CountryISO.PuertoRico; }
        if (countryCode == 178) { return CountryISO.Qatar; }
        //if(countryCode==179){ return CountryISO.Reunion;  }
        if (countryCode == 180) { return CountryISO.Romania; }
        if (countryCode == 181) { return CountryISO.Russia; }
        if (countryCode == 182) { return CountryISO.Rwanda; }
        if (countryCode == 183) { return CountryISO.SaintHelena; }
        if (countryCode == 184) { return CountryISO.SaintKittsAndNevis; }
        if (countryCode == 185) { return CountryISO.SaintLucia; }
        if (countryCode == 186) { return CountryISO.SaintPierreAndMiquelon; }
        //if(countryCode==187){ return CountryISO.Saint VincentAndTheGrenadines;  }
        if (countryCode == 188) { return CountryISO.Samoa; }
        if (countryCode == 189) { return CountryISO.SanMarino; }
        if (countryCode == 190) { return CountryISO.SaintPierreAndMiquelon; }
        if (countryCode == 191) { return CountryISO.SaudiArabia; }
        if (countryCode == 192) { return CountryISO.Senegal; }
        if (countryCode == 193) { return CountryISO.Serbia; }
        if (countryCode == 194) { return CountryISO.Seychelles; }
        if (countryCode == 195) { return CountryISO.SierraLeone; }
        if (countryCode == 196) { return CountryISO.Singapore; }
        if (countryCode == 197) { return CountryISO.Slovakia; }
        if (countryCode == 198) { return CountryISO.Slovenia; }
        //if(countryCode==199){ return CountryISO.SmallerTerritoriesoftheUK;  }
        if (countryCode == 200) { return CountryISO.SolomonIslands; }
        if (countryCode == 201) { return CountryISO.Somalia; }
        if (countryCode == 202) { return CountryISO.SouthAfrica; }
        if (countryCode == 203) { return CountryISO.Georgia; }
        if (countryCode == 204) { return CountryISO.SouthSudan }
        if (countryCode == 205) { return CountryISO.Spain; }
        if (countryCode == 206) { return CountryISO.SriLanka; }
        if (countryCode == 207) { return CountryISO.Sudan; }
        if (countryCode == 208) { return CountryISO.Suriname; }
        if (countryCode == 209) { return CountryISO.SvalbardAndJanMayen; }
        if (countryCode == 210) { return CountryISO.Swaziland; }
        if (countryCode == 211) { return CountryISO.Sweden; }
        if (countryCode == 212) { return CountryISO.Switzerland; }
        if (countryCode == 213) { return CountryISO.Syria; }
        if (countryCode == 214) { return CountryISO.Taiwan; }
        if (countryCode == 215) { return CountryISO.Tajikistan; }
        if (countryCode == 216) { return CountryISO.Tanzania; }
        if (countryCode == 217) { return CountryISO.Thailand; }
        if (countryCode == 218) { return CountryISO.Togo; }
        if (countryCode == 219) { return CountryISO.Tokelau; }
        if (countryCode == 220) { return CountryISO.Tonga; }
        if (countryCode == 221) { return CountryISO.TrinidadAndTobago; }
        if (countryCode == 222) { return CountryISO.Tunisia; }
        if (countryCode == 223) { return CountryISO.Turkey; }
        if (countryCode == 224) { return CountryISO.Turkmenistan; }
        if (countryCode == 225) { return CountryISO.TurksAndCaicosIslands; }
        if (countryCode == 226) { return CountryISO.Tuvalu; }
        if (countryCode == 227) { return CountryISO.Uganda; }
        if (countryCode == 228) { return CountryISO.Ukraine; }
        if (countryCode == 229) { return CountryISO.UnitedArabEmirates; }
        if (countryCode == 230) { return CountryISO.UnitedKingdom; }
        if (countryCode == 231) { return CountryISO.UnitedStates; }
        if (countryCode == 232) { return CountryISO.UnitedStates; }
        if (countryCode == 233) { return CountryISO.Uruguay; }
        if (countryCode == 234) { return CountryISO.Uzbekistan; }
        if (countryCode == 235) { return CountryISO.Vanuatu; }
        if (countryCode == 236) { return CountryISO.VaticanCity; }
        if (countryCode == 237) { return CountryISO.Venezuela; }
        if (countryCode == 238) { return CountryISO.Vietnam; }
        if (countryCode == 239) { return CountryISO.BritishVirginIslands; }
        //if(countryCode==240){ return CountryISO.VirginIslands;  }
        if (countryCode == 241) { return CountryISO.WallisAndFutuna; }
        if (countryCode == 242) { return CountryISO.WesternSahara; }
        if (countryCode == 243) { return CountryISO.Yemen; }
        //if(countryCode==244){ return CountryISO.Yugoslavia;  }
        if (countryCode == 245) { return CountryISO.Zambia; }
        if (countryCode == 246) { return CountryISO.Zimbabwe; }


    }

}