import axios from "axios";
import { useState } from "react";

import { HOST_URL } from "../utils/constants";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const config =
    process?.env?.IS_PRODUCTION !== "false" ? HOST_URL.PROD : HOST_URL.DEV;

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](
        `${config.SERVER_URL}${url}`,
        {
          ...body,
          ...props,
        },
        {
          withCredentials: true, // Now this is was the missing piece in the client side
        }
      );
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response?.data?.errors?.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
