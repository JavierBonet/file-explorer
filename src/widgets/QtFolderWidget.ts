import { QPixmap } from "@nodegui/nodegui";
import { FolderWidget } from "src/widgetsInterfaces";

const fileImagePath = "assets/images/widgets/folder.png";

export default class QtFolderWidget extends QPixmap implements FolderWidget {
  widget: QPixmap;

  constructor() {
    super();
    const image = new QPixmap(fileImagePath);
    this.widget = image.scaled(50, 50);
  }
  getWidget() {
    return this.widget;
  }

  onRightClick() {
    console.log("asdf");
  }
}
