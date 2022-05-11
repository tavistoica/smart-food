import { OrderList } from "../../components/OrderList/OrderList";

import styles from "./index.module.css";

const OrderIndex = ({ orders }) => {
  return (
    <div className={styles["orders-list"]}>
      <OrderList orders={orders} />
    </div>
  );
};

OrderIndex.getInitialProps = async (_context, client) => {
  const { data } = await client.get("/api/orders");
  console.log("some data", data);

  return { orders: data };
};

export default OrderIndex;
