class API::V1::AttendancesController < ApplicationController
    include Authenticable
    before_action :set_event
    #check in de los users
    def create
      attendance = Attendance.find_or_initialize_by(user: current_user, event: @event)  
    
      if attendance.checked_in
        render json: { message: "Ya has confirmado tu asistencia." }, status: :unprocessable_entity
      elsif attendance.check_in
        if current_user.push_token.present?
          PushNotificationService.send_notification(
            to: current_user.push_token,
            title: "Has confirmado tu asistencia al evento!",
            body: "Estaremos esperándote en el evento #{@event.name}.",
            data: {}
          )
        end
    
        # Notificaciones a los amigos del usuario
        friends = current_user.friends
        friends.each do |friend|
          next unless friend.push_token.present? 
          PushNotificationService.send_notification(
            to: friend.push_token,
            title: "#{current_user.handle} participará en un evento!",
            body: "#{current_user.handle} ha confirmado su asistencia al evento #{@event.name}.",
            data: { event_id: @event.id }
          )
        end
    
        render json: { message: "Has confirmado tu asistencia y tus amigos han sido notificados." }, status: :ok
      else
        render json: { errors: attendance.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
  
    def index
      attendances = @event.attendances.includes(:user)
      render json: attendances.map { |u| { user_id: u.user.id, first_name: u.user.first_name, last_name: u.user.last_name, handle: u.user.handle, checked_in: u.checked_in } }
    end
  
    private
  
    def set_event
      @event = Event.find(params[:event_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Evento no encontrado" }, status: :not_found
    end
  end
  