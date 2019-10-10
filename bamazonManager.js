require('dotenv').config();

var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.DATABASE_PW,
  database: 'bamazon'
});

connection.connect(function (error) {
  if (error) throw error;
  showMenu()
});

function showMenu(){
  inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'Welcome To Bamazon Mr. Man, Please Select An Option:',
    choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
  }).then(function(response, error){
    if(error) throw error;
    console.log(response);
    var choice = response.menu;
    switch(choice) {
      case 'View Products For Sale':
        viewProducts();
        break;
      case 'View Low Inventory':
        viewLowInv();
        break;
      case 'Add to Inventory':
        addInv();
        break;
      case 'Add New Product':
        addProduct();
        break;
    }
  })
}

function viewProducts(){
  var queryAll = 'SELECT * FROM products';
  connection.query(queryAll, function (error, response) {
    if (error) throw error;
    console.table(response);
    returnToMenu();
  })
}

function viewLowInv(){
  var query = 'SELECT * FROM products WHERE stock_quantity<20'
  connection.query(query, function(error, response){
    console.table(response);
    returnToMenu();
  })
}

function addInv(){
  inquirer.prompt({
    type: 'number',
    name: 'product_id',
    message: 'What is the ID of the product you want to restock?'
  }).then(function(response, error){
    if(error) throw error;
    var ID = response.product_id
    getStock(ID);
  })
}

function getStock(id){
  connection.query('SELECT * FROM products WHERE id='+id, function(error, response){
    restockProduct(id, response[0].stock_quantity);
  })
}

function restockProduct(id, stock){
  inquirer.prompt({
    type: 'number',
    name: 'restock',
    message: 'How much product would you like to restock?'
  }).then(function(response, error){
    var newStock = stock + response.restock;
    console.log(newStock)
    if(error) throw error;
    connection.query('UPDATE products SET stock_quantity='+ newStock + ' WHERE id='+id, function(error, results){
      console.log('Product Stock Ordered.');
      returnToMenu();
    });
  })
}

function addProduct(){
  inquirer.prompt([
  {
    type: 'input',
    name: 'product_name',
    message: 'What is the name of the product?'
  },
  {
    type: 'input',
    name: 'department_name',
    message: 'What department is it in?'
  },
  {
    type: 'number',
    name: 'price',
    message: 'How much does this product cost?'
  },
  {
    type: 'number',
    name: 'stock_quantity',
    message: 'How many are you stocking?'
  }
  ]).then(function(response, error){
    if(error) throw console.error();
    var newProduct = response;
    console.log(newProduct);
    connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE ("' + newProduct.product_name + '","' + newProduct.department_name + '",' + newProduct.price + ',' + newProduct.stock_quantity + ');', function (error, response) {
      console.log('Product entered.')
      returnToMenu();
    })

  })
}

function returnToMenu(){
  inquirer.prompt({
    type: 'confirm',
    name: 'return',
    message: 'Return to menu?'
  }).then(function(response, error){
    if(error) throw error;
    if(response.return === true){
      showMenu();
    } else {
      connection.end();
    }
  })
}