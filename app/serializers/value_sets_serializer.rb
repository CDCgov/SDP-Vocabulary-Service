class ValueSetsSerializer < ActiveModel::Serializer
  attribute :url
  def url
    Rails.application.routes.url_helpers.response_set_url(object)
  end
  
  attribute :identifier
  def identifier

  end

  attribute :version
  attribute :name
  
  attribute :status #not yet available
  def status
  end

  attribute :description

  attribute :expansion
  def expansion
    expansion = {}
    expansion['identifier'] = nil
    expansion['timestamp'] = nil
    expansion['contains'] = []
    @responses = object.responses
    @responses.each do |response|
      exp = {}
      exp['system'] = response.code_system
      exp['version'] = nil
      exp['code'] = response.value
      exp['display'] = response.display_name
      
      expansion['contains'] << exp
    end
    expansion
  end
end
