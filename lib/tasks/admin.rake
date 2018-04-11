require 'sdp/importers/phin_vads_importer'
namespace :admin do
  # Create a new user for the system
  task :create_user, [:email, :password, :admin] => :environment do |_t, args|
    user = User.find_by(email: args.email)
    if user
      puts "User with email address #{args.email} already exists"
    else
      user = User.create(email: args.email, password: args.password, password_confirmation: args.password)
      user.add_role :admin if args.admin == 'true'
    end
  end

  # Add an adminstrative user
  task :grant_admin, [:email] => :environment do |_t, args|
    user = User.find_by(email: args.email)
    if user
      user.add_role :admin
      user.save
      puts "Admin role granted for #{args.email}"
    else
      puts "User #{args.email} not found"
    end
  end

  # Revoke an administrative users admin rights"
  task :revoke_admin, [:email] => :environment do |_t, args|
    user = User.find_by(email: args.email)
    if user
      user.remove_role :admin
      user.save
      puts "Admin role revoked for #{args.email}"
    else
      puts "User #{args.email} not found"
    end
  end

  # Make a user a publisher
  task :make_publisher, [:email] => :environment do |_t, args|
    user = User.find_by(email: args.email)
    if user
      user.add_role :publisher
      user.save
      puts "Publisher role assigned to #{args.email}"
    else
      puts "User #{args.email} not found"
    end
  end

  # Revoke the publisher role from a user
  task :revoke_publisher, [:email] => :environment do |_t, args|
    user = User.find_by(email: args.email)
    if user
      user.remove_role :publisher
      user.save
      puts "Publisher role revoked for #{args.email}"
    else
      puts "User #{args.email} not found"
    end
  end

  desc 'sync valuesets from PHIN VADS into the db'
  task :sync_phinvads_vs, [:email, :force_reload, :oid] => :environment do |_t, args|
    user = User.where(email: args.email).first
    if user.nil?
      puts 'Could not find user that matches supplied email address'
      return
    end
    proxy = ENV['http_proxy'] || ENV['https_proxy'] || ENV['HTTP_PROXY'] || ENV['HTTPS_PROXY']
    params = { user: user, force_reload: (args.force_reload == 'true') }
    puts params
    if proxy
      uri = URI(proxy)
      params[:proxy] = { host: uri.host, port: uri.port }
    end
    importer = SDP::Importers::PhinVadsImporter.new(params)
    if !args.oid.nil? && !args.oid.empty?
      importer.import_valueset(args.oid)
    else
      importer.import_valuesets
    end
  end
end
