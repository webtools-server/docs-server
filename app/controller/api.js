/**
 * api控制器
 */

const path = require('path');
const fse = require('fs-extra');
const decompress = require('decompress');

const root = path.join(__dirname, '..');
const zipDir = path.join(root, 'zip');

const STATUS = {
  OK: 1,
  ERROR: 0
};

module.exports = (app) => {
  class ApiController extends app.Controller {
    * upload() {
      const ctx = this.ctx;
      const stream = yield ctx.getFileStream();
      const { name, token } = stream.fields;

      if (!name) {
        ctx.body = { code: STATUS.ERROR, msg: 'name不能为空' };
        return;
      }

      if (!ctx.service.user.isExist(token)) {
        ctx.body = { code: STATUS.ERROR, msg: 'token不正确' };
        return;
      }

      const zipFile = path.join(zipDir, stream.filename);
      const outputDir = path.join(root, 'public/book', name);

      try {
        // 如果没有zip目录，先创建
        yield fse.ensureDir(zipDir);
        // 生成压缩包
        yield createZip(stream, zipFile);
        // 解压
        yield fse.ensureDir(outputDir);
        yield decompress(zipFile, outputDir);
        ctx.body = { code: STATUS.OK, msg: '发布文档成功' };
      } catch (e) {
        ctx.status = 500;
        ctx.body = { code: STATUS.ERROR, msg: e.stack };
      }

      // 删除压缩包
      yield fse.remove(zipFile);
    }
  }
  return ApiController;
};

function createZip(stream, zipFile) {
  return new Promise((resolve, reject) => {
    stream.pipe(fse.createWriteStream(zipFile));
    stream.on('end', () => {
      resolve();
    });
    stream.on('error', (e) => {
      reject(e);
    });
  });
}
