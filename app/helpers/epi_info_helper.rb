# rubocop:disable Metrics/MethodLength
module EpiInfoHelper
  def epi_info_field_type(code, rs)
    case code
    when 'decimal'
      5
    when 'integer'
      5
    when 'date'
      7
    when 'boolean'
      11
    when 'dateTime'
      9
    when 'instant'
      8
    when 'time'
      8
    when 'string'
      1
    when 'text'
      4
    when 'url'
      1
    when 'choice', 'open-choice'
      if rs && rs.response_values?
        19
      else
        17
      end
    when 'attachment'
      99
    when 'quantity'
      1
    else
      99
    end
  end
end
# rubocop:enable Metrics/MethodLength
