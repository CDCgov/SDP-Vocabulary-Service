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

  namespace :api, defaults: { format: :json } do
    get '/questions/', to: 'questions#index'
    get '/questions/:id', to: 'questions#show'
    get '/questions/:id/usage', to: 'questions#usage'
    get '/forms/:id', to: 'forms#show'
    get '/valueSets', to: 'response_sets#index'
    get '/valueSets/:id', to: 'response_sets#show'
    get '/valueSets/:id/usage', to: 'response_sets#usage'
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

Rails.application.routes.default_url_options = {
    host: 'example.com'
}
