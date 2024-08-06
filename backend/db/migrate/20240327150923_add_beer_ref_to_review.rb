class AddBeerRefToReview < ActiveRecord::Migration[6.1]
  def change
    add_reference :reviews, :beer, null: false, foreign_key: true
  end
end
