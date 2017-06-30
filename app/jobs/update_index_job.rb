require 'sdp/elastic_search'
class UpdateIndexJob < ApplicationJob
  queue_as :default

  def perform(type, object)
    # call elasticsearch
    data = "ES#{type.camelize}Serializer".constantize.new(object).as_json
    SDP::Elasticsearch.ensure_index
    SDP::Elasticsearch.with_client do |client|
      if client.exists? index: 'vocabulary', type: type.underscore, id: data[:id]
        client.update index: 'vocabulary', type: type.underscore, id: data[:id], body: { doc: data }
      else
        client.create index: 'vocabulary', type: type.underscore, id: data[:id], body: data
      end
    end
  end
end
