# app/models/post.rb
class Post < ApplicationRecord
    belongs_to :user
    belongs_to :postable, polymorphic: true, optional: true # Para poder asociar con bares u otros modelos
    
    validates :content, presence: true
    
    # Scope para obtener posts relevantes para un usuario
    scope :feed_for, ->(user) {
      # Obtener IDs de amigos
      friend_ids = user.friends.pluck(:id)
      
      # Obtener IDs de bares donde el usuario ha escrito
      bar_ids = Review.where(user_id: user.id).pluck(:bar_id)
      
      where(
        "(user_id IN (:friend_ids)) OR " \
        "(postable_type = 'Bar' AND postable_id IN (:bar_ids)) OR " \
        "user_id = :user_id",
        friend_ids: friend_ids,
        bar_ids: bar_ids,
        user_id: user.id
      ).order(created_at: :desc)
    }
  
    def as_json(options = {})
      super(
        options.merge(
          include: {
            user: { only: [:id, :name, :email] },
            postable: { only: [:id, :name] }
          }
        )
      )
    end
  end