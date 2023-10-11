"use strict";
exports.id = 72;
exports.ids = [72];
exports.modules = {

/***/ 72:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fy": () => (/* binding */ NoUpdateAvailableError),
/* harmony export */   "Kg": () => (/* binding */ convertToDictionaryItemsRepresentation),
/* harmony export */   "sk": () => (/* binding */ signRSASHA256),
/* harmony export */   "tw": () => (/* binding */ getPrivateKeyAsync),
/* harmony export */   "BE": () => (/* binding */ getLatestUpdateBundlePathForRuntimeVersionAsync),
/* harmony export */   "fE": () => (/* binding */ getAssetMetadataAsync),
/* harmony export */   "AE": () => (/* binding */ createRollBackDirectiveAsync),
/* harmony export */   "pA": () => (/* binding */ createNoUpdateAvailableDirectiveAsync),
/* harmony export */   "Se": () => (/* binding */ getMetadataAsync),
/* harmony export */   "bg": () => (/* binding */ getExpoConfigAsync),
/* harmony export */   "Uc": () => (/* binding */ convertSHA256HashToUUID)
/* harmony export */ });
/* unused harmony export truthy */
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(113);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(292);
/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs_promises__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var mime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var mime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(mime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(17);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_4__);





class NoUpdateAvailableError extends Error {
}
function createHash(file, hashingAlgorithm, encoding) {
    return crypto__WEBPACK_IMPORTED_MODULE_0___default().createHash(hashingAlgorithm).update(file).digest(encoding);
}
function getBase64URLEncoding(base64EncodedString) {
    return base64EncodedString.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function convertToDictionaryItemsRepresentation(obj) {
    return new Map(Object.entries(obj).map(([k, v])=>{
        return [
            k,
            [
                v,
                new Map()
            ]
        ];
    }));
}
function signRSASHA256(data, privateKey) {
    const sign = crypto__WEBPACK_IMPORTED_MODULE_0___default().createSign("RSA-SHA256");
    sign.update(data, "utf8");
    sign.end();
    return sign.sign(privateKey, "base64");
}
async function getPrivateKeyAsync() {
    const privateKeyPath = process.env.PRIVATE_KEY_PATH;
    if (!privateKeyPath) {
        return null;
    }
    const pemBuffer = await fs_promises__WEBPACK_IMPORTED_MODULE_2___default().readFile(path__WEBPACK_IMPORTED_MODULE_4___default().resolve(privateKeyPath));
    return pemBuffer.toString("utf8");
}
async function getLatestUpdateBundlePathForRuntimeVersionAsync(runtimeVersion) {
    const updatesDirectoryForRuntimeVersion = `updates/${runtimeVersion}`;
    if (!fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(updatesDirectoryForRuntimeVersion)) {
        throw new Error("Unsupported runtime version");
    }
    const filesInUpdatesDirectory = await fs_promises__WEBPACK_IMPORTED_MODULE_2___default().readdir(updatesDirectoryForRuntimeVersion);
    const directoriesInUpdatesDirectory = (await Promise.all(filesInUpdatesDirectory.map(async (file)=>{
        const fileStat = await fs_promises__WEBPACK_IMPORTED_MODULE_2___default().stat(path__WEBPACK_IMPORTED_MODULE_4___default().join(updatesDirectoryForRuntimeVersion, file));
        return fileStat.isDirectory() ? file : null;
    }))).filter(truthy).sort((a, b)=>parseInt(b, 10) - parseInt(a, 10)
    );
    return path__WEBPACK_IMPORTED_MODULE_4___default().join(updatesDirectoryForRuntimeVersion, directoriesInUpdatesDirectory[0]);
}
async function getAssetMetadataAsync(arg) {
    const assetFilePath = `${arg.updateBundlePath}/${arg.filePath}`;
    const asset = await fs_promises__WEBPACK_IMPORTED_MODULE_2___default().readFile(path__WEBPACK_IMPORTED_MODULE_4___default().resolve(assetFilePath), null);
    const assetHash = getBase64URLEncoding(createHash(asset, "sha256", "base64"));
    const key = createHash(asset, "md5", "hex");
    const keyExtensionSuffix = arg.isLaunchAsset ? "bundle" : arg.ext;
    const contentType = arg.isLaunchAsset ? "application/javascript" : mime__WEBPACK_IMPORTED_MODULE_3___default().getType(arg.ext);
    return {
        hash: assetHash,
        key,
        fileExtension: `.${keyExtensionSuffix}`,
        contentType,
        url: `${process.env.HOSTNAME}/api/assets?asset=${assetFilePath}&runtimeVersion=${arg.runtimeVersion}&platform=${arg.platform}`
    };
}
async function createRollBackDirectiveAsync(updateBundlePath) {
    try {
        const rollbackFilePath = `${updateBundlePath}/rollback`;
        const rollbackFileStat = await fs_promises__WEBPACK_IMPORTED_MODULE_2___default().stat(rollbackFilePath);
        return {
            type: "rollBackToEmbedded",
            parameters: {
                commitTime: new Date(rollbackFileStat.birthtime).toISOString()
            }
        };
    } catch (error) {
        throw new Error(`No rollback found. Error: ${error}`);
    }
}
async function createNoUpdateAvailableDirectiveAsync() {
    return {
        type: "noUpdateAvailable"
    };
}
async function getMetadataAsync({ updateBundlePath , runtimeVersion  }) {
    try {
        const metadataPath = `${updateBundlePath}/metadata.json`;
        const updateMetadataBuffer = await fs_promises__WEBPACK_IMPORTED_MODULE_2___default().readFile(path__WEBPACK_IMPORTED_MODULE_4___default().resolve(metadataPath), null);
        const metadataJson = JSON.parse(updateMetadataBuffer.toString("utf-8"));
        const metadataStat = await fs_promises__WEBPACK_IMPORTED_MODULE_2___default().stat(metadataPath);
        return {
            metadataJson,
            createdAt: new Date(metadataStat.birthtime).toISOString(),
            id: createHash(updateMetadataBuffer, "sha256", "hex")
        };
    } catch (error) {
        throw new Error(`No update found with runtime version: ${runtimeVersion}. Error: ${error}`);
    }
}
/**
 * This adds the `@expo/config`-exported config to `extra.expoConfig`, which is a common thing
 * done by implementors of the expo-updates specification since a lot of Expo modules use it.
 * It is not required by the specification, but is included here in the example client and server
 * for demonstration purposes. EAS Update does something conceptually very similar.
 */ async function getExpoConfigAsync({ updateBundlePath , runtimeVersion  }) {
    try {
        const expoConfigPath = `${updateBundlePath}/expoConfig.json`;
        const expoConfigBuffer = await fs_promises__WEBPACK_IMPORTED_MODULE_2___default().readFile(path__WEBPACK_IMPORTED_MODULE_4___default().resolve(expoConfigPath), null);
        const expoConfigJson = JSON.parse(expoConfigBuffer.toString("utf-8"));
        return expoConfigJson;
    } catch (error) {
        throw new Error(`No expo config json found with runtime version: ${runtimeVersion}. Error: ${error}`);
    }
}
function convertSHA256HashToUUID(value) {
    return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20, 32)}`;
}
function truthy(value) {
    return !!value;
}


/***/ })

};
;