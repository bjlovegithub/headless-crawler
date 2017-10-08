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

const browser = (async () => {
  return await puppeteer.launch()
})()

const server = http.createServer(app);
server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});

app.post('/verify', function (req, res) {
  const val = (async (url, xpath) => {
	const page = await browser.newPage();
	await page.goto(url);
	await page.waitForXpath(xpath)  
	val = await page.$XPath(xpath)
	return val
  })(req.body.url, req.body.xpath);

  res.send(val)
})		

