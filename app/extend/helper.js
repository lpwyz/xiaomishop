var sd = require('silly-datetime');
module.exports = {
  getTime(param) {
    /* param  时间戳  */
    return sd.format(new Date(param), 'YYYY-MM-DD HH:mm:ss');
  },
};
