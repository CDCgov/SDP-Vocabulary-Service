const $ = require('jquery');

exports.addQuestion = function addQuestion(questionName, question, responseSets) {
  const tbl = $('#questionTable > tbody:last-child')
  var responseSetsSelect = "<label for='response_set_ids'>Response Sets</label><select name='response_set_ids[]' id='response_set_ids'>";
  responseSetsSelect += "<option aria-label=' '></option>";
  responseSets.forEach(function(rs){
    responseSetsSelect += '<option value="'
    responseSetsSelect += rs.id
    responseSetsSelect += '">'
    responseSetsSelect += rs.name
    responseSetsSelect += '</option>';
  });
  responseSetsSelect += "</select>";
  var appendString = '<tr><td>' + questionName + '</td><input aria-label="Question IDs" type="hidden" name="question_ids[]" value="' + question + '"/><td>' + responseSetsSelect + '</td></tr>'
  tbl.append(appendString);
}