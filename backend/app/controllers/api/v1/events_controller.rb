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
    if @event
      event_json = @event.as_json
      if @event.flyer.attached?
        event_json[:flyer_url] = rails_blob_url(@event.flyer, only_path: false)
      end
      if @event.event_pictures.attached?
        event_json[:event_pictures] = @event.event_pictures.map do |pic|
          {
            id: pic.id,
            url: rails_blob_url(pic, only_path: false),
            thumbnail_url: rails_blob_url(pic.variant(resize_to_limit: [200, nil]).processed, only_path: false)
          }
        end
      end
      render json: { event: event_json }, status: :ok
    else
      render json: { error: "Evento no encontrado" }, status: :not_found
    end
  end

  # POST /api/v1/events
  def create
    @event = Event.new(event_params.except(:flyer_base64, :event_pictures_base64))
    attach_flyer_from_base64 if event_params[:flyer_base64]
    attach_event_pictures_from_base64 if event_params[:event_pictures_base64]

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

  # PATCH /api/v1/events/:id
  def update
    attach_flyer_from_base64 if event_params[:flyer_base64]
    attach_event_pictures_from_base64 if event_params[:event_pictures_base64]

    if @event.update(event_params.except(:flyer_base64, :event_pictures_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
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


  # POST /api/v1/events/:id/upload_picture
  def upload_picture
    event = Event.find_by(id: params[:id])
    unless event
      render json: { error: 'Evento no encontrado' }, status: :not_found and return
    end

    image_data = params[:image].sub(/^data:image\/\w+;base64,/, '')
    
    begin
      decoded_data = Base64.decode64(image_data)
      unique_filename = "#{SecureRandom.uuid}.jpg"

      blob = ActiveStorage::Blob.create_and_upload!(
        io: StringIO.new(decoded_data),
        filename: unique_filename,
        content_type: 'image/jpeg'
      )

      event.event_pictures.attach(blob)

      render json: {
        message: 'Imagen subida con éxito',
        id: event.event_pictures.last.id,
        url: rails_blob_url(event.event_pictures.last, only_path: true)
      }, status: :ok
    rescue => e
      Rails.logger.error("Error al subir la imagen: #{e.message}")
      render json: { error: 'Error al subir la imagen. Por favor, intenta de nuevo.' }, status: :unprocessable_entity
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

  def attach_flyer_from_base64
    decoded_image = decode_image(event_params[:flyer_base64])
    @event.flyer.attach(
      io: decoded_image[:io],
      filename: decoded_image[:filename],
      content_type: decoded_image[:content_type]
    )
  end

  def attach_event_pictures_from_base64
    event_params[:event_pictures_base64].each do |image_base64|
      decoded_image = decode_image(image_base64)
      @event.event_pictures.attach(
        io: decoded_image[:io],
        filename: decoded_image[:filename],
        content_type: decoded_image[:content_type]
      )
    end
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
