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

    return this.httpClient
      .get<GetResponseProduct>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  getProductCategoryList(): Observable<ProductCategory[]>{
    const searchUrl = `${this.baseUrl}/product-category?size=8`;

    return this.httpClient
      .get<GetResponseProductCategory>(searchUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }
}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
