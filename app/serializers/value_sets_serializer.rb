class ValueSetsSerializer < ActiveModel::Serializer
  attribute :url
  def url
    Rails.application.routes.url_helpers.api_valueSet_url(object, :only_path => true)
  end
  
  attribute :identifier #additional identifiers not yet available
  def identifier
  end

  attribute :version
  attribute :name
  
  attribute :status #status not yet available
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
      exp['version'] = nil #responses aren't versioned
      exp['code'] = response.value
      exp['display'] = response.display_name
      
      expansion['contains'] << exp
    end
    expansion
  end
end
