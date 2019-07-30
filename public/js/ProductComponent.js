Vue.component('products', {
	data() {
		return {
			products: [],
		}
	},
	mounted() {
		this.$parent.getJson(`/api/products`)
			.then(data => {
				for (let el of data) {
					this.products.push(el);
				}
			})
	},
	template: ` <section class="container catalog-flex">
				<div class="catalog__header">
					<h2 class="catalog_h2">Fetured Items</h2>
					<p class="h_2_description">Shop for items based on what we featured in this week</p>
				</div>
				<div class="catalog-products">
					<product v-for="el of products" 
                    	:key="el.id_product"
                    	:product="el">
                	</product>
				<div class = "no_items_catalog" v-if="this.products.length<1">Нет товаров</div>	
				
				<a  v-if="!this.products.length<1" href="product.html" class="button catalog_browse_button">Browse All Product <img src="img/arrow-right.png" alt="arrow right"></a>

				</div>
			</section>`
});

Vue.component('catalog', {
	data() {
		return {
			products: [],
		}
	},
	mounted() {
		this.$parent.getJson(`/api/catalog`)
			.then(data => {
				for (let el of data) {
					this.products.push(el);
				}
			})
	},
	template: `<div class="catalog-products">
					<product v-for="el of products" 
                    	:key="el.id_product"
                    	:product="el">
                	</product>
				<div class = "no_items_catalog" v-if="this.products.length<1">Нет товаров</div>	
				</div>`
});

Vue.component('alsolike', {
	data() {
		return {
			products: [],
		}
	},
	mounted() {
		this.$parent.getJson(`/api/likeproducts`)
			.then(data => {
				for (let el of data) {
					this.products.push(el);
				}
			})
	},
	template: ` <section class="catalog_main_page">
			<div class="container catalog-flex">
            <div class="catalog__header">
                <h2 class="catalog_h2 catalog_h2_single_page_mod">you may like also</h2>
            </div>
            <div class="catalog-products">
					<product v-for="el of products" 
                    	:key="el.id_product"
                    	:product="el">
                	</product>
				<div class = "no_items_catalog" v-if="this.products.length<1">Нет товаров</div>	
				</div>
			</div>
			</div>
			    </section>`
});

Vue.component('product', {
	data(){
		return{
			standart_product_img: 'https://placehold.it/261x279',
		}
	},
	props: ['product'],
	template: `<div class="product-card">
				<div class="product_img">
					<img :src='product.image' :alt='product.name'>
					<div class="product_hover">
						<a class="add_to_chart" href="#" @click.prevent="$root.$refs.cart.addProductToCart(product)">
						<img class="cart product_cart" src="img/product-cart.svg" alt="cart">Add to Cart</a>
					</div>
				</div>
				<a href="single_page.html" class="product_name">{{product.product_name}}</a>
				<p class="product_price">$ {{product.price}}</p>
		</div>`,
	mounted(){
		fetch(this.product.image)
		.then( result =>{
			if(result.status!='200'){
				this.product.image = this.standart_product_img;
			}
		})
	}
})
