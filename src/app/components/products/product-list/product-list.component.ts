import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products!: Product[];
  categoryId!: number;
  searchMode!: boolean;
  keyword!: string;
 

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getProducts();
    });
  }

  private getProducts() {
    const HasId: boolean = this.route.snapshot.paramMap.has('id');
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.getProductsViaSearch();
    } else {
      if (HasId) {
        this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
      } else {
        this.categoryId = 1;
      }

      this.productService.getProductList(this.categoryId).subscribe((data) => {
        this.products = data;
      });
    }
  }
  private getProductsViaSearch() {
    this.keyword = String(this.route.snapshot.paramMap.get('keyword'));
    this.productService.getProductBySearch(this.keyword).subscribe((data) => {
      this.products = data;
    });
  }
}
