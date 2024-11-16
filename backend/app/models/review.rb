class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  validates :text, presence: true, length: { minimum: 15, tokenizer: lambda { |str| str.split(/\s+/) } }
  validates :rating, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }

  after_save :update_beer_rating
  after_destroy :update_beer_rating
  has_one :feed_item, as: :reviewable, dependent: :destroy
  after_create :create_feed_item

  private

  def create_feed_item
    FeedItem.create!(
      user: self.user,
      reviewable: self,
      activity_type: 'review'
    )
  end
  
  def update_beer_rating
    beer.update_avg_rating
  end
end
