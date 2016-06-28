'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _index = require('./barcodes/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./renderers/index.js');

var _index4 = _interopRequireDefault(_index3);

var _merge = require('./help/merge.js');

var _merge2 = _interopRequireDefault(_merge);

var _linearizeEncodings = require('./help/linearizeEncodings.js');

var _linearizeEncodings2 = _interopRequireDefault(_linearizeEncodings);

var _fixOptions = require('./help/fixOptions.js');

var _fixOptions2 = _interopRequireDefault(_fixOptions);

var _getOptionsFromElement = require('./help/getOptionsFromElement.js');

var _getOptionsFromElement2 = _interopRequireDefault(_getOptionsFromElement);

var _defaults = require('./defaults/defaults.js');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The protype of the object returned from the JsBarcode() call


// Import the renderers
var API = function API() {};

// The first call of the library API
// Will return an object with all barcodes calls and the data that is used
// by the renderers


// Default values


// Help functions
// Import all the barcodes
var JsBarcode = function JsBarcode(element, text, options) {
	var api = new API();

	if (typeof element === "undefined") {
		throw Error("No element to render on was provided.");
	}

	// Variables that will be pased through the API calls
	api._renderProperties = getRenderProperies(element);
	api._encodings = [];
	api._options = _defaults2.default;

	// If text is set, use the simple syntax (render the barcode directly)
	if (typeof text !== "undefined") {
		options = options || {};

		if (!options.format) {
			options.format = autoSelectBarcode();
		}

		api.options(options);
		api[options.format](text, options);
		api.render();
	}

	return api;
};

// To make tests work TODO: remove
JsBarcode.getModule = function (name) {
	return _index2.default[name];
};

// Register all barcodes
for (var name in _index2.default) {
	if (_index2.default.hasOwnProperty(name)) {
		// Security check if the propery is a prototype property
		registerBarcode(_index2.default, name);
	}
}
function registerBarcode(barcodes, name) {
	API.prototype[name] = API.prototype[name.toUpperCase()] = API.prototype[name.toLowerCase()] = function (text, options) {
		var newOptions = (0, _merge2.default)(this._options, options);
		var Encoder = barcodes[name];
		var encoded = encode(text, Encoder, newOptions);
		this._encodings.push(encoded);

		return this;
	};
}

// encode() handles the Encoder call and builds the binary string to be rendered
function encode(text, Encoder, options) {
	// Ensure that text is a string
	text = "" + text;

	var encoder = new Encoder(text, options);

	// If the input is not valid for the encoder, throw error.
	// If the valid callback option is set, call it instead of throwing error
	if (!encoder.valid()) {
		if (options.valid === _defaults2.default.valid) {
			throw new Error('"' + text + '" is not a valid input for ' + name);
		} else {
			options.valid(false);
		}
	}

	// Make a request for the binary data (and other infromation) that should be rendered
	var encoded = encoder.encode();

	// Encodings can be nestled like [[1-1, 1-2], 2, [3-1, 3-2]
	// Convert to [1-1, 1-2, 2, 3-1, 3-2]
	encoded = (0, _linearizeEncodings2.default)(encoded);

	// Merge
	for (var i = 0; i < encoded.length; i++) {
		encoded[i].options = (0, _merge2.default)(options, encoded[i].options);
	}

	return encoded;
}

function autoSelectBarcode() {
	// If CODE128 exists. Use it
	if (_index2.default["CODE128"]) {
		return "CODE128";
	}

	// Else, take the first (probably only) barcode
	return Object.keys(_index2.default)[0];
}

// Sets global encoder options
// Added to the api by the JsBarcode function
API.prototype.options = function (options) {
	this._options = (0, _merge2.default)(this._options, options);
	return this;
};

// Will create a blank space (usually in between barcodes)
API.prototype.blank = function (size) {
	var zeroes = "0".repeat(size);
	this._encodings.push({ data: zeroes });
	return this;
};

// Initialize JsBarcode on all HTML elements defined.
API.prototype.init = function () {
	// Make sure renderProperies is an array
	if (!Array.isArray(this._renderProperties)) {
		this._renderProperties = [this._renderProperties];
	}

	var renderProperty;
	for (var i in this._renderProperties) {
		renderProperty = this._renderProperties[i];
		var options = (0, _merge2.default)(this._options, renderProperty.options);

		if (options.format == "auto") {
			options.format = autoSelectBarcode();
		}

		var text = options.value;

		var Encoder = _index2.default[options.format.toUpperCase()];

		var encoded = encode(text, Encoder, options);

		render(renderProperty, encoded, options);
	}
};

// The render API call. Calls the real render function.
API.prototype.render = function () {
	if (Array.isArray(this._renderProperties)) {
		for (var i in this._renderProperties) {
			render(this._renderProperties[i], this._encodings, this._options);
		}
	} else {
		render(this._renderProperties, this._encodings, this._options);
	}

	this._options.valid(true);

	return this;
};

// Prepares the encodings and calls the renderer
function render(renderProperties, encodings, options) {
	var renderer = _index4.default[renderProperties.renderer];

	encodings = (0, _linearizeEncodings2.default)(encodings);

	for (var i = 0; i < encodings.length; i++) {
		encodings[i].options = (0, _merge2.default)(options, encodings[i].options);
		(0, _fixOptions2.default)(encodings[i].options);
	}

	(0, _fixOptions2.default)(options);

	renderer(renderProperties.element, encodings, options);

	if (renderProperties.afterRender) {
		renderProperties.afterRender();
	}
}

// Export to browser
if (typeof window !== "undefined") {
	window.JsBarcode = JsBarcode;
}

// Export to jQuery
/*global jQuery */
if (typeof jQuery !== 'undefined') {
	jQuery.fn.JsBarcode = function (content, options) {
		var elementArray = [];
		jQuery(this).each(function () {
			elementArray.push(this);
		});
		return JsBarcode(elementArray, content, options);
	};
}

// Export to commonJS
//module.exports = JsBarcode;
exports.default = JsBarcode;

// Takes an element and returns an object with information about how
// it should be rendered
// This could also return an array with these objects
// {
//   element: The element that the renderer should draw on
//   renderer: The name of the renderer
//   afterRender (optional): If something has to done after the renderer
//     completed, calls afterRender (function)
//   options (optional): Options that can be defined in the element
// }

function getRenderProperies(element) {
	// If the element is a string, query select call again
	if (typeof element === "string") {
		var selector = document.querySelectorAll(element);
		if (selector.length === 0) {
			throw new Error("No element found");
		} else {
			var returnArray = [];
			for (var i = 0; i < selector.length; i++) {
				returnArray.push(getRenderProperies(selector[i]));
			}
			return returnArray;
		}
	}
	// If element is array. Recursivly call with every object in the array
	else if (Array.isArray(element)) {
			var _returnArray = [];
			for (var _i = 0; _i < element.length; _i++) {
				_returnArray.push(getRenderProperies(element[_i]));
			}
			return _returnArray;
		}
		// If element, render on canvas and set the uri as src
		else if (typeof HTMLCanvasElement !== 'undefined' && element instanceof HTMLImageElement) {
				var canvas = document.createElement('canvas');
				return {
					element: canvas,
					options: (0, _getOptionsFromElement2.default)(element, _defaults2.default),
					renderer: "canvas",
					afterRender: function afterRender() {
						element.setAttribute("src", canvas.toDataURL());
					}
				};
			}
			// If SVG
			else if (typeof SVGElement !== 'undefined' && element instanceof SVGElement) {
					return {
						element: element,
						options: (0, _getOptionsFromElement2.default)(element, _defaults2.default),
						renderer: "svg"
					};
				}
				// If canvas (in browser)
				else if (typeof HTMLCanvasElement !== 'undefined' && element instanceof HTMLCanvasElement) {
						return {
							element: element,
							options: (0, _getOptionsFromElement2.default)(element, _defaults2.default),
							renderer: "canvas"
						};
					}
					// If canvas (in node)
					else if (element.getContext) {
							return {
								element: element,
								renderer: "canvas"
							};
						} else {
							throw new Error("Not supported type to render on.");
						}
}