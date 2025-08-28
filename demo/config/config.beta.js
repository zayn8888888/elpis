module.exports = {
  name: "beta",
  signKey: "hudwhuhndappw32u188s7dwhh2uj3hu2",
  jwtSecretKey: "36c84fbe-7ec4-496b-9d3d-0080ff053669",
  db: {
    client: "mysql2",
    connection: {
      host: "",
      port: 3306,
      user: "",
      password: "",
      database: "",
    },
    pool: {
      max: 10,
      min: 5,
    },
  },
};
