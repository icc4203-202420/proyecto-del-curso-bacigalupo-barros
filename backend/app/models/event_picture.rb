class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  validates :image, content_type: { in: ['image/png', 'image/jpg', 'image/jpeg'],
                                     message: 'must be a valid image format' },
                    size: { less_than: 5.megabytes }
end
