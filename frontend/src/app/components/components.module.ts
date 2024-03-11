import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Dodany import

import { NavComponent } from './nav/nav.component';
import { MaterialsModule } from '../material/material.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NicePlacesComponent } from './nice-places/nice-places.component';
import { OneNicePlaceComponent } from './nice-places/one-nice-place/one-nice-place.component';
import { NewNicePlaceComponent } from './nice-places/new-nice-place/new-nice-place.component';
import { LogInComponent } from './log-in/log-in.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './header/header.component';
import { JoinUsComponent } from './join-in/join-us/join-us.component';
import { JoinUsModule } from './join-in/join-us.module';

@NgModule({
  declarations: [
    NavComponent,
    NicePlacesComponent,
    OneNicePlaceComponent,
    NewNicePlaceComponent,
    LogInComponent,
    NotFoundComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    MaterialsModule,
    RouterModule,
    JoinUsModule,
  ],
  exports: [NavComponent],
})
export class ComponentsModule {}
