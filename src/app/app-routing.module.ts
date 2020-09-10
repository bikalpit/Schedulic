import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from './_models';
import { AuthGuard } from './_helpers';
import { AttendeesRegistrationComponent } from './attendees-registration'
import { LoginComponent } from './login';
import { ForgotPasswordComponent } from './forgot-password';
import { ResetPasswordComponent } from './reset-password';
import { FrontbookingComponent } from './frontbooking';
import { OnlinePaymentComponent } from './online-payment';
import { SubscriptionComponent } from './subscription/subscription.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FrontBookingThemeFourComponent } from './front-booking-theme-four/front-booking-theme-four.component'

const routes: Routes = [
  {
    path: '', 
    component: LoginComponent 
  },
  {
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'forgot-password', 
    component: ForgotPasswordComponent 
  },
  {
    path: 'reset-password', 
    component: ResetPasswordComponent 
  },
  {
    path: 'attendees-registration', 
    component:  AttendeesRegistrationComponent,
  },
  {
    path: 'booking', 
    component:  FrontbookingComponent,
  },
  {
    path: 'booking-4', 
    component:  FrontBookingThemeFourComponent,
  },
  {
    path: 'online-payment', 
    component:  OnlinePaymentComponent,
  },
  {
    path: 'admin-select-subscription', 
    component:  SubscriptionComponent,
  },

  {
    path: 'user',
    canActivate: [AuthGuard],
    data: {roles: Role.Customer},
    loadChildren: () => import('./user/user.module').then(mod => mod.UserModule)
  },

  {
    path: 'staff',
    canActivate: [AuthGuard],
    data: {roles: Role.Staff},
    loadChildren: () => import('./staff/staff.module').then(mod => mod.StaffModule)
  },

  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: {roles: Role.Admin},
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)
  },
  { path: 'super-admin', loadChildren: () => import('./super-admin/super-admin.module').then(m => m.SuperAdminModule) },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})

export class AppRoutingModule { }
