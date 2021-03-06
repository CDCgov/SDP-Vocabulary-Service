# rubocop:disable Metrics/AbcSize
class LandingController < ApplicationController
  def index
  end

  def stats
    response_set_count = ResponseSet.analytics_count(current_user)
    question_count = Question.analytics_count(current_user)
    section_count = Section.analytics_count(current_user)
    survey_count = Survey.analytics_count(current_user)

    my_response_set_count = current_user ? ResponseSet.where(created_by: current_user.id).all.count : 0
    my_question_count = current_user ? Question.where(created_by: current_user.id).all.count : 0
    my_section_count = current_user ? Section.where(created_by: current_user.id).all.count : 0
    my_survey_count = current_user ? Survey.where(created_by: current_user.id).all.count : 0

    render json: { response_set_count: response_set_count, question_count: question_count,
                   section_count: section_count, survey_count: survey_count, version: Settings.app_version,
                   my_response_set_count: my_response_set_count, my_question_count: my_question_count,
                   my_section_count: my_section_count, my_survey_count: my_survey_count }
  end
end
# rubocop:enable Metrics/AbcSize
