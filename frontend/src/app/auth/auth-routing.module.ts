import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './component/log-in.component';
import { NewNicePlaceComponent } from '../components/nice-places/new-nice-place/new-nice-place.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'auth/login', component: LogInComponent },
  {
    path: 'add-new-place',
    component: NewNicePlaceComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
