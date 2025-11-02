import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: "输入内容不能为空" });

  try {
    const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
    const response = await axios.post(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        model: "glm-4",
        messages: [
          {
            role: "user",
            content: `请以“未来的我”的口吻，写一封温柔、充满希望的信件，回应我写的：“${input}”`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${ZHIPU_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "未来还没来得及回信，请稍后再试。";
    res.json({ reply });
  } catch (err) {
    console.error("AI调用失败：", err.message);
    res.status(500).json({ error: "AI接口调用失败", details: err.message });
  }
});

// 启动服务（Zeabur 自动检测 3000端口）
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


---
