class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, omniauth_providers: [:openid_connect]

  validates :email, uniqueness: true, case_sensitive: false
  has_many :authentications

  belongs_to :last_system, class_name: SurveillanceSystem
  belongs_to :last_program, class_name: SurveillanceProgram

  def apply_omniauth(omniauth)
    self.email = omniauth['info']['email'] if email.blank? && omniauth['info']
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
