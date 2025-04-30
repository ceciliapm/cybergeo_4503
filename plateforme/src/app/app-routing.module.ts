import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterfaceComponent } from './interface/interface.component';
import { HomeComponent } from './home/home.component';
import { GeosComponent } from './geos/geos.component';

const routes: Routes = [
{ path: '', component: InterfaceComponent },
{ path: 'home', component: HomeComponent },
{ path: 'geoserver', component: GeosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

