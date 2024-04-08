import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { HeaderComponent } from './components/header/header.component';
import { OneNicePlaceComponent } from './components/nice-places/one-nice-place/one-nice-place.component';
import { NewNicePlaceComponent } from './components/nice-places/new-nice-place/new-nice-place.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { JoinUsComponent } from './components/join-in/join-us/join-us.component';
import { AuthGuard } from './auth/auth.guard';
import { LogInComponent } from './auth/component/log-in.component';
import { NicePlacesListComponent } from './components/nice-places/nice-places-list.component';

const routes: Routes = [
  {
    title: 'NP | Home',
    path: '',
    component: HeaderComponent,
    // canActivate: [AuthGuard],
  },
  {
    title: 'NP | Nice Places',
    path: 'nice-places',
    component: NicePlacesListComponent,
    // canActivate: [AuthGuard],
  },
  {
    title: 'NP | Just one ',
    path: 'nice-places/:id',
    component: OneNicePlaceComponent,
    // canActivate: [AuthGuard],
  },
  {
    title: 'NP | Add ',
    path: 'auth/add',
    component: NewNicePlaceComponent,
    canActivate: [AuthGuard],
  },
  { title: 'NP | Log', path: 'auth/login', component: LogInComponent },
  { title: 'NP | Join ', path: 'join-us', component: JoinUsComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
