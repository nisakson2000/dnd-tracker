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

// ── Ollama auto-setup: detect, download URL, launch ──

#[derive(Serialize)]
pub struct OllamaSetupStatus {
    pub installed: bool,
    pub running: bool,
    pub install_url: String,
    pub models: Vec<String>,
}

#[tauri::command]
pub async fn ollama_setup_status() -> Result<OllamaSetupStatus, String> {
    // Check if running first
    let url = format!("{}/api/tags", OLLAMA_URL);
    match client(3)?.get(&url).send().await {
        Ok(resp) if resp.status().is_success() => {
            let body: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
            let models = body["models"]
                .as_array()
                .map(|arr| arr.iter().filter_map(|m| m["name"].as_str().map(String::from)).collect())
                .unwrap_or_default();
            Ok(OllamaSetupStatus {
                installed: true,
                running: true,
                install_url: String::new(),
                models,
            })
        }
        _ => {
            // Not running — check if installed by looking for the binary
            let installed = is_ollama_installed();
            Ok(OllamaSetupStatus {
                installed,
                running: false,
                install_url: "https://ollama.com/download".to_string(),
                models: vec![],
            })
        }
    }
}

fn is_ollama_installed() -> bool {
    #[cfg(target_os = "windows")]
    {
        // Check common install paths on Windows
        if let Ok(user) = std::env::var("USERNAME") {
            let local_path = std::path::PathBuf::from(r"C:\Users")
                .join(&user)
                .join(r"AppData\Local\Programs\Ollama\ollama.exe");
            if local_path.exists() { return true; }
        }
        if std::path::Path::new(r"C:\Program Files\Ollama\ollama.exe").exists() { return true; }
        // Try PATH
        std::process::Command::new("ollama").arg("--version").output().is_ok()
    }
    #[cfg(not(target_os = "windows"))]
    {
        std::process::Command::new("ollama").arg("--version").output().is_ok()
    }
}

#[tauri::command]
pub async fn ollama_start() -> Result<String, String> {
    // Try to start Ollama serve in the background
    #[cfg(target_os = "windows")]
    {
        let mut paths: Vec<std::path::PathBuf> = vec![];
        if let Ok(user) = std::env::var("USERNAME") {
            paths.push(std::path::PathBuf::from(r"C:\Users").join(&user).join(r"AppData\Local\Programs\Ollama\ollama.exe"));
        }
        paths.push(std::path::PathBuf::from(r"C:\Program Files\Ollama\ollama.exe"));
        for p in &paths {
            if p.exists() {
                std::process::Command::new(p)
                    .arg("serve")
                    .stdin(std::process::Stdio::null())
                    .stdout(std::process::Stdio::null())
                    .stderr(std::process::Stdio::null())
                    .spawn()
                    .map_err(|e| format!("Failed to start Ollama: {}", e))?;
                // Wait a moment for it to start
                tokio::time::sleep(std::time::Duration::from_secs(2)).await;
                return Ok("Ollama started".to_string());
            }
        }
        // Try PATH
        std::process::Command::new("ollama")
            .arg("serve")
            .stdin(std::process::Stdio::null())
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
            .map_err(|e| format!("Failed to start Ollama: {}", e))?;
        tokio::time::sleep(std::time::Duration::from_secs(2)).await;
        Ok("Ollama started".to_string())
    }
    #[cfg(not(target_os = "windows"))]
    {
        std::process::Command::new("ollama")
            .arg("serve")
            .stdin(std::process::Stdio::null())
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
            .map_err(|e| format!("Failed to start Ollama: {}", e))?;
        tokio::time::sleep(std::time::Duration::from_secs(2)).await;
        Ok("Ollama started".to_string())
    }
}

// ── Auto-download and install Ollama ──

#[derive(Clone, Serialize)]
pub struct InstallProgress {
    pub stage: String,
    pub percent: u32,
    pub done: bool,
}

#[tauri::command]
pub async fn ollama_auto_install(
    on_progress: Channel<InstallProgress>,
) -> Result<String, String> {
    // Only for Windows
    #[cfg(not(target_os = "windows"))]
    {
        return Err("Auto-install is only supported on Windows. Install Ollama manually from https://ollama.com/download".to_string());
    }

    #[cfg(target_os = "windows")]
    {
        let _ = on_progress.send(InstallProgress { stage: "Downloading Ollama installer...".into(), percent: 0, done: false });

        let download_url = "https://ollama.com/download/OllamaSetup.exe";
        let temp_dir = std::env::temp_dir();
        let installer_path = temp_dir.join("OllamaSetup.exe");

        // Download the installer with progress
        let resp = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(600))
            .build()
            .map_err(|e| e.to_string())?
            .get(download_url)
            .send()
            .await
            .map_err(|e| format!("Download failed: {}", e))?;

        if !resp.status().is_success() {
            return Err(format!("Download failed: HTTP {}", resp.status()));
        }

        let total_size = resp.content_length().unwrap_or(0);
        let mut downloaded: u64 = 0;
        let mut file = std::fs::File::create(&installer_path)
            .map_err(|e| format!("Failed to create temp file: {}", e))?;

        use std::io::Write;
        use futures_util::StreamExt;

        let mut stream = resp.bytes_stream();
        while let Some(chunk) = stream.next().await {
            let bytes = chunk.map_err(|e| format!("Download interrupted: {}", e))?;
            file.write_all(&bytes).map_err(|e| format!("Write failed: {}", e))?;
            downloaded += bytes.len() as u64;
            if total_size > 0 {
                let pct = ((downloaded as f64 / total_size as f64) * 80.0) as u32; // 0-80% for download
                let _ = on_progress.send(InstallProgress {
                    stage: format!("Downloading... {}MB / {}MB", downloaded / 1_000_000, total_size / 1_000_000),
                    percent: pct,
                    done: false,
                });
            }
        }
        drop(file);

        let _ = on_progress.send(InstallProgress { stage: "Installing Ollama...".into(), percent: 85, done: false });

        // Run the installer silently
        let status = std::process::Command::new(&installer_path)
            .arg("/VERYSILENT")
            .arg("/NORESTART")
            .arg("/SUPPRESSMSGBOXES")
            .status()
            .map_err(|e| format!("Failed to run installer: {}", e))?;

        // Clean up installer
        let _ = std::fs::remove_file(&installer_path);

        if !status.success() {
            return Err("Ollama installer exited with an error".to_string());
        }

        let _ = on_progress.send(InstallProgress { stage: "Starting Ollama...".into(), percent: 95, done: false });

        // Wait a moment for Ollama to initialize
        tokio::time::sleep(std::time::Duration::from_secs(3)).await;

        let _ = on_progress.send(InstallProgress { stage: "Ollama installed!".into(), percent: 100, done: true });

        Ok("Ollama installed successfully".to_string())
    }
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
    max_tokens: Option<u32>,
    temperature: Option<f64>,
) -> Result<(), String> {
    let url = format!("{}/api/chat", OLLAMA_URL);
    let num_predict = max_tokens.unwrap_or(128);
    let temp = temperature.unwrap_or(0.3);
    let resp = client(300)?
        .post(&url)
        .json(&serde_json::json!({
            "model": model,
            "messages": messages,
            "stream": true,
            "options": { "num_predict": num_predict, "temperature": temp },
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

// ── M-20: AI Quest Generation ──

#[tauri::command]
pub async fn generate_quest(
    prompt: String,
    party_level: i32,
    setting: String,
) -> Result<String, String> {
    let system_prompt = format!(
        "You are a D&D Dungeon Master's assistant. Generate a quest scaffold in markdown format for a party of level {} characters in a {} setting. \
        Include: Quest Title, Hook, Objectives (numbered), Key NPCs, Potential Encounters, Rewards, and Complications. \
        Keep it concise but evocative.",
        party_level,
        if setting.is_empty() { "fantasy" } else { &setting }
    );

    let url = format!("{}/api/generate", OLLAMA_URL);

    let resp = client(120)?
        .post(&url)
        .json(&serde_json::json!({
            "model": "llama3.2",
            "prompt": format!("{}\n\nQuest theme/concept: {}", system_prompt, prompt),
            "stream": false,
            "options": {
                "num_predict": 1024,
                "temperature": 0.8,
            },
        }))
        .send()
        .await
        .map_err(|e| format!("Failed to reach Ollama: {}", e))?;

    if !resp.status().is_success() {
        let text = resp.text().await.unwrap_or_default();
        return Err(format!("Ollama error: {}", text));
    }

    let body: serde_json::Value = resp.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
    let response_text = body["response"]
        .as_str()
        .unwrap_or("*Failed to generate quest. Make sure Ollama is running with a model installed.*")
        .to_string();

    Ok(response_text)
}

// ── Generic AI generation (one-shot, non-streaming) ──
// Used by all 9 AI modules for DM content generation

#[tauri::command]
pub async fn ollama_generate(
    model: String,
    prompt: String,
    system: Option<String>,
    max_tokens: Option<u32>,
    temperature: Option<f64>,
) -> Result<String, String> {
    let url = format!("{}/api/generate", OLLAMA_URL);
    let num_predict = max_tokens.unwrap_or(1024);
    let temp = temperature.unwrap_or(0.7);

    let mut body = serde_json::json!({
        "model": model,
        "prompt": prompt,
        "stream": false,
        "options": {
            "num_predict": num_predict,
            "temperature": temp,
        },
    });

    if let Some(sys) = system {
        body["system"] = serde_json::Value::String(sys);
    }

    let resp = client(300)?
        .post(&url)
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Failed to reach Ollama: {}", e))?;

    if !resp.status().is_success() {
        let text = resp.text().await.unwrap_or_default();
        return Err(format!("Ollama error: {}", text));
    }

    let result: serde_json::Value = resp.json().await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    let text = result["response"]
        .as_str()
        .unwrap_or("*Generation failed. Ensure Ollama is running with a model installed.*")
        .to_string();
    Ok(text)
}

// ── Streaming AI generation for DM modules ──

#[tauri::command]
pub async fn ollama_generate_stream(
    model: String,
    prompt: String,
    system: Option<String>,
    max_tokens: Option<u32>,
    temperature: Option<f64>,
    on_chunk: Channel<ChatChunk>,
) -> Result<(), String> {
    let url = format!("{}/api/generate", OLLAMA_URL);
    let num_predict = max_tokens.unwrap_or(1024);
    let temp = temperature.unwrap_or(0.7);

    let mut body = serde_json::json!({
        "model": model,
        "prompt": prompt,
        "stream": true,
        "options": {
            "num_predict": num_predict,
            "temperature": temp,
        },
    });

    if let Some(sys) = system {
        body["system"] = serde_json::Value::String(sys);
    }

    let resp = client(300)?
        .post(&url)
        .json(&body)
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
            if line.is_empty() { continue; }
            if let Ok(json) = serde_json::from_str::<serde_json::Value>(&line) {
                let content = json["response"].as_str().unwrap_or("").to_string();
                let done = json["done"].as_bool().unwrap_or(false);
                let _ = on_chunk.send(ChatChunk { content, done });
                if done { return Ok(()); }
            }
        }
    }
    Ok(())
}
