const express = require("express");

const db = require("../data/dbConfig.js");
const AccountsRouter =  require('../accounts/accountsRouter.js');
const server = express();

server.use(express.json());

server.use('/accounts', AccountsRouter);

server.get('/', (req, res) => {
  res.status(200).json({ message: 'server is up'})
})

module.exports = server;
