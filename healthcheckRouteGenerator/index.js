module.exports = ({ router, mongoConnection, rabbitmqConnection }) => {
  router.get("/health", (req, res) => {
    if (mongoConnection) {
      const { readyState } = mongoConnection;
      // readyState is either 1 or to for connected or connecting
      if (readyState !== 1 && readyState !== 2) {
        return res.status(400).send("DATABASE CONNECTION DROPPED");
      }
    }
    if (rabbitmqConnection) {
      const { readable, writable } = rabbitmqConnection.stream;
      if (!readable || !writable) {
        return res.status(400).send("RABBITMQ CONNECTION DROPPED");
      }
    }
    return res.status(200).send("OK");
  });
};
