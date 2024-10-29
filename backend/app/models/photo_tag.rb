class PhotoTag < ApplicationRecord
    belongs_to :event_picture
    belongs_to :user
  
    validates :user_id, uniqueness: { scope: :event_picture_id, message: "Ya está etiquetado en esta foto" }
end
  

  
