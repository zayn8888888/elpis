module.exports = (app) => {
  const { db } = app.config;
  if (!db) {
    return;
  }
  return require("knex")(db);
};
