const fs = require('fs');
const glob = require('glob');
const path = require('path');

function resize(targetDir) {
  const targetPath = path.resolve(__dirname, '..', targetDir)

  if( !fs.existsSync( targetPath ) ){
      console.log( "Specified directory does not exist.");
      process.exit(1);
  }

  const svgs = glob.sync(`${targetPath}/*.svg`)
  .map(function(f) {
      const iconName = f.replace(`${targetPath}/`, '')
      return {
          svg: fs.readFileSync(f, 'utf-8'),
          id: path.basename(f).replace('.svg', ''),
          name: iconName
      };
  });

  svgs.forEach(function(svg) {

    // ファイル名末尾が -数字 のファイルと、サイズが特殊なファイルは除外。
    const regex = /-[0-9]+\.svg$|^oneway|^default/g;
    const matched = svg.name.match(regex)

    if (!matched) {
      const name = svg.name.replace('.svg', '')

      const regex = /width="([0-9]+|[0-9]+px)" height="([0-9]+|[0-9]+px)"/g;
      const svg11px = svg.svg.replace(regex, 'width="11" height="11"');
      const svg15px = svg.svg.replace(regex, 'width="15" height="15"');

      fs.writeFileSync(`${targetPath}/${name}-11.svg`, svg11px);
      fs.writeFileSync(`${targetPath}/${name}-15.svg`, svg15px);
    }
  })
}

// CLI 実行時
if (process.argv[2]) {
  resize(process.argv[2])
}

module.exports = resize;
