const fs = require('fs');
const path = require('path');
const { stringify } = require('querystring');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		const precioFinal = products.map(product => product.price - (product.price * (product.discount/100)));
		return res.render('products',{
			products,
			toThousand,
			precioFinal,
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
	const { id } = req.params;
    const product = products.find(product => product.id === +id);
	const precioFinal = product.price - (product.price * (product.discount/100));
	return res.render('detail',{
		...product,
		precioFinal,
		toThousand,

	})
	
	},

	// Create - Form to create
	create: (req, res) => {
	
	
		return res.render('product-create-form',{
			title:"Creacion del producto",
			
		})
	},
	
	// Create -  Method to store
	store: (req, res) => {
	
	const {id,name,price,discount,description,category}= req.body;

	const newProduct = {
		id: products[products.length -1 ].id +1,
		name: name.trim(),
		price: +price.trim(),
		discount: +discount.trim(),
		image: null,
		description: description.trim(),
		category: category,
	}

	products.push(newProduct);

	fs.writeFileSync('./src/data/productsDataBase',JSON.stringify((products, null, 3),'utf-8'))

		return res.redirect('/products');
	},

	// Update - Form to edit
	edit: (req, res) => {
		
		return res.render('edit')
	},
	// Update - Method to update
	update: (req, res) => {
		
		return res.render('update')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		
		return res.render('delete')
	}
};

module.exports = controller;