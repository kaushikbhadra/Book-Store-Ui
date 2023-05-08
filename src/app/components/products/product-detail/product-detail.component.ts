import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product = new Product();
  isAuth = false;
  private userSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetail();
    });
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuth = !!user;
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

  onBackNavigate() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private handleProductDetail() {
    const productId: number = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(productId).subscribe((data) => {
      this.product = data;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
