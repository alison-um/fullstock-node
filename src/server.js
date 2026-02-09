/**
  FULLSTOCK E-commerce

  Desarrollado por: ALISON ABIGAIL MAMANI UCHASARA
  GitHub: https://github.com/alison-um/fullstock-node

  Puerto: 3001
 */


import express from "express";
import {
  homeHandler,
  categoryHandler,
  productHandler,
  addProductHandler,
  cartHandler,
  removeProductCartHandler,  //A
  checkoutHandler,
  checkoutPostHandler,
  orderConfirmationHandler,
  aboutHandler,
  termsHandler,
  loginHandler,
  signupHandler
} from "./handlers.js";

const app = express();
const port = 3001;

app.set("view engine", "ejs");
app.use(express.static("assets"));
// express.urlencoded
app.use(express.urlencoded({ extended: true }));  //A


// Router
app.get("/", homeHandler);
app.get("/categories/:id", categoryHandler);
app.get("/products/:id", productHandler);
app.post("/cart/add/:id", addProductHandler);
app.get("/cart", cartHandler);

//A: 
app.post("/cart/remove/:id", removeProductCartHandler);
app.get("/checkout", checkoutHandler);
app.post("/checkout", checkoutPostHandler);
app.get("/order-confirmation/:id", orderConfirmationHandler);
app.get("/about", aboutHandler);
app.get("/terminos", termsHandler);
app.get("/log-in", loginHandler);
app.get("/sign-up", signupHandler);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
