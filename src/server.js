/**
  FULLSTOCK E-commerce

  Desarrollado por: ALISON ABIGAIL MAMANI UCHASARA
  GitHub: https://github.com/alison-um/fullstock-node

  Puerto: 3001
 */


import express from "express";
import expressLayouts from "express-ejs-layouts";

import {
  homeHandler,
  categoryHandler,
  productHandler,
  addProductHandler,
  cartHandler,
  updateProductCartHandler,  //A
  deleteProductCartHandler,  
  checkoutHandler,
  placeOrderHandler,
  orderConfirmationHandler,
  aboutHandler,
  termsHandler,
  loginHandler,
  signupHandler
} from "./handlers.js";

const app = express();
const port = 3001;                    // Iniciar Servidor

app.set("view engine", "ejs");        // Para trabajar con plantillas motor ejs
app.set("views", "./views");          // ya por defecto lo busca en esa carpeta
//A
app.use(expressLayouts);              // Middleware para usar ejs-layouts
app.set("layout", "layout");

app.use(express.static("assets"));    // Middleware para archivos estaticos

app.use(express.urlencoded({ extended: true }));  // express.urlencoded



const pageTitleByPath = {
  "/": "Inicio",
  "/cart": "Carrito",
  "/checkout": "Checkout",
  "/about": "Quiénes somos",
  "/terminos": "Términos y Condiciones",
  "/log-in": "Iniciar sesión",
  "/sign-up": "Registrarse"
};

app.use((req, res, next) => {
  const currentPath = req.path;
  res.locals.namePage = pageTitleByPath[currentPath] || "FullStock";
  next();
});


// Router
app.get("/", homeHandler);
app.get("/categories/:slug", categoryHandler);
app.get("/products/:id", productHandler);
app.post("/cart/add-product", addProductHandler);
app.get("/cart", cartHandler);

//A: 
app.post("/cart/update-item", updateProductCartHandler);
app.post("/cart/delete-item", deleteProductCartHandler);
app.get("/checkout", checkoutHandler);
app.post("/checkout/place-order", placeOrderHandler);
app.get("/order-confirmation", orderConfirmationHandler);
app.get("/about", aboutHandler);
app.get("/terminos", termsHandler);
app.get("/log-in", loginHandler);
app.get("/sign-up", signupHandler);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
