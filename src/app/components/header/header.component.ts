import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  totalPrice: number = 0.0;
  totalQuantity: number = 0;
  totalPriceUnsubscribe!: Subscription;
  totalQuantityUnsubscribe!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.updateCartStatus();
  }
  updateCartStatus() {
    this.totalPriceUnsubscribe = this.cartService.totalPrice.subscribe(
      (data) => {
        this.totalPrice = data;
      }
    );

    this.totalQuantityUnsubscribe = this.cartService.totalQuantity.subscribe(
      (data) => {
        this.totalQuantity = data;
      }
    );
  }

  onSubmit(value: string) {
    this.router.navigateByUrl(`/search/${value}`);
  }

  onCartDetails() {
    this.router.navigate(['/cart-details'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.totalPriceUnsubscribe.unsubscribe();
    this.totalQuantityUnsubscribe.unsubscribe();
  }
}
