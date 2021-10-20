const fs = require("fs");
const path = require("path");
const parser = require("fast-xml-parser");

// fast-xml-parser options
const parserOptions = {
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  ignoreAttributes: false,
};

/**
 *
 * @param {string} styleText
 * @returns mutated style text
 */
const whitenRectBorder = (styleText) => {
  const styleEntries = styleText.split(";").map((kvp) => kvp.split(":"));
  for (const styleEntry of styleEntries) {
    const [key] = styleEntry;
    if (key === "fill") {
      styleEntry[1] = "#ffffff";
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
  if (Array.isArray(parent)) {
    for (const item of parent) {
      convert(item, filename);
    }
  } else if (typeof parent === "object") {
    const keys = Object.keys(parent)
      // should filter child node, not attribute
      .filter((key) => !key.startsWith(parserOptions.attributeNamePrefix));

    for (const key of keys) {
      if (key === "path") {
        const fillKey = `${parserOptions.attributeNamePrefix}fill`;
        if (Array.isArray(parent.path)) {
          for (const eachPath of parent.path) {
            eachPath[fillKey] = "#ffffff";
          }
        } else {
          parent.path[fillKey] = "#ffffff";
        }
      } else if (filename.match(/$default_[0-9]/) && key === "rect") {
        const styleKey = `${parserOptions.attributeNamePrefix}style`;
        if (Array.isArray(parent.rect)) {
          for (const rect of parent.rect) {
            rect[styleKey] = whitenRectBorder(rect[styleKey]);
          }
        } else {
          rect[styleKey] = whitenRectBorder(rect[styleKey]);
        }
      } else {
        convert(parent[key], filename);
      }
    }
  }
};

const main = async () => {
  const basicDir = path.resolve(__dirname, "..", "src", "basic");
  const basicWhiteDir = path.resolve(__dirname, "..", "src", "basic-white");

  const svgs = fs
    .readdirSync(basicDir, {
      withFileTypes: true,
    })
    .filter(
      (dirent) => dirent.isFile() && dirent.name.toLowerCase().endsWith(".svg")
    )
    .map((dirent) => ({
      filename: dirent.name,
      src: path.resolve(basicDir, dirent.name),
      dest: path.resolve(basicWhiteDir, dirent.name),
    }));

  await Promise.all(
    svgs.map(({ filename, src, dest }) => {
      const xmlData = fs.readFileSync(src).toString();
      const xml = parser.parse(xmlData, parserOptions);

      convert(xml, filename);
      const whitenedXML = new parser.j2xParser({
        ...parserOptions,
        format: true,
      }).parse(xml);

      fs.writeFileSync(dest, whitenedXML);
    })
  );
};

main();
