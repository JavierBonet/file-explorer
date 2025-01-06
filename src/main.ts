import LayoutHandler, { ILayoutHandler } from "./layoutHandler";

const appTitle = "File Browser";

const layoutHandler: ILayoutHandler = new LayoutHandler(appTitle);
layoutHandler.start();
