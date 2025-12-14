import { invoke } from '@tauri-apps/api/core';

interface FileEntry {
  name: string;
  is_dir: boolean;
  file_type: string;
  path: string;
}

export const getDirectoryContents = async (path: string) => {
  const contents: FileEntry[] = await invoke('get_directory_contents', {
    path,
  });

  return contents;
};

export const createFile = async (currentPath: string, fileName: string) => {
  try {
    const payload = {
      path: currentPath,
      fileName,
    };
    await invoke('create_file', payload);
  } catch (e) {
    console.log(e);
  }
};

export const deleteFile = async (currentPath: string, fileName: string) => {
  try {
    const payload = {
      path: currentPath,
      fileName,
    };
    await invoke('delete_file', payload);
  } catch (e) {
    console.log(e);
  }
};
