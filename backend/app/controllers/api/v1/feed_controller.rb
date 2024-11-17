# app/controllers/api/v1/feed_controller.rb
class API::V1::FeedController < ApplicationController
    include Authenticable
    before_action :verify_jwt_token
  
    def index
        Rails.logger.info "Feed index called with params: #{params.inspect}"
        Rails.logger.info "Current user: #{current_user.inspect}"
      @feed_items = FeedItem.includes(:user, reviewable: :beer)
                           .where(user: current_user.friends)
                           .order(created_at: :desc)
                           .limit(20)
                           .offset(params[:offset].to_i || 0)
      Rails.logger.info "Feed items retrieved: #{@feed_items.map(&:inspect)}"
      render json: {
        feed_items: @feed_items.map { |item| feed_item_json(item) },
        has_more: @feed_items.size == 20
      }
    end
  
    private
  
    def feed_item_json(item)
      {
        id: item.id,
        type: item.activity_type,
        created_at: item.created_at,
        user: {
          id: item.user.id,
          handle: item.user.handle,
          first_name: item.user.first_name,
          last_name: item.user.last_name
        },
        content: {
          review_id: item.reviewable_id,
          text: item.reviewable.text,
          rating: item.reviewable.rating,
          beer_name: item.reviewable.beer.name,
          beer_id: item.reviewable.beer_id
        }
      }
    end
  end