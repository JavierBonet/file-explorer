import { useState, useEffect } from 'react';
import { createFile, deleteFile, getDirectoryContents } from '../api/filesApi';
import Folder from './Folder';
import File from './File';
import CreateModal from './CreateModal';

interface FileEntry {
  name: string;
  is_dir: boolean;
  file_type: string;
  path: string;
}

const defaultPath = '/home/javier/Escritorio';

const MainWindow = () => {
  const [directoryContents, setDirectoryContents] = useState<FileEntry[]>([]);
  const [selected, setSelected] = useState<FileEntry | null>(null);
  const [pathHistory, setPathHistory] = useState<string[]>([defaultPath]);
  const [pathIndex, setPathIndex] = useState<number>(0);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const setContents = async (path: string) => {
    const contents = await getDirectoryContents(path);
    setDirectoryContents(contents);
  };

  const handleFileCreate = async (fileName: string) => {
    const currentPath = pathHistory[pathIndex];
    await createFile(currentPath, fileName);
    setContents(currentPath);
  };

  const handleFileDelete = async () => {
    const currentPath = pathHistory[pathIndex];
    const fileName = selected!.name;
    await deleteFile(currentPath, fileName);
    setSelected(null);
    setContents(currentPath);
  };

  const goBack = () => {
    if (pathIndex > 0) {
      const newPathIndex = pathIndex - 1;
      setPathIndex(newPathIndex);
      setContents(pathHistory[newPathIndex]);
    }
  };

  const goForward = () => {
    if (pathIndex < pathHistory.length - 1) {
      const newPathIndex = pathIndex + 1;
      setPathIndex(newPathIndex);
      setContents(pathHistory[newPathIndex]);
    }
  };

  const enterFolder = (path: string) => {
    const newPathHistory = [...pathHistory];
    const newPathIndex = pathIndex + 1;
    const existingPath = pathHistory[newPathIndex];
    if (existingPath !== undefined) {
      if (existingPath !== path) {
        newPathHistory.splice(newPathIndex, pathHistory.length, path);
      }
    } else {
      newPathHistory.push(path);
    }
    setPathHistory(newPathHistory);
    setPathIndex(newPathIndex);
    setContents(path);
  };

  useEffect(() => {
    setContents(defaultPath);
  }, []);

  return (
    <main className="container">
      <h1>Welcome</h1>

      <div className="navigation-buttons">
        {!showCreateModal && (
          <button className="create-button" type="button" onClick={() => setShowCreateModal(true)}>
            Create file
          </button>
        )}
        <button type="button" disabled={!selected} onClick={() => handleFileDelete()}>
          Delete
        </button>
        {pathIndex > 0 && (
          <button className="go-back-button" type="button" onClick={goBack}>
            Go back
          </button>
        )}
        {pathIndex < pathHistory.length - 1 && (
          <button className="go-forward-button" type="button" onClick={goForward}>
            Go forward
          </button>
        )}
      </div>

      {showCreateModal && <CreateModal onClose={() => setShowCreateModal(false)} onCreate={handleFileCreate} />}

      <div className="folder-content">
        {directoryContents.map((element) =>
          element.is_dir ? (
            <Folder
              key={element.path}
              name={element.name}
              isSelected={selected?.path === element.path}
              onClick={() => setSelected(element)}
              onDblClick={() => enterFolder(element.path)}
            />
          ) : (
            <File
              key={element.path}
              name={element.name}
              fileType={element.file_type}
              isSelected={selected?.path === element.path}
              onClick={() => setSelected(element)}
            />
          )
        )}
      </div>
    </main>
  );
};

export default MainWindow;
