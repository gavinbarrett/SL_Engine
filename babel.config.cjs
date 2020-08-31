const presets = [
	["@babel/preset-env", { "modules": "commonjs" }],
	["@babel/preset-react"],
];

const plugins = [
	["@babel/plugin-proposal-class-properties"],
];

module.exports = { presets, plugins };
