require("./src/configs/envConfigs").config();
const express  = require('express')
const app = express()
const bodyParser = require('body-parser')
const routes = require("./src");
app.use(bodyParser.json())

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerJsDocs = YAML.load('./api.yaml')



//connection to MongoDb
require('./src/configs/mongoConfigs')

app.set('view engine', 'ejs')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDocs))
app.use('/', routes)

app.listen(3000, () => {
    console.log('server running at 3000 port')
})