import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToCart(newCartItem: CartItem) {
    let existingCartItem: CartItem | undefined = undefined;
    if (this.cartItems.length > 0) {
      // for (let tempItem of this.cartItems) {
      //   if (tempItem.id === newCartItem.id) {
      //     existingCartItem = tempItem;
      //     break;
      //   }
      // }
      existingCartItem = this.cartItems.find(
        (tempItem) => tempItem.id === newCartItem.id
      );
    }

    if (existingCartItem != undefined) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(newCartItem);
    }

    this.totalCartItemsPrice();
  }

  decToCart(oldCartItem: CartItem) {
    oldCartItem.quantity--;
    if (oldCartItem.quantity === 0) {
      this.removeItem(oldCartItem);
    } else {
      this.totalCartItemsPrice();
    }
  }

  removeItem(item: CartItem) {
    const index = this.cartItems.findIndex(
      (tempItem) => tempItem.id === item.id
    );
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.totalCartItemsPrice();
    }
  }

  totalCartItemsPrice() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let cartItem of this.cartItems) {
      totalPriceValue += cartItem.quantity * cartItem.unitPrice;
      totalQuantityValue += cartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}
