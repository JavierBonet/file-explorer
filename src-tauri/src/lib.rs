use serde::Serialize;
use std::fs;

#[derive(Serialize)]
struct FileEntry {
    name: String,
    is_dir: bool,
    file_type: String,
    path: String,
}

#[derive(Debug, Serialize)]
struct AppError {
    message: String,
    error_code: u32,
}

impl AppError {
    fn new(message: &str, error_code: u32) -> Self {
        AppError {
            message: message.to_string(),
            error_code,
        }
    }
}

#[tauri::command]
fn get_directory_contents(path: &str) -> Result<Vec<FileEntry>, String> {
    let entries = fs::read_dir(path).map_err(|e| e.to_string())?;

    let mut file_list = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let metadata = entry.metadata().map_err(|e| e.to_string())?;

        let path = entry.path();
        let extension = path.extension().and_then(|s| s.to_str()).unwrap_or("");

        let file_type_str = if metadata.is_dir() {
            "directory".to_string()
        } else if !extension.is_empty() {
            extension.to_string()
        } else {
            "file".to_string()
        };

        file_list.push(FileEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            is_dir: metadata.is_dir(),
            file_type: file_type_str,
            path: path.to_string_lossy().to_string(),
        });
    }

    Ok(file_list)
}

fn file_exists_and_is_file(file_name: &str) -> bool {
    let path = std::path::Path::new(file_name);

    // Check if path exists AND is a regular file
    path.exists() && path.is_file()
}


#[tauri::command]
fn create_file(path: &str, file_name: &str) -> Result<String, AppError> {
    let full_file_name = format!("{}{}{}", path, "/", file_name);
    let exist = file_exists_and_is_file(&full_file_name);
    if exist {
        return Err(AppError::new("File already exist", 400));
    }
    let write_result = fs::write(full_file_name, "").map_err(|e| e.to_string());
    if write_result.is_err() {
        return Err(AppError::new(write_result.err().unwrap().trim(), 400));
    }

    Ok("File successfully created".to_string())
}

#[tauri::command]
fn delete_file(path: &str, file_name: &str) -> Result<String, AppError> {
    let full_file_name = format!("{}{}{}", path, "/", file_name);
    let exist = file_exists_and_is_file(&full_file_name);
    if !exist {
        return Err(AppError::new("File does not exist", 400));
    }

    let remove_result = fs::remove_file(full_file_name).map_err(|e| e.to_string());

    if remove_result.is_err() {
        return Err(AppError::new(remove_result.err().unwrap().trim(), 400));
    }

    Ok("File successfully deleted".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_directory_contents,
            create_file,
            delete_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
