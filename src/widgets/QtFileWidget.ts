import { QPixmap } from "@nodegui/nodegui";
import { FileWidget } from "src/widgetsInterfaces";

const fileImagePath = "assets/images/widgets/file.png";

export default class QtFileWidget extends QPixmap implements FileWidget {
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
    console.log("file");
  }
}
