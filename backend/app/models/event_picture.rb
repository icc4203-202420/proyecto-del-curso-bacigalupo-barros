class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  has_many :photo_tags
  has_many :tagged_users, through: :photo_tags, source: :user

  has_one_attached :image

  validates :image, content_type: { in: ['image/png', 'image/jpg', 'image/jpeg'],
                                     message: 'must be a valid image format' },
                    size: { less_than: 5.megabytes }
end
