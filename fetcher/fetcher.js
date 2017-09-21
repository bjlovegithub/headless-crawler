

const puppeteer = require('puppeteer');
const amqp = require('amqplib/callback_api');

const browser = await puppeteer.launch();



while (true) {
	const page = await browser.newPage();
	await page.goto('https://example.com');

	console.log('Dimensions:', dimensions);

	await browser.close();
}
