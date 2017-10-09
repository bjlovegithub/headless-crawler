const express = require('express');
const bodyParser = require('body-parser')
const http = require('http');
const puppeteer = require('puppeteer-xpath');

const app = express();
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.get('/index.html', function (req, res) {
  res.sendFile('index.html', options);
});

(async () => {
  var browser = await puppeteer.launch()

  app.post('/verify', function (req, res) {
	(async () => {
	  const page = await browser.newPage();
	  console.log(req)
	  await page.goto(req.body.url);
	  await page.waitForXpath(req.body.xpath)  
	  val = await page.$XPath(req.body.xpath)

	  res.send(val)
	})()
  })		

  const server = http.createServer(app);
  server.listen(8080, function listening() {
	console.log('Listening on %d', server.address().port);
  });
  
})()



