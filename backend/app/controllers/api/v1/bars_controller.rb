class API::V1::BarsController < ApplicationController
  respond_to :json
  before_action :set_bar, only: [:show, :update, :destroy]

  def index
    @bars = Bar.all
    render json: @bars
  end

  def show
    render json: @bar.as_json.merge({ 
      image_url: url_for(@bar.image), 
      thumbnail_url: url_for(@bar.thumbnail) }),
      status: :ok
  end

  def create
    @bar = Bar.new(bar_params.except(:image_base64, :thumbnail_base64))
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

  private
  include ImageProcessing

  # Use callbacks to share common setup or constraints between actions.
  def set_bar
    @bar = Bar.find(params[:id])
  end

  def bar_params
    params.require(:bar).permit(:name, :address_id, :latitude, :longitude, :image_base64)
  end

  def handle_image_attachment
    decoded_image = decode_image(bar_params[:image_base64])
    @bar.image.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end  
end