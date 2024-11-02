class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances, dependent: :destroy

  has_one_attached :flyer
  has_many_attached :event_pictures

  validates :flyer, content_type: { in: ['image/png', 'image/jpg', 'image/jpeg'],
                                    message: 'must be a valid flyer format' },
                    size: { less_than: 5.megabytes }
  validates :event_pictures, content_type: { in: ['image/png', 'image/jpg', 'image/jpeg'],
                                    message: 'must be a valid image format' },
                    size: { less_than: 5.megabytes }

  EVENT_DURATION = 2.hours # Ajusta esto a la duración real del evento

  def flyer_url
    flyer.attached? ? Rails.application.routes.url_helpers.rails_blob_url(flyer, only_path: true) : nil
  end

  def event_picture_urls
    event_pictures.map { |picture| Rails.application.routes.url_helpers.rails_blob_url(picture, only_path: true) }
  end

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
