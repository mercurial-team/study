//Данные о продуктах
var cart_products = [
	{
		name: 'Rebox Zane',
		price: 250,
		quantity: 1,
		image: 'img/cart_item_1.jpg',
	},
	{
		name: 'Rebox Zane_2',
		price: 350,
		quantity: 2,
		image: 'img/cart_item_2.jpg',
	}
]

//Подвал корзины 
function addTotalPriceAndButtons(cart_class, total_price){
	var total_block = document.createElement('div');
	total_block.classList.add('drop__flex', 'drop_cart', 'total_price');
	total_block.innerHTML = '<p>Total</p>';
	var price = document.createElement('p');
	price.innerHTML = '$ ' + total_price;
	total_block.appendChild(price);	
	//Создаем ссылки
	var item_button = document.createElement('a');
	item_button.classList.add('item_button');
	item_button.innerHTML = 'Checkout';
	item_button.href = '#'
	var go_to_cart = document.createElement('a');
	go_to_cart.classList.add('item_button', 'go_to_cart');
	go_to_cart.innerHTML = 'Go to cart';
	go_to_cart.href = 'shopping_cart.html';
	//Добавляем в корзину
	cart_place = document.querySelector('.' + cart_class);
	cart_place.appendChild(total_block);
	cart_place.appendChild(item_button);
	cart_place.appendChild(go_to_cart);
	
}

//Функция формирования продукта в корзине
function addItemToCart(cart_class, name, price, quantity, image_url){
	var drop_cart = document.createElement('div');
	drop_cart.classList.add('drop__flex', 'drop_cart');
	
	var cart_item = document.createElement('div');
	cart_item.classList.add('drop__h3', 'cart_item');
	
	drop_cart.appendChild(cart_item);
	//Формируем саму запись
	var cart_link = document.createElement('a');
	cart_link.href = '#';
	var cart_image = document.createElement('img');
	cart_image.classList.add('cart_image');
	cart_image.src = image_url;
	cart_image.alt = "cart item";
	cart_link.appendChild(cart_image);
	cart_item.appendChild(cart_link);
	
	var cart_info = document.createElement('div');
	cart_info.classList.add('cart_info');
	cart_item.appendChild(cart_info);
	//Название
	var item_name = document.createElement('a');
	item_name.classList.add('item_name');
	item_name.innerHTML = name;
	cart_info.appendChild(item_name);
	//Звезды
	var stars = document.createElement('img');
	stars.classList.add('stars');
	stars.alt = 'stars';
	stars.src = 'img/stars.png';
	cart_info.appendChild(stars);
	//Цена и количество
	var item_price_and_q = document.createElement('p');
	item_price_and_q.classList.add('item_price_and_q');
	item_price_and_q.innerHTML = quantity + ' x $' + price;
	cart_info.appendChild(item_price_and_q);
	//Кнопка удаления из корзины
	var delete_link = document.createElement('a');
	delete_link.onclick = deleteFromCart;
	delete_link.href = '#';
	delete_link.innerHTML = '<i class="fas fa-times-circle remove_from_cart"></i>';
	cart_info.appendChild(delete_link);
	
	cart_place = document.querySelector('.' + cart_class);
	cart_place.appendChild(drop_cart);
	
	return drop_cart;
}

//Функция обновления сообщения около корзины
function updateCartMessage(cart_class, message){
	cart_place = document.querySelector('.' + cart_class);
	cart_place.innerHTML = message;
}

//Функция формирования корзины
function formCart(cart_class, products){
	
	document.querySelector('.' + cart_class).innerHTML = ""; // очищаем корзину
	
	var total_quantity = products.length;
	var total_price = 0;
	for (var i = 0; i < products.length; i++){
		addItemToCart(cart_class, products[i].name, products[i].price, products[i].quantity, products[i].image);
		//console.log(products[i].image);
		total_price += products[i].price * products[i].quantity;
	} 
	if (total_quantity > 0){
		addTotalPriceAndButtons('cart_block', total_price);
		var message = 'В корзине: ' + total_quantity + ' товаров</br> на сумму ' + total_price + ' рублей';
		updateCartMessage('cart_message', message);
	}	else{
		var message = 'Корзина пуста';
		updateCartMessage('cart_message', message);
	}
}

//Функция добаdления товара в корзину
function addProductToCart(event){
	event.preventDefault();
	parent = event.currentTarget.parentElement.parentElement.parentElement;
	console.log(parent);
	var product_name = parent.querySelector('.product_name').innerHTML;
	var product_price = parent.querySelector('.product_price').innerHTML;
	product_price = product_price.replace('$','');
	var product_image = parent.querySelector('img').src;
	var new_product = {
		name: product_name,
		price: product_price,
		quantity: 1,
		image: product_image,
	}
	
	if (!containsObject(new_product, cart_products)){
		cart_products.push(new_product);
		//console.log(cart_products);
		formCart('cart_block', cart_products);
	}else{
		alert('такой товар уже есть в корзине');
	}
}

//Функция сравнения объектов по именам
function containsObject(obj, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].name === obj.name) {
            return true;
        }
    }
    return false;
}

//Прослушиваем кнопки удаления
function deleteFromCart(event){
	//console.log('Удаляем');
	var check_name = {
		name: event.currentTarget.parentElement.querySelector('.item_name').innerHTML,
	};
	
	if (containsObject(check_name, cart_products)){
		deleteFromCartByName(check_name.name, cart_products);
		console.log(cart_products);
		formCart('cart_block', cart_products);
	}
}

//Функция удаления из массива по имени
function deleteFromCartByName(name, cart){
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
			cart.splice(i, 1);
        }
    }
}

document.addEventListener("DOMContentLoaded", fullCart);

function fullCart(){
	formCart('cart_block', cart_products);
	
	var links = document.querySelectorAll('.add_to_chart');
	for (var i = 0; i < links.length; i++){
		links[i].onclick = addProductToCart;
	}
}

