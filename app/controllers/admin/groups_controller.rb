module Admin
  class GroupsController < AdminController
    def index
      render json: Group.all
    end

    def create
      @group = Group.new(group_params)
      if Group.find_by(name: @group.name)
        render json: { msg: "A group named #{@group.name} already exists" }, status: :unprocessable_entity
      elsif @group.save
        render json: Group.all
      else
        render json: { msg: 'Error saving group - check format, name cannot be blank' }, status: :unprocessable_entity
      end
    end

    def add_user
      user = User.find_by(email: params[:email])
      group = Group.find_by(name: params[:group])
      if user && group
        group.add_user(user)
        resp = { groups: Group.all.collect { |g| GroupSerializer.new(g) }, user: UserSerializer.new(current_user) }
        render json: resp, status: 200
      else
        render json: {
          msg: "No user found with email #{params[:email]}, check what you entered and try again"
        }, status: :unprocessable_entity
      end
    end

    def remove_user
      user = User.find_by(email: params[:email])
      group = Group.find_by(name: params[:group])
      if user && group
        group.remove_user(user)
        resp = { groups: Group.all.collect { |g| GroupSerializer.new(g) }, user: UserSerializer.new(current_user) }
        render json: resp, status: 200
      else
        render json: {
          msg: 'Error when removing user, please check email is in correct format or refresh application and try again'
        }, status: :unprocessable_entity
      end
    end

    private

    def group_params
      params.require(:group).permit(:name, :description)
    end
  end
end
