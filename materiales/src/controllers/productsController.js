const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products');
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		res.render('detail');
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},
	
	// Create -  Method to store

/* Creating a new product and adding it to the products array. */
	store: (req, res) => {
		let image 
		if(req.files[0] != undefined){
			image = req.files[0].filename;	
		}else{
			image = 'default-image.png'
		}
		let newProduct = {
			id: products[products.length - 1].id + 1,
			...req.body,
			image: image,
		}
		products.push(newProduct)
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null));
		res.redirect('/')
	},

	// Update - Form to edit
	edit: (req, res) => {
		let productToEdit = products.find(product => product.id == req.params.id)
		console.log(productToEdit);
		res.render('product-edit-form',{productToEdit});	
	},
	// Update - Method to update
	update: (req, res) => {
		let productToUpdate = products.find(product => product.id == req.params.id)
		let image 
		if(req.files[0] != undefined){
			image = req.files[0].filename;	
		}else{
			image = productToUpdate.image;
		}
		let NewProductToUpdate = {
			id: productToUpdate.id,
			...req.body,
			image: image,
		}
		let newProduct = products.map(product =>{
			if (product.id == NewProductToUpdate.id){
				return product = {...NewProductToUpdate}
			} 
			return product;
		})
		fs.writeFileSync(productsFilePath,JSON.stringify(newProduct,null));
		res.redirect('/')
	}
	,

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productosFiltrados = products.filter(product => product.id != req.params.id)
		fs.writeFileSync(productsFilePath,JSON.stringify(productosFiltrados,null));
		res.redirect('/')
		// Do the magic
	}
};

module.exports = controller;