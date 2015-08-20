var express = require('express');
var router = express.Router();
var userRoles={
  'public':1,
  'user':2,
  'admin':4
}
/* GET home page. */
router.get('/', function(req, res, next) {
  var role = userRoles.public, username = '';
    if(req.user) {
        role = req.user.role;
        username = req.user.username;
    }
    res.cookie('user', JSON.stringify({
        'username': username,
        'role': role
    }));
  res.render('index', { title: 'Express' });
});

module.exports = router;
