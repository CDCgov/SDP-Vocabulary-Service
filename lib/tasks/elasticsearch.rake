require 'sdp/elastic_search'
namespace :es do
  desc 'Synchronize the database and elastic search store'
  task sync: :environment do
    SDP::Elasticsearch.sync_now
  end

  desc 'Test that elasticsearch is actually working'
  task :test, [:user_email] => :environment do |_t, args|
    u = User.find_by email: args.user_email
    search_results = SDP::Elasticsearch.search('', '', 1, 10, u.id)
    if search_results.hits.count > 0
      puts 'Search executed successfully'
    else
      STDERR.puts 'Search using elasticsearch failed.'
      exit(-1)
    end
  end
end
