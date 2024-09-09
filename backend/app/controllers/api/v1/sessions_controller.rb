class API::V1::SessionsController < Devise::SessionsController
  include ::RackSessionsFix
  respond_to :json

  private
  def respond_with(current_user, _opts = {})
    token = encode_token({ sub: resource.id, jti: current_user.jti, scp: 'user' })

    render json: {
      status: {
        code: 200,
        message: 'Logged in successfully.',
        data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] },
        token: token
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      begin
        token = request.headers['Authorization'].split(' ').last
        jwt_payload = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key, true, { algorithm: 'HS256' }).first
        current_user = User.find(jwt_payload['sub'])

        if current_user
          render json: { status: 200, message: 'Logged out successfully.' }, status: :ok
        else
          render json: { status: 401, message: "Couldn't find an active session." }, status: :unauthorized
        end
      rescue JWT::DecodeError, JWT::ExpiredSignature
        render json: { status: 401, message: 'Invalid or expired token.' }, status: :unauthorized
      end
    else
      render json: { status: 401, message: 'Authorization header missing.' }, status: :unauthorized
    end
  end

  private

  def encode_token(payload)
    payload[:iat] = Time.now.to_i
    payload[:exp] = (Time.now + 24.hours).to_i
    payload[:aud] = nil 
    JWT.encode(payload, Rails.application.credentials.devise_jwt_secret_key, 'HS256')
  end
end
