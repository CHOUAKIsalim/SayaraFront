import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Couleur} from '../../../../services/entites/couleur.model';
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import {CouleurService} from '../../../../services/couleur.service';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-modifier-couleur',
  templateUrl: './modifier-couleur.component.html',
  styleUrls: ['../../gestion-version/ajouter-version/ajouter-version.component.scss']
})
export class ModifierCouleurComponent implements OnInit {
  private formulaire: FormGroup;
  couleur: Couleur;
  private color;

  constructor(private constructeurFormulaire: FormBuilder,
              private couleurService: CouleurService,
              private dialogRef: MatDialogRef<ModifierCouleurComponent>,
              private dialogValidation: MatDialog,
              private toastr: ToastrManager,
  ) {}

  ngOnInit() {

    this.color = this.couleur.CodeHexa;
    this.formulaire = this.constructeurFormulaire.group({
      code: this.couleur.CodeCouleur,
      nom: this.couleur.NomCouleur,
    });
    this.formulaire.valueChanges.subscribe();

  }

  onSubmit() {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialogValidation.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez vous confirmer les changements que vous allez effectuer sur la couleur?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        /* modifier le nom de la version */

        this.couleurService.modifierCouleur(this.formulaire.value.code, this.formulaire.value.nom,
          this.color).subscribe(() => {
          this.dialogRef.close();
          this.toastr.successToastr("Modification avec succès");
        }, error => {
            // Erreur de modification d'une couleur
          this.toastr.errorToastr(error);
        });
      }
    });
  }



}
