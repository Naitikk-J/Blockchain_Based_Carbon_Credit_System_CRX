const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const submitRequest = async (formData: any) => {
  try {
    const token = localStorage.getItem("crx_token");
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Submit request error:", error);
    throw error;
  }
};

export const submitCommunityPost = async (postData: any) => {
  try {
    const token = localStorage.getItem("crx_token");
    const res = await fetch(`${API_BASE_URL}/communitypost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(postData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Submit post error:", error);
    throw error;
  }
};

export const logTransaction = async (transactionData: any) => {
  try {
    const token = localStorage.getItem("crx_token");
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(transactionData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Log transaction error:", error);
  }
};
