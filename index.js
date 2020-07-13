const mongodbCRUDGenerator = require('./mongodbCRUDGenerator');
const serverGenerator = require('./serverGenerator');
const healthchecRouteGenerator = require('./healthcheckRouteGenerator');
module.exports = {
    mongodbCRUDGenerator,
    serverGenerator,
    healthchecRouteGenerator,
}