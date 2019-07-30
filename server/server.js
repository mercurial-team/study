const express = require('express');
const fs = require('fs');
const cart = require('./cartRouter');
const app = express();

app.use(express.json());
app.use('/', express.static('public'));
app.use('/api/cart', cart);


makeUponRequest('/api/products', 'server/db/products.json');
makeUponRequest('/api/catalog', 'server/db/catalog.json');
makeUponRequest('/api/likeproducts', 'server/db/likeProducts.json');


function makeUponRequest(apiPart, apiFile){
	app.get(apiPart, (req, res) => {
    fs.readFile(apiFile, 'utf8', (err, data) => {
        if(err){
            res.send({result: 0, text: 'Error!'})
        } else {
            res.send(data)
        }
    })
	});
}



app.listen(3000, () => console.log('Server started....'));