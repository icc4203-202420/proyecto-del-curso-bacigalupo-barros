# app/channels/application_cable/connection.rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      Rails.logger.info "Attempting to connect with user_id: #{request.params[:user_id]}"
      self.current_user = find_verified_user
      Rails.logger.info "Connected user: #{current_user.inspect}" if current_user
    end

    private

    def find_verified_user
      if verified_user = User.find_by(id: request.params[:user_id])
        verified_user
      else
        reject_unauthorized_connection
      end
    end
  end
end