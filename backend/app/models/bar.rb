class Bar < ApplicationRecord
  belongs_to :address
  has_one_attached :image

  validates :name, presence: true
  validates :image, content_type: ['image/png', 'image/jpg', 'image/jpeg'],
                    size: { less_than: 5.megabytes }

  def thumbnail
    image.variant(resize_to_limit: [200, 200]).processed
  end
end