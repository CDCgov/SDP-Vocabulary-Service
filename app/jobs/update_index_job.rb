require 'sdp/elastic_search'
class UpdateIndexJob < ApplicationJob
  queue_as :default

  rescue_from(StandardError) do |exception|
    Rails.logger.error 'Worker thread exception: '
    Rails.logger.error exception.backtrace
  end

  def perform(type, id)
    object = type.camelize.constantize.find_by(id: id)
    return if object.nil?
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
