import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {
  // constructor(private auth: AuthService, private router: Router) {}
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onLogin(): void {
    // this.auth.login();
    this.router.navigateByUrl('');
  }
}
