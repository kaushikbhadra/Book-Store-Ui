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

  constructor(private httpClient: HttpClient) {}

  getProductList(id: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${id}&size=8`;

    return this.getProducts(searchUrl);
  }

  getProductCategoryList(): Observable<ProductCategory[]> {
    const searchUrl = `${this.baseUrl}/product-category?size=8`;

    return this.httpClient
      .get<GetResponseProductCategory>(searchUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  getProductBySearch(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/products/search/findByNameContaining?name=${keyword}&size=8`;

    return this.getProducts(searchUrl);
  }

  getProduct(id: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/products/${id}`;

    return this.httpClient.get<Product>(searchUrl);
  }

  private getProducts(search: string) {
    return this.httpClient
      .get<GetResponseProducts>(search)
      .pipe(map((response) => response._embedded.products));
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
