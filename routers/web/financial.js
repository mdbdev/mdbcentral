// DEPENDENCIES
const router = require("express").Router();
const util = require("../../util/util.js");
const helper = require("../helper.js");
const finReportLogic = require("../../logic/FinReports.js");

// HELPERS
function _getCategories(data) {
  data.categories = [
    "Reimbursements", "Contract", "Membership Dues",
    "Retreat", "Food", "Events", "Social", "Other"
  ];
}

function _initTotalSpendingIncome(categories) {
  var totalSpending = {};
  var totalIncome = {};
  categories.forEach(function(category) {
    totalSpending[category] = 0;
    totalIncome[category] = 0;
  });
  return [totalSpending, totalIncome];
}

function _aggAllByX(vals) {
  return vals.map(function(val) {
    return util.aggregateByX(val);
  });
}

function _calcReportData(reports, totalIncome, totalSpending) {
  var spending = [];
  var futureSpending = [];
  var projSpending = [];
  var balance = [];
  var balanceTotal = 0;
  var today = new Date();
  reports.sort(function(a, b) {
    var tsA = new Date(a.date).getTime();
    var tsB = new Date(b.date).getTime();
    return tsA - tsB;
  }).forEach(function(report) {
    var y = report.dollars;
    var date = new Date(report.date);
    var cat = report.category;
    var projection = report.projection;
    var ts = date.getTime();
    var x = util.timeToString(ts, true);
    if (y > 0)
      totalIncome[cat] += y;
    else if (y < 0) {
      totalSpending[cat] += y * -1;
      if (projection !== true) {
        spending.push([x, y]);
        projSpending.push([ts, y]);
      } else {
        futureSpending.push([x, y]);
      }
    }
    balanceTotal += y;
    balance.push([x, balanceTotal]);
  });
  var results = [spending, futureSpending, projSpending, balance];
  results = _aggAllByX(results);
  results.push(balanceTotal);
  return results;
}

function _getPie(data, d, elementId, pieBool) {
  d = util.genPieData(d, pieBool || false);
  data.graphs.push({
    elementId: elementId,
    type: "pie",
    xData: d[0],
    yData: d[1]
  });
}

function _getLine(data, d, elementId, postProcX) {
  d = util.formatLineData(d);
  if (postProcX) {
    d[0] = d[0].map(function(point) {
      return util.timeToString(point, true);
    });
  }
  data.graphs.push({
    elementId: elementId,
    type: "line",
    xData: d[0],
    yData: d[1]
  });
}

function _getReports(data) {
  return finReportLogic.getAll().then(function(reports) {
    data.reports = reports;
    _getCategories(data);

    var j = _initTotalSpendingIncome(data.categories);
    var totalSpending = j[0];
    var totalIncome = j[1];
    j = _calcReportData(reports, totalIncome, totalSpending);
    _getPie(data, totalSpending, "category_spending_graph");
    _getPie(data, totalIncome, "category_income_graph");

    var spending = j[0];
    var futureSpending = j[1];
    var projSpending = util.getProjectedPoints(j[2], 2);
    var balance = j[3];
    var balanceTotal = j[4];
    _getLine(data, spending, "spending_graph");
    _getLine(data, futureSpending, "future_spending_graph");
    _getLine(data, balance, "balance_graph");
    _getLine(data, projSpending, "proj_spending_graph", true);
  });
}

// METHODS
router.get("/financial", helper.isLoggedIn, function(req, res) {
  var member = req.cookies.member;
  var data;
  helper.genData("financial", member).then(function(d) {
    data = d;
    return _getReports(data).then(function() {
      res.render("index", data);
    });
  });
});

// EXPORTS
module.exports = router;
