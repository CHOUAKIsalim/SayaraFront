import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Commande} from '../../../services/entites/commande.model';
import {MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CommandeServiceMock} from '../../../mocks/commande.Service.mock';
import {Router} from '@angular/router';
import {CommandeService} from '../../../services/commande.service';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {Couleur} from '../../../services/entites/couleur.model';


@Component({
  selector: 'app-all-commandes',
  templateUrl: './all-commandes.component.html',
  styleUrls: ['./all-commandes.component.scss'],
})
export class AllCommandesComponent implements OnInit, AfterViewInit {

  // Le data source qui contient les informations a afficher dans le mat-table
  public dataSource = new MatTableDataSource<Commande>();
  // les colonnes à afficher
  displayedColumns = ['Date', 'Client', 'Vehicule', 'Prix', 'Reservation', 'gestion'];
  // Réference vers le mat-sort
  @ViewChild(MatSort) sort: MatSort;

  // Réference vers le mat-paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;



  constructor(private matDialog: MatDialog,
              private commandeService: CommandeService,
              private dialogValidation: MatDialog,
              private router: Router) {
    this.redefineFilter();
  }

  ngOnInit() {
    this.refreshData();
  }


  refreshData() {
    if (this.router.url.split('/')[2] === 'tous') {
      this.commandeService.getAllCommandes().subscribe(res => {
        this.dataSource.data = res as Commande[];
      });
    } else if (this.router.url.split('/')[2] === 'prepayees') {
      this.commandeService.getCommandesPrepayes().subscribe(res => {
        this.dataSource.data = res as Commande[];
      });
    } else if (this.router.url.split('/')[2] === 'annulees') {
      this.commandeService.getCommandesAnnulles().subscribe(res => {
        this.dataSource.data = res as Commande[];
      });
    } else if (this.router.url.split('/')[2] === 'nouvelles'){
      this.commandeService.getCommandesNouvelles().subscribe(res => {
        this.dataSource.data = res as Commande[];
      });
    }
  }


  /**
   *  Association du sort et de la pagination au dataSource
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Application du filtre entré dans la recherche
   * @param value
   * La valeur entrée dans la recherche
   */
  appliquerFiltre = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  /**
   *  Redéfinition du filtre pour prendre en compte les sous objets
   */
  redefineFilter() {
    this.dataSource.filterPredicate = (order: any, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      const listAsFlatString = (obj): string => {
        let returnVal = '';
        Object.values(obj).forEach((val) => {
          if (typeof val !== 'object') { // Si ce n'est pas un objet
            returnVal = returnVal + ' ' + val;
          } else if (val !== null) { // Si c'est un objet non null
            returnVal = returnVal + ' ' + listAsFlatString(val);
          }
        });
        return returnVal.trim().toLowerCase();
      };
      return listAsFlatString(order).includes(transformedFilter);
    };
  }

  /**
   * Valider une commande
   * @param commande
   */
  validerCommande(commande) {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialogValidation.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez vous vraiment valider cette commande?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commandeService.validerCommande(commande).subscribe(() => {
          this.refreshData();
        });
      }
    });
  }

  /**
   * Rejeter une commande
   * @param commande
   */
  rejeterCommande(commande) {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialogValidation.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez vous vraiment rejeter cette commande?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commandeService.rejeterCommande(commande).subscribe(() => {
          this.refreshData();
        });
      }
    });
  }

}
