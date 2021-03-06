import { natsWrapper } from "@ostoica/common";
import { OrderCreatedListener } from "./events/listener/order-created-listener";

const start = async () => {
  console.log("started expiration service");
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Environment variable 'NATS_CLIENT_ID' is not defined.");
  }
  if (!process.env.NATS_URL) {
    throw new Error("Environment variable 'NATS_URL' is not defined.");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Environment variable 'NATS_CLUSTER_ID' is not defined.");
  }

  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  );

  natsWrapper.client.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  process.on("SIGINT", () => natsWrapper.client.close());
  process.on("SIGTERM", () => natsWrapper.client.close());

  new OrderCreatedListener(natsWrapper.client).listen();
};

start();
