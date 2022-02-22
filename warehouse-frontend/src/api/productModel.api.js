const URL = "http://127.0.0.1:5000/productModel/";

export class ProductModelAPI {
  static async getAll() {
    const response = await fetch(URL, { method: "GET" });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async get(id) {
    const response = await fetch(URL + id, { method: "GET" });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async add(name, brand, partNumber) {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, brand, partNumber }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async delete(id) {
    const response = await fetch(URL + "delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }
}
