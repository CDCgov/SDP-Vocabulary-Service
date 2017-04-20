class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    #   user ||= User.new # guest user (not logged in)
    #   if user.admin?
    #     can :manage, :all
    #   else
    #     can :read, :all
    #   end
    #
    # The first argument to `can` is the action you are giving the user
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on.
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/CanCanCommunity/cancancan/wiki/Defining-Abilities

    # user ||= User.new # guest user (not logged in)
    if user
      can :manage, :all
      cannot :manage, Question
      cannot :manage, Form
      # TODO
      # cannot :manage, ResponseSet
      can :manage, Question, status: 'published'
      can :manage, Question, status: 'draft', created_by: user
      can :manage, Form, status: 'published'
      can :manage, Form, status: 'draft', created_by: user
      # can :manage, ResponseSet, { status: 'published' }
      # can :manage, ResponseSet, { status: 'draft', created_by: user }
    else
      can :read, :all
      cannot :read, Question, status: 'draft'
      cannot :read, Form, status: 'draft'
      # cannot :read, ResponseSet, { status: 'draft' }
    end
    if user && user.publisher?
      can :manage, Question, status: 'draft'
      can :manage, Form, status: 'draft'
      can :manage, ResponseSet, status: 'draft'
      can :manage, Survey, status: 'draft'
    end
  end
end
