const $ = require('jquery');
exports.$ = $;
exports.addQuestion = function addQuestion(questionName, question, responseSets) {
  const tbl = $('#questionTable > tbody:last-child');
  var responseSetsSelect = "<label for='response_set_ids'>Response Sets</label><select name='response_set_ids[]' id='response_set_ids'>";
  responseSetsSelect += "<option aria-label=' '></option>";
  responseSets.forEach(function(rs){
    responseSetsSelect += '<option value="';
    responseSetsSelect += rs.id;
    responseSetsSelect += '">';
    responseSetsSelect += rs.name;
    responseSetsSelect += '</option>';
  });
  responseSetsSelect += "</select>";
  var remove =   '<td><a href="javascript:SDP.forms.removeQuestion(\'#question_id_'+question+'\')">Remove<a></td>';
  var appendString = '<tr><td>' + questionName + '</td><input aria-label="Question IDs" id="question_id_'+question+'" type="hidden" name="question_ids[]" value="' + question + '"/><td>' + responseSetsSelect + '</td>'+remove+'</tr>';
  tbl.append(appendString);
};


exports.removeQuestion = function removeQuestion(td){
  $(td).parent('tr').remove();
};
