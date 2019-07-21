import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ModeleService} from '../../../../services/modele.service';
import {OptionService} from '../../../../services/option.service';
import {VersionService} from '../../../../services/version.service';
import {Option} from '../../../../services/entites/option.model';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ImageService} from '../../../../services/image.service';
import {FileUploader} from 'ng2-file-upload';
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-ajouter-version',
  templateUrl: './ajouter-version.component.html',
  styleUrls: ['./ajouter-version.component.scss']
})
/**
 *  Classe d'ajout des version
 *  Implemente OnInit pour l'initialisation du composant
 *  @author CHABANE CHAOUCH Zahra, CHOUAKI Salim
 *
 */
export class AjouterVersionComponent implements OnInit {
  // Les options a afficher dans les checkbox
  private options: Option[];

  // Réference vers le formulaire html
  private formulaire: FormGroup;

  // Le code du modele auquel on rajoute une version
  public codeModele: string;

  // Les otpions cochées
  public optionsChoisies: Array<Option> = [];
  // Les images sélectionnées
  selectedFile: Array<ImageSnippet> = [];
  images: Array<File> = [];

  // File uploader
  public uploader: FileUploader = new FileUploader({
    isHTML5: true
  });


  /**
   * Constructeur de la classe, déclare seulement les attributs privés de la classe
   * @param constructeurFormulaire
   * De type FormBuilder, Permet de construire des formulaire et de faire le binding avec html
   * @param modeleservice
   * Pour envoyer la requete d'insertion du modele
   * @param optionservice
   * Pour envoyer la requete d'insertion des options compatibles avec le modele
   * @param versionservice
   * Pour inserer les versions
   * @param dialogRef
   * Réference sur la boite de dialogue
   * @param imageService
   * Pour pouvoir gerer les images
   */
  constructor(private constructeurFormulaire: FormBuilder,
              private modeleservice: ModeleService,
              private optionservice: OptionService,
              private versionservice: VersionService,
              private dialogRef: MatDialogRef<AjouterVersionComponent>,
              private imageService: ImageService,
              private dialogValidation: MatDialog
  ) {
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


  /**
   *  Executé a l'initialisation du composant, Construit le formulaire et fait la lsiasion avec le html
   */
  ngOnInit() {
    // La liaison avec les checkbox
    this.optionservice.getOptions(this.codeModele).subscribe(opts => this.options = opts as Option[]);
    // Construction du formulaire
    this.formulaire = this.constructeurFormulaire.group({
      code: '',
      nom: '',
    });
    // La liaison avec le formulaire
    this.formulaire.valueChanges.subscribe();
  }

  /* Sélectionner ou déselectionner une option */
  gererOptions(event, option) {
    option.Checked = !option.Checked;
    if (option.Checked === true) {
      this.optionsChoisies.push(option);
    } else {
      this.optionsChoisies.splice(option);
    }
  }

  // Ajout d'une version
  onSubmit() {

    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialogValidation.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez vous vraiment ajouter cette version?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let i = 0;
        for (let j = 0; j < this.selectedFile.length; j++) {
          this.selectedFile[j].pending = true;
        }
        const codeVersion = this.formulaire.value.code + JSON.parse(localStorage.getItem('utilisateur')).utilfab.Fabricant;
        this.versionservice.ajouter(codeVersion,
          this.formulaire.value.nom, this.codeModele).subscribe(
          () => {
            for (i = 0; i < this.optionsChoisies.length; i++) {
              this.optionservice.ajouter(String(this.optionsChoisies[i].CodeOption), String(this.optionsChoisies[i].NomOption), codeVersion
              ).subscribe();
            }

            /*ajouter des photos à une version */
            for (let j = 0; j < this.images.length; j++) {
              this.imageService.uploadImage(this.images[j], codeVersion, '1').subscribe(resultat => {
                this.selectedFile[j].pending = false;
              });
            }
            this.dialogRef.close();
          },
          (err) => {
            this.dialogRef.close();
          });
      }
    });
  }

  // Supprimer des images
  supprimerImage(selected: ImageSnippet) {
    this.selectedFile.splice(this.selectedFile.indexOf(selected), 1);
    this.images.splice(this.selectedFile.indexOf(selected),1);
  }
}



// Classe pour représenter une image
class ImageSnippet {
  pending = false;
  status = 'init';

  constructor(public src: string, public file: File) {
  }
}
