const $ = require('jquery');

exports.addQuestion = function addQuestion(questionName, question, responseSets) {
  const tbl = $('#questionTable > tbody:last-child')
  let responseSetsSelect = "<select name='response_set_ids[]'>";
  responseSetsSelect += "<option label=' '></option>";
  responseSets.forEach((rs) => {
    responseSetsSelect += `<option value="${rs.id}">${rs.name}</option>`;
  });
  responseSetsSelect << "</select>";
  tbl.append(`<tr>
    <td>${questionName}</td>
    <input type="hidden" name="question_ids[]" value="${question}"/>
    <td>
        ${responseSetsSelect}
    </td>
  </tr>`);
}