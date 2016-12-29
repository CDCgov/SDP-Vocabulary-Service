require 'sdp/importers/redcap'
namespace :redcap do
  task :import, [:file, :user_email] => :environment do |_t, args|
    f = File.new(args.file)
    u = User.find_by(email: args.user_email)
    importer = SDP::Importers::Redcap.new(f, u)
    importer.import
  end
end
