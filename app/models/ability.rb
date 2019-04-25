class Ability
  include CanCan::Ability

  def initialize(user)
    if user && user.admin?
      can :manage, :all
    elsif user && user.publisher?
      can :manage, [ResponseSet, Question, Section, Survey]
      can :manage, [ImportSession], created_by_id: user.id
      can :read, User
    elsif user && user.author?
      can :manage, [ResponseSet, Question, Section, Survey], status: 'published'
      can :manage, [ResponseSet, Question, Section, Survey], status: 'draft', created_by_id: user.id
      can :manage, [ImportSession], created_by_id: user.id
      can :manage, [ResponseSet, Question, Section, Survey], status: 'draft', groups: { id: user.group_ids }
      can :read, User
    elsif user
      # Default is now the 'Collaborator' role who can't create new content
      can :read, [ResponseSet, Question, Section, Survey], status: 'published'
      can :link_to_duplicate, [ResponseSet, Question, Section, Survey], status: 'published', created_by_id: user.id
      can :link_to_duplicate, [ResponseSet, Question, Section, Survey], status: 'published', groups: { id: user.group_ids }
      can [:update, :update_tags, :redcap, :spreadsheet, :epi_info, :more_responses, :parent_items, :duplicate_count, :update_tags, :usage, :comment], [ResponseSet, Question, Section, Survey], status: 'draft', created_by_id: user.id
      can [:update, :update_tags, :redcap, :spreadsheet, :epi_info, :more_responses, :parent_items, :duplicate_count, :update_tags, :usage, :comment], [ResponseSet, Question, Section, Survey], status: 'draft', groups: { id: user.group_ids }
      can :redcap, [ResponseSet, Question, Section, Survey], status: 'published'
      can :parent_items, [Question, Section], status: 'published'
      can :more_responses, [ResponseSet], status: 'published'
      can :epi_info, [Section, Survey], status: 'published'
      can :spreadsheet, [Survey], status: 'published'
      can :duplicate_count, [Survey], status: 'published'
      can :read, User
    else
      can :read, [ResponseSet, Question, Section, Survey], status: 'published'
      can :redcap, [ResponseSet, Question, Section, Survey], status: 'published'
      can :parent_items, [Question, Section], status: 'published'
      can :more_responses, [ResponseSet], status: 'published'
      can :epi_info, [Section, Survey], status: 'published'
      can :spreadsheet, [Survey], status: 'published'
      can :duplicate_count, [Survey], status: 'published'
      can :read, User
    end
  end
end
