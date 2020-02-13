import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyBusinessComponent } from './my-business/my-business.component';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';

//import { Role } from '@app/_models';
//import { AuthGuard } from '@app/_helpers';

const routes: Routes = [
  {
    path: 'mybusiness',
    component: MyBusinessComponent
  }, 
  {
    path: 'myworkspace',
    component: MyWorkSpaceComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
