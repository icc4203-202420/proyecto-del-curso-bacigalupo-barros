#events_controller.rb

class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable
  before_action :verify_jwt_token, only: [:create, :update, :destroy]
  before_action :set_event, only: [:show, :update, :destroy]
  before_action :set_bar, only: [:index]
  respond_to :json
  #flyer = image
  
  #comentar si es que falla
  def index
      if @bar
          events = @bar.events
          render json: { events: events }, status: :ok
        else
          events = Event.all
          render json: { events: events }, status: :ok
        end
  end

  #GET /api/v1/events/:id
  # app/controllers/api/v1/events_controller.rb
def show
  if @event
    event_json = @event.as_json

    if @event.flyer.attached?
      event_json.merge!(flyer_url: rails_blob_url(@event.flyer, only_path: false))
    end

    if @event.event_pictures.attached?
      event_json.merge!(
        event_pictures: @event.event_pictures.map do |pic|
          {
            id: pic.id, # Incluye el ID de la imagen aquí
            url: rails_blob_url(pic, only_path: false), # URL completa de la imagen
            thumbnail_url: rails_blob_url(pic.variant(resize_to_limit: [200, nil]).processed, only_path: false)
          }
        end
      )
    end

    render json: { event: event_json }, status: :ok
  else
    render json: { error: "Evento no encontrado" }, status: :not_found
  end
end


  #POST /api/v1/events
  def create
      @event = Event.new(event_params.except(:flyer_base64, :event_pictures_base64))
      
      handle_flyer_attachment if event_params[:flyer_base64]
      handle_event_pictures_attachments if event_params[:event_pictures_base64]
      
      if @event.save
        render json: {
          event: @event.as_json.merge(
            flyer_url: @event.flyer.attached? ? rails_blob_url(@event.flyer, only_path: false) : nil,
            event_pictures: @event.event_pictures.map { |pic| rails_blob_url(pic, only_path: false) }
          ),
          message: 'Event created successfully.'
        }, status: :created
      else
        Rails.logger.error(@event.errors.full_messages)
        render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
  #PATCH /api/v1/events
  def update
      handle_flyer_attachment if event_params[:flyer_base64]
      handle_event_pictures_attachments if event_params[:event_pictures_base64]
      
      if @event.update(event_params.except(:flyer_base64, :event_pictures_base64))
        render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
      else
        render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end

  #DELETE /api/v1/events/:id
  def destroy
      if @event.destroy
          render json: { message: 'Event successfully deleted.' }, status: :no_content
      else
          render json: @event.errors, status: :unprocessable_entity
      end
  end
  
  def upload_picture
      event = Event.find(params[:id])
      
      if params[:image].present?
        event.event_pictures.attach(params[:image])
        if event.save
          render json: { message: 'Imagen subida exitosamente', picture_url: rails_blob_url(event.event_pictures.last) }, status: :ok
        else
          render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { errors: 'No image provided' }, status: :unprocessable_entity
      end
    end
    
  private
  
  def set_event
      @event = Event.find_by(id: params[:id])
      render json: { error: 'Event not found' }, status: :not_found if @event.nil?
  end
  
  def set_bar
      return unless params[:bar_id]
      @bar = Bar.find(params[:bar_id])
      render json: { error: 'Bar not found' }, status: :not_found if @bar.nil?
  end
  
  def event_params
      params.require(:event).permit(:name, :description, :date, :bar_id, :flyer_base64, :start_date, :end_date, event_pictures_base64: [])
  end

  def picture_params
      params.require(:image).permit(:image) 
  end

  def handle_flyer_attachment
      decoded_image = decode_image(event_params[:flyer_base64])
      @event.flyer.attach(
        io: decoded_image[:io], 
        filename: decoded_image[:filename], 
        content_type: decoded_image[:content_type]
      )
    end
  
    def handle_event_pictures_attachments
      event_params[:event_pictures_base64].each do |image_base64|
        decoded_image = decode_image(image_base64)
        @event.event_pictures.attach(
          io: decoded_image[:io], 
          filename: decoded_image[:filename], 
          content_type: decoded_image[:content_type]
        )
      end
    end
  
  def verify_jwt_token
      authenticate_user!
      head :unauthorized unless current_user
  end
end