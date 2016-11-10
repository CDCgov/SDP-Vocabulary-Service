Rails.application.routes.draw do
  root to: 'questions#index'
  resources :form_questions
  resources :forms
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

  # get 'questions' => 'questions#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
