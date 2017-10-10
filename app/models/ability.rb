class Ability
  include CanCan::Ability

  def initialize(user)
    if user && user.admin?
      can :manage, :all
    elsif user && user.publisher?
      can :manage, [ResponseSet, Question, Form, Survey]
      can :read, User
    elsif user
      can :manage, [ResponseSet, Question, Form, Survey], status: 'published'
      can :manage, [ResponseSet, Question, Form, Survey], status: 'draft', created_by_id: user.id
      can :read, User
    else
      can :read, [ResponseSet, Question, Form, Survey], status: 'published'
      can :read, User
    end
  end
end
