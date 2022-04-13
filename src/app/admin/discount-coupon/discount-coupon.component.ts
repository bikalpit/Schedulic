import { Component, OnInit, Inject } from "@angular/core";
import { AdminService } from "../_services/admin-main.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DatePipe } from "@angular/common";
import { AppComponent } from "@app/app.component";
import { environment } from "@environments/environment";
import { ConfirmationDialogComponent } from '../../_components/confirmation-dialog/confirmation-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '@app/my-date-formats';

export interface DialogData {
  animal: string;
}

@Component({
  selector: "app-discount-coupon",
  templateUrl: "./discount-coupon.component.html",
  styleUrls: ["./discount-coupon.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DatePipe
  ]
})
export class DiscountCouponComponent implements OnInit {
  adminSettings: boolean = false;
  isLoaderAdmin: boolean = false;
  animal: any;
  couponListFilter: any;
  couponCodeListing: boolean = true;
  addNewCouponCode: boolean = false;
  couponCodeStatus: any;
  allCouponCode: any;
  CategorySelect: boolean = false;
  createdCouponCodeData: any;
  businessId: any;
  valid_from: any;
  valid_till: any;
  selectedService: any = [];
  categoryServiceList: any = "";
  categoryServiceCheckCatId: any = [];
  categoryServiceChecksubCatId: any = [];
  categoryServiceCheckServiceId: any = [];
  categoryServiceListTemp: any = [];
  minDate = new Date();
  discountCoupon: FormGroup;
  emailFormat =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  onlynumeric = /^-?(0|[1-9]\d*)?$/;
  search: any;
  current_page: any;
  first_page_url: any;
  last_page: any;
  totalRecord: any;
  fromRecord: any;
  toRecord: any;
  last_page_url: any;
  next_page_url: any;
  prev_page_url: any;
  discountType: any = "P";
  path: any;
  searchService: any;
  searchedServices: boolean = false;
  minTillDate: any = new Date();
  discountApiUrl: any = `${environment.apiUrl}/discount-coupon-list`;
  diccount_error: boolean = false;
  settingsArr: any;
  currencySymbol: any;
  currencySymbolPosition: any;
  currencySymbolFormat: any;
  singleCouponDetail: any;

  constructor(
    private AdminService: AdminService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private appComponent: AppComponent
  ) {
    localStorage.setItem("isBusiness", "false");
    if (localStorage.getItem("business_id")) {
      this.businessId = localStorage.getItem("business_id");
    }
    let addNewAction = window.location.search.split("?coupon");
    if (addNewAction.length > 1) {
      this.fnNewCouponCode();
    }
  }

  ngOnInit() {
    this.couponListFilter = "All";
    this.getAllCouponCode();
    this.fnGetSettingValue();
    this.discountCoupon = this._formBuilder.group({
      coupan_name: ["", [Validators.required, Validators.maxLength(15)]],
      max_redemption: [
        "",
        [Validators.required, Validators.pattern(this.onlynumeric)],
      ],
      coupon_code: ["", [Validators.required, Validators.maxLength(15)]],
      valid_from: ["", Validators.required],
      discount_type: ["", Validators.required],
      valid_till: ["", Validators.required],
      discount_value: [
        "",
        [Validators.required, Validators.pattern(this.onlynumeric)],
      ],
      //user_Mobile : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }

  Search(value) {
    this.search = value;
    this.discountApiUrl = `${environment.apiUrl}/discount-coupon-list`;
    this.getAllCouponCode();
  }

  fnGetSettingValue() {
    let requestObject = {
      business_id: this.businessId,
    };
    this.AdminService.getSettingValue(requestObject).subscribe(
      (response: any) => {
        if (response.data == true && response.response != "") {
          this.settingsArr = response.response;
          this.currencySymbol = this.settingsArr.currency;
          this.currencySymbolPosition =
            this.settingsArr.currency_symbol_position;
          this.currencySymbolFormat = this.settingsArr.currency_format;
        } else if (
          response.data == false &&
          response.response !== "api token or userid invaild"
        ) {
        }
      }
    );
  }

  getAllCouponCode() {
    this.isLoaderAdmin = true;
    let requestObject = {
      business_id: this.businessId,
      filter: this.couponListFilter,
      search: this.search,
    };

    this.AdminService.getAllCouponCode(
      this.discountApiUrl,
      requestObject
    ).subscribe((response: any) => {
      if (response.data == true) {
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

        this.allCouponCode = response.response.data;

        this.allCouponCode.forEach((element) => {
          element.coupon_valid_from = this.datePipe.transform(
            new Date(element.coupon_valid_from),
            "yyyy/MM/dd"
          );
          element.coupon_valid_till = this.datePipe.transform(
            new Date(element.coupon_valid_till),
            "yyyy/MM/dd"
          );
          element.created_at = this.datePipe.transform(
            new Date(element.created_at),
            "yyyy/MM/dd"
          );
        });
      } else if (
        response.data == false &&
        response.response !== "api token or userid invaild"
      ) {
        this.fromRecord = 0;
        this.toRecord = 0;
        this.totalRecord = 0;
        this.allCouponCode = "";
      }
      this.isLoaderAdmin = false;
    });
  }

  navigateTo(api_url) {
    this.discountApiUrl = api_url;
    if (this.discountApiUrl) {
      this.getAllCouponCode();
    }
  }

  navigateToPageNumber(index) {
    this.discountApiUrl = this.path + "?page=" + index;
    if (this.discountApiUrl) {
      this.getAllCouponCode();
    }
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  discount_check() {
    var discount_type = this.discountCoupon.get("discount_type").value;
    var discount_value = this.discountCoupon.get("discount_value").value;

    if (discount_type == "P" && discount_value > 100) {
      this.diccount_error = true;
    } else {
      this.diccount_error = false;
    }
  }

  fnvalideFrom() {
    this.minTillDate = this.discountCoupon.get("valid_from").value;
    this.discountCoupon.get("valid_till").setValue("");
  }


  fnCreateCouponSubmit() {
    console.log('this.discountCoupon:', this.discountCoupon.valid);
    // debugger
    if (this.discountCoupon.valid) {
      this.valid_from = this.discountCoupon.get("valid_from").value;
      this.valid_till = this.discountCoupon.get("valid_till").value;

      if (this.valid_from > this.valid_till) {
        this._snackBar.open("Please select valid till date.", "X", {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
        return;
      }

      this.valid_from = this.datePipe.transform(
        new Date(this.valid_from),
        "yyyy/MM/dd"
      );
      this.valid_till = this.datePipe.transform(
        new Date(this.valid_till),
        "yyyy/MM/dd"
      );

      var discount_type = this.discountCoupon.get("discount_type").value;
      var discount_value = this.discountCoupon.get("discount_value").value;
      if (discount_type == "P" && discount_value > 100) {
        this.diccount_error = true;
        return;
      } else {
        this.diccount_error = false;
      }

      this.createdCouponCodeData = {
        business_id: this.businessId,
        coupon_name: this.discountCoupon.get("coupan_name").value,
        coupon_code: this.discountCoupon.get("coupon_code").value,
        coupon_max_redemptions: this.discountCoupon.get("max_redemption").value,
        valid_from: this.valid_from,
        valid_till: this.valid_till,
        discount_type: this.discountCoupon.get("discount_type").value,
        discount: this.discountCoupon.get("discount_value").value,
        services: this.categoryServiceCheckServiceId,
      };
      if (this.categoryServiceCheckServiceId != "") {
        if (this.singleCouponDetail) {
          // alert('okay')
          this.createdCouponCodeData["coupon_id"] = this.singleCouponDetail.id;
          this.updateCouponCode(this.createdCouponCodeData);
        } else {
          this.createNewCouponCode(this.createdCouponCodeData);
        }
      } else if (this.categoryServiceCheckServiceId == "") {
        this._snackBar.open("Select At Lease 1 Service.", "X", {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
      }
    } else {
      this.discountCoupon.get("coupan_name").markAsTouched();
      this.discountCoupon.get("coupon_code").markAsTouched();
      this.discountCoupon.get("max_redemption").markAsTouched();
      this.discountCoupon.get("discount_type").markAsTouched();
      this.discountCoupon.get("valid_from").markAsTouched();
      this.discountCoupon.get("valid_till").markAsTouched();
      this.discountCoupon.get("discount_value").markAsTouched();
    }
  }

  fnChangeDiscountType(event) {
    this.discountType = event.value;
  }

  createNewCouponCode(createdCouponCodeData) {
    this.isLoaderAdmin = true;
    this.AdminService.createNewCouponCode(createdCouponCodeData).subscribe(
      (response: any) => {
        if (response.data == true) {
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["green-snackbar"],
          });
          this.couponCodeListing = true;
          this.discountCoupon.reset();
          this.categoryServiceCheckServiceId.length = 0;
          this.getAllCouponCode();
          this.addNewCouponCode = false;
          this.isLoaderAdmin = false;
        } else if (
          response.data == false &&
          response.response !== "api token or userid invaild"
        ) {
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          this.isLoaderAdmin = false;
        }
      }
    );
  }

  updateCouponCode(createdCouponCodeData) {
    this.isLoaderAdmin = true;
    this.AdminService.updateCouponCode(createdCouponCodeData).subscribe(
      (response: any) => {
        if (response.data == true) {
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["green-snackbar"],
          });
          this.couponCodeListing = true;
          this.discountCoupon.reset();
          this.singleCouponDetail = null;
          this.categoryServiceCheckServiceId.length = 0;
          this.getAllCouponCode();
          this.addNewCouponCode = false;
          this.isLoaderAdmin = false;
        } else if (
          response.data == false &&
          response.response !== "api token or userid invaild"
        ) {
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          this.isLoaderAdmin = false;
        }
      }
    );
  }

  fnStatusChange(status) {
    this.couponListFilter = status;
    this.discountApiUrl = `${environment.apiUrl}/discount-coupon-list`;
    this.getAllCouponCode();
  }

  changeCouponStaus(event, coupon_id) {
    this.isLoaderAdmin = true;
    if (event.checked == true) {
      this.couponCodeStatus = "Active";
    } else if (event.checked == false) {
      this.couponCodeStatus = "Inactive";
    }
    this.AdminService.changeCouponStaus(
      this.couponCodeStatus,
      coupon_id
    ).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Status Updated.", "X", {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["green-snackbar"],
        });

        this.getAllCouponCode();
        this.isLoaderAdmin = false;
      } else if (
        response.data == false &&
        response.response !== "api token or userid invaild"
      ) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
        this.isLoaderAdmin = false;
      }
    });
  }

  getCateServiceList() {
    let requestObject = {
      business_id: this.businessId,
      search: "",
    };

    this.isLoaderAdmin = true;
    this.AdminService.getCateServiceList(requestObject).subscribe(
      (response: any) => {
        if (response.data == true) {
          this.categoryServiceList = response.response;
          this.categoryServiceList.forEach((element) => {
            element.is_selected = false;
            let subCategoryLength = element.subcategory.length;
            let selectedSubCategoryCount = 0;

            element.subcategory.forEach((subelement) => {
              subelement.is_selected = false;
              let serviceLength = subelement.services.length;
              let selectedServiceCount = 0;

              subelement.services.forEach((serviceselement) => {
                serviceselement.is_selected = false;
                // categoryServiceList
                const index = this.categoryServiceCheckServiceId.indexOf(serviceselement.id, 0);
                if (index > -1) {
                  this.categoryServiceCheckServiceId.push(serviceselement.id);
                  serviceselement.is_selected = true;
                  selectedServiceCount++;
                }
                if (!this.singleCouponDetail) {
                  serviceselement.is_selected = true;
                  this.categoryServiceCheckServiceId.push(serviceselement.id);
                }
              });
              if (selectedServiceCount != 0 && selectedServiceCount == serviceLength) {
                subelement.is_selected = true;
                selectedSubCategoryCount++;
              }
              if (!this.singleCouponDetail) {
                subelement.is_selected = true;
              }
            });
            if (selectedSubCategoryCount != 0 && selectedSubCategoryCount == subCategoryLength) {
              element.is_selected = true;
            }
            if (!this.singleCouponDetail) {
              element.is_selected = true;
            }

            if (element.getservices.length > 0) {
              let dserviceLength = element.getservices.length;
              let dselectedServiceCount = 0;
              element.getservices.forEach(serviceselement => {
                serviceselement.is_selected = false;
                const index = this.categoryServiceCheckServiceId.indexOf(serviceselement.id, 0);
                if (index > -1) {
                  this.categoryServiceCheckServiceId.push(serviceselement.id);
                  serviceselement.is_selected = true;
                  dselectedServiceCount++;
                }
                if (!this.singleCouponDetail) {
                  serviceselement.is_selected = true;
                  this.categoryServiceCheckServiceId.push(serviceselement.id);
                }
              });
              if (dserviceLength == dselectedServiceCount) {
                element.is_selected = true;
              }
            }

          });

          this.categoryServiceListTemp = this.categoryServiceList;

          this.isLoaderAdmin = false;
        } else if (
          response.data == false &&
          response.response !== "api token or userid invaild"
        ) {
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          this.categoryServiceList = [];
          this.categoryServiceListTemp = [];
          this.isLoaderAdmin = false;
        }
      }
    );
  }

  checkServie(event, type, index, sub_index = null, service_index = null) {
    if (type == "category") {
      if (event.checked == true) {
        this.categoryServiceList[index].is_selected = true;
      } else {
        this.categoryServiceList[index].is_selected = false;
      }

      this.categoryServiceList[index].subcategory.forEach((subelement) => {
        if (event.checked == true) {
          subelement.is_selected = true;
        } else {
          subelement.is_selected = false;
        }
        subelement.services.forEach((serviceselement) => {
          if (event.checked == true) {
            serviceselement.is_selected = true;
          } else {
            serviceselement.is_selected = false;
          }
        });
      });
    }

    if (type == "subcategory") {
      if (event.checked == true) {
        this.categoryServiceList[index].subcategory[sub_index].is_selected =
          true;
      } else {
        this.categoryServiceList[index].subcategory[sub_index].is_selected =
          false;
      }

      this.categoryServiceList[index].subcategory[sub_index].services.forEach(
        (serviceselement) => {
          if (event.checked == true) {
            serviceselement.is_selected = true;
          } else {
            serviceselement.is_selected = false;
          }
        }
      );

      var category_i = 0;

      this.categoryServiceList[index].subcategory.forEach((element) => {
        if (element.is_selected == true) {
          category_i++;
        }
      });

      if (category_i == this.categoryServiceList[index].subcategory.length) {
        this.categoryServiceList[index].is_selected = true;
      } else {
        this.categoryServiceList[index].is_selected = false;
      }
    }

    if (type == "service") {
      if (event.checked == true) {
        this.categoryServiceList[index].subcategory[sub_index].services[
          service_index
        ].is_selected = true;
      } else {
        this.categoryServiceList[index].subcategory[sub_index].services[
          service_index
        ].is_selected = false;
      }

      var subcategory_i = 0;

      this.categoryServiceList[index].subcategory[sub_index].services.forEach(
        (serviceselement) => {
          if (serviceselement.is_selected == true) {
            subcategory_i++;
          }
        }
      );

      if (
        subcategory_i ==
        this.categoryServiceList[index].subcategory[sub_index].services.length
      ) {
        this.categoryServiceList[index].subcategory[sub_index].is_selected =
          true;
      } else {
        this.categoryServiceList[index].subcategory[sub_index].is_selected =
          false;
      }

      var category_i = 0;
      this.categoryServiceList[index].subcategory.forEach((element) => {
        if (element.is_selected == true) {
          category_i++;
        }
      });

      if (category_i == this.categoryServiceList[index].subcategory.length) {
        this.categoryServiceList[index].is_selected = true;
      } else {
        this.categoryServiceList[index].is_selected = false;
      }
    }

    this.categoryServiceCheckServiceId = [];

    this.categoryServiceList.forEach((element) => {
      element.subcategory.forEach((subelement) => {
        subelement.services.forEach((serviceselement) => {
          if (subelement.is_selected == true) {
            this.categoryServiceCheckServiceId.push(serviceselement.id);
          }
        });
      });
    });
    this.categoryServiceListTemp = this.categoryServiceList;
  }

  checkCategoryServie(event, Category_index) {
    this.categoryServiceList[Category_index].getservices.forEach((element) => {
      if (event == true) {
        element.is_selected = true;
        this.categoryServiceCheckServiceId.push(element.id);
      } else {
        element.is_selected = false;
        const index = this.categoryServiceCheckServiceId.indexOf(element.id);
        this.categoryServiceCheckServiceId.splice(index, 1);
      }
    });
    this.removeDuplicates(this.categoryServiceCheckServiceId);
    this.categoryServiceListTemp = this.categoryServiceList;
  }

  fnNewCheckService(event, serviceId, index, service_index) {
    if (event == true) {
      this.categoryServiceCheckServiceId.push(serviceId);
    } else if (event == false) {
      const index = this.categoryServiceCheckServiceId.indexOf(serviceId);
      this.categoryServiceCheckServiceId.splice(index, 1);
    }

    this.categoryServiceList[index].getservices[service_index].is_selected =
      event;
    var category_i = 0;
    this.categoryServiceList[index].getservices.forEach((serviceselement) => {
      if (serviceselement.is_selected == true) {
        category_i = category_i + 1;
      }
    });

    if (category_i == this.categoryServiceList[index].getservices.length) {
      this.categoryServiceList[index].is_selected = true;
    } else {
      this.categoryServiceList[index].is_selected = false;
    }
    this.categoryServiceListTemp = this.categoryServiceList;
  }

  removeDuplicates(num) {
    var x,
      len = num.length,
      out = [],
      obj = {};

    for (x = 0; x < len; x++) {
      obj[num[x]] = 0;
    }
    for (x in obj) {
      out.push(parseInt(x));
    }
    this.categoryServiceCheckServiceId = out;
  }
  fnNewCouponCode() {
    this.couponCodeListing = false;
    this.addNewCouponCode = true;
    this.getCateServiceList();
  }

  fnCancelNewCoupon() {
    this.couponCodeListing = true;
    this.categoryServiceCheckServiceId.length = 0;
    this.addNewCouponCode = false;
    this.discountCoupon.reset();
    this.singleCouponDetail = null;
  }

  fnCouponEdit(i) {
    this.couponCodeListing = false;
    this.singleCouponDetail = this.allCouponCode[i];
    this.addNewCouponCode = true;
    console.log(this.singleCouponDetail)

    this.getCateServiceList();
    this.discountCoupon.controls["coupan_name"].setValue(
      this.singleCouponDetail.coupon_title
    );
    this.discountCoupon.controls["max_redemption"].setValue(
      this.singleCouponDetail.coupon_max_redemptions
    );
    this.discountCoupon.controls["coupon_code"].setValue(
      this.singleCouponDetail.coupon_code
    );
    this.discountCoupon.controls["valid_from"].setValue(
      new Date(this.singleCouponDetail.coupon_valid_from)
    );
    this.discountCoupon.controls["discount_type"].setValue(
      this.singleCouponDetail.coupon_type
    );
    this.discountCoupon.controls["discount_value"].setValue(
      this.singleCouponDetail.coupon_value
    );
    this.discountCoupon.controls["valid_till"].setValue(
      new Date(this.singleCouponDetail.coupon_valid_till)
    );

    this.categoryServiceCheckServiceId = this.singleCouponDetail.service_id
      .split(",")
      .map(function (item) {
        return parseInt(item);
      });
  }

  public fnCouponDelete(couponId) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let requestObject = {
          'coupon_id': couponId
        }
        this.isLoaderAdmin = true;
        this.AdminService.deleteCoupon(requestObject).subscribe(
          (response: any) => {
            if (response.data == true) {
              this._snackBar.open(response.response, "X", {
                duration: 2000,
                verticalPosition: "top",
                panelClass: ["green-snackbar"],
              });
              this.getAllCouponCode();
            } else if (
              response.data == false &&
              response.response !== "api token or userid invaild"
            ) {
              this._snackBar.open(response.response, "X", {
                duration: 2000,
                verticalPosition: "top",
                panelClass: ["red-snackbar"],
              });
            }
            this.isLoaderAdmin = false;
          });
      }
    });
  }

  fnCouponDetails(index, CouponId) {
    const dialogRef = this.dialog.open(DialogCouponDetails, {
      height: "700px",

      data: {
        fulldata: this.allCouponCode[index],
        couponId: CouponId,
        currencySymbol: this.currencySymbol,
        currencySymbolPosition: this.currencySymbolPosition,
        currencySymbolFormat: this.currencySymbolFormat,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.animal = result;
      this.getAllCouponCode();
    });
  }

  fnsearchService(event) {
    this.categoryServiceListTemp = [];
    this.categoryServiceList.forEach((element) => {
      if (
        element.category_title &&
        element.category_title
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        this.categoryServiceListTemp.push(element);
        return;
      }
      element.subcategory.forEach((subelement) => {
        if (
          subelement.sub_category_name &&
          subelement.sub_category_name
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        ) {
          if (
            !this.categoryServiceListTemp.some((item) => item.id == element.id)
          ) {
            this.categoryServiceListTemp.push(element);
          }
          return;
        }
        subelement.services.forEach((serviceselement) => {
          if (
            serviceselement.service_name &&
            serviceselement.service_name
              .toLowerCase()
              .includes(event.target.value.toLowerCase())
          ) {
            if (
              !this.categoryServiceListTemp.some(
                (item) => item.id == element.id
              )
            ) {
              this.categoryServiceListTemp.push(element);
            }
            return;
          }
        });
      });
    });
  }

  // fnTillDateChange(){
  //   alert();
  //   this.discountCoupon.get('valid_from').setValue('');
  // }
}

@Component({
  selector: "coupon-details",
  templateUrl: "../_dialogs/coupon-details.html",
})
export class DialogCouponDetails {
  detailsData: any;
  isLoaderAdmin: any;
  couponCodeStatus: any;
  couponId: any;
  couponCodeDetail: any;
  currencySymbol: any;
  currencySymbolPosition: any;
  currencySymbolFormat: any;

  constructor(
    public dialogRef: MatDialogRef<DialogCouponDetails>,
    private AdminService: AdminService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.detailsData = this.data.fulldata;

    this.currencySymbol = this.data.currencySymbol;
    this.currencySymbolPosition = this.data.currencySymbolPosition;
    this.currencySymbolFormat = this.data.currencySymbolFormat;
    this.couponId = this.data.couponId;
    this.getServiceListForCoupon();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getServiceListForCoupon() {
    this.isLoaderAdmin = true;
    this.AdminService.getServiceListForCoupon(this.couponId).subscribe(
      (response: any) => {
        if (response.data == true) {
          this.couponCodeDetail = response.response;
          this.isLoaderAdmin = false;
        } else if (
          response.data == false &&
          response.response !== "api token or userid invaild"
        ) {
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          this.isLoaderAdmin = false;
        }
      }
    );
  }

  changeCouponStaus(event, coupon_id) {
    this.isLoaderAdmin = true;
    if (event.checked == true) {
      this.couponCodeStatus = "Active";
    } else if (event.checked == false) {
      this.couponCodeStatus = "Inactive";
    }
    this.AdminService.changeCouponStaus(
      this.couponCodeStatus,
      coupon_id
    ).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Status Updated.", "X", {
          duration: 2000,
          verticalPosition: "top",
          panelClass: ["green-snackbar"],
        });
        this.isLoaderAdmin = false;
      } else if (
        response.data == false &&
        response.response !== "api token or userid invaild"
      ) {
        this.isLoaderAdmin = false;
      }
    });
  }
}
