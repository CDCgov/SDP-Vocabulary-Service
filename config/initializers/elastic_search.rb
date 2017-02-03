
require 'elasticsearch'

module Vocabulary
  module Elasticsearch
    @@client = ::Elasticsearch::Client.new Settings.elasticsearch
    def self.client
      @@client
    end
  end
end
