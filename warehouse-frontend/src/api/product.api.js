const URL = "http://127.0.0.1:5000/product/";

export class ProductAPI {
  static async getAll() {
    const response = await fetch(URL, { method: "GET" });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async get(gtin) {
    const response = await fetch(URL + gtin, { method: "GET" });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async filter(hallNumber, shelfGtin, productModelId, productGtins) {
    const queryParams = new URLSearchParams();
    if (hallNumber) queryParams.append("hallNumber", hallNumber);
    if (shelfGtin) queryParams.append("shelfGtin", shelfGtin);
    if (productModelId) queryParams.append("productModelId", productModelId);
    if (productGtins) queryParams.append("productGtins", productGtins);
    const response = await fetch(URL + "filter?" + queryParams, { method: "GET" });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async add(hallNumber, shelfGtin, productModelId, productGtin) {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hallNumber, shelfGtin, productModelId, productGtin }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async delete(gtin) {
    const response = await fetch(URL + "delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gtin }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }
}
