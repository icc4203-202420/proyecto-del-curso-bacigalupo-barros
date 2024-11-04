class AddSummaryToEvents < ActiveRecord::Migration[7.1]
  def change
    add_column :events, :summary, :text
  end
end
