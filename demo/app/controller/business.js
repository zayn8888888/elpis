const { Controller } = require("@zaynhzm/elpis");
module.exports = (app) => {
  const BaseController = Controller.Base(app);
  return class BusinessController extends BaseController {
    async remove(ctx) {
      const { product_id } = ctx.request.body;
      this.success(ctx, {
        projKey: ctx.projKey,
        product_id,
      });
    }
    /**
     * 获取产品列表
     * @param {*} ctx
     */
    getList(ctx) {
      const { product_name: productName, page, size } = ctx.request.query;

      let list = [
        {
          product_id: "1",
          product_name: `${ctx.projKey} - 《大前端面试宝典》`,
          price: 39.9,
          inventory: 99999,
          create_time: "2023-01-01 20:23:22",
        },
        {
          product_id: "2",
          product_name: `${ctx.projKey} - 《前端求职之道》`,
          price: 199.9,
          inventory: 9209999,
          create_time: "2023-01-01 11:23:22",
        },
        {
          product_id: "3",
          product_name: `${ctx.projKey} - 《大前端全栈实践》`,
          price: 1699.9,
          inventory: 9209999,
          create_time: "2023-09-01 11:23:22",
        },
      ];
      if (productName) {
        list = list.filter((item) => item.product_name.includes(productName));
      }

      this.success(ctx, list, {
        total: list.length,
        page,
        size,
      });
    }
    /**
     * 获取产品详情
     * @param {*} ctx
     */
    get(ctx) {
      const { product_id: productId } = ctx.request.query;
      this.success(ctx, {
        product_id: productId,
        product_name: `${ctx.projKey} - 《大前端面试宝典》`,
        price: 39.9,
        inventory: 99999,
        create_time: "2023-01-01 20:23:22",
      });
    }
    /**
     * 新增产品
     * @param {*} ctx
     */
    post(ctx) {
      const { product_name: productName, price, inventory } = ctx.request.body;
      this.success(ctx, {
        product_id: "4",
        product_name: productName,
        price,
        inventory,
        create_time: "2023-01-01 20:23:22",
      });
    }
    /**
     * 更新产品
     * @param {*} ctx
     */
    put(ctx) {
      const {
        product_id: productId,
        product_name: productName,
        price,
        inventory,
      } = ctx.request.body;
      this.success(ctx, {
        product_id: productId,
        product_name: productName,
        price,
        inventory,
        create_time: "2023-01-01 20:23:22",
      });
    }
  };
};
