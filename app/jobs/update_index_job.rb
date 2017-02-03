class UpdateIndexJob < ApplicationJob
  queue_as :default

  def perform(type, data)
    # call elasticsearch
    exists = Vocabulary::Elasticsearch.client.exists? index: 'vocabulary',
                                                      type: type.underscore,
                                                      id: data[:id]
    if exists
      Vocabulary::Elasticsearch.client.update index: 'vocabulary',
                                              type: type.underscore,
                                              id: data[:id],
                                              body: { doc: data }
    else
      Vocabulary::Elasticsearch.client.create index: 'vocabulary',
                                              type: type.underscore,
                                              id: data[:id],
                                              body:  data
    end
  end
end
