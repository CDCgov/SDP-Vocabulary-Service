class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  has_many :notifications

  def full_name
    fn = "#{first_name} #{last_name}"
    fn.strip.blank? ? email : fn
  end
end
