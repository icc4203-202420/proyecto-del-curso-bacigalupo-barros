class API::V1::UsersController < ApplicationController
  respond_to :json
<<<<<<< HEAD
  include Authenticable
  before_action :verify_jwt_token, only: [:create, :update]
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]  
=======
  before_action :set_user, only: [:show, :update]  
>>>>>>> upstream/main
  
  def index
    @users = User.includes(:reviews, :address).all   
  end

  def show
<<<<<<< HEAD
    render json: @user, include: [:address, :reviews, :friendships]
=======
  
>>>>>>> upstream/main
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    #byebug
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

<<<<<<< HEAD
  #CAMBIOS PARA FRIENDSHIP
  #GET friendships
  def friendships
    render json: @user.friendships.includes(:friend).map(&:friend)
  end

  #POST friendships
  def create_friendship
    @friendship = @user.friendships.new(friendship_params)
    if @friendship.save
      render json: @friendship, status: :created
    else
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

=======
>>>>>>> upstream/main
  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end
<<<<<<< HEAD

  def friendship_params
    params.require(:friendship).permit(:friend_id)
  end

=======
>>>>>>> upstream/main
end
