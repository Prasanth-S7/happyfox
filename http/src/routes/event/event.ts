// @ts-nocheck
import { Router } from "express";
import { createEvent, getEvents, upload } from "../../controllers/eventController";

const eventRouter = Router();

eventRouter.post('/events',
    upload.fields([
        {name: 'avatar', maxCount: 1},
        {name: 'poster', maxCount: 1}
    ]),
    createEvent
)

eventRouter.get('/events', getEvents);

export default eventRouter;