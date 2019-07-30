let add = (cart, req) => {
    cart.contents.push(req.body);
	calc_total_price(cart);
    return JSON.stringify(cart, null, 4);
};

let change = (cart, req) => {
    let find = cart.contents.find(el => el.id_product === +req.params.id);
	if (req.query.set === '1'){
    	find.quantity = req.body.quantity;
	} else{
		find.quantity += req.body.quantity;
	}
	calc_total_price(cart);
    return JSON.stringify(cart, null, 4);
};

let remove = (cart,req) => {
	if (req.query.remove_all === '1'){
		console.log('remove_all');
		cart.contents = [];
	} 
	else{
		let find = cart.contents.find(el => el.id_product === +req.params.id);
		cart.contents.splice(cart.contents.indexOf(find), 1);
	}
	calc_total_price(cart);
	return JSON.stringify(cart, null, 4);
}

let calc_total_price = (cart)=>{
	cart.countGoods = cart.contents.length;
	cart.amount = 0;
	for (el of cart.contents){
		cart.amount += el.price*el.quantity;
	}
}

module.exports = {
    add,
    change,
	remove
};