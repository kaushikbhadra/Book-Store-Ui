import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductService } from './services/product.service';
import { ShortenPipe } from './common/shorten.pipe';
import { ProductsComponent } from './components/products/products.component';
import { ProductsCategoryComponent } from './components/products/products-category/products-category.component';
import { StartComponent } from './components/start/start.component';
import { FormsModule } from '@angular/forms';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';

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
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [ProductService],
  bootstrap: [AppComponent],
})
export class AppModule {}
