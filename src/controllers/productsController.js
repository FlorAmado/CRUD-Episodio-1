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
		price: +price,
		discount: +discount,
		image: null,
		description: description.trim(),
		category: category,
	}

	products.push(newProduct);

	fs.writeFileSync(productsFilePath,JSON.stringify((products, null, 3),'utf-8'))

		return res.redirect('/products');
	},

	// Update - Form to edit
	edit: (req, res) => {
		const { id } = req.params;
    	const product = products.find(product => product.id === +id);
		return res.render('product-edit-form',{
			...product,
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const {id} = req.params;
		
		const product = products.find(product => product.id === +id);

		const {name,price,discount,description,category}= req.body;

		const productModified = {
			id: +id,
			name: name.trim(),
			price: +price.trim(),
			discount: +discount.trim(),
			image: product.image,
			description: description.trim(),
			category: category,
		}

		const productsModified = products.map(product => {
			if(product.id  === +id){
				return productModified;
			}
			return product
		})

		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 3),'utf-8')

		return res.redirect('products/detail/'+ id)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		
		return res.render('delete')
	}
};

module.exports = controller;