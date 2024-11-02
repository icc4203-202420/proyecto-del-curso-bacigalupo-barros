class AddVideoFieldsToEvents < ActiveRecord::Migration[7.1]
  def change
    add_column :events, :video_generated, :boolean
    add_column :events, :video_url, :string
  end
end
