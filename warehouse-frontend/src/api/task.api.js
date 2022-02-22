const URL = "http://127.0.0.1:5000/task/";

export class TaskAPI {
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

  static async filter(hallNumber, employeeId, taskStatus, activationDate) {
    const queryParams = new URLSearchParams();
    if (hallNumber) queryParams.append("hallNumber", hallNumber);
    if (employeeId) queryParams.append("employeeId", employeeId);
    if (taskStatus) queryParams.append("taskStatus", taskStatus);
    if (activationDate) queryParams.append("activationDate", activationDate);
    const response = await fetch(URL + "filter?" + queryParams, { method: "GET" });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async add(hallNumber, startingShelfGtin, destinationShelfGtin, scansRequired) {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hallNumber, startingShelfGtin, destinationShelfGtin, scansRequired }),
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

  static async scanProduct(taskId, productGtin) {
    const response = await fetch(URL + "scanProduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId, productGtin }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async scanShelf(taskId, shelfGtin) {
    const response = await fetch(URL + "scanShelf", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId, shelfGtin }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async activateTask(taskId, assignedEmployeeId) {
    const response = await fetch(URL + "activateTask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId, assignedEmployeeId }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async finishTask(employeeId, hallNumber) {
    const response = await fetch(URL + "finishTask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeId, hallNumber }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }

  static async cancelTask(employeeId, managerId, taskCancelCause) {
    const response = await fetch(URL + "cancelTask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeId, managerId, taskCancelCause }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return Promise.reject(data.message);
  }
}
