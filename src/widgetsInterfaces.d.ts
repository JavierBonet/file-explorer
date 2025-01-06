import { QImage, QPixmap, QPushButton, QWidget } from "@nodegui/nodegui";

interface WidgetsFactory {
  createFolderWidget: () => FolderWidget;
  createFileWidget: () => FileWidget;
  createPushButtonWidget: () => QPushButton;
}

interface RightClickable {
  onRightClick: () => void;
}

interface Widget<T> {
  getWidget: () => T;
}

type MyType<T> = T & Widget<T>;

type FolderWidget = MyType<QPixmap> & RightClickable;

// interface FileWidget {
//   setText: (label: string) => void;
// }

type FileWidget = MyType<QPixmap> & RightClickable;
