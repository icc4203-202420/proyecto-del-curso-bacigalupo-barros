class CreatePhotoTags < ActiveRecord::Migration[6.1]
  def change
    create_table :photo_tags do |t|
      t.references :event_picture, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :photo_tags, [:event_picture_id, :user_id], unique: true
  end
end
