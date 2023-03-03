var express = require('express');
var router = express.Router();
function requireAuth(req, res, next)
{
    //check if the user is logged in
    if (!req.isAuthenticated())
    {
        return res.redirect('/login')
    }
    next();
}

let indexController = require('../controllers/index');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Placeholder');
});

router.get('/edit/:id', requireAuth,indexController.displayBusUserEditPage);

/*POST Route for processing the Edit page - UPDATE Operation*/
router.post('/edit/:id', requireAuth,indexController.processEditPage);

/*GET to perform Deletion - DELETE Operation */
router.get('/delete/:id', requireAuth,indexController.performDelete);

module.exports = router;
