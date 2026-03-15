use sha2::{Sha256, Digest};

/// The SHA-256 hash of the dev access passphrase.
/// This is stored as a constant so the plaintext passphrase never appears in frontend code.
const DEV_PASSPHRASE_HASH: &str = "9d5c072e469d0b78afe63cac8f4358a7e817e741f37866e3b99559c7b6cdce71";

#[tauri::command]
pub fn verify_dev_passphrase(passphrase: String) -> bool {
    let mut hasher = Sha256::new();
    hasher.update(passphrase.as_bytes());
    let result = format!("{:x}", hasher.finalize());
    result == DEV_PASSPHRASE_HASH
}
