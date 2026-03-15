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

// ── AI NPC Generation ──

#[tauri::command]
pub async fn generate_npc(
    race: Option<String>,
    occupation: Option<String>,
    setting: Option<String>,
    party_level: Option<i32>,
) -> Result<String, String> {
    let setting_str = setting.as_deref().unwrap_or("fantasy");
    let level_str = party_level
        .map(|l| format!("The party is level {}.", l))
        .unwrap_or_default();
    let race_str = race
        .as_deref()
        .map(|r| format!("The NPC's race must be {}.", r))
        .unwrap_or_default();
    let occupation_str = occupation
        .as_deref()
        .map(|o| format!("The NPC's occupation/class must be {}.", o))
        .unwrap_or_default();

    let system_prompt = format!(
        "You are a D&D Dungeon Master's assistant. Generate a single D&D NPC for a {} setting. {} {} {}\n\
        Respond with ONLY valid JSON (no markdown, no code fences) using exactly these fields:\n\
        {{\n  \
          \"name\": \"string\",\n  \
          \"race\": \"string\",\n  \
          \"npc_class\": \"string\",\n  \
          \"description\": \"string — a vivid 2-3 sentence physical and personality description\",\n  \
          \"appearance\": \"string — 2-3 sentence physical description covering build, facial features, any scars or distinguishing marks, and clothing style\",\n  \
          \"mannerisms\": \"string — a specific behavioral quirk or habit this NPC displays (e.g. always polishes a coin, taps their teeth when thinking, refuses to make eye contact)\",\n  \
          \"voice\": \"string — description of accent, tone, and speech pattern (e.g. gravelly whisper with clipped sentences, sing-song elvish lilt, booming baritone that fills any room)\",\n  \
          \"catchphrase\": \"string — a signature phrase, greeting, or saying this NPC is known for\",\n  \
          \"disposition\": \"string — one of: friendly, neutral, hostile, fearful, mysterious\",\n  \
          \"location\": \"string — where this NPC can typically be found\",\n  \
          \"quest_hook\": \"string — a short quest or favor this NPC might offer\",\n  \
          \"notes_text\": \"string — DM-only notes about secrets or hidden motives\",\n  \
          \"faction\": \"string — faction or guild affiliation, or empty string\",\n  \
          \"role\": \"string — narrative role such as ally, villain, merchant, informant\",\n  \
          \"status\": \"string — one of: alive, dead, missing, unknown\"\n\
        }}",
        setting_str, level_str, race_str, occupation_str
    );

    let url = format!("{}/api/generate", OLLAMA_URL);

    let resp = client(120)?
        .post(&url)
        .json(&serde_json::json!({
            "model": "llama3.2",
            "prompt": system_prompt,
            "stream": false,
            "options": {
                "num_predict": 2048,
                "temperature": 0.85,
            },
        }))
        .send()
        .await
        .map_err(|e| format!("Failed to reach Ollama: {}", e))?;

    if !resp.status().is_success() {
        let text = resp.text().await.unwrap_or_default();
        return Err(format!("Ollama error: {}", text));
    }

    let body: serde_json::Value = resp.json().await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    let response_text = body["response"]
        .as_str()
        .unwrap_or("*Failed to generate NPC. Make sure Ollama is running with a model installed.*")
        .to_string();

    Ok(response_text)
}

// ── AI Location Generation ──

#[tauri::command]
pub async fn generate_location(
    location_type: Option<String>,
    setting: Option<String>,
    party_level: Option<i32>,
) -> Result<String, String> {
    let setting_str = setting.as_deref().unwrap_or("fantasy");
    let level_str = party_level
        .map(|l| format!("The party is level {}.", l))
        .unwrap_or_default();
    let type_str = location_type.as_deref().unwrap_or("any");

    let body_guidance = match type_str.to_lowercase().as_str() {
        "dungeon" | "cave" | "ruin" | "ruins" | "tomb" | "temple" => {
            "The body should be filled-in markdown with these sections: \
            ## Entrance, ## Levels/Rooms (describe at least 3), ## Known Hazards, \
            ## Inhabitants, ## Treasure, ## History. \
            Fill every section with vivid, specific details — never leave a section blank."
        }
        "town" | "city" | "village" | "hamlet" | "settlement" => {
            "The body should be filled-in markdown with these sections: \
            ## Population, ## Government, ## Notable Landmarks (at least 3), \
            ## Economy, ## Dangers, ## Key NPCs (at least 2 with names and roles). \
            Fill every section with vivid, specific details — never leave a section blank."
        }
        "tavern" | "inn" | "pub" | "bar" => {
            "The body should be filled-in markdown with these sections: \
            ## Type, ## Owner (name, race, personality), ## Notable Features, \
            ## Atmosphere, ## Menu Specials (at least 3 items), ## Rumors Heard Here (at least 3). \
            Fill every section with vivid, specific details — never leave a section blank."
        }
        _ => {
            "The body should be filled-in markdown with descriptive sections appropriate for this \
            type of location. Include at least 4 sections covering appearance, inhabitants, \
            dangers, and notable features. Fill every section with vivid, specific details."
        }
    };

    let system_prompt = format!(
        "You are a D&D Dungeon Master's assistant. Generate a D&D location of type \"{}\" for a {} setting. {}\n\
        Respond with ONLY valid JSON (no markdown, no code fences) using exactly these fields:\n\
        {{\n  \
          \"title\": \"string — the location name\",\n  \
          \"category\": \"string — the location type (e.g. dungeon, town, tavern, wilderness, etc.)\",\n  \
          \"body\": \"string — filled-in markdown content with all sections populated\",\n  \
          \"atmosphere\": \"string — the overall mood or feeling of this place (e.g. oppressive, welcoming, eerie, sacred, foreboding, lively)\",\n  \
          \"sensory_details\": \"string — what you hear, smell, and physically feel when you first enter this place (e.g. the drip of water on stone, the acrid tang of old smoke, a bone-deep chill)\",\n  \
          \"inhabitants_hint\": \"string — who or what might live here, presented as clues the party could notice (tracks, sounds, remnants) rather than a plain list\",\n  \
          \"hook\": \"string — a compelling reason adventurers would seek out or stumble upon this location\",\n  \
          \"discovery_type\": \"string — one of: known, rumored, hidden, discovered\",\n  \
          \"related_to_text\": \"string — a comma-separated list of related locations, NPCs, or factions\"\n\
        }}\n\n\
        {}",
        type_str, setting_str, level_str, body_guidance
    );

    let url = format!("{}/api/generate", OLLAMA_URL);

    let resp = client(120)?
        .post(&url)
        .json(&serde_json::json!({
            "model": "llama3.2",
            "prompt": system_prompt,
            "stream": false,
            "options": {
                "num_predict": 2048,
                "temperature": 0.85,
            },
        }))
        .send()
        .await
        .map_err(|e| format!("Failed to reach Ollama: {}", e))?;

    if !resp.status().is_success() {
        let text = resp.text().await.unwrap_or_default();
        return Err(format!("Ollama error: {}", text));
    }

    let body: serde_json::Value = resp.json().await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    let response_text = body["response"]
        .as_str()
        .unwrap_or("*Failed to generate location. Make sure Ollama is running with a model installed.*")
        .to_string();

    Ok(response_text)
}

// ── AI Lore Generation ──

#[tauri::command]
pub async fn generate_lore(
    category: Option<String>,
    topic: Option<String>,
    setting: Option<String>,
) -> Result<String, String> {
    let setting_str = setting.as_deref().unwrap_or("fantasy");
    let category_str = category.as_deref().unwrap_or("general");
    let topic_str = topic.as_deref().unwrap_or("");

    let body_guidance = match category_str.to_lowercase().as_str() {
        "deity" | "god" | "religion" | "pantheon" => {
            "The body should be filled-in markdown with sections: \
            ## Domain & Portfolio, ## Holy Symbol, ## Worship & Rituals, \
            ## Clergy & Temples, ## Mythology & Origin, ## Relationships with Other Deities. \
            Fill every section with vivid, specific details."
        }
        "history" | "event" | "war" | "era" => {
            "The body should be filled-in markdown with sections: \
            ## Overview, ## Key Figures, ## Timeline of Events, \
            ## Causes, ## Consequences, ## Legacy & Modern Impact. \
            Fill every section with vivid, specific details."
        }
        "faction" | "guild" | "organization" | "order" => {
            "The body should be filled-in markdown with sections: \
            ## Purpose & Goals, ## Leadership, ## Membership & Ranks, \
            ## Headquarters, ## Allies & Enemies, ## Secret Activities. \
            Fill every section with vivid, specific details."
        }
        "legend" | "myth" | "prophecy" | "artifact" => {
            "The body should be filled-in markdown with sections: \
            ## The Legend, ## Origin, ## Known Versions of the Tale, \
            ## Evidence & Sightings, ## Significance, ## What the Scholars Say. \
            Fill every section with vivid, specific details."
        }
        _ => {
            "The body should be filled-in markdown with descriptive sections appropriate for this \
            type of lore entry. Include at least 4 sections with vivid, specific details. \
            Never leave a section blank or use placeholder text."
        }
    };

    let topic_line = if topic_str.is_empty() {
        String::new()
    } else {
        format!("The topic/subject is: \"{}\".", topic_str)
    };

    let system_prompt = format!(
        "You are a D&D Dungeon Master's assistant. Generate a lore entry in the \"{}\" category for a {} setting. {}\n\
        Respond with ONLY valid JSON (no markdown, no code fences) using exactly these fields:\n\
        {{\n  \
          \"title\": \"string — the lore entry title\",\n  \
          \"category\": \"string — the lore category\",\n  \
          \"body\": \"string — filled-in markdown content with all sections populated\",\n  \
          \"discovery_method\": \"string — how players would learn about this lore (e.g. found in an ancient tome, revealed through NPC exposition, carved as an inscription on a ruin, experienced in a prophetic dream)\",\n  \
          \"sensory_anchor\": \"string — a distinctive sensory detail tied to this lore that makes it memorable (e.g. the smell of brimstone whenever the artifact activates, a faint humming heard near the sealed door, the taste of copper on the tongue when the curse is near)\",\n  \
          \"discovery_type\": \"string — one of: known, rumored, hidden, discovered\",\n  \
          \"related_to_text\": \"string — a comma-separated list of related lore entries, locations, or NPCs\"\n\
        }}\n\n\
        {}",
        category_str, setting_str, topic_line, body_guidance
    );

    let url = format!("{}/api/generate", OLLAMA_URL);

    let resp = client(120)?
        .post(&url)
        .json(&serde_json::json!({
            "model": "llama3.2",
            "prompt": system_prompt,
            "stream": false,
            "options": {
                "num_predict": 2048,
                "temperature": 0.85,
            },
        }))
        .send()
        .await
        .map_err(|e| format!("Failed to reach Ollama: {}", e))?;

    if !resp.status().is_success() {
        let text = resp.text().await.unwrap_or_default();
        return Err(format!("Ollama error: {}", text));
    }

    let body: serde_json::Value = resp.json().await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    let response_text = body["response"]
        .as_str()
        .unwrap_or("*Failed to generate lore. Make sure Ollama is running with a model installed.*")
        .to_string();

    Ok(response_text)
}

// ── AI Encounter Generation ──

#[tauri::command]
pub async fn generate_encounter(
    prompt: String,
    encounter_type: Option<String>,
    party_level: Option<i32>,
    setting: Option<String>,
) -> Result<String, String> {
    let setting_str = setting.as_deref().unwrap_or("fantasy");
    let level_str = party_level
        .map(|l| format!("The party is level {}.", l))
        .unwrap_or_default();
    let type_str = encounter_type.as_deref().unwrap_or("any");

    let type_guidance = match type_str.to_lowercase().as_str() {
        "combat" => "This is a combat encounter. Focus on enemy tactics, terrain advantages, and escalation.",
        "social" => "This is a social encounter. Focus on NPC motivations, persuasion opportunities, and social stakes.",
        "exploration" => "This is an exploration encounter. Focus on discovery, environmental puzzles, and hidden secrets.",
        "environmental" => "This is an environmental encounter. Focus on natural hazards, survival challenges, and terrain effects.",
        "moral_dilemma" => "This is a moral dilemma encounter. Focus on difficult choices, competing values, and consequences with no clear right answer.",
        "mystery" => "This is a mystery encounter. Focus on clues, red herrings, deduction, and revelations.",
        _ => "Generate any type of encounter that fits the prompt.",
    };

    let system_prompt = format!(
        "You are a D&D Dungeon Master's assistant. Generate a complete encounter package for a {} setting. {} {}\n\
        Respond with ONLY valid JSON (no markdown, no code fences) using exactly these fields:\n\
        {{\n  \
          \"opening_narration\": \"string — 2-4 sentences of read-aloud flavor text for the DM\",\n  \
          \"player_text\": \"string — a shorter version of the narration suitable for player screens\",\n  \
          \"sensory_details\": \"string — what the party sees, hears, and smells as the encounter begins (e.g. torchlight guttering in a sudden draft, the crunch of bone underfoot, a sweet rotting scent)\",\n  \
          \"mechanics\": \"string — what checks or actions are immediately in play, include DCs\",\n  \
          \"outcomes\": [\"string — 2-3 branching outcomes with consequences\"],\n  \
          \"escalation\": \"string — how the situation gets worse if the party hesitates or does nothing (reinforcements arrive, the ritual completes, the fire spreads, etc.)\",\n  \
          \"loot\": \"string — what the party can gain\",\n  \
          \"consequence_if_ignored\": \"string — what happens if the players walk away\",\n  \
          \"mood\": \"string — one of: tense, comedic, mysterious, dangerous, tragic, chaotic\"\n\
        }}",
        setting_str, level_str, type_guidance
    );

    let url = format!("{}/api/generate", OLLAMA_URL);

    let resp = client(120)?
        .post(&url)
        .json(&serde_json::json!({
            "model": "llama3.2",
            "prompt": format!("{}\n\nEncounter concept: {}", system_prompt, prompt),
            "stream": false,
            "options": {
                "num_predict": 2048,
                "temperature": 0.85,
            },
        }))
        .send()
        .await
        .map_err(|e| format!("Failed to reach Ollama: {}", e))?;

    if !resp.status().is_success() {
        let text = resp.text().await.unwrap_or_default();
        return Err(format!("Ollama error: {}", text));
    }

    let body: serde_json::Value = resp.json().await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    let response_text = body["response"]
        .as_str()
        .unwrap_or("*Failed to generate encounter. Make sure Ollama is running with a model installed.*")
        .to_string();

    Ok(response_text)
}
