const fs = require('fs');
const path = require('path');
const resize = require('./resize');

const targetPath = path.resolve(__dirname, '..', 'src/test');

const svg = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Aerialway" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="19" height="19" viewBox="0 0 11 11" style="enable-background:new 0 0 11 11;" xml:space="preserve">
<path d="M9,4.5H6V3.1c0.1992-0.1183,0.3512-0.3021,0.43-0.52L9.5,2C9.7761,2,10,1.7761,10,1.5S9.7761,1,9.5,1
	L6.25,1.61C5.8847,1.1957,5.2528,1.156,4.8386,1.5213C4.713,1.6321,4.6172,1.7726,4.56,1.93L1.5,2.5C1.2239,2.5,1,2.7239,1,3
	s0.2239,0.5,0.5,0.5l3.25-0.61C4.8213,2.9732,4.9057,3.0442,5,3.1v1.4H2c-0.5523,0-1,0.4477-1,1V9c0,0.5523,0.4477,1,1,1h7
	c0.5523,0,1-0.4477,1-1V5.5C10,4.9477,9.5523,4.5,9,4.5z M5,8.5H2.5v-3H5V8.5z M8.5,8.5H6v-3h2.5V8.5z"/>
</svg>`;
const svgUnitPx = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Aerialway" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="19px" height="19px" viewBox="0 0 11 11" style="enable-background:new 0 0 11 11;" xml:space="preserve">
<path d="M9,4.5H6V3.1c0.1992-0.1183,0.3512-0.3021,0.43-0.52L9.5,2C9.7761,2,10,1.7761,10,1.5S9.7761,1,9.5,1
	L6.25,1.61C5.8847,1.1957,5.2528,1.156,4.8386,1.5213C4.713,1.6321,4.6172,1.7726,4.56,1.93L1.5,2.5C1.2239,2.5,1,2.7239,1,3
	s0.2239,0.5,0.5,0.5l3.25-0.61C4.8213,2.9732,4.9057,3.0442,5,3.1v1.4H2c-0.5523,0-1,0.4477-1,1V9c0,0.5523,0.4477,1,1,1h7
	c0.5523,0,1-0.4477,1-1V5.5C10,4.9477,9.5523,4.5,9,4.5z M5,8.5H2.5v-3H5V8.5z M8.5,8.5H6v-3h2.5V8.5z"/>
</svg>`;

const mockSVGs = {
  default: `${targetPath}/aerialway.svg`,
  size11px: `${targetPath}/aerialway-11.svg`,
  size15px: `${targetPath}/aerialway-15.svg`,
  exclude1: `${targetPath}/default_1.svg`,
  exclude2: `${targetPath}/oneway.svg`,
}

beforeAll(() => {
  fs.mkdirSync(targetPath);
});

afterAll(() => {
  fs.rmdirSync(targetPath, { recursive: true });
});

beforeEach(() => {
  fs.writeFileSync(mockSVGs.default, svg);
});

afterEach(() => {
  fs.existsSync( mockSVGs.default ) && fs.unlinkSync(mockSVGs.default);
  fs.existsSync( mockSVGs.size11px ) && fs.unlinkSync(mockSVGs.size11px);
  fs.existsSync( mockSVGs.size15px ) && fs.unlinkSync(mockSVGs.size15px);
  fs.existsSync( mockSVGs.exclude1 ) && fs.unlinkSync(mockSVGs.exclude1);
  fs.existsSync( mockSVGs.exclude2 ) && fs.unlinkSync(mockSVGs.exclude2);
});

test('Generate SVGs of 11px and 15px sizes', () => {
  resize('src/test');

  expect(fs.existsSync(mockSVGs.default)).toBe(true);
  expect(fs.existsSync(mockSVGs.size11px)).toBe(true);
  expect(fs.existsSync(mockSVGs.size15px)).toBe(true);
})

test('Replace width height to resize SVG', () => {
  resize('src/test');

  const svg11px = fs.readFileSync(mockSVGs.size11px, 'utf-8');
  const svg15px = fs.readFileSync(mockSVGs.size15px, 'utf-8');

  const result11px = svg11px.match(/width="11" height="11"/g);
  const result15px = svg15px.match(/width="15" height="15"/g);

  expect(result11px[0]).toBe('width="11" height="11"');
  expect(result15px[0]).toBe('width="15" height="15"');
})

test('Replace width height with px to resize SVG', () => {

  fs.unlinkSync(mockSVGs.default)
  fs.writeFileSync(mockSVGs.default, svgUnitPx);

  const svg19px = fs.readFileSync(mockSVGs.default, 'utf-8');
  const result19px = svg19px.match(/width="19px" height="19px"/g);
  expect(result19px[0]).toBe('width="19px" height="19px"');

  resize('src/test');

  const svg11px = fs.readFileSync(mockSVGs.size11px, 'utf-8');
  const svg15px = fs.readFileSync(mockSVGs.size15px, 'utf-8');

  const result11px = svg11px.match(/width="11" height="11"/g);
  const result15px = svg15px.match(/width="15" height="15"/g);

  expect(result11px[0]).toBe('width="11" height="11"');
  expect(result15px[0]).toBe('width="15" height="15"');
})

test('Does not replace the file which has filename includes hyphen + number', () => {

  fs.unlinkSync(mockSVGs.default)
  fs.writeFileSync(mockSVGs.size11px, svg);
  fs.writeFileSync(mockSVGs.size15px, svg);

  resize('src/test');

  fs.readdir(targetPath, (err, files) => {
    expect(files.length).toBe(2);
  });
})

test('Does not replace excluded files', () => {

  fs.unlinkSync(mockSVGs.default)
  fs.writeFileSync(mockSVGs.exclude1, svg);
  fs.writeFileSync(mockSVGs.exclude2, svg);

  resize('src/test');

  fs.readdir(targetPath, (err, files) => {
    expect(files[0]).toBe('default_1.svg');
    expect(files[1]).toBe('oneway.svg');
  });
})

