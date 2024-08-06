class Review < ApplicationRecord
  after_create :increment_review_count_callback
  after_destroy :decrement_review_count_callback
  belongs_to :user
  belongs_to :beer

  private

  def increment_review_count_callback
    rc = ReviewCounter.first
    rc.count += 1
    rc.save
  end

  def decrement_review_count_callback
    rc = ReviewCounter.first
    rc.count -= 1
    rc.save
  end

end
