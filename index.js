const { CaptchaGenerator } = require("captcha-canvas");
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const domain = "localhost:8080" //api.taejung.xyz
const port = 8080

app.use('/v3/captcha', serveStatic(path.join(process.cwd(), './v3/captcha')));

app.get('/v3/captcha', function (req, res) {
	function hex2() { //
		var result = '';
		var strs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var strslenth = strs.length;
		for (var i = 0; i < 10; i++) {
			result += strs.charAt(Math.floor(Math.random() * strslenth));
		}
		return result;
	}
	const captcha = new CaptchaGenerator();
	const code = hex2()
	const file_path = `./v3/captcha/${code}.png`
	fs.writeFileSync(`./v3/captcha/${code}.png`, captcha.generateSync());
	const img = `http://${domain}/v3/captcha/${code}.png`;
	const json = {
		"api" : "taejung_api_v3",
		"success" : "true",
		"img" : img,
		"key" : captcha.text
	}
    res.json(json);	
	setTimeout(() => {
		fs.unlink(file_path, function(err){
			if(err) {
			  console.log(err)
			}
		  })
	}, 300000); //300000 = 5분
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.listen(port , function() {
	console.log(`listen on ${port}`)
})






