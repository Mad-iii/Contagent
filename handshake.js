// handshake.js
// Run with: node handshake.js

const BASE_URL = "https://agentalent.ai";
const HANDSHAKE_URL = `${BASE_URL}/api/handshake/a51e0434-8f52-44b4-83b3-f445d69a2960`;
const OPENROUTER_API_KEY = "";

async function callModel(prompt) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://contentagent.app",
      "X-Title": "ContentAgent",
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.8,
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(`OpenRouter error: ${data.error.message}`);
  }

  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("OpenRouter returned empty response");
  }

  return text;
}

async function submitResponse(submitUrl, response) {
  const fullUrl = submitUrl.startsWith("http") ? submitUrl : `${BASE_URL}${submitUrl}`;
  console.log(`\n📤 Submitting to: ${fullUrl}`);

  const res = await fetch(fullUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ response }),
  });

  const data = await res.json();
  console.log("Result:", JSON.stringify(data, null, 2));
  return data;
}

async function run() {
  try {
    console.log("🤝 Starting handshake...\n");
    const res = await fetch(HANDSHAKE_URL, { method: "POST" });
    const first = await res.json();
    console.log("Handshake response:", JSON.stringify(first, null, 2));

    if (first.error) {
      console.error("❌ Handshake error:", first.error);
      if (first.retry_available_at) {
        console.log("⏰ Retry available at:", first.retry_available_at);
      }
      return;
    }

    let task = first.task;
    let completed = 0;
    const total = first.total_tasks || 10;

    while (task && completed < total) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📋 Task ${completed + 1}/${total}: ${task.name}`);
      console.log(`📝 Prompt: ${task.prompt}`);

      console.log("\n🤖 Generating response...");
      const agentResponse = await callModel(
        `You are ContentAgent, a professional AI content generation assistant specializing in marketing copy, blog posts, emails, social media, and ad creative.\n\nComplete the following task thoroughly and creatively:\n\n${task.prompt}`
      );

      console.log("\n✍️  Response preview:");
      console.log(agentResponse.substring(0, 400));
      console.log(`\n[Total length: ${agentResponse.length} chars]`);

      const result = await submitResponse(task.submit_url, agentResponse);

      completed++;
      console.log(`\n✅ Score: ${result.score ?? "—"}`);
      console.log(`💬 Feedback: ${result.feedback ?? "—"}`);

      if (result.next_task) {
        task = result.next_task;
      } else if (result.task) {
        task = result.task;
      } else {
        console.log("\n🎉 All tasks complete!");
        if (result.final_score !== undefined) {
          console.log(`🏆 Final Score: ${result.final_score}`);
        }
        console.log("\nFull final result:", JSON.stringify(result, null, 2));
        break;
      }
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

run();
