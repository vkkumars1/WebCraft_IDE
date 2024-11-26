

const tokenAndCookie = (userId, res) => {
    // userId and res of POST request of particular user
   
    
    // Save token in cookie
    res.cookie('token', token, {
        httpOnly: true,      // Prevents client-side JS from accessing the cookie
        secure: true,        // Ensures the cookie is sent over HTTPS
        sameSite: 'Lax',  // Prevents CSRF attacks (adjust as needed)
        maxAge: 24 * 60 * 60 * 1000 // 1 day expiration (adjust as needed)
    });
    
};

module.exports = tokenAndCookie;
