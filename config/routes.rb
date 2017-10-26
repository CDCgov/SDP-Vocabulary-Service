Rails.application.routes.draw do
  resources :surveillance_systems, only: [:index, :create]
  resources :surveillance_programs, only: [:index, :create]
  get 'response_types', to: 'response_types#index', as: :response_types
  get 'question_types', to: 'question_types#index', as: :question_types
  get 'concepts', to: 'concepts#index', as: :concepts
  get 'elasticsearch', to: 'elasticsearch#index', as: :elasticsearch
  get 'elasticsearch/duplicate_questions' => 'elasticsearch#duplicate_questions'

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
  get '/administrators' => 'administrators#index'

  namespace :admin do
    put '/roles/grant_admin' => 'roles#grant_admin', as: :grant_admin
    put '/roles/revoke_admin' => 'roles#revoke_admin', as: :revoke_admin
    put '/roles/grant_publisher' => 'roles#grant_publisher', as: :grant_publisher
    put '/roles/revoke_publisher' => 'roles#revoke_publisher', as: :revoke_publisher
    put '/elastic_panel/delete_and_sync' => 'elastic_panel#delete_and_sync', as: :delete_and_sync
    put '/elastic_panel/es_sync' => 'elastic_panel#es_sync', as: :es_sync
  end

  resources :section_questions
  resources :sections, except: [:edit] do # No need for edit as that is handled on the react side
    get :revise, on: :member
    get :export, on: :member
    get :redcap, on: :member
    put :publish, on: :member
  end
  resources :surveys, except: [:edit], defaults: { format: :json } do
    get :revise, on: :member
    put :publish, on: :member
    get :redcap, on: :member
  end
  resources :questions, except: [:edit] do
    get :revise, on: :member
    get :usage, on: :member
    put :publish, on: :member
  end
  resources :comments do
    post :reply_to, on: :member
  end

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
    resources :sections, only: [:index, :show] do
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
