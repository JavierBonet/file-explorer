import { QMainWindow } from "@nodegui/nodegui";

export interface IPageHandler {
  add: (identifier: string, win: QMainWindow) => void;
  remove: (identifier: string) => void;
  getWindow: (identifier: string) => QMainWindow | null;
}

class PageHandler implements IPageHandler {
  private pages: { [identifier: string]: QMainWindow } = {};

  add(identifier: string, win: QMainWindow) {
    if (identifier in this.pages) {
      console.log(`${identifier} already in handled`);
      return;
    }

    this.pages[identifier] = win;
  }

  remove(identifier: string) {
    if (!(identifier in this.pages)) {
      console.log(`${identifier} already in handled`);
      return;
    }

    delete this.pages[identifier];
  }

  getWindow(identifier: string) {
    if (!(identifier in this.pages)) {
      console.log(`${identifier} already in handled`);
      return null;
    }

    return this.pages[identifier];
  }
}
