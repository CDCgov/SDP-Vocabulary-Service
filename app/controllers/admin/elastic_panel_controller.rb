require 'sdp/elastic_search'

module Admin
  class ElasticPanelController < AdminController
    def delete_and_sync
      if SDP::Elasticsearch.ping
        SDP::Elasticsearch.delete_index
        SDP::Elasticsearch.sync_now
        render json: { msg: 'Successfully deleted index and updated Elasticsearch' }, status: :ok
      else
        render json: { msg: 'Error when syncing, Elasticsearch appears to be down, see help documentation' }, status: :unprocessable_entity
      end
    end

    def es_sync
      if SDP::Elasticsearch.ping
        SDP::Elasticsearch.sync_now
        render json: { msg: 'Successfully updated Elasticsearch' }, status: :ok
      else
        render json: { msg: 'Error when syncing, Elasticsearch appears to be down, see help documentation' }, status: :unprocessable_entity
      end
    end
  end
end
