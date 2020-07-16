module.exports = ({
  router,
  healthcheckPath,
  mongoConnection,
  rabbitmqConnection,
}) => {
  if (!healthcheckPath) {
    healthcheckPath = "/health";
  }
  router.get(healthcheckPath, (req, res) => {
    if (mongoConnection) {
      const { readyState } = mongoConnection;
      // readyState is either 1 or to for connected or connecting
      if (readyState !== 1 && readyState !== 2) {
        console.log('DATABASE CONNECTION DROPPED');
        return res.status(503).send("DATABASE CONNECTION DROPPED");
      }
    }
    if (rabbitmqConnection) {
      const { readable, writable } = rabbitmqConnection.stream;
      if (!readable || !writable) {
        console.log('RABBITMQ CONNECTION DROPPED');
        return res.status(503).send("RABBITMQ CONNECTION DROPPED");
      }
    }
    return res.status(200).send("OK");
  });
};
