/**
 * auth Service
 */

const usersData = require('../data/users');

/* eslint-disable class-methods-use-this */
module.exports = (app) => {
  class User extends app.Service {
    isExist(token) {
      return Object.keys(usersData).some((user) => {
        return usersData[user] === token;
      });
    }
  }
  return User;
};
