'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CODE = require('./CODE39/index.js');

var _CODE2 = require('./CODE128/index.js');

var _EAN_UPC = require('./EAN_UPC/index.js');

var _ITF = require('./ITF14/index.js');

var _ITF2 = require('./ITF/index.js');

var _MSI = require('./MSI/index.js');

var _pharmacode = require('./pharmacode/index.js');

var _GenericBarcode = require('./GenericBarcode/index.js');

exports.default = {
  CODE39: _CODE.CODE39,
  CODE128: _CODE2.CODE128, CODE128A: _CODE2.CODE128A, CODE128B: _CODE2.CODE128B, CODE128C: _CODE2.CODE128C,
  EAN13: _EAN_UPC.EAN13, EAN8: _EAN_UPC.EAN8, EAN5: _EAN_UPC.EAN5, EAN2: _EAN_UPC.EAN2, UPC: _EAN_UPC.UPC,
  ITF14: _ITF.ITF14,
  ITF: _ITF2.ITF,
  MSI: _MSI.MSI, MSI10: _MSI.MSI10, MSI11: _MSI.MSI11, MSI1010: _MSI.MSI1010, MSI1110: _MSI.MSI1110,
  pharmacode: _pharmacode.pharmacode,
  GenericBarcode: _GenericBarcode.GenericBarcode
};