var fs = require('fs');
var glob = require('glob');
var path = require('path');

const srcPath = path.resolve(__dirname, '..', 'src')

glob(`${srcPath}/*`, (err, files) => {

  files.forEach(file => {

    const iconCategoryName = file.replace(`${srcPath}/`, "");
    const iconPath = path.join(srcPath, iconCategoryName);

    var svgs = glob.sync(`${iconPath}/*.svg`)
    .map(function(f) {
      const iconName = f.replace(`${iconPath}/`, '')
        return {
            name: iconName,
            path: f
        };
    });

    svgs.forEach(function(svg) {

      // ファイル名末尾が -数字 のファイルと、サイズが特殊なファイルは除外。
      const regex = /-[0-9]+\.svg$|^oneway|^default/g;
      const matched = svg.name.match(regex)

      if (!matched) {
        fs.unlinkSync(svg.path)
      }
    })
  });
});
