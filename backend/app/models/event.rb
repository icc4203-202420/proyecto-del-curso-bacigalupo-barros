class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances, dependent: :destroy
  has_many :event_pictures, dependent: :destroy

  has_one_attached :flyer

  EVENT_DURATION = 2.hours # Ajusta esto a la duración real del evento

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end  

  def finished?
    end_time.present? && end_time < Time.current
  end  

  def video_generated?

    !!self.video_generated_attribute
  end  
end
