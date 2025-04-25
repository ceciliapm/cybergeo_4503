import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InterfaceComponent } from './interface/interface.component';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbAccordionModule, NgbPaginationModule, NgbTypeaheadModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { GeosComponent } from './geos/geos.component';

import { NgxSpinnerModule } from "ngx-spinner";
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ChartModule, HIGHCHARTS_MODULES} from 'angular-highcharts';
import more from 'highcharts/highcharts-more.src';
//import solidGauge from 'highcharts/modules/solid-gauge.src';
import highmaps from 'highcharts/modules/map.src';
//import exporting from 'highcharts/modules/exporting.src';

import { SpeedTestModule } from 'ng-speed-test';

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [ more, highmaps];
}

@NgModule({
  declarations: [
    AppComponent,
    InterfaceComponent,
    HomeComponent,
    GeosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSliderModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    NgbAccordionModule,
    ChartModule,
    SpeedTestModule,
    NgbPaginationModule, 
    NgbTypeaheadModule,
    NgbProgressbarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [{ provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }],
  bootstrap: [AppComponent]
})
export class AppModule { }
