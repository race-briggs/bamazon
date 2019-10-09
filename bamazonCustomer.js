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

connection.connect(function(error){
  if(error) throw error;
  showTable()
});

var chosenId;
var buyAmount;
var price;
var stock;

function showTable(){
  var queryAll = 'SELECT * FROM products';
  connection.query(queryAll, function(error, response){
    if(error) throw error;

    console.table(response);

    sellItem()
  })
}

function sellItem(){
  inquirer.prompt(
    {
      type: 'number',
      name: 'product_id',
      message: 'What is the ID of the product you would like to purchase'
    }
  ).then(function (response, error) {
    if (error) throw error;
    chosenId = response.product_id;

    getStock()
  })
}

function getStock(){

  var queryId = 'SELECT * FROM products WHERE id='+chosenId;
  connection.query(queryId, function(error, response){
    stock = response[0].stock_quantity;
    price = response[0].price;
    howMany();
  })
}

function howMany(){
  inquirer.prompt({
    type: 'number',
    name: 'quantity',
    message: 'How much would you like to purchase?'
  }).then(function (response, error) {
    if (error) throw error;
    console.log(response);
    buyAmount = response.quantity;
    console.log(stock)

    if(buyAmount > stock || stock === 0){
      noSale();
    } else {
      makeSale();
    }
  })
}

function noSale(){
  console.log("We're sorry, but we do not have enough stock remaining to allow that purchase.")
  dropConnection();
}

function makeSale(){
  var newStock = stock - buyAmount;
  var saleQuery = "UPDATE products SET stock_quantity="+newStock+" WHERE id="+chosenId;
  connection.query(saleQuery, function(error, response){
    if(error) throw error;
    var totalCost = buyAmount*price;
    console.log('Transaction completed, you will be billed $'+totalCost+". Thank you, and do come back!" )
  })

  dropConnection();
}

function dropConnection(){
  connection.end();
}