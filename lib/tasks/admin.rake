
namespace :admin do
  # Create a new user for the system
  task :create_user, [:email, :password, :admin] => :environment do |_t, args|
    user = User.find_by(email: args.email)
    if user
      user = User.create(email: args.email, password: args.password, password_confirmation: args.password)
      user.admin = args.admin == 'true'
    else
      puts "User with email address #{args.email} already exists"
    end
  end

  # Add an adminstrative user
  task :grant_admin, [:email] => :environment do |_t, args|
    user = User.find_by(email: args.email)
    if user
      user.admin = true
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
      user.admin = false
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
end
