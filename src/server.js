import express from "express";
import {
  homeHandler,
  categoryHandler,
  productHandler,
  addProductHandler,
  cartHandler,
  //
  removeProductCartHandler,  
  checkoutHandler,
  checkoutPostHandler,
  orderConfirmationHandler
} from "./handlers.js";

const app = express();
const port = 3002;

app.set("view engine", "ejs");
app.use(express.static("assets"));
// express.urlencoded
app.use(express.urlencoded({ extended: true }));  //AÑADIDOxd


// Router
app.get("/", homeHandler);
app.get("/categories/:id", categoryHandler);
app.get("/products/:id", productHandler);
app.post("/cart/add/:id", addProductHandler);
app.get("/cart", cartHandler);

//
app.post("/cart/remove/:id", removeProductCartHandler);
app.get("/checkout", checkoutHandler);
app.post("/checkout", checkoutPostHandler);
app.get("/order-confirmation/:id", orderConfirmationHandler);


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
