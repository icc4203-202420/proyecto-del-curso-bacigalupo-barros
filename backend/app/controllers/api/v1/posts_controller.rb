# app/controllers/api/v1/posts_controller.rb
module Api
    module V1
      class PostsController < ApplicationController
        def index
          @posts = Post.feed_for(current_user).includes(:user, :postable)
          render json: @posts
        end
  
        def create
          @post = if params[:post][:bar_id]
            bar = Bar.find(params[:post][:bar_id])
            current_user.posts.build(post_params.merge(postable: bar))
          else
            current_user.posts.build(post_params)
          end
  
          if @post.save
            broadcast_post
            render json: @post, status: :created
          else
            render json: @post.errors, status: :unprocessable_entity
          end
        end
  
        private
  
        def post_params
          params.require(:post).permit(:content, :bar_id)
        end
  
        def broadcast_post
          # Transmitir a amigos
          current_user.friends.each do |friend|
            ActionCable.server.broadcast(
              "feed_channel_#{friend.id}",
              { post: @post.as_json }
            )
          end
  
          # Si el post está asociado a un bar, transmitir a usuarios relacionados
          if @post.postable_type == 'Bar'
            User.joins(:reviews)
                .where(reviews: { bar_id: @post.postable_id })
                .where.not(id: current_user.id)
                .distinct
                .each do |user|
              ActionCable.server.broadcast(
                "feed_channel_#{user.id}",
                { post: @post.as_json }
              )
            end
          end
        end
      end
    end
  end