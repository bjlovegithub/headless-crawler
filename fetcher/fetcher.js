

var puppeteer = require('puppeteer');
const amqp = require('amqplib/callback_api');

(async () => {
  const browser = await puppeteer.launch();
  
  amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
	  var q = 'url';

	  ch.assertQueue(q, {durable: true});
	  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
	  ch.consume(q, async (msg) => {
		console.log(" [x] Received %s", msg.content.toString());

		const page = await browser.newPage();
		await page.goto(msg.content.toString());

		
		
	  }, {noAck: true});
	});
  });
})();
