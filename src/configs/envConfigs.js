const path = require("path");

exports.config = () => {
    const environment = process.env.env || process.env.ENV || process.env.ENVIRONMENT;
    let envPath = "environment/.env-dev";
    if (environment === "dev") {
        envPath = "environment/.env-dev";
    } else if (environment === "stg") {
        envPath = "environment/.env-stg";
    }
  
    require("dotenv").config({ path: path.resolve(process.cwd(), envPath) });
  
    return environment;
  };