class Bar < ApplicationRecord
  belongs_to :address
  has_many :events
  has_many :friendships
  
  has_one_attached :image

  validates :name, presence: true
  validates :image, content_type: { in: ['image/png', 'image/jpg', 'image/jpeg'],
                                    message: 'must be a valid image format' },
                    size: { less_than: 5.megabytes }

  def thumbnail
    image.variant(resize_to_limit: [200, 200]).processed
  end
end