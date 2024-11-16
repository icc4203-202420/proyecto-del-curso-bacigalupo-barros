# db/migrate/[timestamp]_create_feed_items.rb
class CreateFeedItems < ActiveRecord::Migration[7.0]
  def change
    create_table :feed_items do |t|
      t.references :user, null: false, foreign_key: true
      t.references :reviewable, polymorphic: true, null: false
      t.string :activity_type, null: false

      t.timestamps
    end

    add_index :feed_items, [:reviewable_type, :reviewable_id]
    add_index :feed_items, :created_at
  end
end