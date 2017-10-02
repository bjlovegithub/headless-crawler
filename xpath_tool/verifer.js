const express = require('express');
const http = require('http');

const app = express();
app.use(express.static(__dirname))

app.get('/index.html', function (req, res) {
  res.sendFile('index.html', options);
});

const server = http.createServer(app);
server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});

/*
(async () => {
		const browser = await puppeteer.launch();
		
		var q = 'url';

		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

		const page = await browser.newPage();
		await page.goto(msg.content.toString());
})();
*/
