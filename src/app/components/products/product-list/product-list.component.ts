import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import {
  GetResponseProducts,
  ProductService,
} from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categoryId!: number;
  prevCategoryId: number = 1;
  searchMode!: boolean;
  keyword!: string;

  totalPageElements!: number;
  totalPages!: number;
  pageNumber: number = 0;
  isLoading = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getProducts(this.pageNumber);
    });
  }

  getProducts(pageIndex: number) {
    this.isLoading = true;
    const HasId: boolean = this.route.snapshot.paramMap.has('id');
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    this.pageNumber = pageIndex;

    if (this.searchMode) {
      this.getProductsViaSearch();
    } else {
      if (HasId) {
        this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
      } else {
        this.categoryId = 1;
      }

      if (this.prevCategoryId != this.categoryId) {
        this.pageNumber = 0;
      }

      this.prevCategoryId = this.categoryId;

      this.productService
        .getProductListViaPagination(this.pageNumber, this.categoryId)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.paginationResult();
          },
          error: (error) => {
            this.isLoading = false;
            console.log(error.message);
          },
        });
    }
  }

  getproductPrevOrNext(direction?: string) {
    this.getProducts(
      direction === 'forword' ? this.pageNumber + 1 : this.pageNumber - 1
    );
  }

  private paginationResult() {
    return (data: GetResponseProducts) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number;
      this.totalPages = data.page.totalPages;
      this.totalPageElements = data.page.totalElements;
    };
  }
  private getProductsViaSearch() {
    this.keyword = String(this.route.snapshot.paramMap.get('keyword'));
    this.productService
      .getProductBySearch(this.keyword, this.pageNumber)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.paginationResult();
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error.message);
        },
      });
  }

  addToCart(cartProduct: Product) {
    const cartItem = new CartItem(
      cartProduct.id,
      cartProduct.name,
      cartProduct.imageUrl,
      cartProduct.unitPrice,
      1
    );
    this.cartService.addToCart(cartItem);
  }
}
