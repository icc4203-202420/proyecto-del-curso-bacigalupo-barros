class Beer < ApplicationRecord
  belongs_to :brand
  has_many :countries, through: :brand
  has_many :breweries, through: :brand
  has_many :reviews
  has_many :users, through: :reviews

  validates :name, presence: true
  validates :image, content_type: ['image/png', 'image/jpg', 'image/jpeg'],
                    size: { less_than: 5.megabytes }

  def thumbnail
    image.variant(resize_to_limit: [200, 200]).processed
  end

  def update_avg_rating
    if reviews.any?
      update(avg_rating: reviews.average(:rating).to_f)
    else
      update(avg_rating: 0.0)
    end
  end  
end
