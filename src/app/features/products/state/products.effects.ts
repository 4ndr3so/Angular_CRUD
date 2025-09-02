import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductsActions } from './products.actions';
import { ProductsApi } from '../products-api';
import { Store } from '@ngrx/store';
import { ProductsSelectors } from './products.reducer';
import { catchError, debounceTime, map, of, switchMap, withLatestFrom } from 'rxjs';

export class ProductsEffects {
  private actions$ = inject(Actions);
  private api = inject(ProductsApi);
  private store = inject(Store);

  // When search or page changes (or we enter the page), (re)load the list
  reload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.enterListPage, ProductsActions.searchChanged, ProductsActions.pageChanged),
      debounceTime(150),
      withLatestFrom(
        
        this.store.select(ProductsSelectors.selectQuery),
        this.store.select(ProductsSelectors.selectPageIndex),
        this.store.select(ProductsSelectors.selectLimit),
      ),
      switchMap(([_, q, pageIndex, limit]) => {
        const skip = pageIndex * limit;
        this.store.dispatch(ProductsActions.loadRequested());
        const req$ = q ? this.api.search(q, limit, skip) : this.api.list(limit, skip);
        return req$.pipe(
          map(res => ProductsActions.loadSucceeded({ items: res.products, total: res.total })),
          catchError(err => of(ProductsActions.loadFailed({ error: (err?.message || 'Load failed') })))
        );
      })
    )
  );

  // Detail fetch on demand
  detail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.detailRequested),
      switchMap(({ id }) =>
        this.api.detail(id).pipe(
          map(product => ProductsActions.detailSucceeded({ product })),
          catchError(err => of(ProductsActions.detailFailed({ error: (err?.message || 'Detail failed') })))
        )
      )
    )
  );

  // Create product then refresh list (or just append)
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.createRequested),
      switchMap(({ title, price, description }) =>
        this.api.create({ title, price, description }).pipe(
          map(product => ProductsActions.createSucceeded({ product })),
          catchError(err => of(ProductsActions.createFailed({ error: (err?.message || 'Create failed') })))
        )
      )
    )
  );
}
