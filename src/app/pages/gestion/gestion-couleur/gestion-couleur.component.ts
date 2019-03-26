import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {CouleurDataSource} from '../../../dataSources/CouleurDataSource';
import {ModeleDetail} from '../../../services/entites/modeleDetail.model';
import {ModeleService} from '../../../services/modele.service';
import {CouleurService} from '../../../services/couleur.service';
import {ModifierCouleurComponent} from './modifier-couleur/modifier-couleur.component';
import {AjouterCouleurComponent} from './ajouter-couleur/ajouter-couleur.component';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-gestion-couleur',
  templateUrl: './gestion-couleur.component.html',
  styleUrls: ['./gestion-couleur.component.scss']
})
export class GestionCouleurComponent implements OnInit {

  public dataSource: CouleurDataSource;
  private codeModele: any;
  private modeles: ModeleDetail[];
  interval: any;
  displayedColumns = ['CodeCouleur', 'NomCouleur', 'Hexa', 'gestion'];

  constructor(private couleurService: CouleurService,
              private modalService: MatDialog,
              private _Activatedroute: ActivatedRoute,
              private modeleService: ModeleService,
              private matDialog: MatDialog,
              private dialogValidation: MatDialog) {}
  ngOnInit() {
    try {
      this.codeModele = this._Activatedroute.snapshot.params.CodeModele; /*récupérer le code modèle passé en paramètre dans l'url*/
    } catch {
      this.codeModele = null;
    }
    this.modeleService.getModeles().subscribe(modeles => {
      this.modeles = modeles as ModeleDetail[];
    });
    this.refreshData();

  }

  refreshData() {
    if ((this.codeModele !== '') || (this.codeModele != null )) {
      this.dataSource = new CouleurDataSource(this.couleurService, this.codeModele);
    }
  }

  /*Fonction à exécuter lors de la séléction d'un modèle pour rafraichir la liste des couleurs associées */
  changerCouleurs($event) {
    this.dataSource = new CouleurDataSource(this.couleurService, $event.value);
    this.codeModele = $event.value;
  }

  /* Ouvrir un mat dialog pour l'ajout d'une couleur au modèle courant */
  ajouterCouleur() {
    const dialogRef: MatDialogRef<AjouterCouleurComponent> = this.matDialog.open(AjouterCouleurComponent, {width: '800px', height: '350px'});
    dialogRef.componentInstance.codeModele = this.codeModele;
  }

  /* Ouvrir un mat dialog pour la modification des informations d'une couleur */
  modifierCouleur(couleur) {
    const dialogRef: MatDialogRef<ModifierCouleurComponent> = this.matDialog.open(ModifierCouleurComponent,
      {width: '800px', height: '350px'});
    dialogRef.componentInstance.couleur = couleur;
  }

  supprimerCouleur(couleur) {

    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialogValidation.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez vous vraiment supprimer cette couleur?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.couleurService.supprimerCouleurModele(couleur.code , this.codeModele).subscribe(() => {
        });;
      }
    });
  }


}



