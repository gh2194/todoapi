/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

'use strict';

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');
const { db } = require('../../db/mongoose');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/config');

// test data
const testTodos = [
  { _id: new ObjectID(), text: 'mocha testing todo #1' },
  { _id: new ObjectID(), text: 'mocha testing todo #2' },
];

const testToken = (() => {
  const _id = new ObjectID();
  return jwt.sign({ _id }, jwtSecret);
})();

const testUsers = (() => {
  const _id = new ObjectID();
  const access = 'auth';
  const token = jwt.sign({ _id, access }, jwtSecret);
  const tokens = [{ access, token }];

  return [
    {
      _id,
      email: 'bob@example.org',
      password: 'userOnePass',
      tokens,
    },
    {
      _id: new ObjectID(),
      email: 'jane@example.org',
      password: 'userTwoPass',
    },
  ];
})();

// wait until connection is ready before testing
const waitForMongoServer = done => db.on('connected', done);

// populate with test data
// const populateTodos = (done) => {
//   Todo.deleteMany().then(() => Todo.insertMany(testTodos))
//     .then(() => done())
//     .catch(done);
// };

// version that returns a promise rather than using the done callback
const populateTodos = () => Todo.deleteMany().then(() => Todo.insertMany(testTodos));
// create instead of insertMany to let the pre-save hook run (which hashes pwds)
const populateUsers = () => User.deleteMany().then(() => User.create(testUsers));

module.exports = {
  testTodos,
  testUsers,
  testToken,
  waitForMongoServer,
  populateTodos,
  populateUsers,
};
