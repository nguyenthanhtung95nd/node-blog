const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = new express()
const expressSession = require('express-session');
const validateMiddleWare = require('./middleware/validateMiddleWare.js')
const authMiddleware = require('./middleware/authMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')

// Đăng ký template engine ejs
const ejs = require('ejs')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.raw());

// Đăng ký controller
const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const aboutController = require('./controllers/about')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')

// Connect to database
try {
    mongoose.connect('mongodb+srv://xxxxxxxx', { useNewUrlParser: true })
    console.log('Database connected ...');
} catch (error) {
    console.log("Connect to database error");
}
// Đăng ký file upload
const fileUpload = require('express-fileupload')
app.use(fileUpload())

// Đăng ký thư mục public.
app.use(express.static('public'))

// Create server
app.listen(4000, () => {
    console.log('App listening on port 4000')
})

// Use session
app.use(expressSession({
    secret: 'session-secret'
}));

global.loggedIn = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next()
});

// Using middle ware validate input
app.use('/posts/store', validateMiddleWare)

app.get('/', homeController)

app.get('/posts/new', authMiddleware, newPostController)

app.get('/post/:id', getPostController)

app.post('/posts/store', authMiddleware, storePostController)

app.get('/about', aboutController)

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)

app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)

app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);

app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController)

app.get('/auth/logout', logoutController)

app.use((req, res) => res.render('notfound'));