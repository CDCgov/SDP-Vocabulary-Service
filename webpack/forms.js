const $ = require('jquery');

exports.addQuestion = function addQuestion(questionName, question, responseSets) {
  const tbl = $('#questionTable > tbody:last-child')
  var responseSetsSelect = "<select name='response_set_ids[]'>";
  responseSetsSelect += "<option label=' '></option>";
  responseSets.forEach(function(rs){
    responseSetsSelect += '<option value="'
    responseSetsSelect += rs.id
    responseSetsSelect += '">'
    responseSetsSelect += rs.name
    responseSetsSelect += '</option>';
  });
  responseSetsSelect += "</select>";
  var appendString = '<tr><td>' + questionName + '</td><input type="hidden" name="question_ids[]" value="' + question + '"/><td>' + responseSetsSelect + '</td></tr>'
  tbl.append(appendString);
}