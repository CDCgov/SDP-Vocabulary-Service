class CreateTags < ActiveRecord::Migration[5.1]
  def up
    # Add new reference, polymorphic
    add_reference :concepts, :taggable, polymorphic: true, index: true

    # Copy over information
    concepts = Concept.all

    concepts.each do |concept|
      concept.taggable_id = concept.question_id
      concept.taggable_type = 'Question'
      concept.save
    end

    # Remove previous reference and / or rename column
    remove_reference :concepts, :question, foreign_key: true
  end

  def down
    add_reference :concepts, :question, foreign_key: true
    concepts = Concept.all

    concepts.each do |concept|
      if concept.taggable_type == 'Question'
        concept.question_id = concept.taggable_id
        concept.save
      end
    end
    remove_reference :concepts, :taggable, polymorphic: true, index: true
  end
end
