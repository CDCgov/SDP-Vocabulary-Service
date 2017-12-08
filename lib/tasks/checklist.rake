require 'sdp/importers/checklist'

namespace :checklist do
  desc 'Import a Checklist'
  task :import, [:file, :user_email] => :environment do |_t, args|
    user = User.find_by(email: args.user_email)
    if user.nil?
      STDERR.puts "Unable to find user #{args.user_email}"
      exit(-1)
    end
    SDP::Importers::Checklist.import(args.file, user)
  end
end
