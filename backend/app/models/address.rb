class Address < ApplicationRecord
  belongs_to :country, optional: true
  belongs_to :user

  accepts_nested_attributes_for :country 
end
