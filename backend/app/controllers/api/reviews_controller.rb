class API::V1::ReviewsController < ApplicationController
  before_action :set_review, only: [:show, :update]  
  before_action :set_user, only: [:index, :create, :show, :update]  
  
  def index
    @reviews = Review.where(user: @user)   
  end

  def show
  
  end

  def create
    @review = Review.new(review_params)
    @review.user = @user
    if @review.save
      render :show, status: :created, location: api_v1_user_reviews_path(@review)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def update
    @review.user = @user
    if @review.update(review_params)
      render :show, status: :ok, location: api_v1_user_reviews_path(@review)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  private

  def set_review
    @review = Review.find(params[:id])
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  def review_params
    params.fetch(:review, {}).
        permit(:text, :rating, :beer_id, :user_id)
  end
end