export interface AlisaRequest {
  session: {
    user: {
      user_id: string;
    };
  };
  version: string;
  request: {
    nlu?: {
      intents?: {
        test_add_note?: {
          slots?: {
            note?: {
              value: string;
            };
          };
        };
      };
    };
  };
}
