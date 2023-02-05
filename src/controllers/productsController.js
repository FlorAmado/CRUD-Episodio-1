const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic
		return res.render('index',{
			
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
	const { id } = req.params;
    const product = products.find(product => product.id === +id);
	const precioFinal = product.price - (product.price * (product.discount/100));
	/* const total = if (product.discount >0) {
		return product
	} */
	
	return res.render('detail',{
			title:"Detalle del producto",
			...product,
			precioFinal,
		})
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic
		return res.render('create')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		return res.render('store')
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		return res.render('edit')
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		return res.render('update')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		return res.render('delete')
	}
};

module.exports = controller;