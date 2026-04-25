import { API } from "../api";

const parseSSEEvent = (rawEvent) => {
  const lines = rawEvent.split("\n");
  let event = "message";
  const dataLines = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
      continue;
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }

  const rawData = dataLines.join("\n");

  if (!rawData) {
    return { event, data: null };
  }

  try {
    return {
      event,
      data: JSON.parse(rawData),
    };
  } catch {
    return { event, data: rawData };
  }
};

const streamSSE = async ({ endpoint, body, signal, onEvent }) => {
  const response = await fetch(`${API}${endpoint}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    let message = "Streaming request failed";

    try {
      const errorPayload = await response.json();
      message = errorPayload?.message || message;
    } catch {
      // Ignore JSON parse errors for non-JSON error bodies.
    }

    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("Streaming is not supported in this browser");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

    let separatorIndex = buffer.indexOf("\n\n");
    while (separatorIndex !== -1) {
      const eventBlock = buffer.slice(0, separatorIndex).trim();
      buffer = buffer.slice(separatorIndex + 2);

      if (eventBlock) {
        const parsed = parseSSEEvent(eventBlock);
        onEvent(parsed);
      }

      separatorIndex = buffer.indexOf("\n\n");
    }
  }
};

export { streamSSE };
