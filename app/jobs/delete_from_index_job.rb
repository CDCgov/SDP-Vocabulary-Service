require 'sdp/elastic_search'
class DeleteFromIndexJob < ApplicationJob
  queue_as :default

  rescue_from(StandardError) do |exception|
    Rails.logger.error 'Worker thread exception: '
    Rails.logger.error exception.backtrace
  end

  def perform(type, id)
    SDP::Elasticsearch.delete_item(type, id)
  end
end
