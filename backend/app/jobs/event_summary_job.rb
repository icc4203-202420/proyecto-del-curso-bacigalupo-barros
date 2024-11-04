class EventSummaryJob < ApplicationJob
  queue_as :default

  def perform(event_id)
    event = Event.find(event_id)
    images = event.event_pictures.map do |pic|
      ActiveStorage::Blob.service.send(:path_for, pic.blob.key)
    end

    # Verifica que haya imágenes antes de continuar
    if images.empty?
      Rails.logger.error "No hay imágenes adjuntas para el evento #{event_id}."
      return
    end

    output_video_path = Rails.root.join("public/videos/event_#{event_id}_summary.mp4")

    `ffmpeg -framerate 1/3 -pattern_type glob -i '#{images.join(' ')}' -c:v libx264 #{output_video_path}`
    event.update(video_generated: true, video_url: "/videos/event_#{event_id}_summary.mp4")

    # Notifica a los usuarios
    event.attendees.each do |user|
      NotificationService.send_event_summary_notification(user, event)
    end
  end
end
