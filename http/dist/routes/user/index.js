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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const prismaClient_1 = __importDefault(require("../../prismaClient"));
const jsonwebtoken_1 = require("jsonwebtoken");
exports.userRouter = express_1.default.Router();
exports.userRouter.get('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, firstName, lastName, email, password } = req.body;
    try {
        const isUser = yield prismaClient_1.default.user.findUnique({
            where: {
                username,
            },
        });
        if (isUser) {
            res.status(403).json({ message: 'Username already exists' });
            return;
        }
        const user = yield prismaClient_1.default.user.create({
            data: {
                username,
                firstName,
                lastName,
                email,
                password,
                role: 'USER',
                xp: 0,
            },
        });
        const token = (0, jsonwebtoken_1.sign)({ id: user.id }, process.env.JWT_SECRET);
        res.status(200).json({ user, token });
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.userRouter.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield prismaClient_1.default.user.findUnique({
            where: {
                username,
                password,
            },
        });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.userRouter.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield prismaClient_1.default.user.findUnique({
            where: {
                username,
                password,
            },
        });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
