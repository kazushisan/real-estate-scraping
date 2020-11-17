import app from './app.js'

app()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('done')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
