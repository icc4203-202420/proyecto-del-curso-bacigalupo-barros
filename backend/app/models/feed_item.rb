# app/models/feed_item.rb
class FeedItem < ApplicationRecord
    belongs_to :user
    belongs_to :reviewable, polymorphic: true
  
    validates :activity_type, presence: true
    
    scope :for_user, ->(user) {
      where(user_id: user.friend_ids)
    }
  end