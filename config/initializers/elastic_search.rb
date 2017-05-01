
require 'elasticsearch'

module Vocabulary
  module Elasticsearch
    client_opts = Settings.elasticsearch
    # this is required to allow updating the adapter used by faraday
    # the argument is a symbol to the client so we need to change it
    # to make sure it works -- really required for testing using fake web
    client_opts[:adapter] = client_opts['adapter']
    @@client = ::Elasticsearch::Client.new client_opts
    def self.client
      @@client
    end
  end
end

require 'sdp/elastic_search'
SDP::Elasticsearch.sync
