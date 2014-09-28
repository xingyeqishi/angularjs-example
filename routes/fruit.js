var express = require('express'),
    fs = require('fs'),
    Q = require('q');

var router = express.Router();
var appRoot = process.cwd();

// 新增
router.post('/add.ajax', function(req, res) {
    var data = require('../data/fruit.json');
    var params = req.body;
    if (getItem(data, params) !== -1) {
        res.json({status: 300, errorMsg: '该水果已存在'});
    } else {
        params.createTime = (new Date()).getTime();
        data.unshift(params);
        updateJSON(data)
        .then(function(data) {
            res.json({status: 200, data: params}); 
        });
    }
});

router.get('/', function(req, res) {
    res.sendFile('/views/step1/fruit.html', {root: appRoot});
});
router.get('/result', function(req, res) {
    res.sendFile('/views/step2/fruit.html', {root: appRoot});
});

// 列表
router.get('/list.ajax', function(req, res) {
    var data = require('../data/fruit.json');
    res.json({status:200, data:data});
});

// 更新
router.post('/update.ajax', function(req, res) {
    var data = require('../data/fruit.json');
    var params = req.body;
    deleteItem(data, params);
    params.createTime = (new Date()).getTime();
    data.unshift(params);
    updateJSON(data)
    .then(function(data) {
        res.json({status:200, data:params}); 
    });

});
// 删除
router.post('/delete.ajax', function(req, res) {
    var data = require('../data/fruit.json');
    var params = req.body;
    deleteItem(data, params);
    updateJSON(data);
    res.json({ status:200 });
});

// 从数组中获取某一项的索引
function getItem(data, obj) {
    var pos = -1;
    data.some(function(item, index) {
        if (item.fruitName == obj.fruitName) {
            pos = index;
            return true;
        }
        return false;
    });
    return pos
}
// 从数据中删除某一项
function deleteItem(data, obj) {
    data.some(function(item, index) {
        if (item.fruitName == obj.fruitName) {
            data.splice(index, 1);
            return true;
        }
        return false;
    });

}
// 更新json文件
function updateJSON(data) {
    var deferred = Q.defer();
    data = JSON.stringify(data);
    fs.writeFile(appRoot + '/data/fruit.json', data, function(err) {
        if(err) {
            console.log(err);
            deferred.reject(err);
        }
        deferred.resolve(data);
    });
    return deferred.promise;
}
module.exports = router;
