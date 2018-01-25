// DEPENDENCIES
const router = require("express").Router();
const slackRouter = require("./slack.js");
const expectedAbsencesRouter = require("./expectedAbsences.js");
const feedbackRouter = require("./feedback.js");
const usersRouter = require("./users.js");
const assignmentsRouter = require("./assignments.js");
const scoresRouter = require("./scores.js");
const paymentReqRouter = require("./paymentRequests.js");
const finReportRouter = require("./finReports.js");
const leaderRouter = require("./leaders.js");
const semesterStartRouter = require("./semesterStart.js");
const canSignUpRouter = require("./canSignUp.js");
const signInCodeRouter = require("./signInCode.js");

// ROUTES
router.use(slackRouter);
router.use(expectedAbsencesRouter);
router.use(feedbackRouter);
router.use(usersRouter);
router.use(assignmentsRouter);
router.use(scoresRouter);
router.use(paymentReqRouter);
router.use(finReportRouter);
router.use(leaderRouter);
router.use(semesterStartRouter);
router.use(canSignUpRouter);
router.use(signInCodeRouter);

// EXPORTS
module.exports = router;
