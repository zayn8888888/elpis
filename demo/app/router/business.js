module.exports = (app, router) => {
  const { business: businessController } = app.controller;
  router.delete(
    "/api/proj/product",
    businessController.remove.bind(businessController)
  );
  router.get(
    "/api/proj/product/list",
    businessController.getList.bind(businessController)
  );
  router.get(
    "/api/proj/product",
    businessController.get.bind(businessController)
  );
  router.post(
    "/api/proj/product",
    businessController.post.bind(businessController)
  );
  router.put(
    "/api/proj/product",
    businessController.put.bind(businessController)
  );
};
