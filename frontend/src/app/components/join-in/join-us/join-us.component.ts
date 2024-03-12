import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map, startWith, tap } from 'rxjs';
import { JoinUsService } from '../services/join-us.service';
import { confirmEqualValidator } from '../validators/confirm-equal.validator';

@Component({
  selector: 'app-join-us',
  templateUrl: './join-us.component.html',
  styleUrls: ['./join-us.component.scss'],
})
export class JoinUsComponent implements OnInit {
  loading = false; // Chargement initial désactivé
  mainForm!: FormGroup; // Déclaration du formulaire principal
  personalInfoForm!: FormGroup; // Déclaration du formulaire d'informations personnelles
  contactPreferenceCtrl!: FormControl; // Contrôle de la préférence de contact
  emailCtrl!: FormControl; // Contrôle de l'email
  confirmEmailCtrl!: FormControl; // Contrôle de la confirmation de l'email
  emailForm!: FormGroup; // Formulaire pour l'email
  phoneCtrl!: FormControl; // Contrôle du numéro de téléphone
  passwordCtrl!: FormControl; // Contrôle du mot de passe
  confirmPasswordCtrl!: FormControl; // Contrôle de la confirmation du mot de passe
  loginInfoForm!: FormGroup; // Formulaire des informations de connexion

  showEmailCtrl$!: Observable<boolean>; // Observable pour afficher le contrôle de l'email
  showPhoneCtrl$!: Observable<boolean>; // Observable pour afficher le contrôle du téléphone
  showEmailError$!: Observable<boolean>; // Observable pour afficher l'erreur de l'email
  showPasswordError$!: Observable<boolean>; // Observable pour afficher l'erreur du mot de passe

  constructor(
    private formBuilder: FormBuilder,
    private joinFormService: JoinUsService
  ) {}

  ngOnInit(): void {
    this.initFormControls(); // Initialisation des contrôles de formulaire
    this.initMainForm(); // Initialisation du formulaire principal
    this.initFormObservables(); // Initialisation des observables du formulaire
  }

  private initMainForm(): void {
    // Initialisation du formulaire principal avec les formulaires spécifiques
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm,
    });
  }

  private initFormControls(): void {
    // Initialisation des différents contrôles de formulaire
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required], // Prénom requis
      lastName: ['', Validators.required], // Nom requis
    });
    this.contactPreferenceCtrl = this.formBuilder.control('email'); // Préférence de contact par défaut à l'email
    this.emailCtrl = this.formBuilder.control(''); // Contrôle de l'email vide
    this.confirmEmailCtrl = this.formBuilder.control(''); // Contrôle de confirmation de l'email vide
    this.emailForm = this.formBuilder.group(
      {
        email: this.emailCtrl,
        confirm: this.confirmEmailCtrl,
      },
      {
        validator: [confirmEqualValidator('email', 'confirm')],
        update: 'blur',
      }
    );
    this.phoneCtrl = this.formBuilder.control(''); // Contrôle du numéro de téléphone vide
    this.passwordCtrl = this.formBuilder.control('', Validators.required); // Mot de passe requis
    this.confirmPasswordCtrl = this.formBuilder.control(
      '',
      Validators.required
    ); // Confirmation de mot de passe requise
    this.loginInfoForm = this.formBuilder.group(
      {
        username: ['', Validators.required], // Nom d'utilisateur requis
        password: this.passwordCtrl,
        confirmPassword: this.confirmPasswordCtrl,
      },
      {
        validator: [confirmEqualValidator('password', 'confirmPassword')],
        update: 'blur',
      }
    );
  }

  private initFormObservables() {
    // Initialisation des observables pour les préférences de contact et les erreurs d'email et de mot de passe
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map((preference) => preference === 'email'),
      tap((showEmailCtrl) => this.setEmailValidators(showEmailCtrl))
    );
    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map((preference) => preference === 'phone'),
      tap((showPhoneCtrl) => this.setPhoneValidators(showPhoneCtrl))
    );
    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(
        (status) =>
          status === 'INVALID' &&
          this.emailCtrl.value &&
          this.confirmEmailCtrl.value
      )
    );
    this.showPasswordError$ = this.loginInfoForm.statusChanges.pipe(
      map(
        (status) =>
          status === 'INVALID' &&
          this.passwordCtrl.value &&
          this.confirmPasswordCtrl.value &&
          this.loginInfoForm.hasError('confirmEqual')
      )
    );
  }

  private setEmailValidators(showEmailCtrl: boolean) {
    // Définition des validateurs pour les champs d'email
    if (showEmailCtrl) {
      this.emailCtrl.addValidators([Validators.required, Validators.email]); // Email requis et valide
      this.confirmEmailCtrl.addValidators([
        Validators.required,
        Validators.email,
      ]); // Confirmation d'email requis et valide
    } else {
      this.emailCtrl.clearValidators(); // Effacer les validateurs de l'email
      this.confirmEmailCtrl.clearValidators(); // Effacer les validateurs de confirmation de l'email
    }
    this.emailCtrl.updateValueAndValidity();
    this.confirmEmailCtrl.updateValueAndValidity();
  }

  private setPhoneValidators(showPhoneCtrl: boolean) {
    // Définition des validateurs pour le numéro de téléphone
    if (showPhoneCtrl) {
      this.phoneCtrl.addValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]); // Numéro de téléphone requis et avec une longueur spécifique
    } else {
      this.phoneCtrl.clearValidators(); // Effacer les validateurs du numéro de téléphone
    }
    this.phoneCtrl.updateValueAndValidity();
  }

  onSubmitForm() {
    // Soumission du formulaire
    this.loading = true; // Activation du chargement
    this.joinFormService
      .saveUserInfo(this.mainForm.value) // Envoi des informations du formulaire
      .pipe(
        tap((saved) => {
          this.loading = false; // Désactivation du chargement
          if (saved) {
            this.resetForm(); // Réinitialisation du formulaire après sauvegarde
          } else {
            console.error("Echec de l'enregistrement"); // En cas d'échec, afficher un message d'erreur
          }
        })
      )
      .subscribe();
  }

  private resetForm() {
    // Réinitialisation du formulaire
    this.mainForm.reset(); // Réinitialisation du formulaire principal
    this.contactPreferenceCtrl.patchValue('email'); // Remise à zéro de la préférence de contact
  }

  getFormControlErrorText(ctrl: AbstractControl) {
    // Obtenir le texte d'erreur en fonction du contrôle
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis'; // Message d'erreur pour un champ requis
    } else if (ctrl.hasError('email')) {
      return "Merci d'entrer une adresse mail valide"; // Message d'erreur pour une adresse email non valide
    } else if (ctrl.hasError('minlength')) {
      return 'Ce numéro de téléphone ne contient pas assez de chiffres'; // Message d'erreur pour un numéro de téléphone trop court
    } else if (ctrl.hasError('maxlength')) {
      return 'Ce numéro de téléphone contient trop de chiffres'; // Message d'erreur pour un numéro de téléphone trop long
    } else {
      return 'Ce champ contient une erreur'; // Message d'erreur générique
    }
  }
}
