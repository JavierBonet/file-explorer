import docxIcon from "../assets/icons/docx-icon.png";
import shellScriptIcon from "../assets/icons/shell-script-icon.png";
import txtIcon from "../assets/icons/txt-icon.png";
import htmlIcon from "../assets/icons/html-icon.png";
import pdfIcon from "../assets/icons/pdf-icon.png";

interface FileProps {
  name: string;
  isSelected: boolean;
  fileType: string;
  onClick: () => void;
}

const fileTypeIcons = {
  sh: shellScriptIcon,
  txt: txtIcon,
  html: htmlIcon,
  pdf: pdfIcon,
  docx: docxIcon,
};

const File = ({ name, isSelected, onClick, fileType }: FileProps) => {
  const className = isSelected ? "file-element selected" : "file-element";

  let icon = fileTypeIcons[fileType as keyof typeof fileTypeIcons];

  return (
    <div className={className} onClick={onClick}>
      <div className="file-name">{name}</div>
      <div className="file-icon">
        <img src={icon} alt="" />
      </div>
    </div>
  );
};

export default File;
