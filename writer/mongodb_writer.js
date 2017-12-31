const amqp = require('amqplib/callback_api');
const MongoClient = require('mongodb').MongoClient;

const mongoDB = process.env.MONGO_DB
const rabbitmq = process.env.RABBITMQ_HOST
const rabbitmqUser = process.env.RABBITMQ_USER
const rabbitmqPasswd = process.env.RABBITMQ_PASSWD

const mqTopic = 'extracted';

const dbUrl = 'mongodb://' + mongoDB + '/headless_crawler';
const colName = 'result';

class MongoDBWriter {
  async process() {
	amqp.connect('amqp://' + rabbitmqUser + ':' + rabbitmqPasswd + '@' + rabbitmq, function(err, conn) {
	  if (err) {
		console.log(err);
		throw err;
	  }
	  else {
		conn.createChannel(async (err, ch) => {
		  const db = await MongoClient.connect(dbUrl);
		  const col = db.collection(colName);

		  ch.consume(mqTopic, async (msg) => {
			const obj = JSON.parse(msg.content);
			console.log("Received %s", JSON.stringify(obj));

			col.update({"_id": obj["_id"]}, obj, {"upsert": true}, (err, res) => {
			  if (err) {
				console.log(err);
				throw err;
			  }
			});
		  }, {noAck: true});
		});
	  }
	});
  }
}

const runner = new MongoDBWriter();
runner.process();
