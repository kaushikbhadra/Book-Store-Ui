import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-category',
  templateUrl: './products-category.component.html',
  styleUrls: ['./products-category.component.css'],
})
export class ProductsCategoryComponent implements OnInit {
  productCategorys!: ProductCategory[];
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.productCategoryList();
  }
  private productCategoryList() {
    this.productService.getProductCategoryList().subscribe((data) => {
      this.productCategorys = data;
    });
  }
}
