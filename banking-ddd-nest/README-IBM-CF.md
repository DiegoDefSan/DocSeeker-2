# Deployment to IBM Cloud Foundry

## IBM Cloud

```
https://cloud.ibm.com/login
Email: pcsiebau@upc.edu.pe
Password: IBMCloudUPC2021
```

## Download Cloud Foundry CLI

```
https://github.com/cloudfoundry/cli/releases
```

## Verify Cloud Foundry CLI
```
$ cf --version
```

## Login to IBM Cloud Foundry

```
$ cf login
API endpoint: https://api.us-south.cf.cloud.ibm.com
Email: pcsiebau@upc.edu.pe
Password: IBMCloudUPC2021
```

## Deployment

```
$ npm run build
$ cd dist
$ cf push --no-start

- format: cf set-env {app-name} {var-name} {var-value}

$ cf set-env banking-ddd-nest-ebautista ENVIRONMENT prod
$ cf set-env banking-ddd-nest-ebautista BANKING_DDD_NEST_MYSQL mysql://admin:9lAzuWBCwMJZfqGlxAwC@mysql8.cselj9r9ujlf.us-east-2.rds.amazonaws.com:3306/banking-ddd-nest

$ cf push
```

## Database credentials
```
Host: mysql8.cselj9r9ujlf.us-east-2.rds.amazonaws.com
User: admin
Password: 9lAzuWBCwMJZfqGlxAwC
```


## Tip - Cloud Foundry Environment Variables

```
Strings containing the following characters must be quoted:
:, {, }, [, ], ,, &, *, #, ?, |, -, <, >, =, !, %, @, \.
```