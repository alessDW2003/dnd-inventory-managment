const ClientHelper = {
  getFullURI(relativePath, id = null) {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    if (relativePath.indexOf("/") !== 0) {
      relativePath = "/" + relativePath;
    }

    if (id) {
      relativePath += `/${id}`;
    }

    return baseUrl + relativePath;
  },

  async callAPI(relativePath, method = "GET", id = null, dataObject = null) {
    const url = ClientHelper.getFullURI(relativePath, id);

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (["POST", "PATCH", "PUT"].includes(method) && dataObject) {
      options.body = JSON.stringify(dataObject);
      console.log("options body", options.body);
    }

    try {
      const res = await fetch(url, options);
      const data = await res.json();

      if (res.ok) {
        return data;
      } else {
        throw data;
      }
    } catch (error) {
      console.error("API call failed:", { url, method, error });
    }
  },
};

const Client = {
  async getAll(relativePath) {
    return ClientHelper.callAPI(relativePath);
  },

  async get(relativePath, id) {
    return ClientHelper.callAPI(relativePath, "GET", id);
  },

  async post(relativePath, dataObject) {
    return ClientHelper.callAPI(relativePath, "POST", null, dataObject);
  },

  async patch(relativePath, id, dataObject) {
    return ClientHelper.callAPI(relativePath, "PATCH", id, dataObject);
  },

  async put(relativePath, id, dataObject) {
    return ClientHelper.callAPI(relativePath, "PUT", id, dataObject);
  },

  async delete(relativePath, id) {
    return ClientHelper.callAPI(relativePath, "DELETE", id);
  },
};

export default Client;
