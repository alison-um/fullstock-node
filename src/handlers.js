import { getData, saveData } from "./utils/utils.js";
import { parsePriceToCents, validationsPrices } from "./utils/utils.js";
import { AppError } from "./utils/errorUtils.js";
import { nanoid } from "nanoid";

export async function homeHandler(_req, res) {
  const data = await getData();
  const categories = data.categories;
  res.render("index", { categories });
}

// Trabaja con view: category.ejs
export async function categoryHandler(req, res) {
  const { slug } = req.params;
  const {
    minPrice: minPriceQuery,
    maxPrice: maxPriceQuery,
    error: errorQuery,
  } = req.query;

  const error = errorQuery === "true";

  // Validar los queries Strings
  const minPrice = parsePriceToCents(minPriceQuery) ? minPriceQuery : -Infinity; // product.price > -Infinity
  const maxPrice = parsePriceToCents(maxPriceQuery) ? maxPriceQuery : Infinity; // product.price < Infinity

  
  const data = await getData();
  const {categories , products } = data;
  
  const categoryFind = categories.find(
    (category) => category.slug.toLowerCase() === slug.toLowerCase()
  );

  if (!categoryFind) {
    throw new AppError(
      "La categoría que esta buscando no se encuentra disponible",
      404,
    );
  }
  
  const validations = validationsPrices(minPriceQuery, maxPriceQuery);
  if (error && validations.title) {
    throw new AppError(validations.message, 404);
  }

  const productsFilter = products.filter(
    (product)  => 
      product.categoryId === categoryFind.id &&
      product.price / 100 >= minPrice &&
      product.price / 100 <= maxPrice,
  );

  res.render("category", 
    { 
      minPrice: minPriceQuery || "",
      maxPrice: maxPriceQuery || "",
      category: categoryFind, 
      products: productsFilter, 
      namePage: categoryFind.name 
    },
  );
}

export async function productHandler(req, res) {
  const  productId  = parseInt(req.params.id);

  const data = await getData();
  const {products } = data;

  const productFinded = products.find (
    (product) => product.id === productId
  );
  
  res.render("product", 
    { product: productFinded,
      namePage: productFinded.name 
    }
  );
}

export async function addProductHandler(req, res) {
  const {productId} = req.body;

  const data = await getData();
  const {products, carts} = data;
  
  // Buscamos el producto que el usuario agrego al carrito en objeto de products
  const productFinded = products.find (
    (product) => product.id === parseInt(productId),
  );
  if (!productFinded) {
    throw new AppError(     //CORREGIR!!
      "El producto seleccionado no se encuentra disponible",
      404,
    );
  }

  const cart = carts[0] || {id: 1, items: []};

  // Buscamos el producto que el usuario agrego al carrito en objeto de cart.items
  const cartItem = cart.items.find(
    (item) => item.productId === parseInt(productId),
  );

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.items.push({ 
      productId: parseInt(productId), 
      quantity: 1 
    });
  }

  // Guardar el carrito en mi objeto de carts
  data.carts[0] = cart;
  
  await saveData(data);        
  res.redirect(`/products/${productId}`); 
}

export async function cartHandler(_req, res) {
  
  const data = await getData();
  const {products, carts} = data;

  const cart = carts[0] || {id: 1, items: []};

  // if (!cart) {  
  //   return res.render("cart", {
  //     cartItems: [],
  //     total: 0,
  //   });
  // }
  
  const cartItems = cart.items.map(
    (item) => {
      const product = products.find(
        (product) => product.id === item.productId
      );

      const subtotal = product.price * item.quantity; //en centavos

      return {
        ...item,
        product,
        subtotal,
      };

    });

    const total = cartItems.reduce((accumulator, item) => {
    return accumulator + item.subtotal;
    }, 0);

  res.render("cart", { cartItems, total });

}


// app.post("/cart/update-item", updateProductCartHandler);
// app.post("/cart/remove-item", removeProductCartHandler);
// A
export async function updateProductCartHandler(req, res) {
  const {productId, quantity} = req.body;

  const data = await getData();
  const {carts} = data;
  const cart = carts[0] || { id: 1, items: [] };

  const cartItem = cart.items.find(
    (product) => product.productId === parseInt(productId),
  );

  if (cartItem) {
    cartItem.quantity = parseInt(quantity);
  }

  data.carts[0] = cart;

  await saveData(data);  
  res.redirect("/cart"); 
}


export async function deleteProductCartHandler(req, res) {
  const {productId} = req.body;

  const data = await getData();
  const {carts} = data;
  const cart = carts[0] || { id: 1, items: [] };

  cart.items = cart.items.filter (
    (item) => item.productId !== parseInt(productId),
  );

  data.carts[0] = cart;

  await saveData(data);  
  res.redirect("/cart"); 
}


export async function checkoutHandler(_req, res) {
  const data = await getData();
  const {products, carts} = data;

  const cart = carts[0] || {id: 1, items: []};

  if(!cart || cart.items.length === 0) {
    return res.redirect("/");
  }
  
  const cartItems = cart.items.map(
    (item) => {
      const product = products.find(
        (product) => product.id === item.productId
      );

      const subtotal = product.price * item.quantity; //en centavos

      return {
        ...item,
        product,
        subtotal,
      };

    }
  );

  const total = cartItems.reduce((accumulator, item) => {
  return accumulator + item.subtotal;
  }, 0);

  res.render("checkout", { cartItems, total });

}


export async function placeOrderHandler(req, res) {

  const data = await getData();
  const {products, carts, orders} = data;
  
  const cart = carts[0];

  if(!cart || cart.items.length === 0) {
    return res.redirect("/");
  }

  let total=0;

  const itemsOrder = cart.items.map (item => {
    const product = products.find(prod => prod.id === item.productId);
    const subtotal = product.price * item.quantity;
    total += subtotal;
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      imgSrc: product.imagePath,
      quantity: item.quantity
    }
  }
  );

  const newId = orders.length>0 
    ? Math.max(...orders.map((order) => order.id)) + 1
    : 1;

//     Caso contrario, extraiga todos los id de los elementos usando map y los guarde en una variable ids.
// Calcule el máximo con Math.max(...ids), y retorne ese valor + 1.
  const newOrder = {
    id: newId,
    items: itemsOrder,
    shippingInfo: req.body, 
    total: total,
    status: "pending",
    createdAt: new Date().toISOString()
  };
 
  orders.push(newOrder);
  
  data.carts = [];
  
  await saveData(data);        
 
  res.redirect(303, `/order-confirmation?orderId=${newId}`);
}

export async function orderConfirmationHandler (req, res) {
  const data = await getData();
  const { orders } = data;
  const orderId = parseInt(req.query.orderId);
  
  const order= orders.find (order => order.id === orderId);

  if (!order) {
    return res.redirect("/");
  }

  res.render("order-confirmation", 
    {order,
      namePage: "Confirmación de compra"
    }
  );

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