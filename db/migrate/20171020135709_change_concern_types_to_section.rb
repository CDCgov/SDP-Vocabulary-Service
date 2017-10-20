class ChangeConcernTypesToSection < ActiveRecord::Migration[5.1]
  def up
    Concept.where(taggable_type: 'Form').each do |concept|
      concept.update_attribute :taggable_type, 'Section'
    end
    Comment.where(commentable_type: 'Form').each do |comment|
      comment.update_attribute :commentable_type, 'Section'
    end
  end

  def down
    Concept.where(taggable_type: 'Section').each do |concept|
      concept.update_attribute :taggable_type, 'Form'
    end
    Comment.where(commentable_type: 'Section').each do |comment|
      comment.update_attribute :commentable_type, 'Form'
    end
  end
end
