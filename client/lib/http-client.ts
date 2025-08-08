import { ApiError } from "@/types/api-error.type";
import { SerializedError } from "@reduxjs/toolkit";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  ApiError
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  })(args, api, extraOptions);

  if (result.error) {
    // Handle `SerializedError` if it appears, and convert it to `ApiError`
    if ("status" in result.error) {
      // If the error is of type `FetchBaseQueryError`
      const error = result.error as FetchBaseQueryError;
      const customErrorObj = {
        error: {
          status: error.status as number,
          message:
            (error.data as { msg: string })?.msg || "Unknown error message",
          code: (error.data as { code: number })?.code || -99999,
        },
      };

      if (
        customErrorObj.error.status == 401 ||
        customErrorObj.error.code == -1204
      ) {
        window.history.pushState({}, "", "/login");
      } else {
        toast.error(customErrorObj.error.message);
      }

      return customErrorObj;
    } else {
      // If the error is `SerializedError`, transform it to `ApiError`
      const error = result.error as SerializedError;
      const customErrorObj = {
        error: {
          status: 500,
          message: error.message || "Serialized error occurred",
          code: -99999,
        },
      };

      if (
        customErrorObj.error.status == 401 ||
        customErrorObj.error.code == -1204 //invalid session error code
      ) {
        window.history.pushState({}, "", "/login");
      } else {
        toast.error(customErrorObj.error.message);
      }

      return customErrorObj;
    }
  }

  return result;
};

export const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  return result;
};
