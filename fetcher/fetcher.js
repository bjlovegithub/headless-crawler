const puppeteer = require('puppeteer-xpath');
const amqp = require('amqplib/callback_api');
const { URL } = require('url');
const MongoClient = require('mongodb').MongoClient;

const mongoDB = process.env.MONGO_DB
const rabbitmq = process.env.RABBITMQ_HOST
const rabbitmqUser = process.env.RABBITMQ_USER
const rabbitmqPasswd = process.env.RABBITMQ_PASSWD

const dbUrl = 'mongodb://' + mongoDB + '/headless_crawler';
const colName = 'xpath_conf';

const TTL = 600000;

const xpath_conf = {};

class Fetcher {
  static async getXpathConf(url, xpath_conf) {
	try {
	  const parser = new URL(url);

	  if (xpath_conf[parser.hostname] === undefined ||
		  xpath_conf[parser.hostname].last_update - new Date().getTime() > TTL) {
		// query mongodb to get the latest xpath conf
		const db = await MongoClient.connect(dbUrl);
		const col = db.collection(colName);
		const docs = await col.find({sig: parser.hostname}).toArray();
		if (docs.length > 1) {
		  console.log("Multiple xpath conf for " + parser.hostname);
		  return undefined;
		}
		else if (docs.length == 0) {
		  console.log("No xpath conf for " + parser.hostname);
		  return undefined;
		}
		else {
		  xpath_conf[parser.hostname] = {"conf": docs[0].conf, "last_updated": new Date().getTime()}
		  return docs[0].conf;
		}
		db.close();
	  }
	  else {
		// already have a conf in the memory
		return xpath_conf[parser.hostname]["conf"];
	  }
	}
	catch (e) {
	  console.log(e);
	  return undefined;
	}
  }

  async process() {
	const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
	
	amqp.connect('amqp://' + rabbitmqUser + ':' + rabbitmqPasswd + '@' + rabbitmq, function(err, conn) {
	  if (err !== null) {
		console.log(err);
	  }
	  else {
		conn.createChannel(function(err, ch) {
		  var q = 'url';
		  ch.consume(q, async (msg) => {
			const url = msg.content.toString();
			console.log("Received %s", url);

			Fetcher.getXpathConf(url, xpath_conf).then(async (conf) => {
			  if (conf === undefined) {
				console.log("No conf for: " + host);
				// TODO - Send a metric
			  }
			  else {
				const page = await browser.newPage();
				await page.goto(url);

				const result = {};
				// extract all fields configured in conf
				const confMap = JSON.parse(conf);
				for (const name in confMap) {
				  if (confMap.hasOwnProperty(name) && name !== "sample_url") {
					await page.waitForXpath(confMap[name]);
					const content = await page.$XPath(confMap[name]);
					result[name] = content;  
				  }
				}
				console.log(result);
				ch.sendToQueue("extracted", Buffer.from(JSON.stringify({"_id": url, "result": result})));

				await page.close();
			  }
			}).catch((err) => {
			  console.log(err);
			});
		  }, {noAck: true});
		});
	  }
	});
  }
}

module.exports = Fetcher;
