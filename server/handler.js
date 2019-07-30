const cart = require('./cart');
const fs = require('fs');

const actions = {
    add: cart.add,
    change: cart.change,
	remove: cart.remove,
};

const handler = (req, res, action, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if(err){
            res.send({result: 0, text: 'Error!'})
        } else {
            let newCart = actions[action](JSON.parse(data), req);
			let cartInfo = JSON.parse(newCart);
            fs.writeFile(file, newCart, (err) => {
                if(err){
                    res.send({result: 0, text: 'Error!'})
                } else {
                    res.send({result: 1, cartInfo, text: 'Success!'})
                }
            })
        }
    })
};

module.exports = handler;