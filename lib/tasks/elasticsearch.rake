require 'sdp/elastic_search'
namespace :es do
  desc 'Synchronize the database and elastic search store'
  task sync: :environment do
    SDP::Elasticsearch.sync
  end
end
