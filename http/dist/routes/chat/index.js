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
exports.chatRouter = void 0;
const express_1 = __importDefault(require("express"));
const prismaClient_1 = __importDefault(require("../../prismaClient"));
exports.chatRouter = express_1.default.Router();
exports.chatRouter.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield prismaClient_1.default.chat.findMany();
        res.status(200).json(chats);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.chatRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const chat = yield prismaClient_1.default.chat.findUnique({
            where: {
                id,
            },
        });
        res.status(200).json(chat);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.chatRouter.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, authorId } = req.body;
    try {
        const chat = yield prismaClient_1.default.chat.create({
            data: {
                message,
                authorId
            },
        });
        res.status(200).json(chat);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.chatRouter.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, message, authorId } = req.body;
    try {
        const chat = yield prismaClient_1.default.chat.update({
            where: {
                id,
            },
            data: {
                message,
                authorId
            },
        });
        res.status(200).json(chat);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.chatRouter.post('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const chat = yield prismaClient_1.default.chat.delete({
            where: {
                id,
            },
        });
        res.status(200).json(chat);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
