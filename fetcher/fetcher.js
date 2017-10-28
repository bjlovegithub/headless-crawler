const puppeteer = require('puppeteer-xpath');
const amqp = require('amqplib/callback_api');
const { URL } = require('url');

const xpath_conf = {};

class Fetcher {
  static getXpathConf(url, xpath_conf) {
	try {
	  const parser = new URL(url);

	  return xpath_conf[parser.hostname];
	}
	catch (e) {
	  console.log(e);

	  return undefined;
	}
  }

  async run() {
	const browser = await puppeteer.launch();
	
	amqp.connect('amqp://localhost', function(err, conn) {
	  conn.createChannel(function(err, ch) {
		var q = 'url';
		ch.consume(q, async (msg) => {
		  console.log("Received %s", msg.content.toString());

		  

		  const page = await browser.newPage();
		  await page.goto(msg.content.toString());

		  
		  
		}, {noAck: true});
	  });
	});
  }
}

module.exports = Fetcher;
