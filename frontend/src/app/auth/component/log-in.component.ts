import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogin(): void {
     this.auth.login();
  }
}
