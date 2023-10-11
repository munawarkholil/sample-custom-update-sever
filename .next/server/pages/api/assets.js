"use strict";
(() => {
var exports = {};
exports.id = 609;
exports.ids = [609];
exports.modules = {

/***/ 11:
/***/ ((module) => {

module.exports = require("mime");

/***/ }),

/***/ 113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 292:
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 244:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ assetsEndpoint)
});

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(147);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);
// EXTERNAL MODULE: external "mime"
var external_mime_ = __webpack_require__(11);
var external_mime_default = /*#__PURE__*/__webpack_require__.n(external_mime_);
;// CONCATENATED MODULE: external "nullthrows"
const external_nullthrows_namespaceObject = require("nullthrows");
var external_nullthrows_default = /*#__PURE__*/__webpack_require__.n(external_nullthrows_namespaceObject);
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(17);
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);
// EXTERNAL MODULE: ./common/helpers.ts
var helpers = __webpack_require__(72);
;// CONCATENATED MODULE: ./pages/api/assets.ts





async function assetsEndpoint(req, res) {
    const { asset: assetName , runtimeVersion , platform  } = req.query;
    if (!assetName || typeof assetName !== "string") {
        res.statusCode = 400;
        res.json({
            error: "No asset name provided."
        });
        return;
    }
    if (platform !== "ios" && platform !== "android") {
        res.statusCode = 400;
        res.json({
            error: 'No platform provided. Expected "ios" or "android".'
        });
        return;
    }
    if (!runtimeVersion || typeof runtimeVersion !== "string") {
        res.statusCode = 400;
        res.json({
            error: "No runtimeVersion provided."
        });
        return;
    }
    let updateBundlePath;
    try {
        updateBundlePath = await (0,helpers/* getLatestUpdateBundlePathForRuntimeVersionAsync */.BE)(runtimeVersion);
    } catch (error) {
        res.statusCode = 404;
        res.json({
            error: error.message
        });
        return;
    }
    const { metadataJson  } = await (0,helpers/* getMetadataAsync */.Se)({
        updateBundlePath,
        runtimeVersion
    });
    const assetPath = external_path_default().resolve(assetName);
    const assetMetadata = metadataJson.fileMetadata[platform].assets.find((asset)=>asset.path === assetName.replace(`${updateBundlePath}/`, "")
    );
    const isLaunchAsset = metadataJson.fileMetadata[platform].bundle === assetName.replace(`${updateBundlePath}/`, "");
    if (!external_fs_default().existsSync(assetPath)) {
        res.statusCode = 404;
        res.json({
            error: `Asset "${assetName}" does not exist.`
        });
        return;
    }
    try {
        const asset = external_fs_default().readFileSync(assetPath, null);
        res.statusCode = 200;
        res.setHeader("content-type", isLaunchAsset ? "application/javascript" : external_nullthrows_default()(external_mime_default().getType(assetMetadata.ext)));
        res.end(asset);
    } catch (error1) {
        console.log(error1);
        res.statusCode = 500;
        res.json({
            error: error1
        });
    }
};


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [72], () => (__webpack_exec__(244)));
module.exports = __webpack_exports__;

})();