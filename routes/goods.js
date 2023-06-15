const express = require("express"); //express라는 라이브러리에서 라이브러리를 express라는 변수에 할당하고

const router = express.Router(); //express.router라는 메서드를 실행하여 router를 router변수에 할당

const goods = [
  {
    goodsId: 4,
    name: "상품 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "상품 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "상품 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "상품 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

//req 는 요청, res 응답 api에 받은 데이터는 req안에 있다
router.get("/goods", (req, res) => {
  //router변수를 이용하여 router를 각각 만들게됨 어떤 위치의 기본경로에 들어왔을 때 코드블록 안의 코드를 실행한다
  res.json({ goods: goods }); //req안에 들어온 객체를 반환 send안에 들어온 값을 반환한다는 의미
});

router.get("/goods/:goodsId", (req, res) => {
  const { goodsId } = req.params;
  const [detail] = goods.filter((goods) => goods.goodsId === Number(goodsId)); //배열의 첫번째 변수를 detail에 할당
  res.json({ detail });
});

//goods.js안에있는 라우터를 app.js에 가져다줘야하기 때문에 모듈 exports 와 같은 방식으로 전달

const Cart = require("../schemas/cart.js");
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params; //key value 형태의 객체로 넘어오기 때문에 구조분해할당 이용
  const { quantity } = req.body; //key value 형태의 객체로 넘어오기 때문에 구조분해할당 이용

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 장바구니에 해당하는 상품이 존재합니다.",
    });
  }
  await Cart.create({goodsId, quantity})

  res.json({result: "success"})
});

router.put("/goods/:goodsId/cart",async (req,res)=>{
  const {goodsId} = req.params;
  const {quantity} = req.body;

  const existsCarts = await Cart.find({goodsId})
  if(existsCarts.length){
    await Cart.updateOne({goodsId: goodsId}, {$set: {quantity:quantity}})
  }
  res.status(200).json({success:true})
  
})
router.delete("/goods/:goodsId/cart", async (req,res)=>{
  const {goodsId} = req.params;
  
  const existsCarts = await Cart.find({goodsId});
  if(existsCarts.length){
    await Cart.deleteOne({goodsId});
  }
  res.json({results:"success"});
})

const Goods = require("../schemas/goods");
router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });

  if (goods.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 존재하는 GoodsId입니다.",
    });
  }
  res.status(200).json({success:true});

  const createdGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });
  res.json({ goods: createdGoods });
});
module.exports = router;
