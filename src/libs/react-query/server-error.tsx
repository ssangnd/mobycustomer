import type { Mutation, Query } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { MappingErrorCode, ResponseType } from "./type";

const mappingErrorCode: MappingErrorCode = {
  1: { name: "CANCELLED" },
  2: { name: "UNKNOWN" },
  3: { name: "INVALID_ARGUMENT" },
  4: { name: "DEADLINE_EXCEEDED" },
  5: { name: "NOT_FOUND" },
  6: { name: "ALREADY_EXISTS" },
  7: { name: "PERMISSION_DENIED" },
  8: { name: "RESOURCE_EXHAUSTED" },
  9: { name: "FAILED_PRECONDITION" },
  10: { name: "ABORTED" },
  11: { name: "OUT_OF_RANGE" },
  12: { name: "UNIMPLEMENTED" },
  13: { name: "INTERNAL" },
  14: { name: "UNAVAILABLE" },
  15: { name: "DATA_LOSS" },
  16: { name: "UNAUTHENTICATED" },
  0: { name: "Unknown error" },
};

export const handleError = ({
  error,
  mutation,
  query,
}: {
  error: AxiosError;
  query?: Query;
  mutation?: Mutation;
}) => {
  const httpCode = error.response?.status || 0;
  const result = error.response?.data as ResponseType;

  if (httpCode >= 400) {
    const code = result?.code || 0;
    const message = result?.message;

    const errorInfo = mappingErrorCode[code];

    if (!errorInfo.hiddenNotification) {
      // showNotification({
      //   title: errorInfo.name,
      //   message: message,
      //   autoClose: false,
      //   color: "red",
      // });
    }
  }

  if (query) {
    console.log("Query: ", query?.queryKey);
    console.error("Error: ", error);
  }

  if (mutation) {
    console.log("Mutation: ", mutation.options.mutationFn);
    console.log("Variable: ", mutation.options.variables);
    console.error("Error: ", error);
  }
};
