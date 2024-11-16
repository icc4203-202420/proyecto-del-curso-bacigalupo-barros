class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.text :content, null: false
      t.references :postable, polymorphic: true, null: true
      
      t.timestamps
    end
    
    add_index :posts, [:postable_type, :postable_id]
  end
end
