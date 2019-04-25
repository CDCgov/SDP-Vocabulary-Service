class AuthorsController < ApplicationController
  authorize_resource :user, parent: false

  def index
    authors = User.with_role(:author).preload(:roles)
    collabs = User.all.reject {|u| u.has_role?('author')}
    render json: {authors: authors, collabs: collabs}
  end
end
