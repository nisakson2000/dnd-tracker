use rusqlite::Connection;
use std::path::Path;

use crate::db::open_connection;
use crate::migrations::{run_migrations, CAMPAIGN_MIGRATIONS};

/// Initialize (or open) the DM-side campaigns.db and run all pending migrations.
pub fn init_campaign_db(app_data_dir: &Path) -> Result<Connection, String> {
    let db_path = app_data_dir.join("campaigns.db");
    let conn = open_connection(&db_path)
        .map_err(|e| format!("Failed to open campaigns.db: {}", e))?;

    run_migrations(&conn, CAMPAIGN_MIGRATIONS)?;

    Ok(conn)
}
