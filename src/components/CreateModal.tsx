import { useState } from 'react';
import './CreateModal.scss';

interface CreateModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

interface File {
  name: string;
  extension: string;
}

const initialFile: File = {
  name: '',
  extension: '',
};

const CreateModal = ({ onClose, onCreate }: CreateModalProps) => {
  const [file, setFile] = useState(initialFile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = { ...file, [e.target.id]: e.target.value };
    setFile(newFile);
  };

  const getFileFullName = () => file.name + '.' + file.extension;

  const handleCreate = () => {
    onCreate(getFileFullName());
    setFile(initialFile);
    onClose();
  };

  return (
    <div className="create-modal">
      <button className="close-button" type="button" onClick={onClose}>
        X
      </button>
      <div className="modal-content">
        <h2>Create file</h2>
        <div className="fields">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="File name" value={file.name} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="extension">Extension</label>
            <input
              id="extension"
              type="text"
              placeholder="File extension"
              value={file.extension}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="button" disabled={!file.name || !file.extension} onClick={handleCreate}>
          Create
        </button>
      </div>
      <div className="modal-background" onClick={onClose}></div>
    </div>
  );
};

export default CreateModal;
