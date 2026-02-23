import path from "path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "../data/data.json");

export async function getData() {
  try {
    const content = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(content);

  } catch (error) {
    console.log(error.message);
    return null;
  }
}


export async function saveData(data) {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

  } catch (error) {
    console.log(error.message);
    return null;
  }
}


export function parsePriceToCents(value) {
  if (!value || typeof value === "Infinity" || value.trim() === "")
    return null;

  return value * 100;
}

export function validationsPrices(minPrice, maxPrice) {
  let message = "";
  let title = "";


  if (
    !minPrice ||
    isNaN(minPrice) ||
    minPrice.trim() === "" ||
    parseFloat(minPrice) < 0
  ) {
    title = "Precio mínimo inválido";
    message = `El precio mínimo deber ser un valor entero positivo, se ingresó: "${minPrice}"`;
  }

  if (!maxPrice ||
    isNaN(maxPrice) ||
    maxPrice.trim() === "" ||
    parseFloat(maxPrice) < 0
  ) {
    title = "Precio máximo inválido";
    message = `El precio máximo debe ser un valor entero positivo, se ingresó: "${maxPrice}"`;
  }

  if (parseFloat(minPrice) > parseFloat(maxPrice)) {
    title = "Filtros incorrectos";
    message = `El precio mínimo no debe ser mayor al precio máximo`;
  }

  return {
    message,
    title,
  };
}