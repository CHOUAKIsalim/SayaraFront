import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {VersionDetail} from '../../../../services/entites/versionDetail.model';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Option} from '../../../../services/entites/option.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModeleService} from '../../../../services/modele.service';
import {OptionService} from '../../../../services/option.service';
import {VersionService} from '../../../../services/version.service';
import {ImageService} from '../../../../services/image.service';
import {FileUploader} from 'ng2-file-upload';
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-modifier-verion',
  templateUrl: './modifier-verion.component.html',
  styleUrls: ['../ajouter-version/ajouter-version.component.scss']
})
/**
 *  Classe de modification des versions
 *  Implemente OnInit pour l'initialisation du composant
 *  @author CHABANE CHAOUCH Zahra, CHOUAKI Salim
 *
 */
export class ModifierVerionComponent implements OnInit {
  // Les options pour les checkbox
  private options: Option[];

  // Réference vers le formulaire html
  private formulaire: FormGroup;

  // La version a modifier
  public version: VersionDetail;

  // Les options de la version
  private optionsVersion: Option[];

  // Les options ajoutées
  private optionsAjoutes: Array<Option> = [];

  // Les options supprimées
  private optionsSupp: Array<Option> = [];

  // Les images sélectionnées
  selectedFile: Array<ImageSnippet> = [];
  images: Array<File> = [];
  imagesSupp: Array<any> = [];

  // File uploader
  public uploader: FileUploader = new FileUploader({
    isHTML5: true
  });

  /**
   * Constructeur de la classe, déclare les attributs de la classe
   * @param dialogRef
   * Réference vers la boite de dialogue
   * @param modeleService
   * Service qui va permettre d'envoyer la requete de modification de modele
   * @param optionService
   * Service qui va permettre d'envoyer les requetes d'insertions et de suppressions des modeles
   * @param constructeurFormulaire
   * De type FormBuilder pour construire le formulaire
   * @param dialogValidation
   * Validation du formulaire
   * @param imageService
   * Pour la gestion des images
   * @param versionService
   * Pour la gestion des services
   */
  constructor(private constructeurFormulaire: FormBuilder,
              private modeleService: ModeleService,
              private optionService: OptionService,
              private versionService: VersionService,
              private dialogRef: MatDialogRef<ModifierVerionComponent>,
              private imageService: ImageService,
              private dialogValidation: MatDialog
  ) {

  }

  /**
   *  Executé a l'initialisation du composant, Construit le formulaire et fait la lsiasion avec le html
   */
  ngOnInit() {
    // Construction du formuaire
    this.formulaire = this.constructeurFormulaire.group({
      code: this.version.CodeVersion,
      nom: this.version.NomVersion,
      type:  [null, Validators.compose([Validators.required])]
    });
    /*Chargement des images */
    this.loadFile();
    /*Liaison avec l'html*/
    this.formulaire.valueChanges.subscribe();
    /* Charger les options */
    this.getOptions();

  }

  // Obtention des options
  getOptions() {
    /*subscribe pour régler le problème de synchronisation*/
    this.optionService.getOptions(this.version.CodeModele).subscribe(opts => {
      this.options = opts as Option[];
      this.optionsVersion = (this.version as VersionDetail).options as Option[];
      this.optionsVersion.forEach((element) => {
        this.options.forEach((opt) => {
          if (String(element.CodeOption) === String(opt.CodeOption)) {
            /* séléctionner les options compatibles avec la version parmi ceux associées au modèle */
            opt.Checked = true;
          }
        });
      });
    });
  }

  // Récuperation des images de la version sélectionnée
  loadFile() {
    for (let j = 0; j < this.version.images.length; j++) {
      this.selectedFile[j] = new ImageSnippet(null , null);
      this.selectedFile[j].status = 'ok';
      this.selectedFile[j].new = false;
      this.selectedFile[j].src = String(this.version.images[j].CheminImage);
      this.selectedFile[j].id = String(this.version.images[j].idImage);
    }
  }

  // Uploader des images depuis l'ordinateur
  processFile(imageInput: any) {
    for (let j = 0; j < this.uploader.queue.length; j++) {
      const reader = new FileReader ();
      const fileItem = this.uploader.queue[j]._file;
      reader.addEventListener('load', (event: any) => {
        this.selectedFile[this.selectedFile.length] = new ImageSnippet(event.target.result, fileItem);
      });

      reader.readAsDataURL(fileItem);
      this.images.push(this.uploader.queue[j]._file);
    }
    this.uploader.clearQueue();
  }

  // Gestion des options de versions
  gererOptions(event, option) {
    option.Checked = !option.Checked;
    if (option.Checked === true) {
      if ( this.optionsSupp.indexOf(option) === -1) {
        this.optionsAjoutes.push(option);
      } else {
        this.optionsSupp.splice(this.optionsSupp.indexOf(option) , 1);
      }
    } else {
      if ( this.optionsAjoutes.indexOf(option) === -1) {
        this.optionsSupp.push(option);
      } else {
        this.optionsAjoutes.splice(this.optionsAjoutes.indexOf(option) , 1);
      }
    }

  }

  // Modification de la version
  onSubmit() {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialogValidation.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Voulez vous confirmer les changements que vous allez effectuer sur le version?'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        for (let j = 0; j < this.selectedFile.length; j++) {
          this.selectedFile[j].pending = true;
        }

        /* modifier le nom de la version */
        this.versionService.modifierVersion(this.formulaire.value.code,
          this.formulaire.value.nom, this.formulaire.value.code).subscribe((res) => {
          }
        );
        /* ajouter des options */
        for (let i = 0 ; i < this.optionsAjoutes.length; i++) {
          this.optionService.ajouter(String(this.optionsAjoutes[i].CodeOption), String(this.optionsAjoutes[i].NomOption),
            this.formulaire.value.code).subscribe((res) => {
          } , (error) => {});
        }
        /* supprimer des options */
        for (let i = 0 ; i < this.optionsSupp.length; i++) {
          this.optionService.supprimer(String(this.optionsSupp[i].CodeOption),
            this.formulaire.value.code).subscribe(() => {
          });
        }

        /*ajouter des photos à une version */
        for (let j = 0; j < this.images.length; j++) {
          this.imageService.uploadImage(this.images[j], String(this.version.CodeVersion) ).subscribe(res => {
            this.selectedFile[j].pending = false;
          });
        }

        /* supprimer des photos  d'une version */
        for (let j = 0; j < this.imagesSupp.length; j++) {
          this.imageService.supprimerImage(this.imagesSupp[j], String(this.version.CodeVersion)).subscribe( res => {});
          this.selectedFile[j].pending = false;
        }
        this.dialogRef.close();
      }
    });
    }


  // Supprimer des images
  supprimerImage(selected: ImageSnippet) {
    // si l'image appartient déjà à la version (elle est sur le cloud)
    if (selected.new === false) {
        this.imagesSupp.push(selected.id); // pour envoyer un delete lors de la validation
    } else {
      this.images.splice(this.images.indexOf(selected.file), 1); // supprimer de la liste destinée au POST
    }
    this.selectedFile.splice(this.selectedFile.indexOf(selected), 1);
  }
}


// Zahra please
class ImageSnippet {
  pending = false;
  status = 'init';
  new = true;
  id;
  constructor(public src: string, public file: File) {
  }
}
