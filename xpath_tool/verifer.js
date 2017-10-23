const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const puppeteer = require('puppeteer-xpath');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.get('/index.html', function (req, res) {
  res.sendFile('index.html', options);
});

const dbUrl = 'mongodb://localhost:27017/headless_crawler';
const colName = 'xpath_conf';

(async () => {
  var browser = await puppeteer.launch()

  // handler to verify the xpath
  app.post('/verify', function (req, res) {
	(async () => {
	  const page = await browser.newPage();
	  await page.goto(req.body.url);
	  await page.waitForXpath(req.body.xpath)
	  val = await page.$XPath(req.body.xpath)

	  res.send(val)
	})()
  })

  // handler to load extractor conf from mangodb.
  app.post('/load_conf', function (req, res) {
	(async () => {
	  MongoClient.connect(dbUrl, function(err, db) {
		console.log("Connected successfully to server");
		const col = db.collection(colName);
		col.find({sig: req.body.sig}).toArray(function(err, docs) {
		  db.close();

		  if (err != null) {
			console.log(err);
			res.status(500).send(err);
		  }
		  else {
			if (docs.length != 1) {
			  res.status(500).send("Multiple xpath conf for " + req.body.sig);
			}
			else {
			  res.status(200).send(docs[0].conf);
			}
		  }
		})
	  })
	})()
  })	
  
  // handler to save extractor conf into mangodb.
  app.post('/save_conf', function (req, res) {
	(async () => {
	  MongoClient.connect(dbUrl, function(err, db) {
		console.log("Connected successfully to server");
		const col = db.collection(colName);
		col.findOneAndUpdate(
		  {sig: req.body.sig},
		  {$set: {conf: req.body.conf}},
		  {returnOriginal: false, upsert: true},
		  function (err, r) {
			if (err != null)
			  res.send({"status": false, "info": err});
			else
			  res.send({"status": true});
			
			db.close();
		  });
	  })
	})()
  })


  // test the xpath conf
  app.post('/test_conf', function (req, res) {
	(async () => {
	  try {
		const confObj = JSON.parse(req.body.conf);
		const url = confObj['sample_url'];
		const page = await browser.newPage();
		await page.goto(url);

		result = [];
		
		for (let k in confObj) {
		  if (k === 'sample_url')  continue;

		  const xpath = confObj[k];
		  await page.waitForXpath(xpath);
		  const val = await page.$XPath(xpath);

		  result.push([k, val]);
		}
		res.send(result);
	  }
	  catch (e) {
		res.send(e);
	  }
	})()
  })
		   
		   
  const server = http.createServer(app);
  server.listen(8080, function listening() {
	console.log('Listening on %d', server.address().port);
  });
  
})()



