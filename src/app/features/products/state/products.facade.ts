import { Injectable, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductsSelectors } from './products.reducer';
import { ProductsActions } from './products.actions';
import { map, combineLatest } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  private store = inject(Store);

  // Streams for the component to display
  readonly items$   = this.store.select(ProductsSelectors.selectAll);
  readonly total$   = this.store.select(ProductsSelectors.selectTotal);
  readonly page$    = this.store.select(ProductsSelectors.selectPageIndex);
  readonly limit$   = this.store.select(ProductsSelectors.selectLimit);
  readonly loading$ = this.store.select(ProductsSelectors.selectLoading);

  readonly vm$ = combineLatest([this.items$, this.total$, this.page$, this.limit$]).pipe(
    map(([items, total, page, limit]) => ({
      items, total, page,
      pageCount: Math.max(1, Math.ceil(total / limit))
    }))
  );

  enterListPage() {
    this.store.dispatch(ProductsActions.enterListPage());
  }
  search(query: string) {
    this.store.dispatch(ProductsActions.searchChanged({ query: query.trim() }));
  }
  goToPage(pageIndex: number) {
    this.store.dispatch(ProductsActions.pageChanged({ pageIndex }));
  }
  loadDetail(id: number) {
    this.store.dispatch(ProductsActions.detailRequested({ id }));
  }
  create(title: string, price: number, description: string) {
    this.store.dispatch(ProductsActions.createRequested({ title, price, description }));
  }
}
