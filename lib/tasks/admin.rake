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
      user.save!
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

  # Changes the content ownership
  # signature: Object, Current Owner email address, New Owner email address, version independent id number, version number
  task :update_content_ownership, [:vs_obj, :owner_email, :new_owner_email, :version_independent_id, :version] => :environment do |_t, args|
    owner = User.find_by(email: args.owner_email)
    new_owner = User.find_by(email: args.new_owner_email)
    BOOL_OPT = true if args.vs_obj != 'section' || args.vs_obj != 'survey'
    if args.version
      case args.vs_obj
      when args.vs_obj = 'responseSet'
        vs = ResponseSet.find_by(version_independent_id: args.version_independent_id, version: args.version)
      when args.vs_obj = 'question'
        vs = Question.find_by(version_independent_id: args.version_independent_id, version: args.version)
      when args.vs_obj = 'section'
        vs = Section.find_by(version_independent_id: args.version_independent_id, version: args.version)
      when args.vs_obj = 'survey'
        vs = Survey.find_by(version_independent_id: args.version_independent_id, version: args.version)
      else
        abort("-----\n-----\n----- Data Set #{args.vs_obj} not found -----\n-----\n-----")
      end
      vs.created_by_id = new_owner[:id]
      if BOOL_OPT.nil?
        vs.updated_by_id = owner[:id]
      end
      vs.save!
    else
      case args.vs_obj
      when args.vs_obj = 'responseSet'
        vs = ResponseSet.where(version_independent_id: args.version_independent_id).sort
      when args.vs_obj = 'question'
        vs = Question.where(version_independent_id: args.version_independent_id).sort
      when args.vs_obj = 'section'
        vs = Section.where(version_independent_id: args.version_independent_id).sort
      when args.vs_obj = 'survey'
        vs = Survey.where(version_independent_id: args.version_independent_id).sort
      else
        abort("-----\n-----\n----- Data Set #{args.vs_obj} not found -----\n-----\n-----")
      end
      puts "\n-----"
      puts "Total number of version to be updated: #{vs.count}"
      vs.each do |v|
        puts "Version #{v.version} update initiated."
        v.created_by_id = new_owner[:id]
        if BOOL_OPT.nil?
          v.updated_by_id = owner[:id]
        end
        v.save!
        puts "Version #{v.version} update successful."
      end
    end
    puts "\n----- Summary of #{args.vs_obj} Changes -----"
    puts "\nPrevious Owner: #{owner[:first_name]} #{owner[:last_name]} at #{args.owner_email}"
    puts "New Owner: #{new_owner[:first_name]} #{new_owner[:last_name]} at #{args.new_owner_email}"
    puts "#{args.vs_obj} version: #{args.version}" if args.version
    puts "#{args.vs_obj} Id: #{args.version_independent_id}"
    puts "\n-----"
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
