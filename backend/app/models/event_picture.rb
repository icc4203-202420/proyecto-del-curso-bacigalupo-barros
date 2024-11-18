class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  has_one_attached :image
  has_one :feed_item, as: :reviewable, dependent: :destroy

  after_create :create_feed_item

  private

  def create_feed_item
    FeedItem.create!(
      user: self.user,
      reviewable: self,
      activity_type: 'event_picture'
    )
  end
end