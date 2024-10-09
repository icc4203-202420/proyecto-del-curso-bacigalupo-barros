class API::V1::BarsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_bar, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      @bars = Bar.joins(:address)
                 .where("bars.name ILIKE :query OR 
                         addresses.city ILIKE :query OR 
                         addresses.line1 ILIKE :query OR 
                         addresses.line2 ILIKE :query OR 
                         addresses.country ILIKE :query", query: search_term)
    else
      @bars = Bar.all
    end
    render json: { bars: @bars.as_json(include: :address) }, status: :ok
  end


  def show
    if @bar.image.attached?
      render json: @bar.as_json.merge({ 
        image_url: url_for(@bar.image), 
        thumbnail_url: url_for(@bar.thumbnail) }),
        status: :ok
    else
      render json: { bar: @bar.as_json }, status: :ok
    end
  end

  def create
    @bar = Bar.new(bar_params.except(:image_base64))
    handle_image_attachment if bar_params[:image_base64]

    if @bar.save
      render json: { bar: @bar, message: 'Bar created successfully.' }, status: :ok
    else
      render json: @bar.errors, status: :unprocessable_entity
    end
  end
  
  def update
    handle_image_attachment if bar_params[:image_base64]

    if @bar.update(bar_params.except(:image_base64))
      render json: { bar: @bar, message: 'Bar updated successfully.' }, status: :ok
    else
      render json: @bar.errors, status: :unprocessable_entity
    end
  end

  # Método para eliminar un bar existente
  def destroy
    if @bar.destroy
      render json: { message: 'Bar successfully deleted.' }, status: :no_content
    else
      render json: @bar.errors, status: :unprocessable_entity
    end
  end 
  
  def search
    country = params[:country]
    city = params[:city]
    street = params[:street]
    number = params[:number]

    @bars = Bar.all
    @bars = @bars.joins(:address).where('addresses.country ILIKE ?', "%#{country}%") if country.present?
    @bars = @bars.joins(:address).where('addresses.city ILIKE ?', "%#{city}%") if city.present?
    @bars = @bars.joins(:address).where('addresses.street ILIKE ?', "%#{street}%") if street.present?
    @bars = @bars.joins(:address).where('addresses.number ILIKE ?', "%#{number}%") if number.present?

    render json: { bars: @bars }
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_bar
    @bar = Bar.find_by(id: params[:id])
    render json: { error: 'Bar not found' }, status: :not_found unless @bar
  end

  def bar_params
    params.require(:bar).permit(
      :name, :latitude, :longitude, :image_base64, :address_id,
      address_attributes: [:user_id, :line1, :line2, :city, country_attributes: [:name]]
    )
  end

  def handle_image_attachment
    decoded_image = decode_image(bar_params[:image_base64])
    @bar.image.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end  
end