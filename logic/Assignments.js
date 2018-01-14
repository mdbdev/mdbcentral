// DEPENDENCIES
const dbUtil = require("../util/firebase/db.js");
const getUserById = require("./Members.js").getById;
const scoresUtil = require("./Scores.js");

// CONSTANTS
const ref = dbUtil.refs.assignmentRef;

// HELPERS
function _getAssignments(roleId) {
  var assignments = [];
  return dbUtil.getAll(ref).then(function(assignments) {
    return assignments.filter(function(assignment) {
      return assignment.roleIds.indexOf(roleId) >= 0;
    });
  });
}

// METHODS
function create(params) {
  return dbUtil.createNewObjectByAutoId(ref, {
    due: params.due,
    link: params.link,
    name: params.name,
    roleIds: params.roleIds
  });
}

function getAll() {
  return dbUtil.getAll(ref);
}

function getByUid(params) {
  return getUserById(params.uid).then(function(user) {
    return _getAssignments(user.roleId);
  }).catch(function(error) {
    return [];
  });
}

function getAllScores(params) {
  var result = [];
  var num_scores = 0;
  return getAllUsers().then(function(users) {
    return Promise.all(users.map(function(user) {
      return getAssignmentScores({
        member: member.uid,
        roleId: member.roleId
      }).then(function(assignments) {
        for (var i = 0; i < assignments.length; i++) {
          var assignment = assignments[i];
          if (assignment.key == params.assignmentId) {
            assignment.assignment_name = assignment.name;
            assignment.member_name = member.name;
            result.push(assignment);
            if (assignment.score != nullScoreStr)
              num_scores += 1;
          }
        }
      })
    }));
  }).then(function() {
    return {
      scores: result,
      num_scores: num_scores
    };
  });
}

function getAssignmentScores(params) {
  var result = [];
  return _getAssignments(params.roleId).then(function(assignments) {
    var plist = [];
    assignments.forEach(function(assignment) {
      plist.push(scoresUtil.get(params.member, assignment.key)
        .then(function(score) {
          assignment.score = score.score;
          result.push(assignment);
        }));
    });
    return Promise.all(plist);
  }).then(function() {
    return result;
  });
}

// EXPORTS
module.exports.create = create;
module.exports.getAll = getAll;
module.exports.getByUid = getByUid;
module.exports.getAllScores = getAllScores;
module.exports.getAssignmentScores = getAssignmentScores;
