const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(403); 
  // console.log("token ", token);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); 
    // console.log("user obj ",user);
// 
    req.user = user; 
    userRole = user.role;
    // console.log("id ", user.id);
    // console.log('role ', userRole);
    next();
  });
};

module.exports = auth;