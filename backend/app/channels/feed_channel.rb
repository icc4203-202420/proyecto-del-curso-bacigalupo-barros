# app/channels/feed_channel.rb
class FeedChannel < ApplicationCable::Channel
    def subscribed
      Rails.logger.info "User subscribed to FeedChannel: #{current_user.inspect}"
      stream_for current_user
    end
  
    def unsubscribed
      Rails.logger.info "User unsubscribed from FeedChannel: #{current_user.inspect}"
      stop_all_streams
    end
  end