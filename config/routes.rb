Rails.application.routes.draw do
  get '/landing' => 'landing#index'
  get '/landing/stats' => 'landing#stats'

  root to: 'dashboard#index'

  devise_for :users, controllers: { registrations: 'registrations',
                                    omniauth_callbacks: 'users/omniauth_callbacks' }
  resources :authentications
  get '/mystuff' => 'mystuff#index'
  resources :form_questions
  resources :forms, except: [:edit, :update] do # No editing/updating on response sets, we only revise them
    get :export, on: :member
    get :revise, on: :member
    get :redcap, on: :member
  end
  resources :question_response_sets
  resources :responses
  resources :concepts
  resources :questions, except: [:edit, :update] do
    get :revise, on: :member
  end

  resources :comments do
    post :reply_to, on: :member
  end
  resources :question_types

  resources :response_sets, except: [:edit, :update] # No editing/updating on response sets, we only revise them

  get 'notifications', to: 'notifications#index', as: :notifications
  post 'notifications/mark_read', to: 'notifications#mark_read', as: :notifications_mark_read

  namespace :api, defaults: { format: :json } do
    resources :questions, only: [:index, :show] do
      get :usage, on: :member
    end
    resources :forms, only: [:show]
    resources :valueSets, only: [:index, :show], controller: 'response_sets' do
      get :usage, on: :member
    end
  end

  # get 'questions' => 'questions#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
