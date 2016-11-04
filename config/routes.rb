Rails.application.routes.draw do
  root to: 'questions#index'
  resources :form_questions
  resources :forms
  resources :question_response_sets
  resources :responses
  resources :questions
  resources :question_types
  devise_for :users
  resources :response_sets do
    get :extend, on: :member
  end

  # get 'questions' => 'questions#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
