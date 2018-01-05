Rails.application.routes.draw do
  resources :surveillance_systems, only: [:index, :create]
  resources :surveillance_programs, only: [:index, :create]
  get 'response_types', to: 'response_types#index', as: :response_types
  get 'categories', to: 'categories#index', as: :categories
  get 'concepts', to: 'concepts#index', as: :concepts
  get 'elasticsearch', to: 'elasticsearch#index', as: :elasticsearch
  get 'elasticsearch/duplicate_questions' => 'elasticsearch#duplicate_questions'
  get 'elasticsearch/suggestions' => 'elasticsearch#suggestions'

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
    resources :groups, only: [:index, :create]
    put '/groups/add_user' => 'groups#add_user', as: :add_user
    put '/groups/remove_user' => 'groups#remove_user', as: :remove_user
  end

  resources :section_questions
  resources :sections, except: [:edit] do # No need for edit as that is handled on the react side
    get :revise, on: :member
    get :export, on: :member
    get :redcap, on: :member
    put :publish, on: :member
    put :add_to_group, on: :member
    put :update_tags, on: :member
  end
  resources :surveys, except: [:edit], defaults: { format: :json } do
    get :revise, on: :member
    put :publish, on: :member
    get :redcap, on: :member
    put :add_to_group, on: :member
    put :update_tags, on: :member
  end
  resources :questions, except: [:edit] do
    get :revise, on: :member
    get :usage, on: :member
    put :publish, on: :member
    put :add_to_group, on: :member
    put :update_tags, on: :member
  end
  resources :comments do
    post :reply_to, on: :member
  end

  resources :response_sets, except: [:edit] do
    get :revise, on: :member
    get :usage, on: :member
    put :publish, on: :member
    put :add_to_group, on: :member
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

    namespace :fhir do
      get 'Valueset', to: 'valuesets#index', as: :valuesets, defaults: { format: :json }
      get 'Valueset/:id', to: 'valuesets#show',  as: :valueset, defaults: { format: :json }
      get 'Valueset/:id/_history', to: 'valuesets#versions', as: :valueset_versions, defaults: { format: :json }
      get 'Valueset/:id/_history/:version', to: 'valuesets#show', as: :valueset_version, defaults: { format: :json }

      get 'Questionnaire', to: 'questionaires#index', as: :questionaires, defaults: { format: :json }
      get 'Questionnaire/:id', to: 'questionaires#show',  as: :questionaire, defaults: { format: :json }
      get 'Questionnaire/:id/_history', to: 'questionaires#versions',  as: :questionaire_versions, defaults: { format: :json }
      get 'Questionnaire/:id/_history/:version', to: 'questionaires#show', as: :questionaire_version, defaults: { format: :json }
    end
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
