class Notification < ApplicationRecord
  belongs_to :user
  scope :read, -> { where read: true }
  scope :unread, -> { where read: false }

  validates :user, presence: true
  validates :message, presence: true
  validates :url, presence: true
  validate :user_message_url_did_not_change

  # regardless of what it was created with set the notifications
  # read status to false
  before_create do |note|
    note.read = false
  end

  # centralized method for creating the same notification for
  # more than one user
  def self.notify_users(users, message, url)
    users.each do |u|
      create(user: u, message: message, url: url)
    end
  end

  private

  # Overkill method to ensure that the user message and url do not change on update
  def user_message_url_did_not_change
    errors.add(:user, 'change not allowed!') if user_id_changed? && persisted?
    if message_changed? && persisted?
      errors.add(:message, 'change not allowed!')
    end
    errors.add(:url, 'change not allowed!') if url_changed? && persisted?
  end
end
