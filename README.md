# headless-crawler

# Features
  * Read urls from message queue(like AWS SQS)
  * Fetch the html source with Chrome Headless Browser
  * Extract fields from html source through extraction template
  * Save the structured data into DB
  * UI to modify the extracton template

# Fetcher
## Export Env Variables
export MONGO_DB=localhost:27017
export RABBIT_MQ=localhost


## Build docker image
docker build -t headless-crawler/fetcher -f fetcher/Dockerfile .
docker run -d -t -i -e MONGO_DB='localhost:27017' -e RABBIT_MQ='localhost' headless-crawler/fetcher

# Setup
  * Install MongoDB
  * Run MongoDB with: mongod --dbpath ./mongo_db_dir/

# NOTE
  * puppeteer does not support XPath.