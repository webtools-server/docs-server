/**
 * app
 */

process.env.EGG_SERVER_ENV = 'prod';

require('egg').startCluster({
  baseDir: __dirname,
  workers: 1,
  port: process.env.PORT || 7004
});
