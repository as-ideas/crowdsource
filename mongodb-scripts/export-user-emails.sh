if [[ $# -eq 0 ]] ; then
    echo 'Enter password for MongoDB user "CrowdProdUser" as parameter'
    exit 0
fi

CROWD_PROD_PASSWORD=$1

mongoexport \
  --host CrowdProduction-shard-0/crowdproduction-shard-00-00-je9bv.mongodb.net:27017,crowdproduction-shard-00-01-je9bv.mongodb.net:27017,crowdproduction-shard-00-02-je9bv.mongodb.net:27017 \
  --ssl \
  --username CrowdProdUser \
  --password $CROWD_PROD_PASSWORD \
  --authenticationDatabase admin \
  --db crowdsource_as_prod \
  --collection users \
  --type csv \
  --out crowd-users.csv \
  --fields "email,firstName,lastName"