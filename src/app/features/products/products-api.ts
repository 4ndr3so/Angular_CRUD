import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  thumbnail: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private base = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  list(limit: number, skip: number): Observable<ProductListResponse> {
    const params = new HttpParams().set('limit', limit).set('skip', skip);
    return this.http.get<ProductListResponse>(`${this.base}/products`, { params })
      .pipe(catchError(() => of({ products: [], total: 0, skip, limit })));
  }

  search(q: string, limit: number, skip: number): Observable<ProductListResponse> {
    const params = new HttpParams().set('q', q).set('limit', limit).set('skip', skip);
    return this.http.get<ProductListResponse>(`${this.base}/products/search`, { params })
      .pipe(catchError(() => of({ products: [], total: 0, skip, limit })));
  }

  detail(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`)
      .pipe(catchError(() => of({} as Product)));
  }

  create(payload: Pick<Product, 'title' | 'price' | 'description'>): Observable<Product> {
    return this.http.post<Product>(`${this.base}/products/add`, payload)
      .pipe(catchError(() => of({} as Product)));
  }
}
