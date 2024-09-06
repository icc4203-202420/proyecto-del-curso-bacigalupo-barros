class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_review, only: [:show, :update, :destroy]

  def index
    if params[:beer_id]
      @beer = Beer.find(params[:beer_id])
      @reviews = @beer.reviews.includes(:user)
      user_review = @reviews.find_by(user: current_user)
  
      render json: {
        reviews: @reviews.as_json(include: { user: { only: [:id, :first_name, :last_name] } }),
        user_review: user_review,
        average_rating: @beer.avg_rating
      }
    else
      @reviews = Review.all
      render json: @reviews
    end
  end
  

  def create
    @beer = Beer.find(params[:beer_id])
    @review = @beer.reviews.new(review_params)
    @review.user = current_user

    if @review.save
      render json: @review, status: :created
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find(params[:id])
  end

  def review_params
    params.require(:review).permit(:text, :rating)
  end
end
