use futures_util::StreamExt;
use serde::Serialize;
use tauri::ipc::Channel;

const OLLAMA_URL: &str = "http://127.0.0.1:11434";

fn client(timeout_secs: u64) -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(timeout_secs))
        .build()
        .map_err(|e| e.to_string())
}

// --- Check Ollama status ---

#[derive(Serialize)]
pub struct OllamaStatus {
    pub available: bool,
    pub models: Vec<String>,
    pub error: Option<String>,
}

#[tauri::command]
pub async fn check_ollama() -> Result<OllamaStatus, String> {
    let url = format!("{}/api/tags", OLLAMA_URL);
    match client(5)?.get(&url).send().await {
        Ok(resp) => {
            if !resp.status().is_success() {
                return Ok(OllamaStatus {
                    available: false,
                    models: vec![],
                    error: Some(format!("HTTP {}", resp.status())),
                });
            }
            let body: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
            let models = body["models"]
                .as_array()
                .map(|arr| {
                    arr.iter()
                        .filter_map(|m| m["name"].as_str().map(String::from))
                        .collect()
                })
                .unwrap_or_default();
            Ok(OllamaStatus {
                available: true,
                models,
                error: None,
            })
        }
        Err(e) => Ok(OllamaStatus {
            available: false,
            models: vec![],
            error: Some(e.to_string()),
        }),
    }
}

// --- Streaming chat ---

#[derive(Clone, Serialize)]
pub struct ChatChunk {
    pub content: String,
    pub done: bool,
}

#[tauri::command]
pub async fn ollama_chat(
    model: String,
    messages: serde_json::Value,
    on_chunk: Channel<ChatChunk>,
) -> Result<(), String> {
    let url = format!("{}/api/chat", OLLAMA_URL);
    let resp = client(120)?
        .post(&url)
        .json(&serde_json::json!({
            "model": model,
            "messages": messages,
            "stream": true,
            "options": { "num_predict": 128, "temperature": 0.3 },
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !resp.status().is_success() {
        let text = resp.text().await.unwrap_or_default();
        return Err(format!("Ollama error: {}", text));
    }

    let mut stream = resp.bytes_stream();
    let mut buffer = String::new();

    while let Some(chunk_result) = stream.next().await {
        let bytes = chunk_result.map_err(|e: reqwest::Error| e.to_string())?;
        buffer.push_str(&String::from_utf8_lossy(&bytes));

        while let Some(newline_pos) = buffer.find('\n') {
            let line = buffer[..newline_pos].trim().to_string();
            buffer = buffer[newline_pos + 1..].to_string();

            if line.is_empty() {
                continue;
            }
            if let Ok(json) = serde_json::from_str::<serde_json::Value>(&line) {
                let content = json["message"]["content"]
                    .as_str()
                    .unwrap_or("")
                    .to_string();
                let done = json["done"].as_bool().unwrap_or(false);
                let _ = on_chunk.send(ChatChunk {
                    content,
                    done,
                });
                if done {
                    return Ok(());
                }
            }
        }
    }

    Ok(())
}

// --- Model pull with progress ---

#[derive(Clone, Serialize)]
pub struct PullProgress {
    pub status: String,
    pub total: Option<u64>,
    pub completed: Option<u64>,
    pub done: bool,
}

#[tauri::command]
pub async fn ollama_pull(
    model: String,
    on_progress: Channel<PullProgress>,
) -> Result<(), String> {
    let url = format!("{}/api/pull", OLLAMA_URL);
    let resp = client(600)?
        .post(&url)
        .json(&serde_json::json!({
            "name": model,
            "stream": true,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !resp.status().is_success() {
        let text = resp.text().await.unwrap_or_default();
        return Err(format!("Pull failed: {}", text));
    }

    let mut stream = resp.bytes_stream();
    let mut buffer = String::new();

    while let Some(chunk_result) = stream.next().await {
        let bytes = chunk_result.map_err(|e: reqwest::Error| e.to_string())?;
        buffer.push_str(&String::from_utf8_lossy(&bytes));

        while let Some(newline_pos) = buffer.find('\n') {
            let line = buffer[..newline_pos].trim().to_string();
            buffer = buffer[newline_pos + 1..].to_string();

            if line.is_empty() {
                continue;
            }
            if let Ok(json) = serde_json::from_str::<serde_json::Value>(&line) {
                let status = json["status"].as_str().unwrap_or("").to_string();
                let total = json["total"].as_u64();
                let completed = json["completed"].as_u64();
                let done = status == "success";
                let _ = on_progress.send(PullProgress {
                    status,
                    total,
                    completed,
                    done,
                });
                if done {
                    return Ok(());
                }
            }
        }
    }

    Ok(())
}
