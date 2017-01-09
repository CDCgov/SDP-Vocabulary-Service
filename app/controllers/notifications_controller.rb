class NotificationsController < ApplicationController
  def index
    notifications = current_user ? current_user.notifications : []
    render json: notifications
  end

  def new
    notification = Notification.new(user_id: current_user.id, url: 'localhost:3000/questions', message: 'Hey whats up?')
    notification.save
    render json: notification
  end

  def mark_read
    notifications = current_user.notifications.find(params[:ids])
    notifications.each do |note|
      note.read = true
      note.save
    end
    render plain: '', status: 200
  end
end
