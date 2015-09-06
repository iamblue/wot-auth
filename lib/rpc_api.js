var Promise = require('bluebird');
var superagent = require('superagent');
var id = 1;
var ubusStatus = require('./ubusStatus');
var RPCurl = '/ubus';

var rpcAPI = {
  request: function(config) {
    return new Promise(function(resolve, reject) {
      request
      .post(RPCurl)
      .send(config)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        // return res.ok ? resolve(res) : reject(err);
        if (!res) {
          return reject('Connection failed');
        }

        if (!res.ok) {
          return reject('Connection failed');
        }

        if (res.body && res.body.error) {
          return reject(res.body.error.message);
        }

        if (!res.body.result || res.body.result[0] != 0) {
          return reject(ubusStatus[res.body.result[0]]);
        } else {
          return resolve(res);
        }
      });
    });
  },
  // ====== login start ========
  login: function(userId, password) {

    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        '00000000000000000000000000000000',
        'session',
        'login',
        {
          username: userId,
          password: password
        }
      ]
    };
    return this.request(config);

  },

  grantCode: function(session) {

    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'session',
        'grant',
        {
          scope: 'uci',
          objects: [['*', 'read'], ['*', 'write']]
        }
    ]};

    return this.request(config);

  }
};

module.exports = rpcAPI;

