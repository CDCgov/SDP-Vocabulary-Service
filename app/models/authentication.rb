class Authentication < ApplicationRecord
  belongs_to :user
  validates :uid, presence: true
  validates :provider, presence: true
end
