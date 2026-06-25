const BASE_URL = "http://4.224.186.213/evaluation-service";

export async function Log(stack, level, packageName, message) {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Logging failed", error);
  }
}