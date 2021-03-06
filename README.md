# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate", `

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deploymen, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

## Others
To seed DB: psql -U {username} -d {dbname} -f ./seeds/seed.your_file_name.sql


psql -U etopxtibwiinzl:5c247065352c719155ee8db6f3c53345800c57c5e4786858d4857324274fd17e -h ec2-23-23-182-18.compute-1.amazonaws.com -p 5432 -d d89eb5hbjtaod0 -f ./seeds/seed.wishful_tables.sql