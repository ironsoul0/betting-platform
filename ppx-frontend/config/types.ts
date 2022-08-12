export type BettingPlatform = {
  version: "0.1.0";
  name: "betting_platform";
  instructions: [
    {
      name: "createBet";
      accounts: [
        {
          name: "initializer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "betAccount";
          isMut: true;
          isSigner: true;
        },
        {
          name: "betResolver";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "eventId";
          type: "string";
        },
        {
          name: "makerSide";
          type: "u8";
        },
        {
          name: "betSize";
          type: "u64";
        }
      ];
    },
    {
      name: "matchBet";
      accounts: [
        {
          name: "initializer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "betAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "betResolver";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "resolveBet";
      accounts: [
        {
          name: "betResolver";
          isMut: true;
          isSigner: true;
        },
        {
          name: "betAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "makerAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "takerAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "resultSide";
          type: "u8";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "bet";
      type: {
        kind: "struct";
        fields: [
          {
            name: "eventId";
            type: "string";
          },
          {
            name: "makerSide";
            type: "u8";
          },
          {
            name: "resultSide";
            type: "u8";
          },
          {
            name: "betSize";
            type: "u64";
          },
          {
            name: "status";
            type: {
              defined: "BetStatus";
            };
          },
          {
            name: "maker";
            type: "publicKey";
          },
          {
            name: "taker";
            type: "publicKey";
          },
          {
            name: "betResolver";
            type: "publicKey";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "BetStatus";
      type: {
        kind: "enum";
        variants: [
          {
            name: "InProgress";
          },
          {
            name: "Matched";
          },
          {
            name: "Completed";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "BetMatched";
      msg: "Can not match bet because it is filled already.";
    }
  ];
};

export const IDL: BettingPlatform = {
  version: "0.1.0",
  name: "betting_platform",
  instructions: [
    {
      name: "createBet",
      accounts: [
        {
          name: "initializer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "betAccount",
          isMut: true,
          isSigner: true,
        },
        {
          name: "betResolver",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "eventId",
          type: "string",
        },
        {
          name: "makerSide",
          type: "u8",
        },
        {
          name: "betSize",
          type: "u64",
        },
      ],
    },
    {
      name: "matchBet",
      accounts: [
        {
          name: "initializer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "betAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "betResolver",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "resolveBet",
      accounts: [
        {
          name: "betResolver",
          isMut: true,
          isSigner: true,
        },
        {
          name: "betAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "makerAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "takerAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "resultSide",
          type: "u8",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "bet",
      type: {
        kind: "struct",
        fields: [
          {
            name: "eventId",
            type: "string",
          },
          {
            name: "makerSide",
            type: "u8",
          },
          {
            name: "resultSide",
            type: "u8",
          },
          {
            name: "betSize",
            type: "u64",
          },
          {
            name: "status",
            type: {
              defined: "BetStatus",
            },
          },
          {
            name: "maker",
            type: "publicKey",
          },
          {
            name: "taker",
            type: "publicKey",
          },
          {
            name: "betResolver",
            type: "publicKey",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "BetStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "InProgress",
          },
          {
            name: "Matched",
          },
          {
            name: "Completed",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "BetMatched",
      msg: "Can not match bet because it is filled already.",
    },
  ],
};
