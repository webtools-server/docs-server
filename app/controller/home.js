/**
 * home控制器
 */

module.exports = (app) => {
  class HomeController extends app.Controller {
    index() {
      this.ctx.body = 'docs server';
    }
  }
  return HomeController;
};
