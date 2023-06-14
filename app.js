const express = require('express');
const app = express();
const port = 3000;

const goodsRouter = require('./routes/goods.js')
const cartsRouter = require("./routes/carts.js")
const connect = require('./schemas')
connect();

app.use(express.json())
app.use("/api",[goodsRouter, cartsRouter]);

app.get('/', (req, res) => { //express객체안에있는 get을 사용한 것이기 때문에 router를 설정할 필요 x
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
//app.js에서 가지고오는 것
