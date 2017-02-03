class DeleteFromIndex < ApplicationJob
  queue_as :default

  def perform(type, id)
    # call elasticsearch
    exists = Vocabulary::Elasticsearch.client.exists? index: 'vocabulary',
                                                      type: type.underscore,
                                                      id: id

    if exists
      Vocabulary::Elasticsearch.client.delete index: 'vocabulary',
                                              type: type.underscore,
                                              id: data[:id]
    end
  end
end
