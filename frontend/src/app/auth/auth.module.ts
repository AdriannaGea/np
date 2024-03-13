import { NgModule } from "@angular/core";
import { LogInComponent } from "./component/log-in.component";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";
import { MaterialsModule } from "../material/material.module";

@NgModule({
  declarations: [LogInComponent],
  imports: [CommonModule, MaterialsModule],
  exports: [AuthRoutingModule],
})
export class AuthModule {}
