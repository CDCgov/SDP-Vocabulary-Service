Rails.application.routes.draw do
  resources :surveillance_systems, only: [:index, :show]
  resources :surveillance_programs, only: [:index, :show]
  get 'response_types', to: 'response_types#index', as: :response_types
  get 'elasticsearch', to: 'elasticsearch#index', as: :elasticsearch

  get '/landing' => 'landing#index'
  get '/landing/stats' => 'landing#stats'
  get 'concept_service/systems' => 'concept_service#systems'
  get 'concept_service/search'  => 'concept_service#search'

  root to: 'landing#index'

  devise_for :users, controllers: { registrations: 'registrations',
                                    sessions: 'sessions',
                                    omniauth_callbacks: 'users/omniauth_callbacks' }

  resources :authentications

  get '/publishers' => 'publishers#index'

  get '/my_forms' => 'forms#my_forms'
  get '/my_questions' => 'questions#my_questions'
  get '/my_response_sets' => 'response_sets#my_response_sets'

  resources :form_questions
  resources :forms, except: [:edit] do # No need for edit as that is handled on the react side
    get :revise, on: :member
    get :export, on: :member
    get :redcap, on: :member
    put :publish, on: :member
  end
  resources :surveys, except: [:edit], defaults: { format: :json } do
    get :revise, on: :member
    put :publish, on: :member
  end
  resources :question_response_sets
  resources :responses
  resources :concepts
  resources :questions, except: [:edit] do
    get :revise, on: :member
    get :usage, on: :member
    put :publish, on: :member
  end
  resources :comments do
    post :reply_to, on: :member
  end
  resources :question_types

  resources :response_sets, except: [:edit] do
    get :revise, on: :member
    get :usage, on: :member
    put :publish, on: :member
  end

  get 'notifications', to: 'notifications#index', as: :notifications
  post 'notifications/mark_read', to: 'notifications#mark_read', as: :notifications_mark_read

  namespace :api, defaults: { format: :json } do
    resources :questions, only: [:index, :show] do
      get :usage, on: :member
    end
    resources :forms, only: [:index, :show] do
      get :usage, on: :member
    end
    resources :surveys, only: [:index, :show]
    resources :valueSets, only: [:index, :show], controller: 'response_sets' do
      get :usage, on: :member
    end
    resources :programs, only: [:index, :show] do
      get :usage, on: :member
    end
    resources :systems, only: [:index, :show] do
      get :usage, on: :member
    end
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
