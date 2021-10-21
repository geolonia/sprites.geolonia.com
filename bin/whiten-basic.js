const fs = require("fs");
const path = require("path");
const parser = require("fast-xml-parser");

const basicDir = path.resolve(__dirname, "..", "src", "basic");
const basicWhiteDir = path.resolve(__dirname, "..", "src", "basic-white");

// fast-xml-parser options
const parserOptions = {
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  ignoreAttributes: false,
};

/**
 * Special rules which should be applied for default_x
 * @param {string} styleText
 * @returns mutated style text
 */
const whitenDefault_x = (styleText, index) => {
  const styleEntries = styleText
    .split(";")
    .map((kvp) => kvp.split(":").map((value) => value.trim()));
  for (const entry of styleEntries) {
    if (entry[0] === "fill") {
      console.log(index);
      entry[1] = index === 0 ? "#c5c7c9" : "#ffffff"; // #c5c7c9 is the inverse color of #3a3836
    } else if (entry[0] === "color") {
      entry[1] = "#c5c7c9";
    }
  }
  return styleEntries.map((entry) => entry.join(":")).join(";");
};

/**
 * destructive recursion to append white color
 * @param {object} parent
 * @param {string} filename
 */
const convert = (parent, filename) => {
  const keys = Object.keys(parent)
    // should filter child node, not attribute
    .filter((key) => !key.startsWith(parserOptions.attributeNamePrefix));

  for (const key of keys) {
    const children = Array.isArray(parent[key]) ? parent[key] : [parent[key]];
    for (const child of children) {
      if (key === "path") {
        const appendingKey = `${parserOptions.attributeNamePrefix}fill`;
        child[appendingKey] = "#ffffff";
      } else if (filename.match(/^default_[0-9]/) && key === "rect") {
        const appendingKey = `${parserOptions.attributeNamePrefix}style`;
        child[appendingKey] = whitenDefault_x(
          child[appendingKey],
          children.indexOf(child)
        );
      } else {
        if (typeof child === "object") {
          convert(child, filename);
        }
      }
    }
  }
};

fs.readdirSync(basicDir, {
  withFileTypes: true,
})
  .filter(
    (dirent) => dirent.isFile() && dirent.name.toLowerCase().endsWith(".svg")
  )
  .forEach((dirent) => {
    const filename = dirent.name;
    const src = path.resolve(basicDir, dirent.name);
    const dest = path.resolve(basicWhiteDir, dirent.name);

    const xml = fs.readFileSync(src).toString();
    const tree = parser.parse(xml, parserOptions);

    convert(tree, filename);

    const whiteXml = new parser.j2xParser({
      ...parserOptions,
      format: true,
    }).parse(tree);

    fs.writeFileSync(dest, whiteXml);
  });
