
My Digital Cookbook
===================

My Digital Cookbook is a MEAN webapp meant for users to be able to create, maintain, and, if they so wish, share their own personal recipes. These recipes can either be separate, or compiled into a cookbook, which can eventually be exported as a PDF.


Stack
=====

This application will be built using a MEAN stack, with Heroku being the method of deployment as of now.


Release Process
===============

This github repository is linked up with the Heroku app, and any changes pushed up to **Master** will be auto-built-and-deployed up to Heroku.

General development is being done under a **development** branch, and then later merged into master. Specific feature development is done under a **feature/feature-name** branch, and then later merged into master.


Running Locally
===============

In order to run the app locally, first clone the code from master onto your desktop. Open up a command prompt and run:

```
git clone https://github.com/aolgin/my-digital-cookbook.git [destination]
```

Then, navigate to it and install the necessary node modules:

```
cd my-digital-cookbook
npm install
```

Start up a MongoDB instance using the CLI. Note that this may require you to have a **/data/db** directory at the root of your filesystem:

```
mongod
```

Open up another command prompt and start the node server:

```
node server.js    # using node
nodemon server.js # or using nodemon (for auto-updating based on code changes)
```

Open up a web browser to **localhost:3000**, and the app should open up to the desired front page.
