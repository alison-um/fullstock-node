import { getCategories, getCart, saveCart, getOrders, saveOrders } from "./utils.js";
import { nanoid } from "nanoid";

export async function homeHandler(_req, res) {
  const categories = await getCategories();
  res.render("index", { categories });
}

export async function categoryHandler(req, res) {
  const categories = await getCategories();
  const categoryId = Number(req.params.id);       

  const category = categories.find((c) => c.id === categoryId);
  const products = category.products;
  res.render("category", { category, products });
}

export async function productHandler(req, res) {
  const categories = await getCategories();
  const productId = Number(req.params.id);

  let product = null;
  for (const category of categories) {
    product = category.products.find((p) => p.id === productId);
    if (product) break;
  }
  res.render("product", { product });
}

export async function addProductHandler(req, res) {
  const cart = await getCart();   
  const categories = await getCategories(); 
  const productId = Number(req.params.id);  

  let product = null;
  for (const category of categories) {
    product = category.products.find((p) => p.id === productId);
    if (product) break;
  }
  cart.push(product); 
  saveCart(cart); 
  res.redirect(303, "/");
}

export async function cartHandler(_req, res) {

  const cart = await getCart();
  const total = cart.reduce((accumulator, product) => {
    return accumulator + product.price;
  }, 0);
  res.render("cart", { cart, total });

}


// Quitar product del carrito

export async function removeProductCartHandler(req, res) {
  const cart = await getCart();
  const productId = Number(req.params.id);

  const updatedCart = cart.filter(
    (product) => product.id !== productId
  );

  await saveCart(updatedCart);
  res.redirect("/cart");
}


//Checkout
export async function checkoutHandler(_req, res) {
  
  const cart = await getCart();
  const total = cart.reduce((acc, product) => {
    return acc + product.price;
  }, 0);
  res.render("checkout", { cart, total });
}

//guardar orden despues de checkout
export async function checkoutPostHandler(req, res) {

  const cart = await getCart();

  const total = cart.reduce((acc, product) => {
    return acc + product.price;
  }, 0);

  const orderId = nanoid();
  
  const newOrder = {
    id: orderId,
    cliente: req.body,
    products: cart,
    total
  };

  const orders = await getOrders();
  orders.push(newOrder);
  await saveOrders(orders);

  await saveCart([]);
  
  res.redirect(303, `/order-confirmation/${orderId}`);
}

export async function orderConfirmationHandler (req, res) {
  const orders = await getOrders();
  const orderId = req.params.id;

  let order = null;

  for (const o of orders) {
    if (o.id === orderId) {
      order = o;
      break;
    }
  }

  res.render("order-confirmation", {order});

}