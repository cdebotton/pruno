import path from "path";

class Pruno {
  static require(file) {
    if (/^\.\//.test(file)) {
      file = path.join(process.cwd(), file);
    }

    return module.parent.require(file);
  }

  constructor() {
    this.path = process.cwd();
    this.pkg = Pruno.require("./package.json");
  }
}

export default new Pruno();
