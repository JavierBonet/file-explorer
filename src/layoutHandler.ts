import {
  AlignmentFlag,
  FlexLayout,
  QLabel,
  QLayout,
  QMainWindow,
  QPushButton,
  QScrollArea,
  QSize,
  QSizePolicyPolicy,
  QSizePolicyPolicyFlag,
  QStackedWidget,
  QWidget,
  SizeAdjustPolicy,
} from "@nodegui/nodegui";
import QtWidgetsFactory from "./factories/QtWidgetsFactory";
import { WidgetsFactory } from "./widgetsInterfaces";
import FsUtils, { defaultPath } from "./fsUtils";
import { Dirent } from "fs";

export interface ILayoutHandler {
  start: () => Promise<void>;
}

const heigth = 400;
const width = 600;

export default class LayoutHandler implements ILayoutHandler {
  private mainWindow: QMainWindow;
  private scrollArea: QScrollArea;
  private stack: QStackedWidget;
  private historyTracker: QWidget[];
  private historyIndex: number | undefined;
  private widgetFactory: WidgetsFactory;

  constructor(title: string) {
    // Create the main application window
    this.mainWindow = new QMainWindow();
    const s = new QSize(width, heigth);
    // this.mainWindow.setFixedSize(width, heigth);
    this.mainWindow.setBaseSize(s);
    this.mainWindow.setWindowTitle(title);
    // Create a QStackedWidget to hold all "pages"
    this.stack = new QStackedWidget();
    this.stack.setSizePolicy(
      QSizePolicyPolicy.Fixed,
      QSizePolicyPolicy.Expanding
    );
    // Set the stack as the central widget of the main window
    this.scrollArea = new QScrollArea();
    this.scrollArea.setInlineStyle(`
      flex: 0;
      width: ${width};
    `);

    this.mainWindow.setCentralWidget(this.scrollArea);
    this.historyTracker = [];
    this.historyIndex = undefined;
    this.widgetFactory = new QtWidgetsFactory();
  }

  async start() {
    const section = await this.createSection(defaultPath);

    // Add pages to the stack
    this.stack.addWidget(section);
    this.historyTracker.push(section);
    this.scrollArea.setWidget(this.stack);

    // Show the main window
    this.mainWindow.show();

    // Keep references to prevent garbage collection
    global.win = this.mainWindow;
  }

  async createSection(folderPath: string) {
    const innerWidget = new QWidget();
    const sectionLayout = new FlexLayout();
    // <-------------------------- CHECK IF QBoxLayout WORKS INSTEAD OF FLEX LAYOUT
    innerWidget.setInlineStyle(`
      flex-direction: row;
      flex-wrap: wrap;
      margin: auto;
    `);
    innerWidget.setLayout(sectionLayout);

    const splitted = folderPath.split("/");
    const folderName = splitted[splitted.length - 1];
    const titleLabel = new QLabel();
    titleLabel.setText(folderName);

    const outerWidget = new QWidget();
    const outerLayout = new FlexLayout();
    outerWidget.setLayout(outerLayout);
    outerWidget.setInlineStyle(`
      flex-direction: column;
      margin: auto;
      width: ${width};
    `);
    outerLayout.addWidget(titleLabel);
    outerLayout.addWidget(innerWidget);

    await this.displayFolderElements(folderPath, sectionLayout);
    return outerWidget;
  }

  async displayFolderElements(folderPath: string, containerSection: QLayout) {
    const elements = await FsUtils.getElementsFromDirectory(folderPath);
    const folders = elements
      .filter((element) => element.isDirectory())
      .sort((f1, f2) => (f1.name < f2.name ? 1 : 0));
    const files = elements
      .filter((element) => element.isFile())
      .sort((f1, f2) => (f1.name < f2.name ? 1 : 0));
    const reArrangedElements = folders.concat(files);

    for (const element of reArrangedElements) {
      const widget = new QWidget();
      widget.setInlineStyle(`
        margin: 10px 15px; /* Simulates row-gap: 20px and column-gap: 30px */
        flex-wrap: wrap;
      `);
      const layout = new FlexLayout();
      widget.setLayout(layout);
      const label = new QLabel();
      label.setText(element.name);
      label.setWordWrap(true);
      label.setInlineStyle(`
        text-align: center;
        max-width: 100px;
      `);
      const elementWidget = element.isDirectory()
        ? this.widgetFactory.createFolderWidget().getWidget()
        : this.widgetFactory.createFileWidget().getWidget();
      // const goToPage2Button = new QPushButton();
      // goToPage2Button.setText("Go to Page 2");
      const ql = new QLabel();
      ql.setPixmap(elementWidget);
      layout.addWidget(ql);
      layout.addWidget(label);

      containerSection.addWidget(widget);
    }
  }

  addSection(sectionTitle: string) {
    const section = new QWidget();
    const sectionLayout = new FlexLayout();
    section.setLayout(sectionLayout);

    const label = new QLabel();
    label.setText(sectionTitle);
    const goBackButton = new QPushButton();
    goBackButton.setText("< Go back");

    sectionLayout.addWidget(label);
    sectionLayout.addWidget(goBackButton);

    this.stack.addWidget(section);
    this.historyTracker.push(section);
    this.stack.setCurrentWidget(section);

    goBackButton.addEventListener("clicked", async () => {
      const previousSection = this.historyTracker[this.historyIndex];
      if (!previousSection) {
        throw new Error("NO PREVIOUS SECTION, THIS IS WRONG <------------");
      }

      this.stack.setCurrentWidget(previousSection);
      this.historyIndex++;
    });
    // const b = factory.createPushButtonWidget();

    // page2Layout.addWidget(b);
  }
}
