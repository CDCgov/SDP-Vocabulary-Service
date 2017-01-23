class NotificationsController < ApplicationController
  def index
    notifications = current_user ? current_user.notifications : []
    render json: notifications
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
