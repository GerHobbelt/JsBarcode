'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _index = require('./CODE39/index');

var _index2 = require('./CODE128/index');

var _index3 = require('./EAN_UPC/index');

var _index4 = require('./ITF14/index');

var _index5 = require('./ITF/index');

var _index6 = require('./MSI/index');

var _index7 = require('./pharmacode/index');

var _index8 = require('./GenericBarcode/index');

exports.default = {
	CODE39: _index.CODE39,
	CODE128: _index2.CODE128, CODE128A: _index2.CODE128A, CODE128B: _index2.CODE128B, CODE128C: _index2.CODE128C,
	EAN13: _index3.EAN13, EAN8: _index3.EAN8, EAN5: _index3.EAN5, EAN2: _index3.EAN2, UPC: _index3.UPC,
	ITF14: _index4.ITF14,
	ITF: _index5.ITF,
	MSI: _index6.MSI, MSI10: _index6.MSI10, MSI11: _index6.MSI11, MSI1010: _index6.MSI1010, MSI1110: _index6.MSI1110,
	pharmacode: _index7.pharmacode,
	GenericBarcode: _index8.GenericBarcode
};