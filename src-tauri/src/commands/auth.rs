use sha2::{Sha256, Digest};

/// The SHA-256 hash of the dev access passphrase.
/// This is stored as a constant so the plaintext passphrase never appears in frontend code.
const DEV_PASSPHRASE_HASH: &str = "ad8af64734bdd0c03ba1ea9548691dc5b72421965d3f0ea88ce05633a5b9946e";

#[tauri::command]
pub fn verify_dev_passphrase(passphrase: String) -> bool {
    let mut hasher = Sha256::new();
    hasher.update(passphrase.as_bytes());
    let result = format!("{:x}", hasher.finalize());
    result == DEV_PASSPHRASE_HASH
}
