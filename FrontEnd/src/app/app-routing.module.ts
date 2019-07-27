import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'registrar', loadChildren: './pages/registrar/registrar.module#RegistrarPageModule' },  { path: 'partido', loadChildren: './pages/partido/partido.module#PartidoPageModule' },
  { path: 'registrar-partido', loadChildren: './pages/registrar-partido/registrar-partido.module#RegistrarPartidoPageModule' },
  { path: 'candidatos', loadChildren: './pages/candidatos/candidatos.module#CandidatosPageModule' },
  { path: 'promesas', loadChildren: './pages/promesas/promesas.module#PromesasPageModule' },


  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
