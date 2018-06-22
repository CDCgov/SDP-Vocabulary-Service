class AddContentStageToSurveys < ActiveRecord::Migration[5.1]
  def change
    # Initially stages include: 'Draft', 'Published', 'Retired'
    add_column :surveys, :content_stage, :string, default: 'Draft'
    add_column :sections, :content_stage, :string, default: 'Draft'
    add_column :questions, :content_stage, :string, default: 'Draft'
    add_column :response_sets, :content_stage, :string, default: 'Draft'

    Survey.where(status: 'published').each do |s|
      s.content_stage = 'Published'
      s.save!
    end
    Section.where(status: 'published').each do |sect|
      sect.content_stage = 'Published'
      sect.save!
    end
    Question.where(status: 'published').each do |q|
      q.content_stage = 'Published'
      q.save!
    end
    ResponseSet.where(status: 'published').each do |rs|
      rs.content_stage = 'Published'
      rs.save!
    end
  end
end
