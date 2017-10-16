namespace :cleanup do
  # This should not be needed anymore, but older versions of this app did leak
  # relationships when items were deleted
  desc 'This will delete any orphaned relationships between items'
  task relationships: :environment do
    qrs_orphan_count = 0
    fq_orphan_count = 0
    sf_orphan_count = 0

    QuestionResponseSet.all.each do |qrs|
      if qrs.question.nil? || qrs.response_set.nil?
        qrs.destroy!
        qrs_orphan_count += 1
      end
    end

    SectionQuestion.all.each do |fq|
      if fq.section.nil? || fq.question.nil?
        fq.destroy!
        fq_orphan_count += 1
      end
    end

    SurveySection.all.each do |sf|
      if sf.survey.nil? || sf.section.nil?
        sf.destroy!
        sf_orphan_count += 1
      end
    end

    puts "Cleaned up: #{qrs_orphan_count} QuestionResponseSets, #{fq_orphan_count} SectionQuestions and #{sf_orphan_count} SurveySections."
  end
end
