require 'sdp/elastic_search'
class DeleteFromIndexJob < ApplicationJob
  queue_as :default

  def perform(type, id)
    # call elasticsearch
    SDP::Elasticsearch.with_client do |client|
      if client.exists?(index: 'vocabulary', type: type.underscore, id: id)
        client.delete index: 'vocabulary', type: type.underscore, id: data[:id]
      end
    end
  end
end
