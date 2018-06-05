var express = require('express');
var router = express.Router();
var http = require('http');        // 通过http模块访问cnDBPedia的接口
var querystring = require('querystring');    // 处理请求参数的querystring模块

router.post('/cnDBavpair', (request, response) => {

	console.log("cnDBprobase connect successfully");

	let queryContent = request.body.queryText;
	console.log("queryContent:"+queryContent);

	var postData = querystring.stringify({
	  "q": queryContent
	});

	var options = {
	  "method": "GET",
	  "hostname": "shuyantech.com",
	  "path": "/api/cndbpedia/avpair?" + postData
	};

	// 调用http模块的request方法请求cnDBPedia接口
	var req = http.request(options, function (res) {
		console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
		var resData = "";
    res.on('data', function (data) {
        resData += data;
    });
	  res.on("end", function () {
			console.log(resData);
			response.send({
				body: JSON.parse(resData)
			});
	  });
	});
	req.end();

});

module.exports = router;
