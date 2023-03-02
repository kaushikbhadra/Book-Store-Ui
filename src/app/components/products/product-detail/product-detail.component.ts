import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product = new Product();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetail();
    });
  }

  addToCart(cartProduct: Product) {
    console.log(cartProduct.name);

    const cartItem = new CartItem(
      cartProduct.id,
      cartProduct.name,
      cartProduct.imageUrl,
      cartProduct.unitPrice,
      1
    );
    this.cartService.addToCart(cartItem);
  }

  onBackNavigate() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private handleProductDetail() {
    const productId: number = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(productId).subscribe((data) => {
      this.product = data;
    });
  }
}
