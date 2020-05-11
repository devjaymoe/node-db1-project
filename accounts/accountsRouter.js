const express = require('express');
const db = require('../data/dbConfig.js');
const router = express.Router();

router.get('/', (req, res) => {
  db.from('accounts')
    .then(accounts => {
      res.status(200).json({ data: accounts })
    })
    .catch(error => {
      // save it to a log somewhere
      console.log(error);
      res.status(500).json({ message: error });
    })
});

router.get('/:id', (req, res) => {
  const id = req.params;
  db('accounts')
    .where(id)
    .first() // pick the first record from the array
    .then( account => {
      if (account) {
        res.status(200).json({ data: account })
      } else {
        res.status(404).json({ message: 'no account by that id' })
      }
    })
    .catch( error => console.log(error))
});

router.post("/", (req, res) => {
  const account = req.body;
  // a post must have title and contents
  if (isValidAccount(account)) {
    // once you know the post is valid then try to save to the db
    db("accounts")
      // there will be a warning in the console about .returnnin(), ignore it for SQLite
      .insert(account, "id")
      .then(ids => {
        res.status(201).json({ data: ids });
      })
      .catch(error => {
        // save the error to a log somewhere
        console.log(error);
        res.status(500).json({ message: error.messsage });
      });
  } else {
    res
      .status(400)
      .json({ message: "please provide title and contents for the post" });
  }
});

router.put('/:id', (req, res) => {
  const changes = req.body;

  // validate the data
  db('accounts')
    .where({ id: req.params.id })
    .update(changes)
    .then(count => {
      // the count is the number of records updated
      // if the count is 0, it means, the record was not found
      if(count) {
        res.status(201).json({data: count})
      } else {
        res.status(404).json({message: 'record not found by that id'})
      }
    })
    .catch(error => {
      // save the error to a log somewhere
      console.log(error);
      res.status(500).json({ message: error.messsage });
    })
});

router.delete('/:id', (req, res) => {
  // validate the data
  db('accounts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      // the count is the number of records updated
      // if the count is 0, it means, the record was not found
      if(count) {
        res.status(201).json({data: count})
      } else {
        res.status(404).json({message: 'record not found by that id'})
      }
    })
    .catch(error => {
      // save the error to a log somewhere
      console.log(error);
      res.status(500).json({ message: error.messsage });
    })
});

function isValidAccount(account) {
  return Boolean(account.name && account.budget);
}

module.exports = router;