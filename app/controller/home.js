/**
 * home控制器
 */

const path = require('path');
const fse = require('fs-extra');

module.exports = (app) => {
  class HomeController extends app.Controller {
    * index() {
      const ctx = this.ctx;
      const publicPath = path.join(app.baseDir, 'app/public/book');
      const title = '加油宝文档服务';

      try {
        const docs = (yield fse.readdir(publicPath) || []).filter((dir) => {
          const stats = fse.statSync(path.join(publicPath, dir));
          return stats.isDirectory();
        }).map((dir) => {
          const docsFile = path.join(publicPath, dir, 'docs_server.json');
          let docsContent = '';
          let docsJson = {};

          if (fileExists(docsFile)) {
            docsContent = fse.readFileSync(docsFile);
          }

          if (docsContent) {
            try {
              docsJson = JSON.parse(docsContent);
            } catch (e) {
              docsJson = {};
            }
          }

          return {
            title: docsJson.title || dir,
            desc: docsJson.desc || dir,
            dir: `book/${dir}`
          };
        });

        yield ctx.render('home.html', { title, docs });
      } catch (e) {
        ctx.body = title;
      }
    }
  }
  return HomeController;
};

function fileExists(filePath) {
  try {
    return fse.statSync(filePath).isFile();
  } catch (e) {
    return false;
  }
}
