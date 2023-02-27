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
