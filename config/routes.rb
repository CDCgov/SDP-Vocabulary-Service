Rails.application.routes.draw do
  resources :question_response_sets
  resources :responses
  resources :response_sets
  resources :questions
  resources :question_types
  devise_for :users
  root to: 'questions#index'

  # get 'questions' => 'questions#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
