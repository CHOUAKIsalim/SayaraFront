import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {VersionDetail} from './entites/versionDetail.model';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  private url = this.injector.get('url');
  private urlVersionDetails = this.url + '/marques/modeles/';

  constructor(private http: HttpClient, private injector: Injector) { }

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
        e = 'Cette version existe déja';
      } else if (error.status === 404) {
        e = 'Ce modele n\'existe pas';
      } else {
        e = 'Une erreur s\'est produite, réessayer ulterieurement';
      }
    }
    return throwError(e);
  }

  ajouter(code: string, designation: string, model: string) {
    const tokenHeader = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('utilisateur')).token);
    return this.http.post(this.url + '/Marques/Modeles/' + model + '/Versions',
      {CodeVersion: code, NomVersion: designation}, {headers: tokenHeader}).pipe(
          catchError(VersionService.handleError)
    );
  }

  getVersions(codeModele): Observable<VersionDetail[]> {
    return this.http.get<VersionDetail[]>(this.urlVersionDetails + codeModele + '/versions').pipe(
      catchError(VersionService.handleError)
    );
  }

  getVersion(codeVersion): Observable<VersionDetail> {
    return this.http.get<VersionDetail>(this.urlVersionDetails + 'versions/' + codeVersion).pipe(
      catchError(VersionService.handleError)
    );
  }

  supprimerVersion(codeVersion) {
    const tokenHeader = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('utilisateur')).token);
    return this.http.delete(this.urlVersionDetails + 'versions/' + codeVersion, {headers: tokenHeader}).pipe(
        catchError(VersionService.handleError)
    );
  }

  modifierVersion(code: string, designation: string, codeVersion: string) {
    const tokenHeader = new HttpHeaders().set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('utilisateur')).token);
    return this.http.put(this.url + '/Marques/Modeles/Versions/' + codeVersion ,
      {CodeVersion: code, NomVersion: designation}, {headers: tokenHeader}).pipe(
        catchError(VersionService.handleError)
    );
  }
}
