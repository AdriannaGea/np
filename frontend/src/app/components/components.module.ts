import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavComponent } from './nav/nav.component';
import { MaterialsModule } from '../material/material.module';
import { NicePlacesComponent } from './nice-places/nice-places.component';
import { OneNicePlaceComponent } from './nice-places/one-nice-place/one-nice-place.component';
import { NewNicePlaceComponent } from './nice-places/new-nice-place/new-nice-place.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './header/header.component';
import { AuthModule } from '../auth/auth.module';


@NgModule({
  declarations: [
    NavComponent,
    NicePlacesComponent,
    OneNicePlaceComponent,
    NewNicePlaceComponent,
    NotFoundComponent,
    HeaderComponent,
  ],
  imports: [CommonModule, MaterialsModule, RouterModule, AuthModule],
  exports: [NavComponent],
})
export class ComponentsModule {}
