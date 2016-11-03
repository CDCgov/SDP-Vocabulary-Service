const $ = require('jquery');

exports.addResponseRow = function() {
  const tableRowCount = $("#response-set-table tr").length - 1;
  const newRow = `
        <tr>
          <td>
            <label class="hidden" for="response_set_responses_attributes_${tableRowCount}_value">Value</label>
            <input type="text" name="response_set[responses_attributes][${tableRowCount}][value]" id="response_set_responses_attributes_${tableRowCount}_value">
          </td>
          <td>
            <label class="hidden" for="response_set_responses_attributes_${tableRowCount}_code_system">Code system</label>
            <input type="text" name="response_set[responses_attributes][${tableRowCount}][code_system]" id="response_set_responses_attributes_${tableRowCount}_code_system">
          </td>
          <td>
            <label class="hidden" for="response_set_responses_attributes_${tableRowCount}_display_name">Display name</label>
            <input type="text" name="response_set[responses_attributes][${tableRowCount}][display_name]" id="response_set_responses_attributes_${tableRowCount}_display_name">
          </td>
      </tr>`;
  const tbl = $('#response-set-table > tbody:last-child');
  tbl.append(newRow);
}
