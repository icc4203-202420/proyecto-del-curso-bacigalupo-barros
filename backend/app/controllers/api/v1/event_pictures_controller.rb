class API::V1::EventPicturesController < ApplicationController
    def tag_user
        Rails.logger.info "Event Picture ID received: #{params[:id]}"
        Rails.logger.info "User ID received: #{params[:user_id]}"
    
        begin
            @event_picture = EventPicture.find(params[:id])
            @user = User.find(params[:user_id])
    
            @photo_tag = PhotoTag.new(event_picture: @event_picture, user: @user)
    
            if @photo_tag.save
                render json: @photo_tag, status: :created
            else
                render json: @photo_tag.errors, status: :unprocessable_entity
            end
        rescue ActiveRecord::RecordNotFound => e
            render json: { error: e.message }, status: :not_found
        end
    end
end
