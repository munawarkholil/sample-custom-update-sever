"use strict";
(() => {
var exports = {};
exports.id = 378;
exports.ids = [378];
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

/***/ 637:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ manifestEndpoint)
});

;// CONCATENATED MODULE: external "form-data"
const external_form_data_namespaceObject = require("form-data");
var external_form_data_default = /*#__PURE__*/__webpack_require__.n(external_form_data_namespaceObject);
// EXTERNAL MODULE: external "fs/promises"
var promises_ = __webpack_require__(292);
var promises_default = /*#__PURE__*/__webpack_require__.n(promises_);
;// CONCATENATED MODULE: external "structured-headers"
const external_structured_headers_namespaceObject = require("structured-headers");
// EXTERNAL MODULE: ./common/helpers.ts
var helpers = __webpack_require__(72);
;// CONCATENATED MODULE: ./pages/api/manifest.ts




async function manifestEndpoint(req, res) {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.json({
            error: "Expected GET."
        });
        return;
    }
    const protocolVersionMaybeArray = req.headers["expo-protocol-version"];
    if (protocolVersionMaybeArray && Array.isArray(protocolVersionMaybeArray)) {
        res.statusCode = 400;
        res.json({
            error: "Unsupported protocol version. Expected either 0 or 1."
        });
        return;
    }
    const protocolVersion = parseInt(protocolVersionMaybeArray !== null && protocolVersionMaybeArray !== void 0 ? protocolVersionMaybeArray : "0", 10);
    var ref;
    const platform = (ref = req.headers["expo-platform"]) !== null && ref !== void 0 ? ref : req.query["platform"];
    if (platform !== "ios" && platform !== "android") {
        res.statusCode = 400;
        res.json({
            error: "Unsupported platform. Expected either ios or android."
        });
        return;
    }
    var ref1;
    const runtimeVersion = (ref1 = req.headers["expo-runtime-version"]) !== null && ref1 !== void 0 ? ref1 : req.query["runtime-version"];
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
    const updateType = await getTypeOfUpdateAsync(updateBundlePath);
    try {
        try {
            if (updateType === UpdateType.NORMAL_UPDATE) {
                await putUpdateInResponseAsync(req, res, updateBundlePath, runtimeVersion, platform, protocolVersion);
            } else if (updateType === UpdateType.ROLLBACK) {
                await putRollBackInResponseAsync(req, res, updateBundlePath, protocolVersion);
            }
        } catch (maybeNoUpdateAvailableError) {
            if (maybeNoUpdateAvailableError instanceof helpers/* NoUpdateAvailableError */.fy) {
                await putNoUpdateAvailableInResponseAsync(req, res, protocolVersion);
                return;
            }
            throw maybeNoUpdateAvailableError;
        }
    } catch (error1) {
        console.error(error1);
        res.statusCode = 404;
        res.json({
            error: error1
        });
    }
};
var UpdateType;
(function(UpdateType) {
    UpdateType[UpdateType["NORMAL_UPDATE"] = 0] = "NORMAL_UPDATE";
    UpdateType[UpdateType["ROLLBACK"] = 1] = "ROLLBACK";
})(UpdateType || (UpdateType = {}));
async function getTypeOfUpdateAsync(updateBundlePath) {
    const directoryContents = await promises_default().readdir(updateBundlePath);
    return directoryContents.includes("rollback") ? UpdateType.ROLLBACK : UpdateType.NORMAL_UPDATE;
}
async function putUpdateInResponseAsync(req, res, updateBundlePath, runtimeVersion, platform, protocolVersion) {
    const currentUpdateId = req.headers["expo-current-update-id"];
    const { metadataJson , createdAt , id  } = await (0,helpers/* getMetadataAsync */.Se)({
        updateBundlePath,
        runtimeVersion
    });
    // NoUpdateAvailable directive only supported on protocol version 1
    // for protocol version 0, serve most recent update as normal
    if (currentUpdateId === id && protocolVersion === 1) {
        throw new helpers/* NoUpdateAvailableError */.fy();
    }
    const expoConfig = await (0,helpers/* getExpoConfigAsync */.bg)({
        updateBundlePath,
        runtimeVersion
    });
    const platformSpecificMetadata = metadataJson.fileMetadata[platform];
    const manifest = {
        id: (0,helpers/* convertSHA256HashToUUID */.Uc)(id),
        createdAt,
        runtimeVersion,
        assets: await Promise.all(platformSpecificMetadata.assets.map((asset)=>(0,helpers/* getAssetMetadataAsync */.fE)({
                updateBundlePath,
                filePath: asset.path,
                ext: asset.ext,
                runtimeVersion,
                platform,
                isLaunchAsset: false
            })
        )),
        launchAsset: await (0,helpers/* getAssetMetadataAsync */.fE)({
            updateBundlePath,
            filePath: platformSpecificMetadata.bundle,
            isLaunchAsset: true,
            runtimeVersion,
            platform,
            ext: null
        }),
        metadata: {},
        extra: {
            expoClient: expoConfig
        }
    };
    let signature = null;
    const expectSignatureHeader = req.headers["expo-expect-signature"];
    if (expectSignatureHeader) {
        const privateKey = await (0,helpers/* getPrivateKeyAsync */.tw)();
        if (!privateKey) {
            res.statusCode = 400;
            res.json({
                error: "Code signing requested but no key supplied when starting server."
            });
            return;
        }
        const manifestString = JSON.stringify(manifest);
        const hashSignature = (0,helpers/* signRSASHA256 */.sk)(manifestString, privateKey);
        const dictionary = (0,helpers/* convertToDictionaryItemsRepresentation */.Kg)({
            sig: hashSignature,
            keyid: "main"
        });
        signature = (0,external_structured_headers_namespaceObject.serializeDictionary)(dictionary);
    }
    const assetRequestHeaders = {};
    [
        ...manifest.assets,
        manifest.launchAsset
    ].forEach((asset)=>{
        assetRequestHeaders[asset.key] = {
            "test-header": "test-header-value"
        };
    });
    const form = new (external_form_data_default())();
    form.append("manifest", JSON.stringify(manifest), {
        contentType: "application/json",
        header: {
            "content-type": "application/json; charset=utf-8",
            ...signature ? {
                "expo-signature": signature
            } : {}
        }
    });
    form.append("extensions", JSON.stringify({
        assetRequestHeaders
    }), {
        contentType: "application/json"
    });
    res.statusCode = 200;
    res.setHeader("expo-protocol-version", protocolVersion);
    res.setHeader("expo-sfv-version", 0);
    res.setHeader("cache-control", "private, max-age=0");
    res.setHeader("content-type", `multipart/mixed; boundary=${form.getBoundary()}`);
    res.write(form.getBuffer());
    res.end();
}
async function putRollBackInResponseAsync(req, res, updateBundlePath, protocolVersion) {
    if (protocolVersion === 0) {
        throw new Error("Rollbacks not supported on protocol version 0");
    }
    const embeddedUpdateId = req.headers["expo-embedded-update-id"];
    if (!embeddedUpdateId || typeof embeddedUpdateId !== "string") {
        throw new Error("Invalid Expo-Embedded-Update-ID request header specified.");
    }
    const currentUpdateId = req.headers["expo-current-update-id"];
    if (currentUpdateId === embeddedUpdateId) {
        throw new helpers/* NoUpdateAvailableError */.fy();
    }
    const directive = await (0,helpers/* createRollBackDirectiveAsync */.AE)(updateBundlePath);
    let signature = null;
    const expectSignatureHeader = req.headers["expo-expect-signature"];
    if (expectSignatureHeader) {
        const privateKey = await (0,helpers/* getPrivateKeyAsync */.tw)();
        if (!privateKey) {
            res.statusCode = 400;
            res.json({
                error: "Code signing requested but no key supplied when starting server."
            });
            return;
        }
        const directiveString = JSON.stringify(directive);
        const hashSignature = (0,helpers/* signRSASHA256 */.sk)(directiveString, privateKey);
        const dictionary = (0,helpers/* convertToDictionaryItemsRepresentation */.Kg)({
            sig: hashSignature,
            keyid: "main"
        });
        signature = (0,external_structured_headers_namespaceObject.serializeDictionary)(dictionary);
    }
    const form = new (external_form_data_default())();
    form.append("directive", JSON.stringify(directive), {
        contentType: "application/json",
        header: {
            "content-type": "application/json; charset=utf-8",
            ...signature ? {
                "expo-signature": signature
            } : {}
        }
    });
    res.statusCode = 200;
    res.setHeader("expo-protocol-version", 1);
    res.setHeader("expo-sfv-version", 0);
    res.setHeader("cache-control", "private, max-age=0");
    res.setHeader("content-type", `multipart/mixed; boundary=${form.getBoundary()}`);
    res.write(form.getBuffer());
    res.end();
}
async function putNoUpdateAvailableInResponseAsync(req, res, protocolVersion) {
    if (protocolVersion === 0) {
        throw new Error("NoUpdateAvailable directive not available in protocol version 0");
    }
    const directive = await (0,helpers/* createNoUpdateAvailableDirectiveAsync */.pA)();
    let signature = null;
    const expectSignatureHeader = req.headers["expo-expect-signature"];
    if (expectSignatureHeader) {
        const privateKey = await (0,helpers/* getPrivateKeyAsync */.tw)();
        if (!privateKey) {
            res.statusCode = 400;
            res.json({
                error: "Code signing requested but no key supplied when starting server."
            });
            return;
        }
        const directiveString = JSON.stringify(directive);
        const hashSignature = (0,helpers/* signRSASHA256 */.sk)(directiveString, privateKey);
        const dictionary = (0,helpers/* convertToDictionaryItemsRepresentation */.Kg)({
            sig: hashSignature,
            keyid: "main"
        });
        signature = (0,external_structured_headers_namespaceObject.serializeDictionary)(dictionary);
    }
    const form = new (external_form_data_default())();
    form.append("directive", JSON.stringify(directive), {
        contentType: "application/json",
        header: {
            "content-type": "application/json; charset=utf-8",
            ...signature ? {
                "expo-signature": signature
            } : {}
        }
    });
    res.statusCode = 200;
    res.setHeader("expo-protocol-version", 1);
    res.setHeader("expo-sfv-version", 0);
    res.setHeader("cache-control", "private, max-age=0");
    res.setHeader("content-type", `multipart/mixed; boundary=${form.getBoundary()}`);
    res.write(form.getBuffer());
    res.end();
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [72], () => (__webpack_exec__(637)));
module.exports = __webpack_exports__;

})();