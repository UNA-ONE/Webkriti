const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify} = require('util');



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req,res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
return res.status(400).render('logsin', {
    message: 'please provide an email and password'
})
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (_error,results) => {
           console.log(results);
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('logsin',{
                    message:'E-mail or Password is Incorrect'
                })
            } else{
                const id = results[0].id;

                const token = jwt.sign({ id:id }, process.env.JWT_SECRET, {
                    expiresIn:process.env.JWT_EXPIRES_IN
                });
                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                    res.cookie('jwt', token, cookieOptions);
                    res.status(200).redirect("/dash");
            }


        })

    } catch (error) {
        console.log(error)
    }
}



exports.register = (req,res) =>{
    console.log(req.body);

    const { username, email, password ,confirmpassword} = req.body;

db.query('SELECT email FROM users WHERE email = ?',[email], async (error,results) => {
    if(error) {
        console.log(error);
    }

    if(results.length > 0 ) {
        return res.render('logsin',{
            message: 'That email is already in use'
        })
    } else if( password !== confirmpassword) {
        return res.render('logsin',{
            message: 'Password do not match'
        });
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    
    db.query('INSERT INTO users SET ?', {username : username, email:email, password:hashedPassword}, (error,results) =>{
            if(error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('logsin',{
                    message: 'Registered Succesfully'
                });

            }
    })

});
}








 exports.loggedin = async (req,res,next) => {
    //  console.log(req.cookies);
     if( req.cookies.jwt ) {
         try {
             const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

             console.log(decoded);

             db.query('SELECT * FROM users WHERE id = ?', [decoded.id] , (error, result) => {
                 console.log(result);
                 if(!result) {
                     return next();
                 }

                 req.user = result[0];
                 return next();
             });
         } catch (error) {
             console.log(error);
             return next();
         }
     } else {
        next();
     }
}


exports.logout = async (req,res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 3*1000),
        httpOnly: true

    } );

    res.status(200).redirect('/');
}