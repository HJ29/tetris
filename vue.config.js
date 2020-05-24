module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tetris/'
    : '/',

  pluginOptions: {
    quasar: {
      importStrategy: 'manual',
      rtlSupport: true
    }
  },
  transpileDependencies: [
    'quasar'
  ]
}
