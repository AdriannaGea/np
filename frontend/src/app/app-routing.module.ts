import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { OneNicePlaceComponent } from './components/nice-places/one-nice-place/one-nice-place.component';
import { NewNicePlaceComponent } from './components/nice-places/new-nice-place/new-nice-place.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { LogInComponent } from './auth/component/log-in.component';
import { NicePlacesListComponent } from './components/nice-places/nice-places-list.component';
import { JoinUsComponent } from './join-in/join-us.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    title: 'NP | Home',
    path: '',
    component: HeaderComponent,
  },
  {
    title: 'NP | Nice Places',
    path: 'nice-places',
    component: NicePlacesListComponent,
  },
  {
    title: 'NP | Just one ',
    path: 'nice-places/:id',
    component: OneNicePlaceComponent,
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
