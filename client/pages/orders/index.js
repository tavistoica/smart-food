import { ItemList } from "../../components/molecules/ItemList/ItemList";

import styles from "./index.module.css";

const OrderIndex = ({ orders }) => {
  const fields = ["meal.title", "status", "itemAmount", "meal.price"];
  const headers = ["Title", "Status", "Amount", "Price"];

  return (
    <div className={styles["orders-list"]}>
      <ItemList
        orders={orders}
        fields={fields}
        headers={headers}
        baseURL="/orders"
      />
    </div>
  );
};

OrderIndex.getInitialProps = async (_context, client) => {
  const { data } = await client.get("/api/orders", { withCredentials: true });

  return { orders: data };
};

export default OrderIndex;
