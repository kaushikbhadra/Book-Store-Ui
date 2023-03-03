import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice: number = 0.0;
  totalQuantity: number = 0;
  totalPriceUnsubscribe!: Subscription;
  totalQuantityUnsubscribe!: Subscription;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listOfCartDetails();
  }

  onDecrement(cartItem: CartItem) {
    this.cartService.decToCart(cartItem);
  }

  onIncrement(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  onRemove(cartItem: CartItem) {
    this.cartService.removeItem(cartItem);
  }

  onBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  listOfCartDetails() {
    this.cartItems = this.cartService.cartItems;
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

    this.cartService.totalCartItemsPrice();
  }

  ngOnDestroy(): void {
    this.totalPriceUnsubscribe.unsubscribe();
    this.totalQuantityUnsubscribe.unsubscribe();
  }
}
