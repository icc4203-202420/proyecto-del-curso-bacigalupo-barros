Rails.application.routes.draw do
  get 'current_user', to: 'current_user#index'
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations',
  }

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :bars do
        resources :events do
          resources :attendances, only: [:create, :index]
        end
      end
      resources :events do
        post 'upload_picture', on: :member
        resources :attendances, only: [:create, :index]
      end
      resources :reviews, only: [:create, :update, :destroy]
      resources :beers do
        resources :reviews
      end
      resources :users do
        resources :reviews
        member do
          get :friendships
          post :friendships, action: :create_friendship
        end
        resources :friendships, only: [:index, :create]
      end
      resources :event_pictures do
        member do
          post 'tag_user'
        end
      end
    end
  end
end