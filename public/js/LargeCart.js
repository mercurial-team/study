Vue.component('large-cart', {
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
                    })
			}
		},
		removeAllProductFromCart(){
			this.$parent.deleteJson(`/api/cart/1?remove_all=1`)
			this.cartProducts = [];
			this.TotalPrice = 0;
			this.countGoods = 0;
		},
		setQuantity(element){
			this.$root.putJson(`/api/cart/${element.id_product}?set=1`, {quantity: +element.quantity})
			.then(data => {
				this.TotalPrice = data.cartInfo.amount;
			});
			
		}
    },
	mounted(){
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let el of data.contents) {
                    this.cartProducts.push(el);
                };
				this.TotalPrice = data.amount;
            });
    },
    template: `<div class="cart_page">

		<div class = "no_items_catalog" v-if="this.cartProducts.length<1">Нет товаров</div>	

        <div class="container" v-if = "!this.cartProducts.length<1">
            <div class="cart_page_item cart_page_header">
                <div class="cart_page_first">Product Details</div>
                <div class="cart_page_other_items">
                    <div class="cart_page_other_item">unite Price</div>
                    <div class="cart_page_other_item">Quantity</div>
                    <div class="cart_page_other_item">shipping</div>
                    <div class="cart_page_other_item">Subtotal</div>
                    <div class="cart_page_other_item">ACTION</div>
                </div>
            </div>

			<large-cart-item v-for="el of cartProducts"
                        	:cartItem = "el"
                        	:key = "el.product_id"
							@removeProductFromCart = "removeProductFromCart">
            </large-cart-item>
            

            <div class="cart_page_buttons">
                <a href="#" class="item_button cart_page_button" @click = "removeAllProductFromCart">
                    cLEAR SHOPPING CART
                </a>
                <a href="product.html" class="item_button cart_page_button">
                    cONTINUE sHOPPING
                </a>
            </div>
            <div class="buy_block">
                <div class="shipping">
                    <h2 class="buy_block_name">Shipping Adress</h2>
                    <select class="buy_input" name="country" id="country">
                        <option value="Bangladesh" selected>Bangladesh</option>
                        <option value="New York">New York</option>
                    </select>
                    <input type="text" class="buy_input" placeholder="State">
                    <input type="text" class="buy_input" placeholder="Postcode / Zip">
                    <a href="#" class="item_button cart_page_button buy_button">
                        get a quote
                    </a>
                </div>
                <div class="coupon">
                    <h2 class="buy_block_name">coupon  discount</h2>
                    <p class = "coupon_p">Enter your coupon code if you have one</p>
                    <input type="text" class="buy_input" placeholder="State">
                    <a href="#" class="item_button cart_page_button buy_button">
                        Apply coupon
                    </a>
                </div>
                <div class="grand_total">
                    <div class="total_price_block">
                        <div class="total_price_block_sub">
                            Sub total         <span class="price_span">$<span>{{TotalPrice}}</span></span>
                        </div>
                        <div class="total_price_block_grand">
                            GRAND TOTAL      <span class = "total_price_block_grand_bold price_span">$<span>{{TotalPrice}}</span></span>
                        </div>
                    </div>
                    <a href="checkout.html" class="button checkout_button">proceed to checkout</a>
                    </div>
            </div>
        </div>
    </div>`
});

Vue.component('large-cart-item',{
	data(){
		return{
			standart_product_img_cart: 'https://placehold.it/60x60',
		}
	},
	methods:{
		changeHandler(element){
			if(element.quantity<1){
				element.quantity = 1;
			}
			this.$parent.setQuantity(element);	
		},
	},
    props: ['cartItem'],
    template: `<div class="cart_page_item">
                <div class="cart_page_product cart_page_first">
                    <img class = "cart_large_img":src = "cartItem.image"  :alt="cartItem.product_name">
                    <div class="cart_page_description">
                        <a href="single_page.html" class="cart_page_name">
                            {{cartItem.product_name}}
                        </a>
                        <div class="cart_page_options">
                            <p class="cart_page_text"><span class="cart_page_bold">Color:</span> RED</p>
                            <p class="cart_page_text"><span class="cart_page_bold">Size:</span>Xll</p>
                        </div>
                    </div>
                </div>
                <div class="cart_page_other_items">
                    <div class="cart_page_char cart_page_price"><span>{{cartItem.price}}</span>$</div>
                    <div class="cart_page_char cart_page_quantity_block"><input type="number" class="cart_page_quantity" v-model="cartItem.quantity" @input="changeHandler(cartItem)" min="1"></div>
                    <div class="cart_page_char cart_page_shipping">FREE</div>
                    <div class="cart_page_char cart_page_subtotal">$<span>{{cartItem.price * cartItem.quantity}}</span></div>
                    <div class="cart_page_char cart_page_action"><a href="#" class = "del_cart" @click="$emit('removeProductFromCart',cartItem)"><i class="fas fa-times-circle"></i></a></div>
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