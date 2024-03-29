import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {ModeleDetail} from '../../../services/entites/modeleDetail.model';
import {ModeleService} from '../../../services/modele.service';
import {CouleurService} from '../../../services/couleur.service';
import {ModifierCouleurComponent} from './modifier-couleur/modifier-couleur.component';
import {AjouterCouleurComponent} from './ajouter-couleur/ajouter-couleur.component';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {Couleur} from '../../../services/entites/couleur.model';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-gestion-couleur',
  templateUrl: './gestion-couleur.component.html',
  styleUrls: ['../gestion-modele/gestion-modele.component.scss']
})
export class GestionCouleurComponent implements OnInit {

  // En attente des données
  private loading = false;

  private dataSource = new MatTableDataSource<Couleur>();
  private codeModele: any;
  private modeles: ModeleDetail[];
  interval: any;
  displayedColumns = ['CodeCouleur', 'NomCouleur', 'Hexa', 'gestion'];

  constructor(private couleurService: CouleurService,
              private modalService: MatDialog,
              private activatedroute: ActivatedRoute,
              private modeleService: ModeleService,
              private matDialog: MatDialog,
              private toastr: ToastrManager,
              private dialogValidation: MatDialog) {}
  ngOnInit() {
    try {
      this.codeModele = this.activatedroute.snapshot.params.CodeModele; /*récupérer le code modèle passé en paramètre dans l'url*/
      this.refreshData();

    } catch {
      this.codeModele = null;
    }
    this.modeleService.getModeles().subscribe(modeles => {
      this.modeles = modeles as ModeleDetail[];
    }, error => {
      // Modeles non trouvées ,  forcément probleme de connexion
      this.toastr.errorToastr(error);
    });

  }

  /**
   * Raffraichir la liste des couleurs
   */
  refreshData() {
    if ((this.codeModele !== '') && (this.codeModele != null )) {
      this.loading = true;
      this.couleurService.getCouleurs(this.codeModele).subscribe(res => {
        this.loading = false;
        this.dataSource.data = res as Couleur[];
      }, error => {
        //probleme de connexion
        this.toastr.errorToastr(error);
        this.loading = true;
      });
    }
  }

  /**
   * Méthode à exécuter lors de la séléction d'un modèle pour rafraichir la liste des couleurs associées
   **/
  changerCouleurs($event) {
    this.codeModele = $event.value;
    this.refreshData();
  }

  /**
   * Ouvrir un mat dialog pour l'ajout d'une couleur au modèle courant
   **/
  ajouterCouleur() {
    if ((this.codeModele !== '') && (this.codeModele != null )){
      const dialogRef: MatDialogRef<AjouterCouleurComponent> = this.matDialog.open(AjouterCouleurComponent, {
        width: '800px',
      });
      dialogRef.componentInstance.codeModele = this.codeModele;
      dialogRef.afterClosed().subscribe(res => {
        this.refreshData();
      });
    } else {
      this.toastr.infoToastr('Veuillez choisir un modèle d\'abord');
    }
  }

  /**
   * Ouvrir un mat dialog pour la modification des informations d'une couleur
   **/
  modifierCouleur(couleur) {
    const dialogRef: MatDialogRef<ModifierCouleurComponent> = this.matDialog.open(ModifierCouleurComponent,
      {width: '800px', height: '350px'});
    dialogRef.componentInstance.couleur = couleur;
    dialogRef.afterClosed().subscribe(res => {
      this.refreshData();
    });
  }

  /**
   * Supprimer une couleur
   * @param couleur
   */
  supprimerCouleur(couleur) {

    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialogValidation.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez vous vraiment supprimer cette couleur?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.couleurService.supprimerCouleurModele(couleur.CodeCouleur , this.codeModele).subscribe(() => {
          this.refreshData();
        });
      }
    });
  }

  appliquerFiltre = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}



