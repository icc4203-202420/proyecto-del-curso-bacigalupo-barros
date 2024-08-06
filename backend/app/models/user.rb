class User < ApplicationRecord
  validates :first_name, :last_name, presence: true, length: { minimum: 2 }
  validates :email, email: true
  has_many :reviews
  has_many :beers, through: :reviews
  has_one :address

  accepts_nested_attributes_for :reviews, allow_destroy: true
  accepts_nested_attributes_for :address, allow_destroy: true
end
