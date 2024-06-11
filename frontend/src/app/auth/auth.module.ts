import { NgModule } from "@angular/core";
import { LogInComponent } from "./component/log-in.component";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";
import { MaterialsModule } from "../material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { FooterComponent } from '../components/footer/footer.component';

@NgModule({
  declarations: [LogInComponent],
  imports: [CommonModule, MaterialsModule, ReactiveFormsModule],
  exports: [AuthRoutingModule],
})
export class AuthModule {}
