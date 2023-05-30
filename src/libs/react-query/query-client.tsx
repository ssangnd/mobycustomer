import {
  Mutation,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { handleError } from "./server-error";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (error instanceof AxiosError) {
        handleError({
          error,
          mutation: mutation as Mutation,
        });
        return;
      }
      console.error("Unknown error: ", error);
    },
  }),
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (error instanceof AxiosError) {
        handleError({
          error,
          query,
        });
        return;
      }
      console.error("Unknown error: ", error);
    },
  }),
});
