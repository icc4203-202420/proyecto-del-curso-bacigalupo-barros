class API::V1::FeedController < ApplicationController
  include Authenticable
  before_action :verify_jwt_token

  def index
    Rails.logger.info "Feed index called with params: #{params.inspect}"
    Rails.logger.info "Current user: #{current_user.inspect}"

    # Base query
    feed_query = FeedItem.includes(:user, reviewable: [:beer, :event])
                         .where(user: current_user.friends)

    # Aplicar filtro si está presente
    if params[:filter_by].present? && params[:filter_value].present?
      case params[:filter_by]
      when 'friend'
        feed_query = feed_query.where(user_id: params[:filter_value])
      when 'bar'
        feed_query = feed_query.joins(reviewable: :event)
                               .where(events: { bar_id: params[:filter_value] })
      when 'beer'
        feed_query = feed_query.joins(reviewable: :beer)
                               .where(beers: { id: params[:filter_value] })
      end
    end

    @feed_items = feed_query.order(created_at: :desc)
                            .limit(20)
                            .offset(params[:offset].to_i || 0)

    Rails.logger.info "Filtered feed items: #{@feed_items.map(&:inspect)}"
    render json: {
      feed_items: @feed_items.map { |item| feed_item_json(item) },
      has_more: @feed_items.size == 20
    }
  end

  private

  def feed_item_json(feed_item)
    case feed_item.activity_type
    when 'event_picture'
      {
        id: feed_item.id,
        user: {
          first_name: feed_item.user.first_name,
          last_name: feed_item.user.last_name,
          handle: feed_item.user.handle
        },
        content: {
          event_picture_id: feed_item.reviewable_id,
          event_name: feed_item.reviewable.event.name,
          event_id: feed_item.reviewable.event.id,
          bar_name: feed_item.reviewable.event.bar.name,
          bar_id: feed_item.reviewable.event.bar.id,
          description: feed_item.reviewable.description,
          image_url: url_for(feed_item.reviewable.image)
        },
        created_at: feed_item.created_at
      }
    when 'review'
      {
        id: feed_item.id,
        user: {
          first_name: feed_item.user.first_name,
          last_name: feed_item.user.last_name,
          handle: feed_item.user.handle
        },
        content: {
          beer_id: feed_item.reviewable.beer.id,
          beer_name: feed_item.reviewable.beer.name,
          global_rating: feed_item.reviewable.beer.avg_rating,
          rating: feed_item.reviewable.rating,
          text: feed_item.reviewable.text
        },
        created_at: feed_item.created_at
      }
    else
      {}
    end
  end
end
