const URL = "http://127.0.0.1:5000/hall/";

export class HallAPI {
  static async getAll() {
    const response = await fetch(URL, { method: "GET" });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async get(hallNumber) {
    const response = await fetch(URL + hallNumber, { method: "GET" });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async add(hallNumber) {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hallNumber }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async delete(hallNumber) {
    const response = await fetch(URL + "delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hallNumber }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async moveEmployeeToAnotherHall(employeeId, newHallNumber) {
    const response = await fetch(URL + "moveEmployee", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeId, hallNumber: newHallNumber }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }
}
