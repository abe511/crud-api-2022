## A simple CRUD API implementation using vanilla Node.js
---

### Setup:
>#### Install Typescript

as a dev dependency:\
`npm install typescript --save-dev`

or globally:\
`npm install -g typescript`

>#### Install all the dependencies
in the *project root* directory run:\
`npm install`


>#### Configure port
create a `.env` file in the *project root*\
define an environment variable:\
`PORT=<port_number>`\
*see `.env.example` file for reference*

---
### Execution:

>#### *Development* mode
`npm run start:dev`\
open `http://localhost:<port_number>/api/users/` in the browser\
*enter the port number you used in .env file*

>#### Check out the endpoints
##### *use POSTMAN or similar software to send requests*
* GET `/api/users` - fetch all records from the DB
* POST `/api/users` - insert a record into the DB
##### *use the following schema:*
```json
{
    "username": "name",
    "age": 123,
    "hobbies": [
        "hobbie1",
        "hobbie2",
        "etc.."
    ]
}
```
POST a couple of records\
the user ID will be generated automatically.\
GET the full list and copy an `id` to request a specific user record.

##### *replace \<userID> with the id you copied*
example:\
`http://localhost:8080/api/users/a1b123f0-4b0d-47ba-9c65-7e120e789b1a`
* GET `/api/users/<userID>` - get user record
* PUT `/api/users/<userID>` - modify user record
* DELETE `/api/users/<userID>` - remove user record

>#### *Production* mode
`npm run start:prod`

>#### *Cluster* mode
`npm run start:multi`

>#### To run tests
First run in *development* or *production* mode\
Switch to another terminal and run:  
`npm run test`