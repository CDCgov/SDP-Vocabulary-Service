class ValueSetsSerializer < ActiveModel::Serializer
  attribute :url do
    Rails.application.routes.url_helpers.api_valueSet_url(object.version_independent_id, version: object.version, only_path: true)
  end

  attribute :version_independent_id, key: :id

  attribute :identifier do # additional identifiers not yet available
  end

  attribute :version, key: :version
  attribute :name

  attribute :status do # status not yet available
  end

  attribute :description
  attribute :publisher do
    object.source == 'local' ? 'SDP-Vocabulary' : object.source
  end

  attribute :expansion do
    expansion = {}
    expansion['identifier'] = nil
    expansion['timestamp'] = nil
    expansion['contains'] = []
    @responses = object.responses
    @responses.each do |response|
      exp = {}
      exp['system'] = response.code_system
      exp['version'] = nil # responses aren't versioned
      exp['code'] = response.value
      exp['display'] = response.display_name

      expansion['contains'] << exp
    end
    expansion
  end
  attribute :published_by, serializer: UserSerializer
end
