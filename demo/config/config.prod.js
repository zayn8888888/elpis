module.exports = {
  name: "prod",
  signKey: "ssssssssssssssssss23d4w5s4dwj2i1j3i2",
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
