const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const port = 1000

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret key for production
  resave: false,
  saveUninitialized: true,
}))

//cache
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});



app.get('/', (req, res) => {
  if (req.session.username && req.cookies.username) {
    res.redirect('/welcome');
  } else {
    const error=req.query.error
    res.render('login', { error });
  }
});

app.get('/login',(req,res)=>{
     res.redirect('/')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'Jhon' && password === '123') {
      req.session.username =username
      res.cookie('username',username)
      res.redirect('/welcome');
    } else {
      res.redirect('/?error=Please enter correct Username or Password');
    }
  });
  
  app.post('/logout',(req,res)=>{
    req.session.destroy()
    res.clearCookie("username")
    res.redirect('/login')
  })

app.get('/welcome',(req,res)=>{
    if(req.session.username && req.cookies.username)    res.render('welcome')
    else res.redirect('/')
  })

app.listen(port,()=>{
    console.log(`Server is running on localhost:${port} `)
})