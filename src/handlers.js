import { getCategories, getCart, saveCart, getOrders, saveOrders } from "./utils.js";
import { nanoid } from "nanoid";

export async function homeHandler(_req, res) {
  const categories = await getCategories();
  res.render("index", { categories });
}

// Trabaja con view: category.ejs
export async function categoryHandler(req, res) {
  const categories = await getCategories();
  const categoryId = Number(req.params.id);       
  // si ruta es   "categories/2"  (ruta definida en server.js)   
  //              ===>  req.params.id = "2"
  const category = categories.find((c) => c.id === categoryId);
  // Busca en la bd categories  todos los ids (la bd tiene primero las categorias y dentro sus productos)
  const products = category.products;
  res.render("category", { category, products });
}

export async function productHandler(req, res) {
  const categories = await getCategories();
  const productId = Number(req.params.id);
  let product = null;
  for (const category of categories) {
    // Por cada elemento dentro del array categories (BD),
    // guárdalo temporalmente en una variable llamada category
    product = category.products.find((p) => p.id === productId);
    if (product) break;
  }
  res.render("product", { product });
}

export async function addProductHandler(req, res) {
  const cart = await getCart();   /*getCart: lee el archivo cart.json , convierte en un array nuevo en memoria , devuelve ese array */
  const categories = await getCategories(); /*lee el archivo categories.json*/
  const productId = Number(req.params.id);  /*lee el id del producto pedido*/
  let product = null;
  for (const category of categories) {
    // itera cant. veces categorias en la bd (categories.json) 
    product = category.products.find((p) => p.id === productId);
    // como category hace referencia a cd categoria puedo acceder a su atributo products y lo guarda en product, 
    // si lo encuentro STOP
    if (product) break;
  }
  cart.push(product);     //agregar al carrito , hace referencia al array cart en memoria de getCart
  saveCart(cart);         //escribe en array cart en memoria de getCart
  res.redirect(303, "/");   //redirige (despues del post) a pagina principal
}

export async function cartHandler(_req, res) {
  // Lee el carrito
  // Calcula el total
  // Renderiza cart.ejs con productos y total
  const cart = await getCart();
  const total = cart.reduce((accumulator, product) => {
    return accumulator + product.price;
  }, 0);
  res.render("cart", { cart, total });

  // envia un objeto Que se envía solo a esa vista (cart.ejs)
  // {
  //   cart: cart,
  //   total: total
  // }
  // { cart, total } → datos solo para esa vista
  // ❌ No son globales
  // ❌ No se exportan
  // ✔ Solo viven durante ese request
}



// AÑADIDOS

export async function removeProductCartHandler(req, res) {
  const cart = await getCart();
  const productId = Number(req.params.id);

  // filter crea un nuevo array
  // SOLO incluye los elementos que cumplan la condición
  // Excluye el producto con ese  ID
  // Guarda el carrito actualizado

  const updatedCart = cart.filter(
    (product) => product.id !== productId
  );

  await saveCart(updatedCart);
  res.redirect("/cart");
}


export async function checkoutHandler(_req, res) {
  // Lee el carrito
  // Calcula el total
  // Renderiza checkout.ejs con productos y total
  const cart = await getCart();
  const total = cart.reduce((acc, product) => {
    return acc + product.price;
  }, 0);
  res.render("checkout", { cart, total });
}


export async function checkoutPostHandler(req, res) {

  // 1. Leer carrito
  const cart = await getCart();
  // 2. Calcular total
  const total = cart.reduce((acc, product) => {
    return acc + product.price;
  }, 0);

  //3. Generar Id
  const orderId = nanoid();
  // 4. Crear orden
  const newOrder = {
    id: orderId,
    cliente: req.body,
    products: cart,
    total
  };

  // 5. Guardar orden
  const orders = await getOrders();
  orders.push(newOrder);
  await saveOrders(orders);

  // 6. Vaciar carrito
  await saveCart([]);
  // 7. Redirigir 
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


// pags del footerr
export function aboutHandler(_req,res) {
  res.render("about");
}
export function termsHandler(_req,res) {
  res.render("terms");
}

// paginas de Autenticacion
export function loginHandler(_req, res) {
  res.render("login");
}

export function signupHandler(_req, res) {
  res.render("signup");
}