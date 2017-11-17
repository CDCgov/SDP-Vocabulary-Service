class RenameQuestionTypeToCategory < ActiveRecord::Migration[5.1]
  def up
    rename_table :question_types, :categories

    add_reference :subcategories, :category, foreign_key: true
    add_reference :questions, :category, foreign_key: true
    subcategories = Subcategory.all
    subcategories.each do |subcat|
      subcat.update_column('category_id', subcat.question_type_id)
    end
    questions = Question.all
    questions.each do |q|
      q.update_column('category_id', q.question_type_id)
    end
    remove_reference :subcategories, :question_type, index: true
    remove_reference :questions, :question_type, index: true
  end

  def down
    rename_table :categories, :question_types

    add_reference :subcategories, :question_type, foreign_key: true
    add_reference :questions, :question_type, foreign_key: true
    subcategories = Subcategory.all
    subcategories.each do |subcat|
      subcat.update_column('question_type_id', subcat.category_id)
    end
    questions = Question.all
    questions.each do |q|
      q.update_column('question_type_id', q.category_id)
    end
    remove_reference :subcategories, :category, index: true
    remove_reference :questions, :category, index: true
  end
end
