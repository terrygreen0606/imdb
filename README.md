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

## Environment Versions

Node js: 14.19

npm: 6.14.16

mysql: 8

## P.S

Didn't make the id field AUTO_INCREMENT, because the csv files already have id field, and those values need to be imported, rather than auto-generation incrementing.
