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

# Setup
  * Install MongoDB
  * Run MongoDB with: mongod --dbpath ./mongo_db_dir/

# NOTE
  * puppeteer does not support XPath.