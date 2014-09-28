/* jshint node:true */
var express = require('express'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    cons = require('consolidate'),
    fruitRouter = require('./routes/fruit');

var app = express(),
    appRoot = process.cwd();

initAppConfig(app);
initMiddleware(app);
app.listen(3000);
/**
 * 初始化配置项
 */
function initAppConfig(app) {
    //app.enable('view cache');
    app.enable('strict routing');
    app.enable('x-powered-by');
    /*
    app.engine('html', cons.swig);
    // set .html as the default extension 
    app.set('view engine', 'html');
    app.set('views', appRoot + '/views');
    */
}
/**
 * 初始化中间件
 */
function initMiddleware(app) {
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyParser.json());
    app.use(favicon(appRoot + '/static/img/favicon.ico'));
    app.use('/static', express.static(appRoot + '/static'));
    app.use('/views', express.static(appRoot + '/views'));
    app.use('/fruit', fruitRouter);
    app.use('/', function(req, res) {
        res.sendFile('/views/singlepage/index.html', {root: appRoot});
    });
}
