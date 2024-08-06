class Beer < ApplicationRecord
  belongs_to :brand
  has_many :countries, through: :brand
  has_many :breweries, through: :brand
  has_many :reviews
  has_many :users, through: :reviews
end
