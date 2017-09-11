class CreateTags < ActiveRecord::Migration[5.1]
  def change
    # Rename table
    rename_table :concepts, :tags

    # Add new reference, polymorphic
    add_reference :tags, :taggable, polymorphic: true, index: true

    # Copy over information
    tags = Tag.all

    tags.each do |tag|
      tag.taggable_id = tag.question_id
      tag.taggable_type = 'Question'
      tag.save
    end

    # Remove previous reference and / or rename column
    remove_reference :tags, :question, foreign_key: true
  end
end
