var fs = require('fs');
var glob = require('glob');
var path = require('path');

function deleteOriginal(targetDir) {

  const targetPath = path.resolve(__dirname, '..', targetDir);

  if( !fs.existsSync( targetPath ) ){
    console.log( "Specified directory does not exist.");
    process.exit(1);
  };

  var svgs = glob.sync(`${targetPath}/*.svg`)
  .map(function(f) {
    const iconName = f.replace(`${targetPath}/`, '')
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
}

// CLI 実行時
if (process.argv[2]) {
  deleteOriginal(process.argv[2])
}

module.exports = deleteOriginal;
