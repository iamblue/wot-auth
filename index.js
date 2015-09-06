var api = require('./lib/rpcAPI');

module.exports = {
  login:function(userId, password){
    return api.login(userId, password);
  },
  auth: function(session) {
    return api.grantCode(session);
  }
}