const app = require('./src/app');

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`server running on: ${PORT}`);
});
