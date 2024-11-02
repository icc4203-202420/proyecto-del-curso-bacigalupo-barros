# app/jobs/event_summary_job.rb
class EventSummaryJob < ApplicationJob
    queue_as :default
  
    def perform(event_id)
      event = Event.find(event_id)
      images = event.event_pictures.pluck(:path) # Obtiene las rutas de las imágenes
      output_video_path = Rails.root.join("public/videos/event_#{event_id}_summary.mp4")
  
      # Ejecuta ffmpeg para crear el slideshow
      `ffmpeg -framerate 1/3 -pattern_type glob -i '#{images.join(' ')}' -c:v libx264 #{output_video_path}`
  
      # Marca el evento como "video generado"
      event.update(video_generated: true, video_url: "/videos/event_#{event_id}_summary.mp4")
  
      # Notifica a los usuarios
      event.attendees.each do |user|
        NotificationService.send_event_summary_notification(user, event) # Implementa este servicio de notificaciones
      end
    end
  end
  