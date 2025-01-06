import { QPushButton, QWidget } from "@nodegui/nodegui";
import QtFileWidget from "src/widgets/QtFileWidget";
import QtFolderWidget from "src/widgets/QtFolderWidget";

import {
  FileWidget,
  FolderWidget,
  WidgetsFactory,
} from "src/widgetsInterfaces";

class QtWidgetsFactory implements WidgetsFactory {
  createFolderWidget() {
    return new QtFolderWidget();
  }
  createFileWidget() {
    return new QtFileWidget();
  }
  createPushButtonWidget() {
    return new QPushButton();
  }
}

export default QtWidgetsFactory;
