const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){

    if(!isValid(username)){
      return res.status(404).json({message : "Invalid Username."});
    }

    let filteredUsers = users.filter((user) => user.username === username);

    if(filteredUsers.length == 0){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    else {
      return res.status(404).json({message : "User already exists."});
    }

  }

  return res.status(404).json({message : "Unable to register user."});
});

// Get the book list available in the shop
const getBookListPromise = new Promise((resolve, reject) => {
  resolve(books);
})

public_users.get('/',function (req, res) {
  //return res.status(300).send(JSON.stringify(books));

  getBookListPromise.then((data) => {
    res.status(300).send(JSON.stringify(data));
  })
});

// Get book details based on ISBN
const getBookByISBNPromise = (ISBN) => new Promise((resolve, reject) => {
  resolve(books[ISBN]);
})

public_users.get('/isbn/:isbn',function (req, res) {
  //const ISBN = req.params.isbn;
  //return res.status(300).send(JSON.stringify(books[ISBN]));

  getBookByISBNPromise(req.params.isbn).then((data) => {
    res.status(300).send(JSON.stringify(data));
  })
 });
  
// Get book details based on author
const getBooksByAuthorPromise = (author) => new Promise((resolve, reject) => {
  let filteredBooks = {};

  //look through books and find all that are written by particular author
  for(var i in books){
    if(books[i]["author"] === author){
      filteredBooks[i] = books[i];
    }
  }

  resolve(filteredBooks);
})

public_users.get('/author/:author',function (req, res) {
  // const author = req.params.author;
  // let filteredBooks = {};
  //look through books and find all that are written by particular author
  // for(var i in books){
  //   if(books[i]["author"] === author){
  //     filteredBooks[i] = books[i];
  //   }
  // }
  // return res.status(300).send(JSON.stringify(filteredBooks));

  getBooksByAuthorPromise(req.params.author).then((data) => {
    res.status(300).send(JSON.stringify(data));
  })
});

// Get all books based on title
const getBooksByTitlePromise = (title) => new Promise((resolve, reject) => {
  let filteredBooks = {};

  //look through books and find all that have a particular title
  for(var i in books){
    if(books[i]["title"] === title){
      filteredBooks[i] = books[i];
    }
  }

  resolve(filteredBooks);
})

public_users.get('/title/:title',function (req, res) {
  // const title = req.params.title;
  // let filteredBooks = {};
  // //look through books and find all that have a particular title
  // for(var i in books){
  //   if(books[i]["title"] === title){
  //     filteredBooks[i] = books[i];
  //   }
  // }
  // return res.status(300).send(JSON.stringify(filteredBooks));
  getBooksByTitlePromise(req.params.title).then((data) => {
    res.status(300).send(JSON.stringify(data));
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  const ISBN = req.params.isbn;

  return res.status(300).send(JSON.stringify(books[ISBN]["reviews"]));
});

module.exports.general = public_users;
