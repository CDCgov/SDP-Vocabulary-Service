require 'test_helper'
require 'sdp/importers/jupiter'

class JupiterTest < ActiveSupport::TestCase
  test 'request' do
    FakeWeb.register_uri(:get, 'http://jupiter-example.com/test1',
                         body: File.read('test/fixtures/files/jupiter_response.json'),
                         content_type: 'application/json')
    programs = SDP::Importers::Jupiter.request('http://jupiter-example.com/test1')
    assert_equal 3, programs.length
    assert_equal 'Arctic Investigations Program', programs[0][:name]
    assert programs[0][:description].include?('The mission of the Arctic Investigations Program')
    assert_nil programs[2][:description]
  end
end
