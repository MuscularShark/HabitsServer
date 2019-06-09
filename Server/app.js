const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const routes = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const models = require('./models');

mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);

mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('Database connection closed.'))
    .once('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });

//express
const app = express();

// sessions
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    })
);

//sets and uses
app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    '/javascripts',
    express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

app.get('/', (req, res) => {
    const id = req.session.userId;
    const Nickname = req.session.userNickname;
    if(!id){
        res.render('unlogged', {
            user: {
                id: "",
                Nickname: ""
            }
        });
    } else {

        models.Deal.find({userId: id}, (err, insulins) => {
            if(err){
                console.log(err);
            }
            models.User.findOne({_id: id}).then(user => {
            res.render('index', {
                user: {
                    id,
                    Nickname: user.nickname
                },
                insulins: insulins
            }); 
            }) 
        })
    }    
});

app.use('/api/auth', routes.auth);
app.use('/deal', routes.deal);
app.use('/user', routes.user);
app.use('/insulina', routes.insulin);
app.use('/sugar', routes.sugar);
app.use('/device', routes.device);


app.listen(config.PORT, () =>
    console.log(`Listening on port ${config.PORT}!`)
);