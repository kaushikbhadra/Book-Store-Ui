import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { SpaceValidators } from 'src/app/common/space-validators';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkOutForm!: FormGroup;
  totalQuantity: number = 0;
  totalAmount: number = 0.0;
  cardMonths: number[] = [];
  cardYears: number[] = [];
  countries: Country[] = [];
  shippingStateAddress: State[] = [];
  billingStateAddress: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private formService: FormService,
    private checkOutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkOutForm = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email,
          SpaceValidators.notOnlyWhiteSpace,
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        address: new FormControl('', [
          Validators.required,
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        country: new FormControl('', [
          Validators.required,
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [
          Validators.required,
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        zip: new FormControl('', [
          Validators.required,
          Validators.maxLength(6),
          SpaceValidators.notOnlyWhiteSpace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        address: new FormControl('', [
          Validators.required,
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        country: new FormControl('', [
          Validators.required,
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [
          Validators.required,
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        zip: new FormControl('', [
          Validators.required,
          Validators.maxLength(6),
          SpaceValidators.notOnlyWhiteSpace,
        ]),
      }),
      payment: this.formBuilder.group({
        name: new FormControl('', [
          Validators.required,
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        number: new FormControl('', [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
          SpaceValidators.notOnlyWhiteSpace,
        ]),
        exp: this.formBuilder.group({
          month: new FormControl('', [
            Validators.required,
            SpaceValidators.notOnlyWhiteSpace,
          ]),
          year: new FormControl('', [
            Validators.required,
            SpaceValidators.notOnlyWhiteSpace,
          ]),
        }),
        cvv: new FormControl('', [
          Validators.required,
          Validators.maxLength(3),
          SpaceValidators.notOnlyWhiteSpace,
        ]),
      }),
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    this.cartService.totalPrice.subscribe((data) => {
      this.totalAmount = data;
    });

    const startMonth: number = new Date().getMonth() + 1;
    this.formService.getCardMonths(startMonth).subscribe((data) => {
      this.cardMonths = data;
    });

    this.formService.getCardYears().subscribe((data) => {
      this.cardYears = data;
    });

    this.formService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  get payMonth() {
    const expGroup = this.checkOutForm.get('payment.exp');
    return expGroup?.get('month');
  }
  get payYear() {
    const expGroup = this.checkOutForm.get('payment.exp');
    return expGroup?.get('year');
  }
  get payNumber() {
    return this.checkOutForm.get('payment.number');
  }

  get shipState() {
    return this.checkOutForm.get('shippingAddress.state');
  }

  get billState() {
    return this.checkOutForm.get('billingAddress.state');
  }

  handleMonthAndYear() {
    const cardGroup = this.checkOutForm.get('payment');
    const cardFormGroup = cardGroup?.get('exp');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = cardFormGroup?.value.year;
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formService.getCardMonths(startMonth).subscribe((data) => {
      this.cardMonths = data;
    });
  }

  addressSwap(event: Event | any) {
    if (event.target.checked) {
      this.checkOutForm.controls['billingAddress'].setValue(
        this.checkOutForm.controls['shippingAddress'].value
      );

      this.billingStateAddress = this.shippingStateAddress;
    } else {
      this.checkOutForm.controls['billingAddress'].reset();
      this.billingStateAddress = [];
    }
  }

  getStates(op: string) {
    const formGroup = this.checkOutForm.get(op);
    const countryCode = formGroup?.value.country.code;

    this.formService.getStates(countryCode).subscribe((data) => {
      if (op === 'shippingAddress') {
        this.shippingStateAddress = data;
      } else {
        this.billingStateAddress = data;
      }
      formGroup?.get('state')?.setValue(data[0]);
    });
  }

  onSubmit() {
    let order = new Order();
    order.totalPrice = this.totalAmount;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;

    let orderItems: OrderItem[] = cartItems.map(
      (tempItem) => new OrderItem(tempItem)
    );

    let purchase = new Purchase();

    purchase.customer = this.checkOutForm.controls['customer'].value;

    purchase.shippingAddress =
      this.checkOutForm.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress =
      this.checkOutForm.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkOutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Your Order has been recived.\nOrder tracking number: ${response.orderTrackingNumber}`
        );
        this.resetCart();
      },
      error: (error) => {
        alert(`There was a error: ${error.massage}`);
      },
    });
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkOutForm.reset();
    this.router.navigateByUrl('/products');
  }
}
