// DEPENDENCIES
const dbUtil = require("../util/firebase/db.js");

// CONSTANTS
const ref = dbUtil.refs.eventsRef;

// HELPERS

function _getTimestamp(dateStr, timeStr) {
  return new Date(dateStr + " " + timeStr).getTime();
}

// METHODS
function create(params) {
  return dbUtil.createNewObjectByAutoId(ref, {
    timestamp: _getTimestamp(params.startDate, params.startTime),
    title: params.title,
    endTimestamp: _getTimestamp(params.endDate, params.endTime),
  });
}

function deleteById(params) {
  return dbUtil.remove(ref, params.id);
}

function getAll() {
  return dbUtil.getAll(ref);
}

function getByToday() {
  var today = new Date().getTime();
  return getAll().then(function(events) {;
    var data = events.reduce(function(tuple, currE) {
      var e = tuple[0];
      var diff = tuple[1];
      if (!e) return [currE, diff];
      var currDiff = Math.abs(event.timestamp - today);
      if (currDiff < diff) return [currE, currDiff];
      return tuple;
    }, [null, Number.MAX_VALUE]);
    if (data[0] != null) return data[0];
    return Promise.reject(new Error("Could not find event"));
  });
}

function getById(params) {
  return dbUtil.getByKey(ref, params.id);
}

// EXPORTS
module.exports.deleteById = deleteById;
module.exports.getById = getById;
module.exports.getByToday = getByToday;
module.exports.getAll = getAll;
module.exports.create = create;
