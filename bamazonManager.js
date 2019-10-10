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

}

function addProduct(){

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