class Friendship < ApplicationRecord
  belongs_to :user
  belongs_to :friend, class_name: 'User'
  belongs_to :bar, optional: true

  validates :user_id, presence: true
  validates :friend_id, presence: true
  #prevent duplicates
  validates :friend_id, uniqueness: { scope: :user_id }

  validate :cannot_be_self_friend

  private

  def cannot_be_self_friend
    errors.add(:friend_id, "can't be the same as user") if user_id == friend_id
  end
end
