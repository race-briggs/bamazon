require('dotenv').config();

var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DATABASE_PW,
  database: 'bamazon'
});

connection.connect();

var bamazonTable;

connection.query('SELECT * FROM products', function(err, results, someFunction){
  if(err){
    console.log(err);
  };

  console.log('Welcome to Bamazon! Here are the products we have available for purchase:');
  bamazonTable = console.table(results);
  console.log(bamazonTable);
});

inquirer.prompt(
  {
    type: 'number',
    name: 'product_id',
    message: 'What is the ID of the product you would like to purchase'
  },
  {
    type: 'number',
    name: 'quantity',
    message: 'How much would you like to buy?'
  }
).then(function(response, error){
  if(error) throw error;
  console.log(response);
})

connection.end();