import { Routes } from '@angular/router';

export const routes: Routes =  [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () =>
      import('../app/features/products/list-ng/list-ng').then(m => m.ListNg)
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('../app/features/products/detail-ng/detail-ng').then(m => m.DetailNg)
  },
  { path: '**', redirectTo: 'list' }
];