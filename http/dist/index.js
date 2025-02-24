"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const user_1 = require("./routes/user");
const chat_1 = require("./routes/chat");
const forum_1 = require("./routes/forum");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use('/api/v1/user', user_1.userRouter);
app.use('/api/v1/chat', chat_1.chatRouter);
app.use('/api/v1/forum', forum_1.forumRouter);
app.listen(config_1.PORT, () => {
    console.log(`Server started on port ${config_1.PORT}`);
});
