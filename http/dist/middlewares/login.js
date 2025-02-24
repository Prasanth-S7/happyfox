"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const loginMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        const user = yield prismaClient_1.default.user.findUnique({
            where: {
                //@ts-ignore
                id: decoded.id,
            },
        });
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        //@ts-ignore
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
});
exports.loginMiddleware = loginMiddleware;
