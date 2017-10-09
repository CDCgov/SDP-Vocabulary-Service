require 'test_helper'

class ValueSetsSerializerTest < ActiveSupport::TestCase
  test 'should use phin vads url when source of material is vads' do
    rset = response_sets(:phin_source)
    json = ValueSetsSerializer.new(rset).as_json
    assert_equal "https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=#{rset.oid}", json[:url]
  end

  test 'should use internal url when source of material is not vads' do
    rset = response_sets(:one)
    json = ValueSetsSerializer.new(rset).as_json
    assert_equal Rails.application.routes.url_helpers.api_valueSet_url(rset.version_independent_id, version: rset.version, only_path: true), json[:url]
  end
end
