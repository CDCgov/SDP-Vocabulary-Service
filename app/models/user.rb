# rubocop:disable Rails/HasAndBelongsToMany
class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, omniauth_providers: [:openid_connect]

  validates :email, uniqueness: true, case_sensitive: false
  has_many :authentications
  has_and_belongs_to_many :groups

  belongs_to :last_system, class_name: 'SurveillanceSystem'
  belongs_to :last_program, class_name: 'SurveillanceProgram'

  def apply_omniauth(omniauth)
    self.email = omniauth['info']['email'] if email.blank? && omniauth['info']
    self.first_name = omniauth['info']['given_name'] if omniauth['info']['given_name'] && !omniauth['info']['given_name'].blank?
    self.last_name = omniauth['info']['family_name'] if omniauth['info']['family_name'] && !omniauth['info']['family_name'].blank?
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

  def admin?
    has_role?(:admin)
  end

  def publisher?
    has_role?(:publisher)
  end

  def author?
    has_role?(:author)
  end
end
# rubocop:enable Rails/HasAndBelongsToMany
