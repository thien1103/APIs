const authenRouter = require('./authenRouter')
const userRouter = require('./userRouter')
const healthPostRouter = require('./healthPostRouter');
const contactRouter = require('./contactRouter');
const notificationRouter = require('./notificationRouter');
const pickUpRouter = require('./pickUpRouter');
const requestRouter = require('./requestRouter')
const messageRouter = require("./messageRouter");
const remindMedicinesRouter = require("./remindMedicinesRouter")
const feedbackRouter = require("./feedbackRouter");


function route(app){
    app.use('/api',authenRouter);
    app.use('/api',userRouter);
    app.use('/api',healthPostRouter);
    app.use('/api',contactRouter);
    app.use('/api',notificationRouter);
    app.use('/api',pickUpRouter);
    app.use('/api',requestRouter)
    app.use("/api", messageRouter);
    app.use("/api", remindMedicinesRouter);
    app.use("/api", feedbackRouter);
}
module.exports = route;