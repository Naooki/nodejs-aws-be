import productList from "./productsList.json";

export function getProductById(id: string) {
  const product = productList.find((product) => id === product.id);
  return Promise.resolve(product);
}

export function getProducts(params: { [key: string]: string }) {
  let result = productList;

  if (params.search) {
    result = result.filter(item => item.title.indexOf(params.search) !== -1);
  }

  if (params.limit && +params.limit) {
    result = result.slice(0, +params.limit);
  }

  return Promise.resolve(result);
}
