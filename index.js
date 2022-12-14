const buildEnvironment = require("./src/configs/envConfigs").config();
const express  = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())


//connection to MongoDb
require('./src/configs/mongoConfigs')

app.set('view engine', 'ejs')


app.use('/', require('./src/routes/auctonDetails.routes'))

app.listen(3000, () => {
    console.log('server running at 3000 port')
})