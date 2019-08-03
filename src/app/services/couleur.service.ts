import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {ModeleDetail} from './entites/modeleDetail.model';
import {Couleur} from './entites/couleur.model';
import {ModeleService} from './modele.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CouleurService {

  private url = this.injector.get('url');
  private serviceUrl = this.url + '/marques/modeles/';

  constructor(private http: HttpClient, private injector: Injector, private modeleService: ModeleService) {
  }

  private static handleError(error: HttpErrorResponse) {
    let e: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      e = 'Une erreur s\'est produite, réessayer ulterieurement';
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}`);
      if (error.status === 401) {
        e = 'Vous n\'ètes pas autorisé a effectué cette action';
      } else if (error.status === 409) {
        e = 'Cette couleur existe déja';
      } else if (error.status === 404) {
        e = 'Ce modele n\'existe pas';
      } else {
        e = 'Une erreur s\'est produite, réessayer ulterieurement';
      }
    }
    return throwError(e);
  }

  private static handleErrorForVersionInsertion(error: HttpErrorResponse) {
    let e: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      e = 'Une erreur s\'est produite, réessayer ulterieurement';
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}`);
      if (error.status === 401) {
        e = 'Vous n\'ètes pas autorisé a effectué cette action';
      } else if (error.status === 409) {
        e = 'Cette couleur existe déja';
      } else if (error.status === 404) {
        e = 'Cette version n\'existe pas';
      } else {
        e = 'Une erreur s\'est produite, réessayer ulterieurement';
      }
    }
    return throwError(e);

  }
  /* supprimer une couleur d'un modèle */
  supprimerCouleurModele(code: string, codeModele: string) {
    const tokenHeader = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('utilisateur')).token);
    return this.http.delete(this.url + '/Marques/Modeles/' + codeModele + '/Couleurs/' + code,
     {headers: tokenHeader}).pipe();

  }

  /* ajouter une couleur et l'associer à un modèle donnée */
  ajouterCouleurModele(code: string, designation: string, hexa: string, codeModele: string) {
    const tokenHeader = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('utilisateur')).token);
    return this.http.post(this.url + '/Marques/Modeles/' + codeModele + '/Couleurs',
      {CodeCouleur: code, NomCouleur: designation, CodeHexa: hexa}, {headers: tokenHeader}).pipe(
        catchError(CouleurService.handleError)
    );
  }


  /* ajouter une couleur et l'associer à un modèle donnée */
  ajouterCouleurVersion(code: string, codeVersion: string) {
    const tokenHeader = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('utilisateur')).token);
    return this.http.post(this.url + '/Marques/Modeles/Versions/' + codeVersion + '/Couleurs',
      {CodeCouleur: code}, {headers: tokenHeader}).pipe(
        catchError(CouleurService.handleErrorForVersionInsertion)
    );
  }

  /* récupérer les couleurs associées à un modèle */
  getCouleurs(codeModele): Observable<Couleur[]> {
    return this.http.get<Couleur[]>(this.serviceUrl + codeModele + '/couleurs');
  }


  /* récupérer les couleurs associées à un modèle */
  getCouleursVersion(codeVersion): Observable<Couleur[]> {
    return this.http.get<Couleur[]>(this.serviceUrl + 'versions/' + codeVersion + '/couleurs');

  }

  /* Modifier un couleur */
  modifierCouleur(code: string, nom: string, codeHexa: string) {
    const tokenHeader = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('utilisateur')).token);
    return this.http.put(this.url + '/Marques/Modeles/Versions/Couleurs/' + code,
      {CodeCouleur: code, NomCouleur: nom, CodeHexa: codeHexa}, {headers: tokenHeader}).pipe();
  }

  /* récupérer la liste des couleurs associés à tous les modèles d'une marque */
  getCouleursMarque(): any {
    const couleursMap = new Map();
    let modeles;
    this.modeleService.getModeles().subscribe( res => {
      modeles = res as ModeleDetail[];
      for (let i = 0; i < modeles.length; i++) {
        const couleurs = modeles[i].couleurs as Couleur[];
        for (let j = 0; j < couleurs.length ; j++) {
          couleursMap.set(couleurs[j].CodeCouleur , couleurs[j]);
        }
      }
      console.log(couleursMap);
      return couleursMap;
    });
  }

  // supprimer couleur d'une version
  supprimerVersion(code: string, codeVersion: string) {
    const tokenHeader = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('utilisateur')).token);
    return this.http.delete(this.url + '/Marques/Modeles/Versions/' + codeVersion + '/Couleurs/' + code,
      {headers: tokenHeader}).pipe();

  }
}
