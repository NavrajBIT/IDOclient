const API_URL = "https://bitbhoomiido.tech/api/v1/";
const WALLET_API_URL = "https://bitbhoomiido.tech/api/";

const useAPI = () => {
  async function crud(requestMethod, endpoint, data, isWallet) {
    const requestOptions = {
      method: requestMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };

    const URL = isWallet ? WALLET_API_URL : API_URL;

    try {
      const response = await fetch(URL + endpoint + "/", requestOptions);

      if (response.status === 401) {
        throw 401;
      }

      if (requestMethod === "DELETE") return { status: response.status };

      const responseData = await response.json();

      if (responseData["status"]) {
        responseData["modelStatus"] = responseData["status"];
      }
      responseData["status"] = response.status;
      // refreshToken();
      return responseData;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  }

  return { crud };
};

export default useAPI;
