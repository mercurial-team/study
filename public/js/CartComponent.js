Vue.component('cart', {
    data(){
        return{
            cartProducts:[],
			TotalPrice: 0,
			countGoods: 0,
        }
    },
    methods: {
        addProductToCart(element){
			let find = this.cartProducts.find(el => el.id_product === element.id_product);
			if(find){
				this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1})
                    .then(data => {
                        if(data.result){
							console.log(data);
                            find.quantity++;
							this.TotalPrice = data.cartInfo.amount;
                        }
                    })
			}
			else{
				let newCartProduct = Object.assign({quantity: 1}, element);
				this.$parent.postJson(`/api/cart`, newCartProduct)
                    .then(data => {
                        if(data.result){
                            this.cartProducts.push(newCartProduct);
							this.TotalPrice = data.cartInfo.amount;
							this.countGoods = data.cartInfo.countGoods;
                        }
                    })
			}
		},
		removeProductFromCart(element){
            //console.log(element);
			let find = this.cartProducts.find(el => el.id_product === element.id_product);
			if(find.quantity > 1){
				this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: -1})
                    .then(data => {
                        if(data.result){
                            find.quantity--;
							this.TotalPrice = data.cartInfo.amount;
                        }
                    })
			}
			else{
				this.$parent.deleteJson(`/api/cart/${find.id_product}`)
                    .then(data => {
                        this.cartProducts.splice(this.cartProducts.indexOf(element), 1);
						this.TotalPrice = data.cartInfo.amount;
						this.countGoods = data.cartInfo.countGoods;
                    })
			}
		},  
    },
	mounted(){
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let el of data.contents) {
                    this.cartProducts.push(el);
                };
				this.TotalPrice = data.amount;
				this.countGoods = data.countGoods;
            });
    },
    template: `<div class="cart_link"><a href="#"><img class="cart" src="img/cart.svg" alt="cart"></a>
		<div class="cart_total_position">{{countGoods}}</div>
			<div class="drop cart_block">
						<cart-item v-for="el of cartProducts"
                        	:cartItem = "el"
                        	:key = "el.product_id"
							@removeProductFromCart = "removeProductFromCart">
                		</cart-item>
						<div v-if="!cartProducts.length<1" class="drop__flex drop_cart total_price" >
							<p>Total</p>
							<p>$<span>{{TotalPrice}}</span></p>
						</div>
						<a v-if="!cartProducts.length<1" href="checkout.html" class="item_button">Checkout</a>
						<a v-if="!cartProducts.length<1" href="shopping_cart.html" class="item_button go_to_cart">Go to cart</a>
						<div class = "no_items_cart" v-if="cartProducts.length<1">Нет товаров</div>
					</div>
			</div>`
});

Vue.component('cart-item',{
	data(){
		return{
			standart_product_img_cart: 'https://placehold.it/60x60',
		}
	},
    props: ['cartItem'],
    template: `<div class="drop__flex drop_cart">
							<div class="drop__h3 cart_item">
								<a href="#"><img class = "cart_image" :src = "cartItem.image" :alt="cartItem.product_name"></a>
								<div class="cart_info">
									<a href="single_page.html" class="item_name">{{cartItem.product_name}}</a>
									<div class="cart__stars">
										<i class="fas fa-star"></i>
										<i class="fas fa-star"></i>
										<i class="fas fa-star"></i>
										<i class="fas fa-star"></i>
										<i class="fas fa-star-half-alt"></i>
									</div>
									<p class="item_price_and_q">{{cartItem.quantity}} x $<span>{{cartItem.price}}</span></p>
									<a href="#" class = "del_cart" @click="$emit('removeProductFromCart',cartItem)"><i class="fas fa-times-circle remove_from_cart"></i></a>
								</div>
							</div>
						</div>`,
	mounted(){
		fetch(this.cartItem.image)
		.then( result =>{
			if(result.status!='200'){
				this.cartItem.image = this.standart_product_img_cart;
			}
		})
	}
});