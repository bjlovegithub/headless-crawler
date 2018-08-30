# headless-crawler

# Features
  * Read urls from message queue(like RabbitMQ)
  * Fetch the html source with Chrome Headless Browser
  * Extract fields from html source through extraction template
  * Save the structured data into DB
  * UI to modify the extracton template

# Fetcher
## Export Env Variables
export RABBITMQ_HOST=
export RABBITMQ_USER=
export RABBITMQ_PASSWD=

## Build docker image
docker build -t headless-crawler/fetcher -f fetcher/Dockerfile .
docker run -d -t -i -e MONGO_DB='' -e RABBITMQ_HOST='' -e RABBITMQ_USER='' -e RABBITMQ_PASSWD='' headless-crawler/fetcher
		
docker build -t headless-crawler/writer -f writer/Dockerfile .
docker run -d -t -i -e MONGO_DB='' -e RABBITMQ_HOST='' -e RABBITMQ_USER='' -e RABBITMQ_PASSWD='' headless-crawler/writer

docker run -d -t -i -e MONGO_DB='192.168.0.3:27017' -p 8080:8080 headless-crawler/xpath_tool

# Setup
  * Install MongoDB
  * Run MongoDB with: mongod --dbpath ./mongo_db_dir/


# Run in minikube
* Install minikube by following the steps at: https://kubernetes.io/docs/tasks/tools/install-minikube/

* Execute: minikube start

* Let minikube use local docker registry: eval $(minikube docker-env)

* Execute: kubectl create -f k18s/service.yaml

* Expose service:
    * kubectl expose deployment/account-service --type="NodePort" --port 8080
  * kubectl expose deployment/account-service --type=LoadBalancer --name=accoun-service2			