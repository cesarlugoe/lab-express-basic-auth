


function requireUser (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.redirect('/');
  }
  next();
}

function userLoggedIn (req, res, next) {
  if (!req.session.currentUser){
    return res.redirect('/auth/main')
  }
  next();
}


module.exports = { 
  requireUser,
  userLoggedIn
}