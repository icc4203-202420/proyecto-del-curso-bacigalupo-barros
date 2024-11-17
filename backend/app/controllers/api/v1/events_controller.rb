require 'tempfile'
class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable
  before_action :verify_jwt_token, only: [:create, :update, :destroy]
  before_action :set_event, only: [:show, :update, :destroy]
  before_action :set_bar, only: [:index]
  respond_to :json

  # GET /api/v1/events
  def index
    if @bar
      events = @bar.events
    else
      events = Event.all
    end
    render json: { events: events }, status: :ok
  end

  # GET /api/v1/events/:id
  def show
    @event_pictures = @event.event_pictures.includes(:user)    
    event_pictures_data = @event_pictures.map do |picture|
      { 
        id: picture.id, 
        description: picture.description, 
        image_url: url_for(picture.image),
        user_handle: picture.user.handle
     }
    end
  
    if @event.flyer.attached?
      render json: @event.as_json.merge({
        image_url: url_for(@event.image),
        thumbnail_url: url_for(@event.thumbnail)
      }), status: :ok
    else
      render json: { 
        event: @event.as_json, 
        event_pictures: event_pictures_data
      }, status: :ok
    end
  end

  # POST /api/v1/events
  def create
    @event = Event.new(event_params.except(:image_base64))
    handle_image_attachment if event_params[:image_base64]

    if @event.save
        render json: { event: @event, message: 'Event created successfully.' }, status: :created
    else
        render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
      handle_image_attachment if event_params[:image_base64]

      if @event.update(event_params.except(:image_base64))
          render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
      else
          render json: @event.errors, status: :unprocessable_entity
      end
  end

  # DELETE /api/v1/events/:id
  def destroy
    if @event.destroy
      render json: { message: 'Event successfully deleted.' }, status: :no_content
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # POST /api/v1/events/:id/generate_summary
  def generate_summary
    event = Event.find(params[:id])
    if event.finished? && event.video_generated == false
      EventSummaryJob.perform_later(event.id)
      render json: { message: "Resumen en proceso. Recibirás una notificación cuando esté listo." }, status: :accepted
    else
      errors = []
      errors << "Evento no terminado." unless event.finished?
      errors << "Resumen ya generado." if event.video_generated
      Rails.logger.error("Errores de procesamiento: #{errors.join(', ')}") # Agregar log para más detalle
      render json: { error: errors.join(" ") }, status: :unprocessable_entity
    end
  end
  
  

  # GET /api/v1/events/:id/summary
  def summary
    event = Event.find_by(id: params[:id])

    if event.nil?
      render json: { error: 'Evento no encontrado' }, status: :not_found
    elsif event.summary.present?
      render json: { summary: event.summary }, status: :ok
    else
      render json: { message: 'El resumen aún no está disponible. Por favor, intenta de nuevo más tarde.' }, status: :accepted
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
    params.require(:event).permit(:name, :description, :date, :bar_id, :flyer_base64, :start_date, :end_date, :image_base64)
  end

  def attach_flyer_from_base64
    decoded_image = decode_image(event_params[:flyer_base64])
    @event.flyer.attach(
      io: decoded_image[:io],
      filename: decoded_image[:filename],
      content_type: decoded_image[:content_type]
    )
  end

  def handle_image_attachment
    decode_image = decode_image(event_params[:image_base64])
    @event.flyer.attach(io: decoded_image[:io],
        filename: decode_image[:filename],
        content_type: decoded_image[:content_type]
    )
  end

  def decode_image(base64_string)
    image_data = base64_string.sub(/^data:image\/\w+;base64,/, '')
    decoded_data = Base64.decode64(image_data)
    {
      io: StringIO.new(decoded_data),
      filename: "#{SecureRandom.uuid}.jpg",
      content_type: 'image/jpeg'
    }
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end
end
