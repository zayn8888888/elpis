module.exports = (app) => {
  return class ViewController {
    /**
     * 渲染页面
     * @param {Object} ctx Koa上下文
     */
    async renderPage(ctx, page, data) {
      await ctx.render(`dist/entry.${ctx.params.page}`, {
        projKey: ctx.query?.proj_key,
        name: app.options?.name,
        env: app.env.get(),
        options: JSON.stringify(app.options),
      });
    }
  };
};
