import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { AuthService } from 'src/app/services/auth.service';
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
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categoryId!: number;
  prevCategoryId: number = 1;
  searchMode!: boolean;
  keyword!: string;
  isAuth = false;
  private userSub!: Subscription;

  totalPageElements!: number;
  totalPages!: number;
  pageNumber: number = 0;
  isLoading = false;
  error!: null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getProducts(this.pageNumber);
      this.userSub = this.authService.user.subscribe((user) => {
        this.isAuth = !!user;
      });
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
          next: (data: GetResponseProducts) => {
            this.isLoading = false;
            this.products = data._embedded.products;
            this.pageNumber = data.page.number;
            this.totalPages = data.page.totalPages;
            this.totalPageElements = data.page.totalElements;
          },
          error: (error) => {
            this.isLoading = false;
            console.log(error.message);
            this.error = error;
          },
        });
    }
  }

  getproductPrevOrNext(direction?: string) {
    this.getProducts(
      direction === 'forword' ? this.pageNumber + 1 : this.pageNumber - 1
    );
  }

  private getProductsViaSearch() {
    this.keyword = String(this.route.snapshot.paramMap.get('keyword'));
    this.productService
      .getProductBySearch(this.keyword, this.pageNumber)
      .subscribe({
        next: (data: GetResponseProducts) => {
          this.isLoading = false;
          this.products = data._embedded.products;
          this.pageNumber = data.page.number;
          this.totalPages = data.page.totalPages;
          this.totalPageElements = data.page.totalElements;
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error.message);
          this.error = error;
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

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
