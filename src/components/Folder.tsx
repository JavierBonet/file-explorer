import folderIcon from "../assets/icons/folder-icon.png";

interface FolderProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  onDblClick: () => void;
}

const Folder = ({ name, isSelected, onClick, onDblClick }: FolderProps) => {
  const className = isSelected ? "folder-element selected" : "folder-element";

  return (
    <div className={className} onClick={onClick} onDoubleClick={onDblClick}>
      <div className="folder-name">{name}</div>
      <div className="folder-icon">
        <img src={folderIcon} alt="" />
      </div>
    </div>
  );
};

export default Folder;
