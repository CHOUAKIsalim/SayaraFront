import {Component, Input, OnInit} from '@angular/core';
import {ModeleDetail} from '../../../services/entites/modeleDetail.model';
import {ModeleService} from '../../../services/modele.service';
import {VersionDetail} from '../../../services/entites/versionDetail.model';
import {VersionService} from '../../../services/version.service';
import {Couleur} from '../../../services/entites/couleur.model';
import {CouleurService} from '../../../services/couleur.service';
import {OptionDetail} from '../../../services/entites/optionDetail.model';
import {OptionService} from '../../../services/option.service';
import {StockService} from '../../../services/stock.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Vehicule} from '../../../services/entites/Vehicule.model';
import {InfosDispoComponent} from '../infos-dispo/infos-dispo.component';
import {ToastrManager} from 'ng6-toastr-notifications';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {
  //tableau des options de la version choisie
  private optionsVersion: Array<OptionDetail> = [];
  //tableau des modèles de la marque
  private listModeles : Array<ModeleDetail> = [];
  //tableau des versions du modèle choisi
  private listVersions: Array<VersionDetail> =[];
  //tableau des couleurs de la version choisie
  private listCouleurs: Array<Couleur> = [];
  //image du modèle choisi
  private imageModele: string = null;
  //image dela version choisie
  private imageVersion:string = null;
  //etape de choix
  private etape= 1;
  private photosModeles: Array<string> ;
  private photosVersions: Array<string> ;
  private modeleChoisi: ModeleDetail = null;
  private versionChoisie: VersionDetail = null;
  private couleurChoisie: Couleur= null;
  private optionsChoisies: Array<String>= Array<String> ();
  private prixTotal : number  = 0;
  private prixOptions: number =0;

  constructor(public modeleService: ModeleService,
              public versionService: VersionService,
              public couleurService: CouleurService,
              public stockService: StockService,
              public matDialog: MatDialog,
              private toastr: ToastrManager,
              public optionService: OptionService) {
  }

  ngOnInit() {
    this.modeleService.getModeles().subscribe((res) => {
      this.listModeles = res as  ModeleDetail[];
      this.modeleChoisi = this.listModeles[0];
      this.getPhotosModeles();
    }, error => {
      // Erreur dans l'obtention des modeles
      this.toastr.errorToastr(error);
    });

  }

  /**
   * Récupérer une photo par modèle
   */
  getPhotosModeles() {
    this.photosModeles = new Array<string>(this.listModeles.length);
    //parcourir la liste des modèles et récupérer leurs versions
    this.listModeles.forEach((modele) => {
      this.versionService.getVersions(modele.CodeModele).subscribe((res) => {
        const versions = res as VersionDetail [];
        var ok : boolean = false;
        var i =0;

        // itérer sur les versions jusqu'à trouver une couleur qui contient une photo
        while (!ok && i< versions.length) {
          const clr = versions[i++].couleurs.find(c => c.CheminImage != null);
          if (clr != null) {
            this.photosModeles[this.listModeles.indexOf(modele)] = clr.CheminImage;
            if(i==1) this.imageModele = clr.CheminImage;
            ok = true;
          }
        }
        if (!ok) {
          // insérer aucune photo s'il n'ya aucune photo trouvée
          this.photosModeles[this.listModeles.indexOf(modele)] = './assets/images/Pics/aucune.jpg';
        }
      });
    }, error => {
      // Erreur dans l'obtention des versions
      this.toastr.errorToastr(error);
    });
  }

  /**
   *choix d'un modèles parmis la liste affichée
   */
  choisirModele(modele: ModeleDetail) {
    this.modeleChoisi = modele;
    this.imageModele = this.photosModeles[this.listModeles.indexOf(modele)];
  }

  /**
   * choix d'une version
   */
  choisirVersion (version) {
    this.versionChoisie = version;
    this.imageVersion = this.photosVersions[this.listVersions.indexOf(version)];
    this.prixTotal = this.versionChoisie.lignetarif.Prix;
  }

  /**
   * Choix de la couleur
   */
  choisirCouleur (couleur) {
    this.couleurChoisie = couleur;
    this.prixTotal = this.versionChoisie.lignetarif.Prix+ this.couleurChoisie.lignetarif.Prix;
  }

  /**
   * Choix des options
   */

  choisirOptions($event, option) {
    option.Checked = !option.Checked;
    if(option.Checked) {
      this.optionsChoisies.push(option.CodeOption);
      this.prixTotal += option.lignetarif.Prix;
      this.prixOptions += option.lignetarif.Prix;
    } else {
      this.optionsChoisies.splice(0,option.CodeOption);
      this.prixTotal -= option.lignetarif.Prix;
      this.prixOptions -= option.lignetarif.Prix;
    }
  }

  /**
   * passer au choix de la version
   */

  passerEtape2() {
    if (this.modeleChoisi != null) {
      this.etape = 2;
      this.versionService.getVersions(this.modeleChoisi.CodeModele).subscribe( (res) => {
        this.listVersions = res as VersionDetail[];
        if (this.listVersions!= null) {
          this.versionChoisie = this.listVersions[0];
          this.prixTotal = this.versionChoisie.lignetarif.Prix;

          //récupérer les photos des versions du modèle choisi
          this.photosVersions = new Array<string>(this.listVersions.length);
          this.listVersions.forEach((vers) => {
            const clr = vers.couleurs.find(c => c.CheminImage != null);
            if (clr != null) {
              this.photosVersions[this.listVersions.indexOf(vers)] = clr.CheminImage;
            } else {
              this.photosVersions[this.listVersions.indexOf(vers)] = './assets/images/Pics/aucune.jpg';
            }
          });
          this.imageVersion = this.photosVersions[0];
        }
      }, error => {
        // Erreur dans l'obtention des versions
        this.toastr.errorToastr(error);
      });

    } else {
      this.toastr.errorToastr("Aucun modèle choisi");
    }
  }

  /**
   * passer au choix de la couleur
   */

  passerEtape3() {
    if (this.versionChoisie!= null) {
      this.etape = 3;
      this.couleurService.getCouleursVersion(this.versionChoisie.CodeVersion).subscribe( (res) => {
        this.listCouleurs = res as Couleur[];
        if (this.listCouleurs.length!= 0) {
          this.couleurChoisie = this.listCouleurs[0];
          this.prixTotal += this.couleurChoisie.lignetarif.Prix;
        }
      }, error => {
        // Erreur dans l'obtention des couleurs d'une version
        this.toastr.errorToastr(error);
      });
    } else {
      alert("Aucune version choisie");
    }
  }

  /**
   * passer au choix des options
   */

  passerEtape4() {
    this.etape = 4;
    this.optionService.getOptionsVersion(this.versionChoisie.CodeVersion).subscribe( (res) => {
      this.optionsVersion = res as OptionDetail[];
    }, error => {
      // Erreur dans l'obtention des options
      this.toastr.errorToastr(error);
    });
  }


  revenirEtape3() {
    this.etape = 3;
    this.prixTotal = 0;
    this.prixOptions = 0;
    this.optionsVersion = null;
  }

  revenirEtape2() {
    this.etape = 2;
    this.prixTotal = this.versionChoisie.lignetarif.Prix;
    this.listCouleurs = null;
    this.couleurChoisie = null;
  }

  revenirEtape1() {
    this.etape = 1;
    this.prixTotal -= this.versionChoisie.lignetarif.Prix;
    this.listVersions = null;
    this.photosVersions = null;
    this.imageVersion = null;
    this.versionChoisie = null;
  }


  /**
   * Vérifier la diponibilité en stock véhicules avec les options et la
   couleur configurés
   */
  verifierDispo() {
    //le tableau à envoyer dans le post
    var options: Array<String> = new Array<String>(this.optionsChoisies.length);
    this.optionsChoisies.forEach(element => {
      if (element!= null)  {
        //ajuster selon le format de la requête
        options.push('{\'CodeOption\': '+ element + '}');
      }
    });
    // tableau des véhicules à récupérer
    var arrayDispo: Array<Vehicule> = [];
    this.stockService.getVehiculesDispo(this.versionChoisie.CodeVersion, this.couleurChoisie.CodeCouleur, options).subscribe( res => {
      arrayDispo = res as Vehicule[];
      //Ouvrir un Mat Dialog pour afficher la disponibilité
      const dialogRef: MatDialogRef<InfosDispoComponent> = this.matDialog.open(InfosDispoComponent, {width: '800px', height: '300px'});
      dialogRef.componentInstance.vehicules = arrayDispo;
      dialogRef.afterClosed().subscribe(() => {
      });
    }, error => {
      // Erreur dans l'obtention des vehicules disponibles
      this.toastr.errorToastr(error);
    });

  }





}
