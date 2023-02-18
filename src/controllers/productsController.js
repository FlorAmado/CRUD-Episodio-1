const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		const precioFinal = products.map(product => product.price - (product.price * (product.discount/100)) );
		
		res.render('products',{
			products,
			precioFinal,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {

		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		const {id}= req.params
		const product = products.find(product => product.id === +id);
		const precioFinal = product.price - (product.price * (product.discount/100))

		return res.render(`detail`,{
			...product,
			precioFinal,
			toThousand
		})

	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const {name,price,discount,category,description} = req.body
		
		const newProduct = {
			id : products[products.length - 1].id + 1,
			name : name.trim(),
			price: +price,
			discount : +discount,
			category : category,
			description : description.trim(),
			image: req.file ? req.file.filename : null,
		}
		
		products.push(newProduct)
		fs.writeFileSync(productsFilePath,JSON.stringify(products, null, 3), 'utf-8')
		
		//return res.send(req.file)
		return res.redirect('/products') 
	},

	// Update - Form to edit
	edit: (req, res) => {
		const { id } = req.params;
    	const product = products.find(product => product.id === +id);
		res.render("product-edit-form",{
			...product,
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const {id}= req.params
		const product = products.find(product => product.id === +id);
    	const {name,price,discount,category,description} = req.body

		const productModified = {
			id : +id,
			name: name.trim(),
			price: +price,
			discount: +discount,
			category: category,
			description: description.trim(),
			image: req.file ? req.file.filename : null, 
		}

		const productUpdate = products.map(product =>{
			if(product.id === +id ){
			  return productModified
			}
			return product
		  })
		  fs.writeFileSync(productsFilePath,JSON.stringify(productUpdate, null, 3), 'utf-8')

		  return res.redirect("/products/detail/"+id)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const id = req.params.id;
    	const productosModificados = products.filter(product => product.id !== +id);
    
    	fs.writeFileSync(productsFilePath,JSON.stringify(productosModificados, null, 3),'utf-8')
    	return res.redirect(`/products`)
	}
};

module.exports = controller;