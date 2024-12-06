/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/student_records.json`.
 */
export type StudentRecords = {
  "address": "EJ8ErDmqaLffZHWfpsowrNycvbEYJUC4Q3QzMnHdTpMe",
  "metadata": {
    "name": "studentRecords",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addAchievement",
      "discriminator": [
        143,
        64,
        98,
        1,
        183,
        143,
        132,
        227
      ],
      "accounts": [
        {
          "name": "student",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "authorityGroup",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "achievement",
          "type": "string"
        }
      ]
    },
    {
      "name": "addAuthority",
      "discriminator": [
        229,
        9,
        106,
        73,
        91,
        213,
        109,
        183
      ],
      "accounts": [
        {
          "name": "authorityGroup",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "initializeAuthorityGroup",
      "discriminator": [
        64,
        247,
        147,
        70,
        126,
        27,
        149,
        30
      ],
      "accounts": [
        {
          "name": "authorityGroup",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "initializer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "authorities",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "initializeStudent",
      "discriminator": [
        112,
        55,
        47,
        7,
        217,
        128,
        228,
        180
      ],
      "accounts": [
        {
          "name": "student",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  117,
                  100,
                  101,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "contractState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "gpa",
          "type": "u8"
        },
        {
          "name": "rollNo",
          "type": "string"
        }
      ]
    },
    {
      "name": "intializeContract",
      "discriminator": [
        76,
        221,
        62,
        159,
        38,
        203,
        231,
        9
      ],
      "accounts": [
        {
          "name": "contractState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateStudent",
      "discriminator": [
        208,
        104,
        170,
        157,
        94,
        249,
        7,
        125
      ],
      "accounts": [
        {
          "name": "student",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  117,
                  100,
                  101,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "authorityGroup",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "gpa",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "authorityGroup",
      "discriminator": [
        228,
        92,
        193,
        5,
        218,
        34,
        61,
        98
      ]
    },
    {
      "name": "contract",
      "discriminator": [
        172,
        138,
        115,
        242,
        121,
        67,
        183,
        26
      ]
    },
    {
      "name": "student",
      "discriminator": [
        173,
        194,
        250,
        75,
        154,
        20,
        81,
        57
      ]
    }
  ],
  "types": [
    {
      "name": "authorityGroup",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authorities",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "contract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "students",
            "type": "u64"
          },
          {
            "name": "studentsList",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "student",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "gpa",
            "type": "u8"
          },
          {
            "name": "achievements",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "rollNo",
            "type": "string"
          }
        ]
      }
    }
  ]
};
