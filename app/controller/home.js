/**
 * home控制器
 */

const path = require('path');
const fse = require('fs-extra');

const root = path.join(__dirname, '..');

module.exports = (app) => {
  class HomeController extends app.Controller {
    * index() {
      const ctx = this.ctx;
      const publicPath = path.join(root, 'public/book');
      const title = '加油宝文档服务';

      try {
        const dirs = (yield fse.readdir(publicPath) || []).filter((dir) => {
          const stats = fse.statSync(path.join(publicPath, dir));
          return stats.isDirectory();
        }).map(dir => `book/${dir}`);

        yield ctx.render('home.html', { title, dirs });
      } catch (e) {
        ctx.body = title;
      }
    }
  }
  return HomeController;
};
