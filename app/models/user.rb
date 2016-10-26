class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, omniauth_providers: [:openid_connect, :developer, :google_oauth2]

  validates :email, uniqueness: true, case_sensitive: false
  has_many :authentications

  def apply_omniauth(omniauth)
    self.email = omniauth['info']['email'] if email.blank?
    authentications.build(provider: omniauth['provider'], uid: omniauth['uid'])
  end

  def password_required?
    (authentications.empty? || !password.blank?) && super
  end

  has_many :notifications

  def full_name
    fn = "#{first_name} #{last_name}"
    fn.strip.blank? ? email : fn
  end

end
