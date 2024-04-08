import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {
  loginForm!: FormGroup; // Initialisation du formulaire de connexion

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  // Initialisation du formulaire lors du chargement du composant
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // Méthode pour gérer l'événement de connexion
  onLogin() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    // Appel du service d'authentification pour la connexion
    this.authService.login(email, password).subscribe(
      (data) => {
        // Si la connexion réussit, rediriger l'utilisateur vers la page '/nice-places'
        this.router.navigate(['/nice-places']);
      },
      (error) => {
        // Gérer les erreurs de connexion ici, par exemple afficher un message d'erreur
        console.error('Erreur de connexion:', error);
      }
    );
  }
}
