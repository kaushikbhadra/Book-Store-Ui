import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8082/api';
  private size: number = 20;

  constructor(private httpClient: HttpClient) {}

  // getAllProducts(pageNumber: number) : Observable<GetResponseProducts>{

  //   const searchUrl = `${this.baseUrl}/products?page=${pageNumber}&size=${this.size}`;
  //   return this.httpClient.get<GetResponseProducts>(searchUrl);

  // }

  getProductListViaPagination(
    pageNumber: number,
    id: number
  ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${id}&page=${pageNumber}&size=${this.size}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategoryList(): Observable<ProductCategory[]> {
    const searchUrl = `${this.baseUrl}/product-category`;

    return this.httpClient
      .get<GetResponseProductCategory>(searchUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  getProductBySearch(
    keyword: string,
    pageNumber: number
  ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/products/search/findByNameContaining?name=${keyword}&page=${pageNumber}&size=${this.size}`;

    return this.getProducts(searchUrl);
  }

  getProduct(id: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/products/${id}`;

    return this.httpClient.get<Product>(searchUrl);
  }

  private getProducts(search: string) {
    return this.httpClient.get<GetResponseProducts>(search);
  }
}

export interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
