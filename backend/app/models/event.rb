class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances, dependent: :destroy

  has_one_attached :flyer
  has_many_attached :event_pictures

  validates :flyer, content_type: { in: ['image/png', 'image/jpg', 'image/jpeg'],
                                    message: 'must be a valid flyer format' },
                    size: { less_than: 5.megabytes }
  validates :event_pictures, content_type: { in: ['image/png', 'image/jpg', 'image/jpeg'],
                                    message: 'must be a valid image format' },
                    size: { less_than: 5.megabytes }

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end  
end
