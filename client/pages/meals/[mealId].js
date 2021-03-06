import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

import styles from "./meal.module.css";

const buildDropdown = (stock) => {
  const response = [];
  for (let i = 1; i <= stock; i++) {
    response.push(<option value={i}>{i}</option>);
  }
  return response;
};

const MealShow = ({ meal }) => {
  const [itemAmount, setItemAmount] = useState(1);

  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      mealId: meal.id,
      itemAmount,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div className={styles["meal-page"]}>
      <h1>{meal.title}</h1>
      <h4>{meal.price}$</h4>
      <div>
        <img src={meal.imagePath} width="300px" />
      </div>
      <div>
        <select
          value={itemAmount}
          onChange={(event) => setItemAmount(event.target.value)}
        >
          {buildDropdown(meal.stock)}
        </select>
      </div>
      {errors}
      <button
        className={`btn btn-primary ${styles["purchase-btn"]}`}
        onClick={() => doRequest()}
      >
        Purchase
      </button>
    </div>
  );
};

MealShow.getInitialProps = async (context, client) => {
  const { mealId } = context.query;
  const { data } = await client.get(`/api/meals/${mealId}`, {
    withCredentials: true,
  });

  return { meal: data };
};

export default MealShow;
