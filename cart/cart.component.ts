import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems=[]
  total


  constructor(private _service:FoodService,private _router:Router) { 
  
   
  }
  navigateToPayment(){
    this._router.navigate(["home/payment"])
  }
  decreaseQuantity(food){
    this.total-=food.price
    this._service.removeFromCart(food["prodID"],this.email)
    .subscribe(data=>{
      this._service.removeFromCart(food["prodID"],this.email)
          .subscribe(data=>{
            this._service.getCartItems(this.email)
                .subscribe((resp:Array<any>)=>{this._service.cartItems=resp
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
       this.cartItems.splice(this.cartItems.indexOf(food),1)
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
              this._service.getCartItems(this.email)
                  .subscribe((resp:Array<any>)=>{this._service.cartItems=resp
                  this._service.update()
                  })
            })
      })
     }
       this.calculatTotal()
  }
  removeFromCart(food){
    this._service.cartItems.splice(this._service.cartItems.indexOf(food),1)
    this.cartItems.splice(this.cartItems.indexOf(food),1)
    console.log(this._service.cartItems)
    this.calculatTotal()
    this._service.removeFromCart(parseInt(food["prodID"]),this.email)
    .subscribe(data=>{
      this._service.removeFromCart(parseInt(food["prodID"]),this.email)
          .subscribe(data=>{
            this._service.getCartItems(this.email)
                .subscribe((resp:Array<any>)=>{this._service.cartItems=resp
                this._service.update()
                })
          })
    })
  }
  ngOnInit() {
    this._service.cartItems.forEach(cart=>
      {
        
        if(!cart.hasOwnProperty('quantity')){
          cart.quantity=1
        }
        this.cartItems.push(cart)
    }
      )
    this.calculatTotal()
    console.log(this.cartItems)
    this.email=sessionStorage.getItem("email")
  }
  email=""
  calculatTotal(){
    this.total=this.cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0)
  }

}

 //this.selectedCars=this._service.addedCars
    //console.log(this.selectedCars)
    // this.total=this.selectedCars.reduce((data,acc)=>
    // {
    //    return parseFloat(acc['estimatedPrice'])+data
    // }
    // ,0)