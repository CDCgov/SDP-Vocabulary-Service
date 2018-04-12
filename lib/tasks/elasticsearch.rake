require 'sdp/elastic_search'
namespace :es do
  desc 'Synchronize the database and elastic search store'
  task sync: :environment do
    SDP::Elasticsearch.sync_now
  end

  desc 'Test that elasticsearch is actually working'
  task test: :environment do
    search_results = SDP::Elasticsearch.search('question', 'favorite', 1, 10, 'test@sdpv.local')
    if search_results.hits.count > 0
      puts 'Search executed successfully'
    else
      STDERR.puts 'Search using elasticsearch failed.'
      exit(-1)
    end
  end
end
