import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductService } from './services/product.service';
import { ShortenPipe } from './common/shorten.pipe';
import { ProductsComponent } from './components/products/products.component';
import { ProductsCategoryComponent } from './components/products/products-category/products-category.component';
import { StartComponent } from './components/start/start.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingComponent } from './ui/loading/loading.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    HeaderComponent,
    ShortenPipe,
    ProductsComponent,
    ProductsCategoryComponent,
    StartComponent,
    ProductDetailComponent,
    CartDetailsComponent,
    CheckoutComponent,
    AuthComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    ProductService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
