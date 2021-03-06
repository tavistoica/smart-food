import { OrderCancelledEvent, OrderStatus } from "@ostoica/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "@ostoica/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../model/order.model";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Pending,
    price: 10,
    userId: "random",
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    meal: {
      id: "randomId",
      stock: 10,
      imagePath: "test",
    },
    itemAmount: 5,
  };

  //    @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("updates the status of the order", async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);
  const orderUpdated = await Order.findById(order.id);

  expect(orderUpdated!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
