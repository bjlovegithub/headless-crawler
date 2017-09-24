var puppeteer = require('puppeteer');

(async () => {
		const browser = await puppeteer.launch();
		
		var q = 'url';

		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

		const page = await browser.newPage();
		await page.goto(msg.content.toString());
})();
