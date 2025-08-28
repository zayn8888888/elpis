module.exports = {
  "/api/proj/business/list": {
    get: {
      query: {
        type: "object",
        properties: {
          page: {
            type: "string",
          },
          size: {
            type: "string",
          },
        },
        required: ["page", "size"],
      },
    },
  },
  "/api/proj/business": {
    delete: {
      body: {
        type: "object",
        properties: {
          product_id: {
            type: "string",
          },
        },
        required: ["product_id"],
      },
    },
    post: {
      body: {
        type: "object",
        properties: {
          product_name: {
            type: "string",
          },
          price: {
            type: "number",
          },
          inventory: {
            type: "number",
          },
        },
        required: ["product_name", "price", "inventory"],
      },
    },
    put: {
      body: {
        type: "object",
        properties: {
          product_id: {
            type: "string",
          },
          product_name: {
            type: "string",
          },
          price: {
            type: "number",
          },
          inventory: {
            type: "number",
          },
        },
        required: ["product_id"],
      },
    },

    get: {
      query: {
        type: "object",
        properties: {
          page: {
            type: "string",
          },
          size: {
            type: "string",
          },
        },
        required: ["page", "size"],
      },
    },
  },
};
