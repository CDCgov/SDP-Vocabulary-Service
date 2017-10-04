class RemoveAdminFromUsers < ActiveRecord::Migration[5.1]
  def up
    users = User.where(admin: true)
    users.each do |user|
      user.add_role :admin
    end
    remove_column :users, :admin, :boolean
  end

  def down
    add_column :users, :admin, :boolean, default: false
    users = User.with_role(:admin).preload(:roles)
    users.each do |user|
      user.admin = true
    end
  end
end
