require 'sdp/elastic_search'
class DeleteFromIndexJob < ApplicationJob
  queue_as :default

  rescue_from(StandardError) do |exception|
    Rails.logger.error 'Worker thread exception: '
    Rails.logger.error exception.backtrace
  end

  def perform(type, id)
    SDP::Elasticsearch.ensure_index
    SDP::Elasticsearch.with_client do |client|
      if client.exists?(index: 'vocabulary', type: type.underscore, id: id)
        client.delete index: 'vocabulary', type: type.underscore, id: id
      end
    end
  end
end
