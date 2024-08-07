class API::V1::BeersController < ApplicationController
  respond_to :json
  before_action :set_beer, only: [:show, :update, :destroy]

  # GET /beers
  def index
    @beers = Beer.all
    render json: @beers
  end

  # def index
  #   @beers = Rails.cache.fetch("beers", expires_in: 12.hours) do
  #     Beer.includes(:brand, :brewery).all
  #   end
  #   render json: @beers
  # end
  
  # GET /beers/:id
  def show
    render json: @beer
  end

  # POST /beers
  def create
    @beer = Beer.new(beer_params)
    if @beer.save
      render json: @beer, status: :created, location: api_v1_beer_url(@beer)
    else
      render json: @beer.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /beers/:id
  def update
    if @beer.update(beer_params)
      render json: @beer
    else
      render json: @beer.errors, status: :unprocessable_entity
    end
  end

  # DELETE /beers/:id
  def destroy
    @beer.destroy
    head :no_content
  end

  private

  def set_beer
    @beer = Beer.find(params[:id])
  end

  def beer_params
    params.require(:beer).permit(:name, :beer_type, :style, :hop, :yeast, :malts, :ibu, :alcohol, :blg, :brand_id, :avg_rating)
  end
end
