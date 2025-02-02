# IMDB Backend Test

## Importing data to database

I could make the script to accept input parameters for importing data, but I thought it would be even more comfortable to use just one command to import all necessary data.
So, to import data, all you need is to run

```shell
$ npm run import
```

## Start server

```shell
$ npm run start
```

Opens the server at http://localhost:4000

## Open Swagger Api

After running server, please go to http://localhost:4000/api-docs/ to see the swagger.

## Environment Versions

Node js: 14.19

npm: 6.14.16

mysql: 8

## AWS

### Lambda

https://f21b26zr43.execute-api.ap-south-1.amazonaws.com/dev

This is the root api link for this app deployed.

### RDS (Mysql)

Using AWS RDS for mysql

## Unit Testing

```shell
$ npm run test
```

Added unit testing for movies api only for demonstration purpose. Can add more if you want.

## P.S

Didn't make the id field AUTO_INCREMENT, because the csv files already have id field, and those values need to be imported, rather than auto-generation incrementing.

## Debugging

If you have problems importing data complaining about loading local file, just add

```shell
$ SET GLOBAL local_infile=1;
```

to line 5 of script.js file
