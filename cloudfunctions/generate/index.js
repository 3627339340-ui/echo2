const axios = require("axios");

exports.main = async (event) => {
  const { input } = event;
  if (!input) {
    return { error: "Input is required" };
  }

  try {
    const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
    if (!ZHIPU_API_KEY) {
      return { error: "Missing ZHIPU_API_KEY" };
    }

    const response = await axios.post(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        model: "glm-4",
        messages: [
          {
            role: "user",
            content: `请以“未来的我”的口吻，写一封温柔、充满希望的信件，回应我写的：“${input}”`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${ZHIPU_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "未来还没来得及回信，请稍后再试。";

    return { reply };
  } catch (err) {
    console.error("AI接口调用失败：", err.message);
    return { error: "AI接口调用失败", details: err.message };
  }
};
