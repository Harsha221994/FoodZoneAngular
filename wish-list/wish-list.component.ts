import { Component, OnInit } from '@angular/core';
import { FoodService } from '../food.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {

  constructor(private _service:FoodService,private _router:Router) { 
  
   
  }
 
  total
  navigateToPayment(){
    this._router.navigate(["home/payment"])
  }
  decreaseQuantity(food){
    this.total-=food.price
    this._service.removeFromWishList(parseInt(food["prodID"]),this.email)
    .subscribe(data=>{
      this._service.removeFromWishList(parseInt(food["prodID"]),this.email)
          .subscribe(data=>{
            this._service.getWishListItems(this.email)
                .subscribe((resp:Array<any>)=>{
                  this._service.wishListItems=resp
                this._service.update()
                })
          })
    })
    if(food.quantity>1)
     {
       food.quantity--
     }
     else if(food.quantity==1){
      this._service.cartItems.splice(this._service.cartItems.indexOf(food),1)
     
     }
     else{
       this.wishListItems.splice(this.wishListItems.indexOf(food),1)
     }
  }
  increaseQuantity(food){
    food.quantity++
    this.total+=food.price
  }
  onBlur(food){
    console.error("On blurr")
    if(food.quantity==0)
     {
      this._service.removeFromCart(food["prodID"],this.email)
      .subscribe(data=>{
        this._service.removeFromCart(food["prodID"],this.email)
            .subscribe(data=>{
              this._service.getWishListItems(this.email)
                  .subscribe((resp:Array<any>)=>{this._service.wishListItems=resp
                  this._service.update()
                  })
            })
      })
     }
       this.calculatTotal()
  }
  wishListItems=[]
  email=""
  removeFromWishList(food){
    this._service.wishListItems.splice(this._service.wishListItems.indexOf(food),1)
    this.wishListItems.splice(this.wishListItems.indexOf(food),1)
    console.log(this._service.wishListItems)
    this.calculatTotal()
    this._service.removeFromWishList(parseInt(food["prodID"]),this.email)
    .subscribe(data=>{
      this._service.removeFromWishList(parseInt(food["prodID"]),this.email)
          .subscribe(data=>{
            this._service.getWishListItems(this.email)
                .subscribe((resp:Array<any>)=>{this._service.wishListItems=resp
                this._service.update()
                })
          })
    })
  }
  ngOnInit() {
    this._service.wishListItems.forEach(cart=>
      {
        debugger
        if(!cart.hasOwnProperty('quantity')){
          cart.quantity=1
        }
        this.wishListItems.push(cart)
    }
      )
    this.calculatTotal()
    this.email=sessionStorage.getItem("email")
  }
  calculatTotal(){
    this.total=this.wishListItems.reduce((acc,item)=>acc+item.price*item.quantity,0)
  }
}
