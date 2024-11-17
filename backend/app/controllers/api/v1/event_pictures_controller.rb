class API::V1::EventPicturesController < ApplicationController
    include ImageProcessing
    before_action :set_event, only: [:create]
    
    def create
      Rails.logger.debug "Params: #{params.inspect}"
      @event_picture = @event.event_pictures.new(event_picture_params)
      @event_picture.user = User.find(params["user_id"].to_i)
  
      if @event_picture.save
        # Enviar notificaciones push al usuario que subió la imagen
        if @event_picture.user.push_token.present?
          PushNotificationService.send_notification(
            to: @event_picture.user.push_token,
            title: "Imagen subida con éxito!",
            body: "Tu imagen ha sido subida exitosamente al evento #{@event.name}.",
            data: { event_id: @event.id }
          )
        end
  
        # Enviar notificaciones push a los amigos del usuario que subió la imagen
        friends = @event_picture.user.friends
        friends.each do |friend|
          next unless friend.push_token.present?
          PushNotificationService.send_notification(
            to: friend.push_token,
            title: "#{@event_picture.user.handle} ha subido una nueva imagen al evento!",
            body: "#{@event_picture.user.handle} ha subido una imagen al evento #{@event.name}.",
            data: { event_id: @event.id }
          )
        end
  
        render json: { message: 'Imagen subida exitosamente.' }, status: :created
      else
        Rails.logger.debug @event_picture.errors.full_messages
        render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
    def handle_image_attachment
      decode_image = decode_image(event_params[:image_base64])
      @event.flyer.attach(io: decoded_image[:io],
          filename: decode_image[:filename],
          content_type: decoded_image[:content_type]
      )
    end
    
    def set_event
      @event = Event.find(params[:event_id])
    end
    
    def event_picture_params
      params.require(:event_picture).permit(:image, :description)
    end
  end
  