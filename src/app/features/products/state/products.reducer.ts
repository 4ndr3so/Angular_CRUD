// products.reducer.ts
import { createFeature, createReducer, on, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ProductsActions } from './products.actions';
import { Product } from '../products-api';

export interface ProductsState extends EntityState<Product> {
  total: number;
  pageIndex: number;
  limit: number;
  query: string;
  loading: boolean;
  error: string | null;
  selectedId: number | null;
}

const adapter = createEntityAdapter<Product>({ selectId: p => p.id });

const initialState: ProductsState = adapter.getInitialState({
  total: 0,
  pageIndex: 0,
  limit: 10,
  query: '',
  loading: false,
  error: null,
  selectedId: null
});

// handlers for each action in the lifecycle
const reducer = createReducer(
  initialState,

  // UI inputs
  on(ProductsActions.searchChanged, (s, { query }) => ({ ...s, query, pageIndex: 0 })),
 // on(ProductsActions.limitChanged, (s, { limit }) => ({ ...s, limit, pageIndex: 0 })),
  on(ProductsActions.pageChanged,   (s, { pageIndex }) => ({ ...s, pageIndex })),

  // List load lifecycle
  on(ProductsActions.loadRequested, s => ({ ...s, loading: true, error: null })),
  on(ProductsActions.loadSucceeded, (s, { items, total }) =>
    adapter.setAll(items, { ...s, total, loading: false })
  ),
  on(ProductsActions.loadFailed,    (s, { error }) => ({ ...s, loading: false, error })),

  // Detail lifecycle (optional but useful)
  on(ProductsActions.detailRequested, (s, { id }) => ({ ...s, selectedId: id, loading: true })),
  on(ProductsActions.detailSucceeded, (s, { product }) =>
    adapter.upsertOne(product, { ...s, selectedId: product.id, loading: false })
  ),
  on(ProductsActions.detailFailed,     (s, { error }) => ({ ...s, loading: false, error })),

  // Create lifecycle (optional)
  on(ProductsActions.createRequested, s => ({ ...s, loading: true, error: null })),
  on(ProductsActions.createSucceeded, (s, { product }) =>
    adapter.addOne(product, { ...s, loading: false, total: s.total + 1 })
  ),
  on(ProductsActions.createFailed,    (s, { error }) => ({ ...s, loading: false, error })),
);

// Feature + selectors
export const productsFeature = createFeature({
  name: 'products',
  reducer,
});

export const selectProductsState = productsFeature.selectProductsState;
const { selectAll, selectEntities } = adapter.getSelectors(selectProductsState);

export const selectTotal      = createSelector(selectProductsState, s => s.total);
export const selectPageIndex  = createSelector(selectProductsState, s => s.pageIndex);
export const selectLimit      = createSelector(selectProductsState, s => s.limit);
export const selectQuery      = createSelector(selectProductsState, s => s.query);
export const selectLoading    = createSelector(selectProductsState, s => s.loading);
export const selectSelectedId = createSelector(selectProductsState, s => s.selectedId);

export const ProductsSelectors = {
  selectAll,
  selectEntities,
  selectTotal,
  selectPageIndex,
  selectLimit,
  selectQuery,
  selectLoading,
  selectSelectedId,
};
