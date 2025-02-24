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
exports.forumRouter = void 0;
const express_1 = __importDefault(require("express"));
const prismaClient_1 = __importDefault(require("../../prismaClient"));
const login_1 = require("../../middlewares/login");
exports.forumRouter = express_1.default.Router();
exports.forumRouter.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const forums = yield prismaClient_1.default.forum.findMany();
        res.status(200).json(forums);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.forumRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const forum = yield prismaClient_1.default.forum.findUnique({
            where: {
                id,
            },
        });
        res.status(200).json(forum);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.forumRouter.post('/create', login_1.loginMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    try {
        const forum = yield prismaClient_1.default.forum.create({
            data: {
                name,
                description,
                //@ts-ignore
                adminId: req.user.id
            },
        });
        res.status(200).json(forum);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.forumRouter.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, description, adminId } = req.body;
    try {
        const isAdmin = yield prismaClient_1.default.user.findUnique({
            where: {
                id: adminId,
            },
        });
        if (!isAdmin) {
            res.status(403).json({ message: 'You are not authorized to perform this action' });
            return;
        }
        const forum = yield prismaClient_1.default.forum.update({
            where: {
                id,
            },
            data: {
                name,
                description,
            },
        });
        res.status(200).json(forum);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
exports.forumRouter.post('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const forum = yield prismaClient_1.default.forum.delete({
            where: {
                id,
            },
        });
        res.status(200).json(forum);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
