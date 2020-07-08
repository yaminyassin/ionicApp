import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module')
    .then(m => m.MapPageModule)
  },
  {
    path: 'places',
    loadChildren: () => import('./pages/places/places.module')
    .then(m => m.PlacesPageModule)
  },
  {
    path: 'promos',
    loadChildren: () => import('./pages/promos/promos.module')
    .then( m => m.PromosPageModule)
  },
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full'
  },]  
;
@NgModule({
  imports: [
    RouterModule.forRoot(routes, 
      { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
