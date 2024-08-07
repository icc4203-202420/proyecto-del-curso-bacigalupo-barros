class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
    :recoverable, :validatable, 
    :jwt_authenticatable, 
    jwt_revocation_strategy: self

  validates :first_name, :last_name, presence: true, length: { minimum: 2 }
  validates :email, email: true
  has_many :reviews
  has_many :beers, through: :reviews
  has_one :address

  accepts_nested_attributes_for :reviews, allow_destroy: true
  accepts_nested_attributes_for :address, allow_destroy: true
end
