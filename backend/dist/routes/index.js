"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_js_1 = __importDefault(require("./driver/index.js"));
const index_js_2 = __importDefault(require("./rider/index.js"));
const router = (0, express_1.Router)();
router.use("/driver", index_js_1.default);
router.use("/rider", index_js_2.default);
exports.default = router;
