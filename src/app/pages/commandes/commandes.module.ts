import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CommandesRoutingModule} from './commandes-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';
import {GestionModule} from '../gestion/gestion.module';
import {MaterialModule} from '../../material.module';
import {CommandesComponent} from './commandes/commandes.component';
import {AllCommandesComponent} from './all-commandes/all-commandes.component';
import {GestionRoutingModule} from '../gestion/gestion-routing.module';
import {MatMenuModule} from '@angular/material';
import {ColorPickerModule} from 'ngx-color-picker';

@NgModule({
  declarations: [CommandesComponent, AllCommandesComponent],
  imports: [
    CommonModule,
    CommandesRoutingModule,
    FormsModule,
    BrowserModule,
    FlexLayoutModule,
    GestionModule,
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    ColorPickerModule,
  ]
})
export class CommandesModule {
}

