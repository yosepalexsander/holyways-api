const app = require();

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`server running on: ${PORT}`);
});
