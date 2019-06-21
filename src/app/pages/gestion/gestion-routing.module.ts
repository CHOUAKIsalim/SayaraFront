import {Input, NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GestionComponent} from './gestion/gestion.component';
import {GestionModeleComponent} from './gestion-modele/gestion-modele.component';
import {GestionOptionsComponent} from './gestion-options/gestion-options.component';
import {GestionVersionComponent} from './gestion-version/gestion-version.component';
import {GestionCouleurComponent} from './gestion-couleur/gestion-couleur.component';
<<<<<<< Updated upstream
import {StockComponent} from './stock/stock.component';
import {StockVehiculesComponent} from './stock/stock-vehicules/stock-vehicules.component';
import {UtilisateurGuard} from '../../guards/utilisateur.guard';
=======
>>>>>>> Stashed changes

const routes: Routes = [
  {
    path: 'gestion',
    component: GestionComponent,
    canActivate: [UtilisateurGuard],
    children: [
      {
        path: 'modeles',
        component: GestionModeleComponent
      },
      {
        path: 'options/:CodeModele',
        component: GestionOptionsComponent,
        pathMatch: 'full'
      },
      {
        path: 'options',
        component: GestionOptionsComponent,
        pathMatch: 'full'
      },
      {
        path: 'versions',
        component: GestionVersionComponent
      },
      {
        path: 'couleurs/:CodeModele',
        component: GestionCouleurComponent,
        pathMatch: 'full'
      },

      {
        path: 'couleurs',
        component: GestionCouleurComponent,
        pathMatch: 'full'
      }]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
