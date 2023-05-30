export type MappingErrorCode = {
  [key: number]: {
    name: string;
    hiddenNotification?: boolean;
  };
};

export type ResponseType = {
  code: number;
  details: string[];
  message: string;
};
