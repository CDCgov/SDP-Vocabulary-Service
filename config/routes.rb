Rails.application.routes.draw do
  root to: 'dashboard#index'
  resources :form_questions
  resources :forms, except: [:edit, :update] do # No editing/updating on response sets, we only revise them
    get :export, on: :member
    get :revise, on: :member
  end
  resources :question_response_sets
  resources :responses
  resources :questions, except: [:edit, :update] do
    get :revise, on: :member
  end
  resources :question_types
  devise_for :users
  resources :response_sets, except: [:edit, :update] do # No editing/updating on response sets, we only revise them
    get :revise, on: :member
    get :extend, on: :member
  end

  namespace :api, defaults: { format: :json } do
    resources :questions, only: [:index, :show] do
      get :usage, on: :member
    end
    resources :forms, only: [:show]
    resources :valueSets, only: [:index, :show], controller: 'response_sets' do
      get :usage, on: :member
    end
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
