import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from 'src/app/material/material.module';
import { JoinUsComponent } from './join-us.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [JoinUsComponent],
  imports: [CommonModule, MaterialsModule, ReactiveFormsModule],
  exports: [JoinUsComponent],
})
export class JoinUsModule {}
