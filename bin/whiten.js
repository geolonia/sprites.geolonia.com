const fs = require("fs");
const path = require("path");
const parser = require("fast-xml-parser");
const { j2xParser } = require("fast-xml-parser");
const invertColor = require("invert-color");
const { join } = require("path");

const invertStyle = (styleText) => {
  const styleEntries = styleText.split(";").map((kvp) => kvp.split(":"));
  for (const styleEntry of styleEntries) {
    const [key, value] = styleEntry;
    if (key === "color") {
      styleEntry[1] = invertColor(value);
    }
  }
  return styleEntries.map((entry) => entry.join(":")).join(";");
};

// destructive. Append <path fill="#ffffff" />
const convert = (parent) => {
  if (Array.isArray(parent)) {
    for (const item of parent) {
      convert(item);
    }
  } else if (typeof parent === "object") {
    const keys = Object.keys(parent).filter((key) => !key.startsWith("@_"));
    for (const key of keys) {
      if (key === "path") {
        if (Array.isArray(parent.path)) {
          for (const eachPath of parent.path) {
            eachPath["@_fill"] = "#ffffff";
          }
        } else {
          parent.path["@_fill"] = "#ffffff";
        }
      } else if (key === "rect") {
        if (Array.isArray(parent.rect)) {
          for (const eachrect of parent.rect) {
            eachrect["@_style"] = invertStyle(eachrect["@_style"]);
          }
        } else {
          eachrect["@_style"] = invertStyle(eachrect["@_style"]);
        }
      } else {
        convert(parent[key]);
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
      src: path.resolve(basicDir, dirent.name),
      dest: path.resolve(basicWhiteDir, dirent.name),
    }));

  await Promise.all(
    svgs.map(({ src, dest }) => {
      const xmlData = fs.readFileSync(src).toString();
      const xml = parser.parse(xmlData, {
        attributeNamePrefix: "@_",
        textNodeName: "#text",
        ignoreAttributes: false,
      });

      convert(xml);

      const whitened = new j2xParser({
        attributeNamePrefix: "@_",
        textNodeName: "#text",
        ignoreAttributes: false,
      }).parse(xml);

      fs.writeFileSync(dest, whitened);
    })
  );
};

main();
