import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product, ProductsApi } from '../products-api';

// src/app/features/products/state/products.actions.ts

export const ProductsActions = createActionGroup({
  source: 'Products',
  events: {
    // no payload → emptyProps()
    'Enter List Page': emptyProps(),
    'Load Requested':  emptyProps(),

    // with payload → props<{ ... }>()
    'Search Changed':  props<{ query: string }>(),
    'Page Changed':    props<{ pageIndex: number }>(),

    'Load Succeeded':  props<{ items: Product[]; total: number }>(),
    'Load Failed':     props<{ error: string }>(),

    'Detail Requested': props<{ id: number }>(),
    'Detail Succeeded': props<{ product: Product }>(),
    'Detail Failed':    props<{ error: string }>(),

    'Create Requested': props<{ title: string; price: number; description: string }>(),
    'Create Succeeded': props<{ product: Product }>(),
    'Create Failed':    props<{ error: string }>(),
  }
});
