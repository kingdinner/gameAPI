const app = require('./server');

module.exports.gameAPI = async (event) => {
    return app(event);
    //
};
  