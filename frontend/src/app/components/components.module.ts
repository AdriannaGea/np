import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { MaterialsModule } from '../material/material.module';
import { OneNicePlaceComponent } from './nice-places/one-nice-place/one-nice-place.component';
import { NewNicePlaceComponent } from './nice-places/new-nice-place/new-nice-place.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './header/header.component';
import { AuthModule } from '../auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NicePlacesListComponent } from './nice-places/nice-places-list.component';
import { NicePlacesComponent } from './nice-places/nice-places/nice-places.component';

@NgModule({
  declarations: [
    NavComponent,
    NicePlacesComponent,
    OneNicePlaceComponent,
    NewNicePlaceComponent,
    NotFoundComponent,
    HeaderComponent,
    NicePlacesListComponent,
  ],
  imports: [
    CommonModule,
    MaterialsModule,
    RouterModule,
    AuthModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
  ],
  exports: [NavComponent],
})
export class ComponentsModule {}
